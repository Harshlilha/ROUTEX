import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, Mail, Shield, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Card } from '../components/ui/Card';
import { useStore } from '../store/useStore';
import { authService } from '../services/auth.service';

export const Profile = () => {
  const { user, setUser, showToast } = useStore();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const updatedUser = await authService.updateProfile(user.id, {
        full_name: fullName,
      });

      setUser(updatedUser);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast('Error updating profile', 'error');
    } finally {
      setLoading(false);
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
            <User className="w-8 h-8 text-violet-500" />
            <h1 className="text-4xl font-bold text-white">Profile Settings</h1>
          </div>
          <p className="text-gray-400">Manage your account information and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassPanel className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{user?.full_name || 'User'}</h3>
                <p className="text-sm text-gray-400 mb-2">{user?.email}</p>
                <div className="flex items-center gap-2 px-3 py-1 bg-violet-500/10 text-violet-500 rounded-full text-xs">
                  <Shield className="w-3 h-3" />
                  {user?.role?.toUpperCase()}
                </div>
              </div>
            </GlassPanel>

            <Card glass className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Member Since</span>
                  <span className="text-white text-sm font-semibold">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Role</span>
                  <span className="text-white text-sm font-semibold capitalize">{user?.role}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <GlassPanel className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-300">{user?.email}</span>
                    <span className="ml-auto text-xs text-gray-500">Email cannot be changed</span>
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  <Save className="w-5 h-5" />
                  Save Changes
                </Button>
              </form>
            </GlassPanel>

            <GlassPanel className="p-6 mt-6">
              <h2 className="text-2xl font-bold text-white mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">Email Notifications</h3>
                    <p className="text-sm text-gray-400">Receive updates about your decisions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">AI Recommendations</h3>
                    <p className="text-sm text-gray-400">Show AI suggestions automatically</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
