import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Repeat, LineChart, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AnimatedBackground } from '../components/AnimatedBackground';
import {
  csvRAGService,
  BangaloreSupplier,
  SupplierAnalysis,
  ComparisonResult,
  PredictionResult,
} from '../services/csv-rag.service';

// 7-section renderer for supplier analysis
const renderAnalysis = (analysis: SupplierAnalysis) => (
  <div className="grid gap-4 md:grid-cols-2">
    <Section title="1️⃣ Supplier Overview">
      <div className="text-sm text-white/70">{analysis.supplier_overview.name}</div>
      <div className="text-sm text-white/70">Location: {analysis.supplier_overview.location}</div>
      <div className="text-sm text-white/70">Employees: {analysis.supplier_overview.employees}</div>
      <div className="text-sm text-white/70">Business Results: {analysis.supplier_overview.business_results}</div>
      <div className="text-sm text-white/70">Traffic: {analysis.supplier_overview.traffic_connectivity}</div>
    </Section>
    <Section title="2️⃣ Key Performance Indicators">
      <Metric label="Quality" value={analysis.key_performance_indicators.quality_score} />
      <Metric label="Quantity Capacity" value={analysis.key_performance_indicators.quantity_capacity} />
      <Metric label="Serviceability" value={analysis.key_performance_indicators.serviceability} />
      <Metric label="Reputation" value={analysis.key_performance_indicators.reputation} />
      <Metric label="Flexibility" value={analysis.key_performance_indicators.flexibility} />
    </Section>
    <Section title="3️⃣ Cost vs Reliability Analysis">
      <Metric label="Price/Unit (₹)" value={analysis.cost_vs_reliability.price_per_unit} />
      <Metric label="Delivery (days)" value={analysis.cost_vs_reliability.delivery_time_days} />
      <div className="text-sm text-white/70">Payment Terms: {analysis.cost_vs_reliability.payment_terms}</div>
      <Metric label="Cost/Reliability" value={analysis.cost_vs_reliability.cost_reliability_ratio} />
    </Section>
    <Section title="4️⃣ Operational Risk (Traffic + Delivery)">
      <div className="text-sm text-white/70">Traffic Risk: {analysis.operational_risk.traffic_risk}</div>
      <div className="text-sm text-white/70">Delivery Consistency: {analysis.operational_risk.delivery_consistency}</div>
      <Metric label="Logistics Score" value={analysis.operational_risk.logistics_score} />
    </Section>
    <Section title="5️⃣ Financial & Asset Strength">
      <Metric label="Financial Condition" value={analysis.financial_asset_strength.financial_condition} />
      <Metric label="Asset Condition" value={analysis.financial_asset_strength.asset_condition} />
      <Metric label="Business Strength" value={analysis.financial_asset_strength.business_strength} />
      <Metric label="Overall Stability" value={analysis.financial_asset_strength.overall_stability} />
    </Section>
    <Section title="6️⃣ AI Recommendation">
      <Metric label="Overall Score" value={analysis.ai_recommendation.overall_score} />
      <div className="text-sm text-white/70">Best Use Case: {analysis.ai_recommendation.best_use_case}</div>
      <div className="text-xs text-emerald-300 mt-1">Strengths: {analysis.ai_recommendation.strengths.join(', ')}</div>
      <div className="text-xs text-rose-300 mt-1">Weaknesses: {analysis.ai_recommendation.weaknesses.join(', ')}</div>
    </Section>
    <Section title="7️⃣ Confidence Score (0–100%)">
      <Metric label="Confidence" value={analysis.confidence_score} />
    </Section>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg shadow-black/20">
    <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const Metric = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between text-sm text-white/80">
    <span>{label}</span>
    <span className="text-white font-semibold">{Number(value).toFixed(2)}</span>
  </div>
);

