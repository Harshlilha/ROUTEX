import { motion } from 'framer-motion';
import { Package, Clock, Star, Leaf, TrendingUp, Award } from 'lucide-react';
import { Supplier } from '../types';
import { Card } from './ui/Card';

interface SupplierCardProps {
  supplier: Supplier;
  isSelected?: boolean;
  rank?: number;
  onSelect?: () => void;
}

export const SupplierCard = ({ supplier, isSelected = false, rank, onSelect }: SupplierCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, rotateY: 2, rotateX: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <Card
        glass
        hover
        onClick={onSelect}
        className={`
          p-6 relative overflow-hidden
          ${isSelected ? 'ring-2 ring-violet-500 shadow-violet-500/50' : ''}
        `}
      >
        {rank && (
          <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            #{rank}
          </div>
        )}

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{supplier.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{supplier.country}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${supplier.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Delivery</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {supplier.delivery_time} days
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ScoreBadge
            icon={<Star className="w-4 h-4" />}
            label="Quality"
            score={supplier.quality_score}
            color="violet"
          />
          <ScoreBadge
            icon={<Leaf className="w-4 h-4" />}
            label="ESG"
            score={supplier.esg_score}
            color="green"
          />
          <ScoreBadge
            icon={<TrendingUp className="w-4 h-4" />}
            label="AI Score"
            score={supplier.ai_performance_score}
            color="purple"
          />
          <ScoreBadge
            icon={<Award className="w-4 h-4" />}
            label="Human"
            score={supplier.human_scorecard_score}
            color="orange"
          />
        </div>

        <p className="mt-4 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
          {supplier.description}
        </p>
      </Card>
    </motion.div>
  );
};

const ScoreBadge = ({
  icon,
  label,
  score,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
  color: string;
}) => {
  const colors = {
    violet: 'bg-violet-500/10 text-violet-500',
    green: 'bg-green-500/10 text-green-500',
    purple: 'bg-purple-500/10 text-purple-500',
    orange: 'bg-orange-500/10 text-orange-500',
  };

  return (
    <div className={`${colors[color as keyof typeof colors]} rounded-lg p-2`}>
      <div className="flex items-center gap-1 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-lg font-bold">{score}</div>
    </div>
  );
};
