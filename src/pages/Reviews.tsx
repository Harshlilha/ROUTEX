import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassPanel } from '../components/ui/GlassPanel';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { reviewService } from '../services/review.service';
import { Review } from '../types';

export const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reviewsData, statsData] = await Promise.all([
        reviewService.getReviews(50),
        reviewService.getReviewStats(),
      ]);
      setReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.sentiment === filter;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 bg-green-500/10';
      case 'neutral': return 'text-yellow-400 bg-yellow-500/10';
      case 'negative': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <>
        <AnimatedBackground />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading reviews..." />
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <MessageSquare className="w-8 h-8 text-violet-500" />
              <h1 className="text-4xl font-bold text-white">Supplier Reviews</h1>
            </div>
            <p className="text-gray-400">Feedback and ratings from previous contracts</p>
          </motion.div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Total Reviews</span>
                  <MessageSquare className="w-5 h-5 text-violet-500" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.totalReviews}</div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Average Rating</span>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.avgRating.toFixed(1)}</div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Positive</span>
                  <ThumbsUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {stats.sentimentCounts.positive}
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Negative</span>
                  <ThumbsDown className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {stats.sentimentCounts.negative}
                </div>
              </GlassPanel>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            {(['all', 'positive', 'neutral', 'negative'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === f
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassPanel className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(
                          review.sentiment
                        )}`}
                      >
                        {review.sentiment}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.review_date).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-3">{review.review_text}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Review ID: {review.review_id}</span>
                    <span>•</span>
                    <span>Contract: {review.contract_id}</span>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
