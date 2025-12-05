import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Loader2, Users, Bot, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Card } from '../components/ui/Card';
import { useStore } from '../store/useStore';
import { decisionService } from '../services/decision.service';
import { supplierService } from '../services/supplier.service';
import { Decision } from '../types';

export const Comparison = () => {
  const { user, showToast } = useStore();
  const [loading, setLoading] = useState(true);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [suppliers, setSuppliers] = useState<{ [key: string]: { name: string } }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;

    try {
      const [decisionsData, suppliersData] = await Promise.all([
        decisionService.getDecisions(user.id),
        supplierService.getAllSuppliers(),
      ]);

      setDecisions(decisionsData);

      const suppliersMap = suppliersData.reduce((acc, supplier) => {
        acc[supplier.id] = { name: supplier.name };
        return acc;
      }, {} as { [key: string]: { name: string } });

      setSuppliers(suppliersMap);
    } catch (error) {
      showToast('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const conflictDecisions = decisions.filter((d) => d.conflict);
  const alignedDecisions = decisions.filter((d) => !d.conflict && d.human_selected_supplier);
  const conflictRate = decisions.length > 0 ? (conflictDecisions.length / decisions.length) * 100 : 0;
  const alignmentRate = 100 - conflictRate;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">AI vs Human Comparison</h1>
          <p className="text-gray-400">Analyze how AI recommendations compare with human decisions</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card glass className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Total Comparisons</span>
                <Users className="w-5 h-5 text-violet-500" />
              </div>
              <div className="text-4xl font-bold text-white">{decisions.length}</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card glass className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Aligned</span>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-4xl font-bold text-white">{alignmentRate.toFixed(1)}%</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card glass className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Conflicts</span>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-4xl font-bold text-white">{conflictRate.toFixed(1)}%</div>
            </Card>
          </motion.div>
        </div>

        {decisions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Comparisons Yet</h3>
            <p className="text-gray-400">Make decisions to see AI vs Human comparisons</p>
          </motion.div>
        ) : (
          <>
            {conflictDecisions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  Conflict Cases
                </h2>
                <div className="space-y-4">
                  {conflictDecisions.map((decision) => (
                    <GlassPanel key={decision.id} className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">{decision.decision_name}</h3>
                          <p className="text-sm text-gray-400 mb-3">
                            {new Date(decision.created_at).toLocaleDateString()}
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Bot className="w-5 h-5 text-violet-500" />
                              <div>
                                <p className="text-xs text-gray-500">AI Selected</p>
                                <p className="text-sm font-semibold text-white">
                                  {suppliers[decision.ai_selected_supplier]?.name || 'Unknown'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-5 h-5 text-green-500" />
                              <div>
                                <p className="text-xs text-gray-500">Human Selected</p>
                                <p className="text-sm font-semibold text-white">
                                  {suppliers[decision.human_selected_supplier || '']?.name || 'Unknown'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-medium">
                          <AlertTriangle className="w-4 h-4" />
                          Conflict
                        </div>
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              </motion.div>
            )}

            {alignedDecisions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  Aligned Decisions
                </h2>
                <div className="space-y-4">
                  {alignedDecisions.slice(0, 5).map((decision) => (
                    <GlassPanel key={decision.id} className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">{decision.decision_name}</h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {new Date(decision.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-blue-500" />
                            <Users className="w-5 h-5 text-green-500" />
                            <p className="text-sm font-semibold text-white">
                              Both selected: {suppliers[decision.ai_selected_supplier]?.name || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-xl text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          Aligned
                        </div>
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
