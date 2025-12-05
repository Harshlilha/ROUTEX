import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { Chat } from '../types';

interface ChatBubbleProps {
  chat: Chat;
}

export const ChatBubble = ({ chat }: ChatBubbleProps) => {
  const isAI = chat.sender === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      <div
        className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${isAI ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-gradient-to-br from-gray-600 to-gray-700'}
        `}
      >
        {isAI ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`
          max-w-[70%] px-4 py-3 rounded-2xl
          ${
            isAI
              ? 'bg-white/5 border border-white/10'
              : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
          }
        `}
      >
        <p className={`text-sm ${isAI ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
          {chat.message}
        </p>
        <p className={`text-xs mt-1 ${isAI ? 'text-gray-500' : 'text-violet-100'}`}>
          {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </motion.div>
    </motion.div>
  );
};
