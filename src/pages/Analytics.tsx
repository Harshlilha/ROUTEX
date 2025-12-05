import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BarChart3, Loader2, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Card } from '../components/ui/Card';
import { useStore } from '../store/useStore';
import { analyticsService } from '../services/analytics.service';

export const Analytics = () => {
  const { user, showToast } = useStore();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalDecisions: 0,
    completedDecisions: 0,
    conflictRate: 0,
    alignmentRate: 0,
    avgDecisionTime: 0,
    avgConfidence: 0,
    satisfactionRate: 0,
    totalFeedback: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      const data = await analyticsService.calculateMetrics(user.id);
      setMetrics(data);
    } catch (error) {
      showToast('Error loading analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const alignmentData = [
    { name: 'Aligned', value: metrics.alignmentRate, color: '#10b981' },
    { name: 'Conflict', value: metrics.conflictRate, color: '#ef4444' },
  ];

  const performanceData = [
    { name: 'Week 1', decisions: 5, satisfaction: 85 },
    { name: 'Week 2', decisions: 8, satisfaction: 90 },
    { name: 'Week 3', decisions: 6, satisfaction: 88 },
    { name: 'Week 4', decisions: metrics.totalDecisions || 10, satisfaction: metrics.satisfactionRate || 87 },
  ];

  const factorData = [
    { factor: 'Quality', weight: 30 },
    { factor: 'ESG', weight: 25 },
    { factor: 'Performance', weight: 20 },
    { factor: 'Price', weight: 15 },
    { factor: 'Delivery', weight: 10 },
  ];

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
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-violet-500" />
            <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>
          </div>
          <p className="text-gray-400">Comprehensive insights into your decision-making performance</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card glass className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Decisions</span>
                <Activity className="w-5 h-5 text-violet-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metrics.totalDecisions}</div>
              <div className="flex items-center gap-1 text-green-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>{metrics.completedDecisions} completed</span>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card glass className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">AI Alignment</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metrics.alignmentRate.toFixed(1)}%</div>
              <div className="text-gray-400 text-sm">Human-AI agreement rate</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card glass className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Avg Confidence</span>
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metrics.avgConfidence}%</div>
              <div className="text-gray-400 text-sm">AI prediction confidence</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card glass className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Satisfaction</span>
                {metrics.satisfactionRate >= 70 ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metrics.satisfactionRate.toFixed(1)}%</div>
              <div className="text-gray-400 text-sm">User satisfaction rate</div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassPanel className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">AI vs Human Alignment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={alignmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {alignmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </GlassPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassPanel className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Decision Factors Weight</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={factorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="factor" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="weight" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassPanel>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassPanel className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Performance Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="decisions" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
};
