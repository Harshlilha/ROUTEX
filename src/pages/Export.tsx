import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { GlassPanel } from '../components/ui/GlassPanel';
import { useStore } from '../store/useStore';
import { decisionService } from '../services/decision.service';
import { supplierService } from '../services/supplier.service';
import { analyticsService } from '../services/analytics.service';

export const Export = () => {
  const { user, showToast } = useStore();
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExportAllDecisions = async () => {
    if (!user) return;

    setExporting('decisions');

    try {
      const decisions = await decisionService.getDecisions(user.id);
      const suppliers = await supplierService.getAllSuppliers();

      const suppliersMap = suppliers.reduce((acc, supplier) => {
        acc[supplier.id] = supplier;
        return acc;
      }, {} as { [key: string]: typeof suppliers[0] });

      const exportData = decisions.map((decision) => ({
        id: decision.id,
        name: decision.decision_name,
        created_at: decision.created_at,
        status: decision.status,
        conflict: decision.conflict,
        ai_confidence: decision.ai_confidence_score,
        ai_selected: {
          id: decision.ai_selected_supplier,
          name: suppliersMap[decision.ai_selected_supplier]?.name,
        },
        human_selected: {
          id: decision.human_selected_supplier,
          name: suppliersMap[decision.human_selected_supplier || '']?.name,
        },
        decision_factors: decision.decision_factors,
      }));

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all-decisions-${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      showToast('All decisions exported successfully', 'success');
    } catch (error) {
      showToast('Error exporting decisions', 'error');
    } finally {
      setExporting(null);
    }
  };

  const handleExportAnalytics = async () => {
    if (!user) return;

    setExporting('analytics');

    try {
      const metrics = await analyticsService.calculateMetrics(user.id);
      const analytics = await analyticsService.getAnalytics(user.id);

      const exportData = {
        summary: metrics,
        events: analytics,
        exported_at: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      showToast('Analytics exported successfully', 'success');
    } catch (error) {
      showToast('Error exporting analytics', 'error');
    } finally {
      setExporting(null);
    }
  };

  const handleExportSuppliers = async () => {
    if (!user) return;

    setExporting('suppliers');

    try {
      const suppliers = await supplierService.getAllSuppliers();

      const blob = new Blob([JSON.stringify(suppliers, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `suppliers-${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      showToast('Suppliers exported successfully', 'success');
    } catch (error) {
      showToast('Error exporting suppliers', 'error');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-8 h-8 text-violet-500" />
            <h1 className="text-4xl font-bold text-white">Export Reports</h1>
          </div>
          <p className="text-gray-400">Download your data and reports in various formats</p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card glass className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">All Decisions Report</h3>
                  <p className="text-gray-400 mb-4">
                    Export all your supplier decisions with AI recommendations, human selections, and decision factors.
                  </p>
                  <Button
                    onClick={handleExportAllDecisions}
                    loading={exporting === 'decisions'}
                  >
                    <Download className="w-5 h-5" />
                    Export Decisions
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card glass className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Analytics Summary</h3>
                  <p className="text-gray-400 mb-4">
                    Download comprehensive analytics including metrics, trends, and performance data.
                  </p>
                  <Button
                    onClick={handleExportAnalytics}
                    loading={exporting === 'analytics'}
                  >
                    <Download className="w-5 h-5" />
                    Export Analytics
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card glass className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Supplier Database</h3>
                  <p className="text-gray-400 mb-4">
                    Export complete supplier information including scores, pricing, and performance metrics.
                  </p>
                  <Button
                    onClick={handleExportSuppliers}
                    loading={exporting === 'suppliers'}
                  >
                    <Download className="w-5 h-5" />
                    Export Suppliers
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <GlassPanel className="p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-3">Export Information</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• All exports are in JSON format for easy integration</li>
            <li>• Data is exported in real-time from the latest database</li>
            <li>• Exports include all relevant metadata and timestamps</li>
            <li>• Files are named with the current date for easy organization</li>
          </ul>
        </GlassPanel>
      </div>
    </div>
  );
};
