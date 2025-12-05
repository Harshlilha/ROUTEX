import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export const GlassPanel = ({ children, className = '' }: GlassPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white/5 backdrop-blur-2xl
        border border-white/10
        rounded-3xl
        shadow-2xl
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
