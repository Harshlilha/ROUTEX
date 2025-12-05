import { supabase } from '../lib/supabase';
import { Review } from '../types';

export const reviewService = {
  async getReviews(limit = 100): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('review_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getReviewsBySupplier(supplierId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('review_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getReviewsByDecision(decisionId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('decision_id', decisionId)
      .order('review_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getReviewStats() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*');

    if (error) throw error;

    const reviews = data || [];
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const sentimentCounts = {
      positive: reviews.filter(r => r.sentiment === 'positive').length,
      neutral: reviews.filter(r => r.sentiment === 'neutral').length,
      negative: reviews.filter(r => r.sentiment === 'negative').length,
    };

    return {
      totalReviews: reviews.length,
      avgRating,
      sentimentCounts,
    };
  },

  async createReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
