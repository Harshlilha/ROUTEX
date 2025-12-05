import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { csvRAGService, SupplierAnalysis, BangaloreSupplier, ComparisonResult } from '../services/csv-rag.service';

export function RAGAnalysis() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SupplierAnalysis | null>(null);
  const [searchResults, setSearchResults] = useState<BangaloreSupplier[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setAnalysis(null);
    setComparisonResult(null);
    
    try {
      const results = await csvRAGService.retrieveRelevantSuppliers(query, 10);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSupplier = async (supplierName: string) => {
    setLoading(true);
    try {
      const result = await csvRAGService.analyzeSupplier(supplierName);
      setAnalysis(result);
      setComparisonResult(null);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetBestSupplier = async () => {
    setLoading(true);
    try {
      const best = await csvRAGService.getBestSupplier(query || 'overall');
      if (best) {
        handleAnalyzeSupplier(best.supplier);
      }
    } catch (error) {
      console.error('Best supplier error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (selectedSuppliers.length !== 2) return;
    
    setLoading(true);
    try {
      const result = await csvRAGService.compareSuppliers(selectedSuppliers[0], selectedSuppliers[1]);
      setComparisonResult(result);
      setAnalysis(null);
    } catch (error) {
      console.error('Comparison error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSupplierSelection = (supplierName: string) => {
    if (selectedSuppliers.includes(supplierName)) {
      setSelectedSuppliers(selectedSuppliers.filter(s => s !== supplierName));
    } else if (selectedSuppliers.length < 2) {
      setSelectedSuppliers([...selectedSuppliers, supplierName]);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-violet-100 to-purple-100 bg-clip-text text-transparent mb-2">
              Supplier Intelligence Dashboard
            </h1>
            <p className="text-white/60">
              Powered by RAG on 200 verified Bangalore suppliers
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
          >
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search suppliers (e.g., 'best quality fast delivery', 'low price high volume', 'financially stable')"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                Search
              </Button>
              <Button
                onClick={handleGetBestSupplier}
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 hover:from-pink-600 hover:via-purple-600 hover:to-violet-600"
              >
                <TrendingUp className="w-5 h-5" />
                Best Match
              </Button>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => {
                  setCompareMode(!compareMode);
                  setSelectedSuppliers([]);
                }}
                variant={compareMode ? 'primary' : 'secondary'}
                size="sm"
              >
                Compare Mode {compareMode ? 'ON' : 'OFF'}
              </Button>
              {compareMode && selectedSuppliers.length === 2 && (
                <Button
                  onClick={handleCompare}
                  disabled={loading}
                  size="sm"
                  className="bg-gradient-to-r from-violet-500 to-purple-500"
                >
                  Compare Selected
                </Button>
              )}
            </div>
          </motion.div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">
                Found {searchResults.length} Suppliers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((supplier, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (compareMode) {
                        toggleSupplierSelection(supplier.supplier);
                      } else {
                        handleAnalyzeSupplier(supplier.supplier);
                      }
                    }}
                    className={`
                      backdrop-blur-xl bg-white/5 border rounded-xl p-4 cursor-pointer transition-all hover:bg-white/10
                      ${selectedSuppliers.includes(supplier.supplier) ? 'border-violet-500 bg-violet-500/10' : 'border-white/10'}
                    `}
                  >
                    <h3 className="font-bold text-white mb-2">{supplier.supplier}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-white/50">Quality:</span>
                        <span className="text-violet-400 ml-2 font-semibold">{supplier.quality_score.toFixed(1)}</span>
                      </div>
                      <div>
                        <span className="text-white/50">Delivery:</span>
                        <span className="text-purple-400 ml-2 font-semibold">{supplier.delivery_time_days}d</span>
                      </div>
                      <div>
                        <span className="text-white/50">Price:</span>
                        <span className="text-pink-400 ml-2 font-semibold">₹{supplier.price_per_unit_inr.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-white/50">Financial:</span>
                        <span className="text-violet-400 ml-2 font-semibold">{supplier.financial_condition.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Comparison Result */}
          {comparisonResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Supplier Comparison</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-violet-400 mb-4">{comparisonResult.supplier_a}</h3>
                  <div className="space-y-2 text-sm text-white/70">
                    <div className="flex justify-between">
                      <span>Quality:</span>
                      <span className={comparisonResult.quality_winner === comparisonResult.supplier_a ? 'text-green-400 font-bold' : ''}>
                        {comparisonResult.quality_winner === comparisonResult.supplier_a ? '✓ Winner' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className={comparisonResult.price_winner === comparisonResult.supplier_a ? 'text-green-400 font-bold' : ''}>
                        {comparisonResult.price_winner === comparisonResult.supplier_a ? '✓ Winner' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span className={comparisonResult.delivery_winner === comparisonResult.supplier_a ? 'text-green-400 font-bold' : ''}>
                        {comparisonResult.delivery_winner === comparisonResult.supplier_a ? '✓ Winner' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Financial:</span>
                      <span className={comparisonResult.financial_winner === comparisonResult.supplier_a ? 'text-green-400 font-bold' : ''}>
                        {comparisonResult.financial_winner === comparisonResult.supplier_a ? '✓ Winner' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">{comparisonResult.supplier_b}</h3>
                  <div className="space-y-2 text-sm text-white/70">
                    <div className="flex justify-between">
                      <span>Quality:</span>
                      <span className={comparisonResult.quality_winner === comparisonResult.supplier_b ? 'text-green-400 font-bold' : ''}>
                        {comparisonResult.quality_winner === comparisonResult.supplier_b ? '✓ Winner' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className={comparisonResult.price_winner === comparisonResult.supplier_b ? 'text-green-400 font-bold' : ''}>
                        {comparisonResult.price_winner === comparisonResult.supplier_b ? '✓ Winner' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span className={comparisonResult.delivery_winner === comparisonResult.supplier_b ? 'text-green-400 font-bold' : ''}>
                        {comparisonResult.delivery_winner === comparisonResult.supplier_b ? '✓ Winner' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Financial:</span>
                      <span className={comparisonResult.financial_winner === comparisonResult.supplier_b ? 'text-green-400 font-bold' : ''}>
                        {comparisonResult.financial_winner === comparisonResult.supplier_b ? '✓ Winner' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-3">Overall Winner: <span className="text-violet-400">{comparisonResult.winner}</span></h4>
                <p className="text-white/80">{comparisonResult.recommendation}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-white/50">Quality Diff:</span>
                    <span className="text-white ml-2 font-semibold">{comparisonResult.detailed_comparison.quality_diff > 0 ? '+' : ''}{comparisonResult.detailed_comparison.quality_diff.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Price Diff:</span>
                    <span className="text-white ml-2 font-semibold">₹{comparisonResult.detailed_comparison.price_diff.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Delivery Diff:</span>
                    <span className="text-white ml-2 font-semibold">{comparisonResult.detailed_comparison.delivery_diff}d</span>
                  </div>
                  <div>
                    <span className="text-white/50">Financial Diff:</span>
                    <span className="text-white ml-2 font-semibold">{comparisonResult.detailed_comparison.financial_diff > 0 ? '+' : ''}{comparisonResult.detailed_comparison.financial_diff.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analysis Result */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Section 1: Supplier Overview */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-6">
                  1️⃣ Supplier Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-white/50 text-sm mb-1">Company Name</div>
                    <div className="text-white text-xl font-bold">{analysis.supplier_overview.name}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-sm mb-1">Location</div>
                    <div className="text-white text-lg">{analysis.supplier_overview.location}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-sm mb-1">Employees</div>
                    <div className="text-white text-lg font-semibold">{analysis.supplier_overview.employees.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-sm mb-1">Business Results</div>
                    <div className="text-white text-lg">{analysis.supplier_overview.business_results}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-white/50 text-sm mb-1">Traffic & Connectivity</div>
                    <div className="text-white text-lg">{analysis.supplier_overview.traffic_connectivity}</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Key Performance Indicators */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                  2️⃣ Key Performance Indicators
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="backdrop-blur-xl bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-violet-400 mb-1">{analysis.key_performance_indicators.quality_score.toFixed(1)}</div>
                    <div className="text-white/60 text-sm">Quality</div>
                  </div>
                  <div className="backdrop-blur-xl bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">{analysis.key_performance_indicators.quantity_capacity.toLocaleString()}</div>
                    <div className="text-white/60 text-sm">Capacity</div>
                  </div>
                  <div className="backdrop-blur-xl bg-pink-500/10 border border-pink-500/30 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-1">{analysis.key_performance_indicators.serviceability.toFixed(1)}</div>
                    <div className="text-white/60 text-sm">Service</div>
                  </div>
                  <div className="backdrop-blur-xl bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-violet-400 mb-1">{analysis.key_performance_indicators.reputation.toFixed(1)}</div>
                    <div className="text-white/60 text-sm">Reputation</div>
                  </div>
                  <div className="backdrop-blur-xl bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">{analysis.key_performance_indicators.flexibility.toFixed(1)}</div>
                    <div className="text-white/60 text-sm">Flexibility</div>
                  </div>
                </div>
              </div>

              {/* Section 3: Cost vs Reliability */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-6">
                  3️⃣ Cost vs Reliability Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <div className="text-white/50 text-sm mb-1">Price per Unit</div>
                    <div className="text-white text-2xl font-bold">₹{analysis.cost_vs_reliability.price_per_unit.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-sm mb-1">Delivery Time</div>
                    <div className="text-white text-2xl font-bold">{analysis.cost_vs_reliability.delivery_time_days} days</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-sm mb-1">Payment Terms</div>
                    <div className="text-white text-lg">{analysis.cost_vs_reliability.payment_terms}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-sm mb-1">Cost/Reliability Ratio</div>
                    <div className="text-white text-2xl font-bold">{analysis.cost_vs_reliability.cost_reliability_ratio.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Section 4: Operational Risk */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent mb-6">
                  4️⃣ Operational Risk Assessment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-white/50 text-sm mb-1">Traffic Risk</div>
                    <div className={`text-lg font-bold ${
                      analysis.operational_risk.traffic_risk === 'Low' ? 'text-green-400' :
                      analysis.operational_risk.traffic_risk.includes('Moderate') ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{analysis.operational_risk.traffic_risk}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-sm mb-1">Delivery Consistency</div>
                    <div className={`text-lg font-bold ${
                      analysis.operational_risk.delivery_consistency === 'High' ? 'text-green-400' :
                      analysis.operational_risk.delivery_consistency === 'Moderate' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{analysis.operational_risk.delivery_consistency}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-sm mb-1">Logistics Score</div>
                    <div className="text-white text-2xl font-bold">{analysis.operational_risk.logistics_score.toFixed(1)}/100</div>
                  </div>
                </div>
              </div>

              {/* Section 5: Financial & Asset Strength */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-6">
                  5️⃣ Financial & Asset Strength
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-violet-400 mb-1">{analysis.financial_asset_strength.financial_condition.toFixed(1)}</div>
                    <div className="text-white/60 text-sm">Financial</div>
                  </div>
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">{analysis.financial_asset_strength.asset_condition.toFixed(1)}</div>
                    <div className="text-white/60 text-sm">Assets</div>
                  </div>
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-1">{analysis.financial_asset_strength.business_strength.toFixed(1)}</div>
                    <div className="text-white/60 text-sm">Business</div>
                  </div>
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-violet-400 mb-1">{analysis.financial_asset_strength.overall_stability.toFixed(1)}</div>
                    <div className="text-white/60 text-sm">Stability</div>
                  </div>
                </div>
              </div>

              {/* Section 6: AI Recommendation */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 border border-violet-500/30 rounded-2xl p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                  6️⃣ AI Recommendation
                </h2>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Overall Score</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                      {analysis.ai_recommendation.overall_score.toFixed(1)}/100
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full transition-all"
                      style={{ width: `${analysis.ai_recommendation.overall_score}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-white font-bold mb-3">Strengths</h4>
                    <ul className="space-y-2">
                      {analysis.ai_recommendation.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start text-white/80">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-3">Weaknesses</h4>
                    <ul className="space-y-2">
                      {analysis.ai_recommendation.weaknesses.map((weakness: string, index: number) => (
                        <li key={index} className="flex items-start text-white/80">
                          <span className="text-red-400 mr-2">⚠</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-bold mb-2">Best Use Case</h4>
                  <p className="text-white/80">{analysis.ai_recommendation.best_use_case}</p>
                </div>
              </div>

              {/* Section 7: Confidence Score */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  7️⃣ Confidence Score
                </h2>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      {analysis.confidence_score}%
                    </div>
                    <div className="text-white/60">Data-verified confidence level</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!loading && !analysis && !comparisonResult && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-white/40 text-lg">
                Enter a search query to find suppliers or click "Best Match" for optimal recommendation
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
