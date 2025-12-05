import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Loader2, Clock } from 'lucide-react';
import { DecisionTimelineItem } from '../components/DecisionTimelineItem';
import { useStore } from '../store/useStore';
import { decisionService } from '../services/decision.service';
import { supplierService } from '../services/supplier.service';
import { Decision } from '../types';

export const History = () => {
  const { user, showToast } = useStore();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<{ [key: string]: { name: string } }>({});

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    if (!user) return;

    try {
      const decisionsData = await decisionService.getDecisions(user.id);
      setDecisions(decisionsData);

      const suppliersData = await supplierService.getAllSuppliers();
      const suppliersMap = suppliersData.reduce((acc, supplier) => {
        acc[supplier.id] = { name: supplier.name };
        return acc;
      }, {} as { [key: string]: { name: string } });

      setSuppliers(suppliersMap);
    } catch (error) {
      showToast('Error loading history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (decision: Decision) => {
    const data = {
      decision_name: decision.decision_name,
      created_at: decision.created_at,
      ai_selected: suppliers[decision.ai_selected_supplier]?.name,
      human_selected: suppliers[decision.human_selected_supplier || '']?.name,
      confidence: decision.ai_confidence_score,
      factors: decision.decision_factors,
      conflict: decision.conflict,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decision-${decision.id}.json`;
    a.click();

    showToast('Decision exported successfully', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-violet-500" />
            <h1 className="text-4xl font-bold text-white">Decision History</h1>
          </div>
          <p className="text-gray-400">Review and export your past supplier decisions</p>
        </motion.div>

        {decisions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Decisions Yet</h3>
            <p className="text-gray-400">Start making supplier decisions to see them here</p>
          </motion.div>
        ) : (
          <div className="relative">
            {decisions.map((decision) => (
              <DecisionTimelineItem
                key={decision.id}
                decision={decision}
                suppliers={suppliers}
                onExport={() => handleExport(decision)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
