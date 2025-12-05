import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { useStore } from '../store/useStore';

export const Voice = () => {
  const { showToast } = useStore();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      showToast('Voice recording started', 'info');

      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setIsRecording(false);
        setAudioLevel(0);
        setTranscript(
          'I need to find a supplier for electronic components with delivery under 15 days, good ESG score, and competitive pricing.'
        );
        showToast('Voice input processed', 'success');
      }, 3000);
    } else {
      setIsRecording(false);
      setAudioLevel(0);
      showToast('Recording stopped', 'info');
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
            <Volume2 className="w-8 h-8 text-violet-500" />
            <h1 className="text-4xl font-bold text-white">Voice Input</h1>
          </div>
          <p className="text-gray-400">Speak your supplier requirements naturally</p>
        </motion.div>

        <GlassPanel className="p-12">
          <div className="flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleRecording}
              className={`
                relative w-32 h-32 rounded-full flex items-center justify-center
                transition-all duration-300
                ${
                  isRecording
                    ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-2xl shadow-red-500/50'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/50'
                }
              `}
            >
              {isRecording ? (
                <MicOff className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}

              {isRecording && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-full border-4 border-red-500/30"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.8, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                    className="absolute inset-0 rounded-full border-4 border-red-500/20"
                  />
                </>
              )}
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-xl text-white font-medium"
            >
              {isRecording ? 'Listening...' : 'Click to start speaking'}
            </motion.p>

            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 w-full max-w-md"
              >
                <div className="flex items-center gap-2 h-16">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: `${Math.random() * audioLevel}%`,
                      }}
                      transition={{ duration: 0.1 }}
                      className="flex-1 bg-gradient-to-t from-violet-500 to-purple-600 rounded-full"
                      style={{ minHeight: '10%' }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {transcript && !isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 w-full"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Transcript</h3>
                  <p className="text-gray-300 mb-6">{transcript}</p>
                  <div className="flex gap-3">
                    <Button className="flex-1">Process Request</Button>
                    <Button variant="secondary" onClick={() => setTranscript('')}>
                      Clear
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Example Voice Commands</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• "Find suppliers with ESG score above 80"</li>
            <li>• "Show me suppliers with delivery under 14 days"</li>
            <li>• "Compare the top 3 suppliers by price"</li>
            <li>• "What are the quality scores of available suppliers?"</li>
            <li>• "Run AI analysis on these three suppliers"</li>
          </ul>
        </GlassPanel>
      </div>
    </div>
  );
};
