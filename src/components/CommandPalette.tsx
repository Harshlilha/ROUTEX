import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Search, Home, BarChart3, Clock, MessageSquare, TrendingUp, FileText, Mic, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

export const CommandPalette = () => {
  const { isCommandPaletteOpen, toggleCommandPalette, user } = useStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const commands: Command[] = [
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      icon: <Home className="w-4 h-4" />,
      action: () => navigate('/dashboard'),
      keywords: ['dashboard', 'home', 'main'],
    },
    {
      id: 'chat',
      label: 'Open AI Chat',
      icon: <MessageSquare className="w-4 h-4" />,
      action: () => navigate('/chat'),
      keywords: ['chat', 'ai', 'assistant', 'talk'],
    },
    {
      id: 'history',
      label: 'View Decision History',
      icon: <Clock className="w-4 h-4" />,
      action: () => navigate('/history'),
      keywords: ['history', 'past', 'decisions', 'timeline'],
    },
    {
      id: 'analytics',
      label: 'View Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      action: () => navigate('/analytics'),
      keywords: ['analytics', 'stats', 'metrics', 'data'],
    },
    {
      id: 'comparison',
      label: 'AI vs Human Comparison',
      icon: <TrendingUp className="w-4 h-4" />,
      action: () => navigate('/comparison'),
      keywords: ['comparison', 'ai', 'human', 'vs'],
    },
    {
      id: 'export',
      label: 'Export Reports',
      icon: <FileText className="w-4 h-4" />,
      action: () => navigate('/export'),
      keywords: ['export', 'report', 'download', 'pdf'],
    },
    {
      id: 'voice',
      label: 'Voice Input',
      icon: <Mic className="w-4 h-4" />,
      action: () => navigate('/voice'),
      keywords: ['voice', 'mic', 'speak', 'audio'],
    },
    {
      id: 'profile',
      label: 'Profile Settings',
      icon: <Settings className="w-4 h-4" />,
      action: () => navigate('/profile'),
      keywords: ['profile', 'settings', 'account', 'user'],
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.keywords.some((keyword) => keyword.includes(search.toLowerCase())) ||
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        toggleCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, toggleCommandPalette]);

  if (!user) return null;

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCommandPalette}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400"
                  autoFocus
                />
                <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">ESC</span>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-8 text-center text-gray-400">No commands found</div>
                ) : (
                  filteredCommands.map((cmd) => (
                    <motion.button
                      key={cmd.id}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        cmd.action();
                        toggleCommandPalette();
                        setSearch('');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                    >
                      <div className="text-gray-400">{cmd.icon}</div>
                      <span className="text-white">{cmd.label}</span>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