export const Dashboard = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<BangaloreSupplier[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [analysis, setAnalysis] = useState<SupplierAnalysis | null>(null);
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [bestResult, setBestResult] = useState<BangaloreSupplier | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [status, setStatus] = useState<string>('');

  const canDownload = useMemo(() => !!analysis, [analysis]);

  const handleSearch = async () => {
    setStatus('');
    setLoading(true);
    setSearchResults([]);
    try {
      const results = await csvRAGService.retrieveRelevantSuppliers(query, 10);
      setSearchResults(results);
      if (results.length === 0) {
        setStatus('No verified supplier data found for this request.');
      }
    } catch (error) {
      setStatus('No verified supplier data found for this request.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (name: string) => {
    setStatus('');
    setSelected(name);
    setAnalysis(null);
    const result = await csvRAGService.analyzeSupplier(name);
    if (!result) {
      setStatus('No verified supplier data found for this request.');
      return;
    }
    setAnalysis(result);
  };

  const handleCompare = async () => {
    setStatus('');
    setComparison(null);
    const result = await csvRAGService.compareSuppliers(compareA, compareB);
    if (!result) {
      setStatus('No verified supplier data found for this request.');
      return;
    }
    setComparison(result);
  };

  const handleBest = async () => {
    setStatus('');
    setBestResult(null);
    const result = await csvRAGService.getBestSupplier(query || 'overall');
    if (!result) {
      setStatus('No verified supplier data found for this request.');
      return;
    }
    setBestResult(result);
    await handleAnalyze(result.supplier);
  };

  const handlePredict = async () => {
    setStatus('');
    setPrediction(null);
    const target = selected || compareA || compareB || bestResult?.supplier;
    if (!target) {
      setStatus('No verified supplier data found for this request.');
      return;
    }
    const result = await csvRAGService.predictPerformance(target);
    if (!result) {
      setStatus('No verified supplier data found for this request.');
      return;
    }
    setPrediction(result);
  };

  const handleDownload = () => {
    if (!analysis) return;
    const content = `Supplier Decision Report\n\n${analysis.supplier_overview.name}\nConfidence: ${analysis.confidence_score}%\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysis.supplier_overview.name}-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-violet-100 to-purple-100 bg-clip-text text-transparent">
              Supplier Decision Assistant
            </h1>
            <p className="text-white/70 text-sm md:text-base">
              Enterprise RAG on 200 verified Bangalore suppliers. No hallucinations. Data-driven, explainable recommendations.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card title="Search Supplier" icon={<Search className="w-5 h-5" />}>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. fast delivery low price"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="w-full mt-3 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500"
              >
                {loading ? 'Searching...' : 'Search Supplier'}
              </Button>
            </Card>

            <Card title="Compare Suppliers" icon={<Repeat className="w-5 h-5" />}>
              <Input
                value={compareA}
                onChange={(e) => setCompareA(e.target.value)}
                placeholder="Supplier A"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Input
                value={compareB}
                onChange={(e) => setCompareB(e.target.value)}
                placeholder="Supplier B"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 mt-2"
              />
              <Button
                onClick={handleCompare}
                disabled={!compareA || !compareB}
                className="w-full mt-3 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500"
              >
                Compare Suppliers
              </Button>
            </Card>

            <Card title="Get Best Supplier" icon={<TrendingUp className="w-5 h-5" />}>
              <p className="text-white/60 text-xs">
                Uses composite RAG score across quality, delivery, price, financials, reputation.
              </p>
              <Button
                onClick={handleBest}
                className="w-full mt-4 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500"
              >
                Get Best Supplier
              </Button>
            </Card>
          </div>

          {status && (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-amber-200 text-sm">
              {status}
            </div>
          )}

          {loading && (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-white/70 text-sm">
              Running vector retrieval…
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-semibold text-lg">Top {searchResults.length} matches</h2>
                  <p className="text-white/60 text-sm">Vector retrieval over Bangalore supplier CSV (top 10)</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {searchResults.map((s) => (
                  <button
                    key={s.supplier}
                    onClick={() => handleAnalyze(s.supplier)}
                    className={`text-left rounded-xl border transition-all p-4 backdrop-blur bg-white/5 hover:bg-white/10 ${
                      selected === s.supplier ? 'border-violet-500' : 'border-white/10'
                    }`}
                  >
                    <div className="text-white font-semibold">{s.supplier}</div>
                    <div className="text-xs text-white/60">
                      Quality {s.quality_score.toFixed(1)} • Delivery {s.delivery_time_days}d • Price ₹
                      {s.price_per_unit_inr.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analysis Output */}
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button onClick={handlePredict} className="bg-white/10 text-white border border-white/10">
                  <LineChart className="w-4 h-4 mr-2" /> Predict Performance
                </Button>
                <Button onClick={handleDownload} disabled={!canDownload} className="bg-white/10 text-white border border-white/10">
                  <Download className="w-4 h-4 mr-2" /> Download Report
                </Button>
              </div>
              {renderAnalysis(analysis)}
            </motion.div>
          )}

          {/* Comparison */}
          {comparison && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3"
            >
              <h3 className="text-white font-semibold">Comparison Result</h3>
              <div className="text-white/70 text-sm">Winner: {comparison.winner}</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                <div>Quality: {comparison.quality_winner}</div>
                <div>Price: {comparison.price_winner}</div>
                <div>Delivery: {comparison.delivery_winner}</div>
                <div>Financial: {comparison.financial_winner}</div>
              </div>
              <div className="text-white/60 text-sm">{comparison.recommendation}</div>
            </motion.div>
          )}

          {/* Prediction */}
          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3"
            >
              <h3 className="text-white font-semibold">Performance Prediction</h3>
              <div className="text-white/70 text-sm">Supplier: {prediction.supplier}</div>
              <div className="text-white/70 text-sm">Current Score: {prediction.current_performance.toFixed(2)}</div>
              <div className="text-white/70 text-sm">Trend (6 months): {prediction.predicted_6month_trend}</div>
              <div className="text-white/70 text-sm">Confidence: {prediction.confidence}%</div>
              <div className="text-xs text-rose-200">Risks: {prediction.risk_factors.join(', ')}</div>
              <div className="text-white/80 text-sm">Recommendation: {prediction.recommendation}</div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

const Card = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg shadow-black/20">
    <div className="flex items-center gap-2 text-white font-semibold mb-3">
      <span className="p-2 rounded-full bg-white/10">{icon}</span>
      {title}
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);
