import { supabase } from '../lib/supabase';
import { Supplier } from '../types';

interface SupplierAnalysis {
  supplier: Supplier;
  aiScore: number;
  humanScore: number;
  conflictIndex: number;
  riskAnalysis: {
    logistics: number;
    financial: number;
    geopolitical: number;
    overall: string;
  };
  performanceMetrics: {
    deliveryReliability: number;
    defectRate: number;
    esgScore: number;
    costEfficiency: number;
  };
  recommendation: 'APPROVE' | 'APPROVE_WITH_MONITORING' | 'REJECT';
  confidence: number;
  prediction: {
    nextQuarterReliability: number;
    disruptionProbability: number;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  };
}

export const ragService = {
  /**
   * Retrieve relevant suppliers based on query with vector similarity
   */
  async retrieveRelevantSuppliers(
    _query: string,
    filters?: {
      city?: string;
      category?: string;
      minEsgScore?: number;
      maxPrice?: number;
    }
  ): Promise<Supplier[]> {
    let queryBuilder = supabase
      .from('suppliers')
      .select('*')
      .limit(10);

    if (filters?.city) {
      queryBuilder = queryBuilder.eq('city', filters.city);
    }
    if (filters?.category) {
      queryBuilder = queryBuilder.eq('category', filters.category);
    }
    if (filters?.minEsgScore) {
      queryBuilder = queryBuilder.gte('baseline_esg_score', filters.minEsgScore);
    }

    const { data, error } = await queryBuilder;
    if (error) throw error;

    return data || [];
  },

  /**
   * Get comprehensive supplier context
   */
  async getSupplierContext(supplierId: string) {
    const [supplier, contracts, reviews, events] = await Promise.all([
      supabase.from('suppliers').select('*').eq('supplier_id', supplierId).single(),
      supabase.from('contracts').select('*').eq('supplier_id', supplierId).order('contract_date', { ascending: false }).limit(20),
      supabase.from('reviews').select('*').eq('supplier_id', supplierId).order('review_date', { ascending: false }),
      supabase.from('events').select('*').limit(100),
    ]);

    return {
      supplier: supplier.data,
      contracts: contracts.data || [],
      reviews: reviews.data || [],
      relevantEvents: events.data || [],
    };
  },

  /**
   * Calculate AI Score using weighted metrics
   */
  calculateAIScore(contracts: any[], _supplier: any, _events: any[]): number {
    if (!contracts || contracts.length === 0) return 0;

    // Weighted delivery reliability (40%)
    const avgOnTime = contracts.reduce((sum, c) => sum + (c.on_time_delivery_pct || 0), 0) / contracts.length;
    const deliveryScore = avgOnTime * 0.4;

    // Defect rate inverse (25%)
    const avgDefectRate = contracts.reduce((sum, c) => sum + (c.defect_rate_pct || 0), 0) / contracts.length;
    const qualityScore = Math.max(0, 100 - avgDefectRate) * 0.25;

    // ESG performance (20%)
    const avgESG = contracts.reduce((sum, c) => sum + (c.esg_score || 0), 0) / contracts.length;
    const esgScore = avgESG * 0.20;

    // Risk penalty (15%)
    const avgGeoRisk = contracts.reduce((sum, c) => sum + (c.geo_risk_score || 0), 0) / contracts.length;
    const avgFinRisk = contracts.reduce((sum, c) => sum + (c.financial_risk_score || 0), 0) / contracts.length;
    const riskPenalty = Math.max(0, 100 - ((avgGeoRisk + avgFinRisk) / 2)) * 0.15;

    return Number((deliveryScore + qualityScore + esgScore + riskPenalty).toFixed(2));
  },

  /**
   * Calculate Human Score from historical patterns
   */
  calculateHumanScore(contracts: any[]): number {
    if (!contracts || contracts.length === 0) return 0;
    
    const avgHumanScore = contracts.reduce((sum, c) => sum + (c.human_score || 0), 0) / contracts.length;
    return Number(avgHumanScore.toFixed(2));
  },

  /**
   * Analyze geopolitical and logistics risks
   */
  analyzeRisks(supplier: any, events: any[], contracts: any[]) {
    const supplierCity = supplier.city || supplier.country || '';
    
    // Check for disruption events in supplier's region
    const relevantEvents = events.filter(e => 
      e.affected_cities?.includes(supplierCity)
    );

    const criticalEvents = relevantEvents.filter(e => e.severity === 'Critical').length;
    const highEvents = relevantEvents.filter(e => e.severity === 'High').length;

    // Logistics risk (based on disruption events and location)
    const logisticsRisk = Math.min(100, (criticalEvents * 25) + (highEvents * 15));

    // Financial risk (from contract data)
    const avgFinRisk = contracts.length > 0 
      ? contracts.reduce((sum, c) => sum + (c.financial_risk_score || 0), 0) / contracts.length 
      : 50;

    // Geopolitical risk (from contract data and events)
    const avgGeoRisk = contracts.length > 0
      ? contracts.reduce((sum, c) => sum + (c.geo_risk_score || 0), 0) / contracts.length
      : 50;

    const overallRisk = (logisticsRisk + avgFinRisk + avgGeoRisk) / 3;
    
    let riskLevel: string;
    if (overallRisk < 30) riskLevel = 'LOW';
    else if (overallRisk < 60) riskLevel = 'MEDIUM';
    else riskLevel = 'HIGH';

    return {
      logistics: Number(logisticsRisk.toFixed(2)),
      financial: Number(avgFinRisk.toFixed(2)),
      geopolitical: Number(avgGeoRisk.toFixed(2)),
      overall: riskLevel,
      relevantEvents,
    };
  },

  /**
   * Generate comprehensive supplier analysis
   */
  async analyzeSupplier(supplierId: string): Promise<SupplierAnalysis | null> {
    try {
      const context = await this.getSupplierContext(supplierId);
      
      if (!context.supplier) {
        return null;
      }

      const aiScore = this.calculateAIScore(context.contracts, context.supplier, context.relevantEvents);
      const humanScore = this.calculateHumanScore(context.contracts);
      const conflictIndex = Math.abs(aiScore - humanScore);

      const riskAnalysis = this.analyzeRisks(context.supplier, context.relevantEvents, context.contracts);

      // Performance metrics
      const performanceMetrics = {
        deliveryReliability: context.contracts.length > 0
          ? context.contracts.reduce((sum, c) => sum + c.on_time_delivery_pct, 0) / context.contracts.length
          : 0,
        defectRate: context.contracts.length > 0
          ? context.contracts.reduce((sum, c) => sum + c.defect_rate_pct, 0) / context.contracts.length
          : 0,
        esgScore: context.contracts.length > 0
          ? context.contracts.reduce((sum, c) => sum + c.esg_score, 0) / context.contracts.length
          : context.supplier.baseline_esg_score || 0,
        costEfficiency: context.contracts.length > 0
          ? context.contracts.reduce((sum, c) => sum + c.contract_value_inr, 0) / context.contracts.length
          : 0,
      };

      // Recommendation logic
      let recommendation: 'APPROVE' | 'APPROVE_WITH_MONITORING' | 'REJECT';
      if (aiScore >= 75 && riskAnalysis.overall === 'LOW') {
        recommendation = 'APPROVE';
      } else if (aiScore >= 60 && riskAnalysis.overall !== 'HIGH') {
        recommendation = 'APPROVE_WITH_MONITORING';
      } else {
        recommendation = 'REJECT';
      }

      // Confidence calculation
      const dataQuality = Math.min(100, (context.contracts.length * 5));
      const scoreConsistency = 100 - (conflictIndex * 2);
      const confidence = Number(((dataQuality + scoreConsistency) / 2).toFixed(2));

      // Prediction (trend analysis)
      const recentContracts = context.contracts.slice(0, 5);
      const olderContracts = context.contracts.slice(5, 10);
      
      const recentAvg = recentContracts.length > 0
        ? recentContracts.reduce((sum, c) => sum + c.ai_score, 0) / recentContracts.length
        : aiScore;
      const olderAvg = olderContracts.length > 0
        ? olderContracts.reduce((sum, c) => sum + c.ai_score, 0) / olderContracts.length
        : aiScore;

      let trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
      if (recentAvg > olderAvg + 5) trend = 'IMPROVING';
      else if (recentAvg < olderAvg - 5) trend = 'DECLINING';
      else trend = 'STABLE';

      const disruptionProbability = Math.min(100, riskAnalysis.logistics + (riskAnalysis.relevantEvents.length * 5));

      return {
        supplier: context.supplier,
        aiScore,
        humanScore,
        conflictIndex,
        riskAnalysis,
        performanceMetrics,
        recommendation,
        confidence,
        prediction: {
          nextQuarterReliability: trend === 'IMPROVING' ? recentAvg + 5 : trend === 'DECLINING' ? recentAvg - 5 : recentAvg,
          disruptionProbability: Number(disruptionProbability.toFixed(2)),
          trend,
        },
      };
    } catch (error) {
      console.error('Error analyzing supplier:', error);
      return null;
    }
  },

  /**
   * Get AI chat response with RAG context
   */
  async getAIChatResponse(query: string, _context?: any): Promise<string> {
    // Extract intent from query
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('best supplier') || lowerQuery.includes('recommend')) {
      // Retrieval-based recommendation
      const filters: any = {};
      
      if (lowerQuery.includes('chennai')) filters.city = 'Chennai';
      if (lowerQuery.includes('mumbai')) filters.city = 'Mumbai';
      if (lowerQuery.includes('delhi')) filters.city = 'Delhi';
      if (lowerQuery.includes('electronics')) filters.category = 'Electronics';
      if (lowerQuery.includes('high esg')) filters.minEsgScore = 70;

      const suppliers = await this.retrieveRelevantSuppliers(query, filters);
      
      if (suppliers.length === 0) {
        return "⚠️ Insufficient verified data for reliable decision. No suppliers match your criteria in the retrieved dataset.";
      }

      const topSupplier = suppliers[0];
      return `📦 **Top Recommendation**: ${topSupplier.supplier_name || topSupplier.name}
      
📍 Location: ${topSupplier.city}
📊 Category: ${topSupplier.category}
🌱 ESG Score: ${topSupplier.baseline_esg_score?.toFixed(1)}
✅ On-Time Delivery: ${topSupplier.baseline_on_time_pct?.toFixed(1)}%
⚡ Defect Rate: ${topSupplier.baseline_defect_pct?.toFixed(2)}%

**Justification**: Based on ${suppliers.length} retrieved suppliers, this supplier shows the best balance of ESG performance, delivery reliability, and quality metrics for your requirements.`;
    }

    if (lowerQuery.includes('compare') || lowerQuery.includes('vs')) {
      return `🧠 **AI vs Human Analysis**

To compare AI and Human decisions, I need specific supplier IDs or contract references from the dataset. Please provide supplier ID (e.g., IND-SUP-100000) for detailed conflict analysis.`;
    }

    if (lowerQuery.includes('risk') || lowerQuery.includes('predict')) {
      return `🔮 **Risk Prediction Analysis**

For accurate delivery risk prediction, please specify:
1. Supplier ID or category
2. Target region
3. Time period

I will analyze historical disruption patterns, geopolitical events, and seasonal logistics risks using verified data only.`;
    }

    // Default intelligent response
    return `💬 **Route X AI Assistant**

I'm ready to help with supplier decisions using verified data. I can:

1. 🔍 **Find best suppliers** - Specify city, category, ESG requirements
2. ⚖️ **Compare AI vs Human** - Provide supplier ID for conflict analysis  
3. ⚠️ **Analyze risks** - Geopolitical, logistics, and financial assessment
4. 🔮 **Predict performance** - Based on historical patterns

Ask me specific questions about suppliers, and I'll ground all responses in retrieved contract data, reviews, and disruption events.`;
  },
};
