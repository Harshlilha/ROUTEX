import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassPanel } from '../components/ui/GlassPanel';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { contractService } from '../services/contract.service';
import { Contract } from '../types';

export const Contracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ai' | 'human' | 'conflict'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contractsData, statsData] = await Promise.all([
        contractService.getContracts(50),
        contractService.getContractStats(),
      ]);
      setContracts(contractsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter(contract => {
    if (filter === 'ai') return contract.decision_winner === 'AI';
    if (filter === 'human') return contract.decision_winner === 'Human';
    if (filter === 'conflict') return contract.ai_human_conflict > 5;
    return true;
  });

  if (loading) {
    return (
      <>
        <AnimatedBackground />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading contracts..." />
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <FileText className="w-8 h-8 text-violet-500" />
              <h1 className="text-4xl font-bold text-white">Contracts</h1>
            </div>
            <p className="text-gray-400">Manage and track supplier contracts</p>
          </motion.div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Total Contracts</span>
                  <FileText className="w-5 h-5 text-violet-500" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.totalContracts}</div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Total Value</span>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-white">
                  ₹{(stats.totalValue / 1000000).toFixed(1)}M
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Avg On-Time</span>
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.avgOnTime.toFixed(1)}%</div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Conflicts</span>
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.conflicts}</div>
              </GlassPanel>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            {(['all', 'ai', 'human', 'conflict'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === f
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Contracts List */}
          <div className="space-y-4">
            {filteredContracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassPanel className="p-6 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {contract.contract_id}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {new Date(contract.contract_date).toLocaleDateString()} - {contract.duration_days} days
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {contract.decision_winner === 'AI' ? (
                        <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-xs font-medium">
                          AI Selected
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">
                          Human Selected
                        </span>
                      )}
                      {contract.ai_human_conflict > 5 && (
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs text-gray-500">Contract Value</span>
                      <p className="text-sm font-semibold text-white">
                        ₹{contract.contract_value_inr.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">On-Time Delivery</span>
                      <p className="text-sm font-semibold text-green-400">
                        {contract.on_time_delivery_pct.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Defect Rate</span>
                      <p className="text-sm font-semibold text-red-400">
                        {contract.defect_rate_pct.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">ESG Score</span>
                      <p className="text-sm font-semibold text-violet-400">
                        {contract.esg_score.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">AI Score</span>
                        <span className="text-violet-400">{contract.ai_score.toFixed(1)}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
                          style={{ width: `${contract.ai_score}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Human Score</span>
                        <span className="text-blue-400">{contract.human_score.toFixed(1)}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-600"
                          style={{ width: `${contract.human_score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
