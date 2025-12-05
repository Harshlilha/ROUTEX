import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className = '', hover = false, glass = false, onClick }: CardProps) => {
  const baseStyles = 'rounded-2xl border transition-all duration-300';
  const glassStyles = glass
    ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl'
    : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 shadow-lg';

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      className={`${baseStyles} ${glassStyles} ${hover ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
