import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ChatBubble } from '../components/ChatBubble';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { useStore } from '../store/useStore';
import { chatService } from '../services/chat.service';
import { Chat as ChatType } from '../types';

export const Chat = () => {
  const { user, showToast } = useStore();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const loadChats = async () => {
    if (!user) return;

    try {
      const data = await chatService.getChatsByUser(user.id);
      setChats(data);
    } catch (error) {
      showToast('Error loading chat history', 'error');
    } finally {
      setInitializing(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!message.trim() || !user) return;

    const userMessage = message.trim();
    setMessage('');
    setLoading(true);

    try {
      const userChat = await chatService.createChat({
        user_id: user.id,
        message: userMessage,
        sender: 'user',
      });

      setChats((prev) => [...prev, userChat]);

      const aiResponse = await chatService.generateAIResponse(userMessage);

      const aiChat = await chatService.createChat({
        user_id: user.id,
        message: aiResponse,
        sender: 'ai',
      });

      setChats((prev) => [...prev, aiChat]);
    } catch (error) {
      showToast('Error sending message', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (initializing) {
    return (
      <>
        <AnimatedBackground />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen pt-24 pb-6 px-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold text-white mb-2">AI Assistant</h1>
          <p className="text-gray-400">Ask me anything about supplier decisions using RAG technology - all responses grounded in verified data</p>
        </motion.div>

        <GlassPanel className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chats.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">RAG-Powered AI Assistant</h3>
                  <p className="text-gray-400 max-w-md mb-4">
                    Ask me about supplier analysis with retrieval-augmented generation. All responses are grounded in verified data.
                  </p>
                  <div className="text-left bg-white/5 rounded-lg p-4 border border-white/10 max-w-md mx-auto">
                    <p className="text-sm text-gray-300 mb-2 font-semibold">Try asking:</p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• "Best electronics supplier in Chennai with high ESG?"</li>
                      <li>• "Compare AI vs Human decision for supplier IND-SUP-100000"</li>
                      <li>• "Predict delivery risk for packaging suppliers"</li>
                      <li>• "Show suppliers with low disruption probability"</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              chats.map((chat) => <ChatBubble key={chat.id} chat={chat} />)
            )}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-gray-400"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Retrieving and analyzing data...</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-white/10">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <Button onClick={handleSend} disabled={!message.trim() || loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </GlassPanel>
      </div>
      </div>
    </>
  );
};
