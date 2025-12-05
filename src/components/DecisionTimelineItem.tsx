import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Download, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Decision } from '../types';
import { Card } from './ui/Card';

interface DecisionTimelineItemProps {
  decision: Decision;
  suppliers: { [key: string]: { name: string } };
  onExport?: () => void;
  onViewChat?: () => void;
}

export const DecisionTimelineItem = ({
  decision,
  suppliers,
  onExport,
  onViewChat,
}: DecisionTimelineItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const aiSupplierName = suppliers[decision.ai_selected_supplier]?.name || 'Unknown';
  const humanSupplierName = suppliers[decision.human_selected_supplier || '']?.name || 'Not set';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative pl-8 pb-8 last:pb-0"
    >
      <div className="absolute left-0 top-2 w-4 h-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full border-4 border-gray-900 dark:border-gray-950" />
      <div className="absolute left-2 top-6 bottom-0 w-px bg-gradient-to-b from-violet-500/50 to-transparent" />

      <Card glass className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {decision.decision_name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(decision.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 mb-3">
          {decision.conflict ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm">
              <XCircle className="w-4 h-4" />
              <span>Conflict</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Aligned</span>
            </div>
          )}

          <div className="px-3 py-1 bg-violet-500/10 text-violet-500 rounded-full text-sm">
            {decision.ai_confidence_score}% confidence
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">AI Selected</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{aiSupplierName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Human Selected</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{humanSupplierName}</p>
          </div>
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-white/10 space-y-3"
          >
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">AI Decision Factors</p>
              <div className="space-y-2">
                {decision.decision_factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${factor.weight}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-24 text-right">
                      {factor.factor}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {onViewChat && (
                <button
                  onClick={onViewChat}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm text-gray-900 dark:text-white"
                >
                  <MessageSquare className="w-4 h-4" />
                  View Chat
                </button>
              )}
              {onExport && (
                <button
                  onClick={onExport}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors text-sm text-blue-500"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              )}
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};
