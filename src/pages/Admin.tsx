import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Shield, Users, TrendingUp, Activity, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { GlassPanel } from '../components/ui/GlassPanel';
import { useStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Admin = () => {
  const { user, showToast } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      showToast('Access denied: Admin only', 'error');
    }
    setLoading(false);
  }, [user]);

  const systemStats = {
    totalUsers: 127,
    activeDecisions: 45,
    totalDecisions: 892,
    systemUptime: '99.8%',
  };

  const activityData = [
    { day: 'Mon', users: 45, decisions: 23 },
    { day: 'Tue', users: 52, decisions: 31 },
    { day: 'Wed', users: 48, decisions: 28 },
    { day: 'Thu', users: 61, decisions: 35 },
    { day: 'Fri', users: 55, decisions: 29 },
    { day: 'Sat', users: 38, decisions: 18 },
    { day: 'Sun', users: 42, decisions: 21 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-gray-900 flex items-center justify-center">
        <GlassPanel className="p-12 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">This page is only accessible to administrators</p>
        </GlassPanel>
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
            <Shield className="w-8 h-8 text-violet-500" />
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400">System overview and management</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card glass className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Total Users</span>
                <Users className="w-5 h-5 text-violet-500" />
              </div>
              <div className="text-4xl font-bold text-white">{systemStats.totalUsers}</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card glass className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Active Decisions</span>
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-4xl font-bold text-white">{systemStats.activeDecisions}</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card glass className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Total Decisions</span>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-4xl font-bold text-white">{systemStats.totalDecisions}</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card glass className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">System Uptime</span>
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-4xl font-bold text-white">{systemStats.systemUptime}</div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <GlassPanel className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="users" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="decisions" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassPanel>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassPanel className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { user: 'John Doe', action: 'Created new decision', time: '2 min ago' },
                  { user: 'Jane Smith', action: 'Exported analytics', time: '15 min ago' },
                  { user: 'Bob Johnson', action: 'Updated profile', time: '1 hour ago' },
                  { user: 'Alice Brown', action: 'Completed decision', time: '2 hours ago' },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{activity.user}</p>
                      <p className="text-gray-400 text-xs">{activity.action}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassPanel className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">System Health</h3>
              <div className="space-y-4">
                {[
                  { name: 'Database', status: 'Healthy', percentage: 98 },
                  { name: 'API Server', status: 'Healthy', percentage: 99 },
                  { name: 'AI Service', status: 'Healthy', percentage: 97 },
                  { name: 'Storage', status: 'Healthy', percentage: 85 },
                ].map((service, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">{service.name}</span>
                      <span className="text-green-500 text-xs">{service.status}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${service.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
