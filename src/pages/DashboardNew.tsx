import { useState, useEffect, useRef } from 'react';
import { SimpleNavbar } from '../components/SimpleNavbar';
import { ChatBot } from '../components/ChatBot';
import { csvRAGService, type BangaloreSupplier } from '../services/csv-rag.service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { Search, TrendingUp, Repeat, LineChart, Download, MessageSquare } from 'lucide-react';

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f3e8ff'];

export const Dashboard = () => {
  const [suppliers, setSuppliers] = useState<BangaloreSupplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<string>('');
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Input states
  const [searchQuery, setSearchQuery] = useState('');
  const [compareSupplier1, setCompareSupplier1] = useState('');
  const [compareSupplier2, setCompareSupplier2] = useState('');
  const [bestCriteria, setBestCriteria] = useState('');
  const [predictSupplier, setPredictSupplier] = useState('');
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await csvRAGService.loadSupplierData();
      setSuppliers(data);
      setStatusMessage(`✅ Loaded ${data.length} verified Bangalore suppliers`);
    } catch (error) {
      setStatusMessage('❌ Error loading supplier data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string, field: string) => {
    if (field === 'search') setSearchQuery(value);
    if (field === 'compare1') setCompareSupplier1(value);
    if (field === 'compare2') setCompareSupplier2(value);
    if (field === 'predict') setPredictSupplier(value);

    setActiveField(field);
    
    if (value.length > 0) {
      const suggestions = suppliers
        .map(s => s.supplier)
        .filter(name => name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
      setFilteredSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    if (activeField === 'search') setSearchQuery(suggestion);
    if (activeField === 'compare1') setCompareSupplier1(suggestion);
    if (activeField === 'compare2') setCompareSupplier2(suggestion);
    if (activeField === 'predict') setPredictSupplier(suggestion);
    setShowSuggestions(false);
  };

  const handleSearchSupplier = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setActiveAction('search');
    try {
      const analysis = await csvRAGService.analyzeSupplier(searchQuery);
      setResult(analysis);
      setStatusMessage(`✅ Analysis complete for ${searchQuery}`);
    } catch (error) {
      setStatusMessage('❌ Supplier not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCompareSuppliers = async () => {
    if (!compareSupplier1.trim() || !compareSupplier2.trim()) return;
    setLoading(true);
    setActiveAction('compare');
    try {
      const comparison = await csvRAGService.compareSuppliers(compareSupplier1, compareSupplier2);
      setResult(comparison);
      setStatusMessage(`✅ Comparison complete`);
    } catch (error) {
      setStatusMessage('❌ Error comparing suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleGetBest = async () => {
    setLoading(true);
    setActiveAction('best');
    try {
      const best = await csvRAGService.getBestSupplier(bestCriteria || 'balanced');
      setResult(best);
      setStatusMessage(`✅ Best supplier identified`);
    } catch (error) {
      setStatusMessage('❌ Error finding best supplier');
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    if (!predictSupplier.trim()) return;
    setLoading(true);
    setActiveAction('predict');
    try {
      const prediction = await csvRAGService.predictPerformance(predictSupplier);
      setResult(prediction);
      setStatusMessage(`✅ Performance prediction complete`);
    } catch (error) {
      setStatusMessage('❌ Error predicting performance');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const report = JSON.stringify(result, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supplier-report-${Date.now()}.json`;
    a.click();
    setStatusMessage('✅ Report downloaded');
  };

  // Dashboard analytics data
  const topSuppliersByQuality = suppliers
    .slice()
    .sort((a, b) => b.quality_score - a.quality_score)
    .slice(0, 10)
    .map(s => ({
      name: s.supplier.substring(0, 15),
      quality: s.quality_score,
    }));

  const priceDistribution = suppliers.reduce((acc: any[], s) => {
    const price = s.price_per_unit_inr;
    const range = price < 100 ? '<100' : price < 200 ? '100-200' : price < 300 ? '200-300' : '300+';
    const existing = acc.find(item => item.range === range);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ range, count: 1 });
    }
    return acc;
  }, []);

  const deliveryTimeData = suppliers.reduce((acc: any[], s) => {
    const days = s.delivery_time_days;
    const range = days <= 3 ? '1-3 days' : days <= 7 ? '4-7 days' : days <= 14 ? '8-14 days' : '15+ days';
    const existing = acc.find(item => item.name === range);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: range, value: 1 });
    }
    return acc;
  }, []);

  const qualityVsPriceData = suppliers.slice(0, 50).map(s => ({
    name: s.supplier,
    quality: s.quality_score,
    price: s.price_per_unit_inr,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="relative z-10">
        <SimpleNavbar />
      
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-purple-300 to-pink-300">
              Supplier Intelligence Dashboard
            </h1>
            <p className="text-purple-200">AI-Powered Supplier Decision Assistant • 200 Verified Suppliers</p>
          </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="mb-6 bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-lg border border-white/30 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
            {statusMessage}
          </div>
        )}

        {/* Floating Chat Button */}
        <button
          onClick={() => setShowChatBot(!showChatBot)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-full shadow-2xl flex items-center justify-center z-50 transform hover:scale-110 transition-all duration-300 animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          <MessageSquare className="text-white" size={28} />
        </button>

        {/* Chatbot Modal */}
        {showChatBot && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={() => setShowChatBot(false)}>
            <div className="w-full max-w-2xl h-[600px]" onClick={(e) => e.stopPropagation()}>
              <ChatBot />
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Suppliers by Quality */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 hover:shadow-violet-500/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span> Top 10 Suppliers by Quality
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSuppliersByQuality}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" tick={{ fill: '#fff', fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fill: '#fff' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="quality" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Price Distribution */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl transform hover:scale-105 hover:-rotate-1 transition-all duration-300 hover:shadow-pink-500/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">💰</span> Price Distribution (INR/Unit)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.range}: ${entry.count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {priceDistribution.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Delivery Time Distribution */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 hover:shadow-blue-500/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🚚</span> Delivery Time Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deliveryTimeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deliveryTimeData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quality vs Price Scatter */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl transform hover:scale-105 hover:-rotate-1 transition-all duration-300 hover:shadow-purple-500/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span> Quality vs Price Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="price" name="Price" tick={{ fill: '#fff' }} label={{ value: 'Price (INR)', position: 'bottom', fill: '#fff' }} />
                <YAxis dataKey="quality" name="Quality" tick={{ fill: '#fff' }} label={{ value: 'Quality Score', angle: -90, position: 'left', fill: '#fff' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Scatter data={qualityVsPriceData} fill="#a78bfa" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => { setActiveAction('search'); setResult(null); }}
            className="bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-violet-500/50 transform hover:scale-110 hover:-rotate-2 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Search size={20} />
            Search Supplier
          </button>
          <button
            onClick={() => { setActiveAction('compare'); setResult(null); }}
            className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 hover:rotate-2 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Repeat size={20} />
            Compare
          </button>
          <button
            onClick={() => { setActiveAction('best'); setResult(null); }}
            className="bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-pink-500/50 transform hover:scale-110 hover:-rotate-2 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <TrendingUp size={20} />
            Get Best
          </button>
          <button
            onClick={() => { setActiveAction('predict'); setResult(null); }}
            className="bg-gradient-to-br from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-rose-500/50 transform hover:scale-110 hover:rotate-2 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LineChart size={20} />
            Predict
          </button>
          <button
            onClick={handleDownloadReport}
            disabled={!result}
            className="bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/50 transform hover:scale-110 hover:-rotate-2 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Download size={20} />
            Download
          </button>
        </div>

        {/* Input Forms Based on Active Action */}
        {activeAction === 'search' && (
          <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4">🔍 Search for Supplier</h3>
            <div className="relative" ref={suggestionsRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value, 'search')}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                placeholder="Start typing supplier name..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-200/50 focus:outline-none focus:border-violet-400"
              />
              {showSuggestions && activeField === 'search' && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-white/20 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectSuggestion(suggestion)}
                      className="px-4 py-3 hover:bg-violet-600 cursor-pointer text-white border-b border-white/10 last:border-0"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSearchSupplier}
              disabled={loading}
              className="mt-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg"
            >
              {loading ? 'Searching...' : 'Analyze Supplier'}
            </button>
          </div>
        )}

        {activeAction === 'compare' && (
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4">⚖️ Compare Two Suppliers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative" ref={suggestionsRef}>
                <input
                  type="text"
                  value={compareSupplier1}
                  onChange={(e) => handleInputChange(e.target.value, 'compare1')}
                  onFocus={() => compareSupplier1 && setShowSuggestions(true)}
                  placeholder="First supplier..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-200/50 focus:outline-none focus:border-violet-400"
                />
                {showSuggestions && activeField === 'compare1' && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-white/20 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectSuggestion(suggestion)}
                        className="px-4 py-3 hover:bg-violet-600 cursor-pointer text-white border-b border-white/10 last:border-0"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={suggestionsRef}>
                <input
                  type="text"
                  value={compareSupplier2}
                  onChange={(e) => handleInputChange(e.target.value, 'compare2')}
                  onFocus={() => compareSupplier2 && setShowSuggestions(true)}
                  placeholder="Second supplier..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-200/50 focus:outline-none focus:border-violet-400"
                />
                {showSuggestions && activeField === 'compare2' && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-white/20 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectSuggestion(suggestion)}
                        className="px-4 py-3 hover:bg-violet-600 cursor-pointer text-white border-b border-white/10 last:border-0"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleCompareSuppliers}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg"
            >
              {loading ? 'Comparing...' : 'Compare Suppliers'}
            </button>
          </div>
        )}

        {activeAction === 'best' && (
          <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4">🏆 Get Best Supplier</h3>
            <select
              value={bestCriteria}
              onChange={(e) => setBestCriteria(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-400 mb-4"
            >
              <option value="balanced">Balanced (Quality + Price + Delivery)</option>
              <option value="quality">Best Quality</option>
              <option value="price">Best Price</option>
              <option value="delivery">Fastest Delivery</option>
            </select>
            <button
              onClick={handleGetBest}
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg"
            >
              {loading ? 'Analyzing...' : 'Find Best Supplier'}
            </button>
          </div>
        )}

        {activeAction === 'predict' && (
          <div className="bg-gradient-to-br from-rose-500/20 to-orange-500/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4">📈 Predict Performance</h3>
            <div className="relative" ref={suggestionsRef}>
              <input
                type="text"
                value={predictSupplier}
                onChange={(e) => handleInputChange(e.target.value, 'predict')}
                onFocus={() => predictSupplier && setShowSuggestions(true)}
                placeholder="Supplier name for prediction..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-200/50 focus:outline-none focus:border-violet-400"
              />
              {showSuggestions && activeField === 'predict' && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-white/20 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectSuggestion(suggestion)}
                      className="px-4 py-3 hover:bg-violet-600 cursor-pointer text-white border-b border-white/10 last:border-0"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handlePredict}
              disabled={loading}
              className="mt-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg"
            >
              {loading ? 'Predicting...' : 'Generate Prediction'}
            </button>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-6">📋 Analysis Results</h3>
            <pre className="bg-gray-900/50 rounded-xl p-6 text-purple-100 overflow-auto max-h-96 text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
