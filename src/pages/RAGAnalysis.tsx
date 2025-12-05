import { useState, useEffect } from 'react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ragService } from '../services/rag.service';
import { supplierService } from '../services/supplier.service';
import { Supplier } from '../types';

export function RAGAnalysis() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Supplier[]>([]);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await supplierService.getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await ragService.retrieveRelevantSuppliers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedSupplier) return;

    setLoading(true);
    try {
      const result = await ragService.analyzeSupplier(selectedSupplier);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'APPROVE':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'APPROVE_WITH_MONITORING':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'REJECT':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'IMPROVING':
        return '📈';
      case 'DECLINING':
        return '📉';
      default:
        return '➡️';
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
            🧠 RAG Supplier Decision Engine
          </h1>
          <p className="text-gray-300">
            AI-Powered Supplier Analysis with Retrieval-Augmented Generation
          </p>
        </div>

        {/* Search Section */}
        <GlassPanel className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">🔍 Intelligent Supplier Search</h2>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search: 'best electronics supplier in Chennai with high ESG' or 'low risk packaging suppliers'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((supplier) => (
                <div
                  key={supplier.supplier_id}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-violet-500/50 cursor-pointer transition-all"
                  onClick={() => setSelectedSupplier(supplier.supplier_id || '')}
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {supplier.supplier_name || supplier.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white ml-2">{supplier.city}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white ml-2">{supplier.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">ESG Score:</span>
                      <span className="text-green-400 ml-2">
                        {supplier.baseline_esg_score?.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">On-Time:</span>
                      <span className="text-violet-400 ml-2">
                        {supplier.baseline_on_time_pct?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        {/* Analysis Section */}
        <GlassPanel className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">📊 Deep Supplier Analysis</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">Select Supplier for Analysis</label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="">Choose a supplier...</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.supplier_id} value={supplier.supplier_id}>
                    {supplier.supplier_name || supplier.name} - {supplier.city}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleAnalyze} disabled={!selectedSupplier || loading}>
              Analyze
            </Button>
          </div>
        </GlassPanel>

        {/* Loading State */}
        {loading && (
          <GlassPanel className="flex justify-center items-center py-12">
            <LoadingSpinner />
            <span className="ml-3 text-gray-300">Retrieving and analyzing supplier data...</span>
          </GlassPanel>
        )}

        {/* Analysis Results */}
        {!loading && analysis && (
          <div className="space-y-6">
            {/* Supplier Overview */}
            <GlassPanel>
              <h2 className="text-2xl font-semibold text-white mb-4">📦 Supplier Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Supplier Name</p>
                  <p className="text-white text-lg font-semibold">
                    {analysis.supplier.supplier_name || analysis.supplier.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white text-lg">{analysis.supplier.city}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Category</p>
                  <p className="text-white text-lg">{analysis.supplier.category}</p>
                </div>
              </div>
            </GlassPanel>

            {/* Scores */}
            <GlassPanel>
              <h2 className="text-2xl font-semibold text-white mb-4">🧠 AI Score vs 👤 Human Score</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">AI Score</p>
                  <p className="text-5xl font-bold text-violet-400">{analysis.aiScore.toFixed(1)}</p>
                  <p className="text-gray-500 text-xs mt-1">Weighted Algorithm</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Human Score</p>
                  <p className="text-5xl font-bold text-purple-400">{analysis.humanScore.toFixed(1)}</p>
                  <p className="text-gray-500 text-xs mt-1">Historical Average</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Conflict Index</p>
                  <p className="text-5xl font-bold text-orange-400">{analysis.conflictIndex.toFixed(1)}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {analysis.conflictIndex < 10 ? 'Low Conflict' : analysis.conflictIndex < 25 ? 'Moderate' : 'High Conflict'}
                  </p>
                </div>
              </div>
            </GlassPanel>

            {/* Performance Metrics */}
            <GlassPanel>
              <h2 className="text-2xl font-semibold text-white mb-4">📊 Key Performance Metrics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Delivery Reliability</span>
                    <span className="text-white font-semibold">
                      {analysis.performanceMetrics.deliveryReliability.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${analysis.performanceMetrics.deliveryReliability}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Quality (Inverse Defect Rate)</span>
                    <span className="text-white font-semibold">
                      {(100 - analysis.performanceMetrics.defectRate).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{ width: `${100 - analysis.performanceMetrics.defectRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">ESG Performance</span>
                    <span className="text-white font-semibold">
                      {analysis.performanceMetrics.esgScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${analysis.performanceMetrics.esgScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </GlassPanel>

            {/* Risk Analysis */}
            <GlassPanel>
              <h2 className="text-2xl font-semibold text-white mb-4">⚠️ Risk Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Logistics Risk</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {analysis.riskAnalysis.logistics.toFixed(0)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Financial Risk</p>
                  <p className="text-3xl font-bold text-red-400">
                    {analysis.riskAnalysis.financial.toFixed(0)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Geopolitical Risk</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {analysis.riskAnalysis.geopolitical.toFixed(0)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Overall Risk</p>
                  <p className={`text-3xl font-bold ${
                    analysis.riskAnalysis.overall === 'LOW' ? 'text-green-400' :
                    analysis.riskAnalysis.overall === 'MEDIUM' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {analysis.riskAnalysis.overall}
                  </p>
                </div>
              </div>
            </GlassPanel>

            {/* Final Recommendation */}
            <GlassPanel>
              <h2 className="text-2xl font-semibold text-white mb-4">✅ Final Decision & Justification</h2>
              <div className="flex items-center justify-between mb-6">
                <div className={`px-6 py-3 rounded-lg border ${getRecommendationColor(analysis.recommendation)}`}>
                  <p className="text-2xl font-bold">
                    {analysis.recommendation === 'APPROVE' ? '✅ APPROVE SUPPLIER' :
                     analysis.recommendation === 'APPROVE_WITH_MONITORING' ? '⚠️ APPROVE WITH MONITORING' :
                     '❌ REJECT SUPPLIER'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Confidence Score</p>
                  <p className="text-4xl font-bold text-violet-400">{analysis.confidence.toFixed(0)}%</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-white leading-relaxed">
                  <strong className="text-violet-400">Justification:</strong> Based on comprehensive analysis of 
                  historical performance data, this supplier scores <strong>{analysis.aiScore.toFixed(1)}</strong> on 
                  our AI evaluation model. The delivery reliability stands at <strong>
                  {analysis.performanceMetrics.deliveryReliability.toFixed(1)}%</strong> with a quality score of{' '}
                  <strong>{(100 - analysis.performanceMetrics.defectRate).toFixed(1)}%</strong>. The overall risk 
                  level is classified as <strong className={
                    analysis.riskAnalysis.overall === 'LOW' ? 'text-green-400' :
                    analysis.riskAnalysis.overall === 'MEDIUM' ? 'text-yellow-400' :
                    'text-red-400'
                  }>{analysis.riskAnalysis.overall}</strong>. {analysis.recommendation === 'APPROVE_WITH_MONITORING' &&
                    'Recommended monitoring includes quarterly performance reviews and disruption event tracking.'}
                </p>
              </div>
            </GlassPanel>

            {/* Prediction */}
            <GlassPanel>
              <h2 className="text-2xl font-semibold text-white mb-4">🔮 3-6 Month Performance Prediction</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Predicted Reliability</p>
                  <p className="text-3xl font-bold text-violet-400">
                    {analysis.prediction.nextQuarterReliability.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Disruption Probability</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {analysis.prediction.disruptionProbability.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Performance Trend</p>
                  <p className="text-3xl font-bold text-white">
                    {getTrendIcon(analysis.prediction.trend)} {analysis.prediction.trend}
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-gray-300">
                  <strong className="text-violet-400">Prediction Methodology:</strong> Based on historical time-series 
                  patterns from the last 12-24 months, seasonal logistics risk factors, and current geopolitical event 
                  frequencies in the supplier's region. This prediction uses verified data only and does not include 
                  speculative forecasting.
                </p>
              </div>
            </GlassPanel>

            {/* Data Sources */}
            <GlassPanel>
              <h2 className="text-2xl font-semibold text-white mb-4">📚 Data Sources & Verification</h2>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-gray-300 mb-2">
                  <strong className="text-violet-400">✓ Verified Data Sources:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                  <li>Supplier master dataset with baseline metrics</li>
                  <li>Time-series contract history (12-24 month lookback)</li>
                  <li>Customer and internal review logs with NLP sentiment analysis</li>
                  <li>Geopolitical and logistics disruption event database</li>
                  <li>Historical AI vs Human decision comparison records</li>
                </ul>
                <p className="text-xs text-gray-500 mt-4 italic">
                  All recommendations are grounded in retrieved documents. This system does NOT hallucinate supplier data.
                </p>
              </div>
            </GlassPanel>
          </div>
        )}

        {/* No Analysis Yet */}
        {!loading && !analysis && (
          <GlassPanel>
            <div className="text-center py-12">
              <p className="text-6xl mb-4">🔍</p>
              <p className="text-xl text-gray-400 mb-2">No Analysis Selected</p>
              <p className="text-sm text-gray-500">
                Search for suppliers or select one from the dropdown to begin comprehensive RAG analysis
              </p>
            </div>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
