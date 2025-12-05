import { supabase } from '../lib/supabase';
import { FeedbackRating } from '../types';

export const feedbackService = {
  async createFeedback(feedback: {
    decision_id: string;
    user_id: string;
    rating: 'thumbs_up' | 'thumbs_down';
    comment?: string;
  }): Promise<FeedbackRating> {
    const sentimentScore = feedback.rating === 'thumbs_up' ? 0.8 : -0.6;

    const { data, error } = await supabase
      .from('feedback_ratings')
      .insert({
        ...feedback,
        comment: feedback.comment || '',
        sentiment_score: sentimentScore,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getFeedbackByDecision(decisionId: string): Promise<FeedbackRating | null> {
    const { data, error } = await supabase
      .from('feedback_ratings')
      .select('*')
      .eq('decision_id', decisionId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAllFeedback(userId: string): Promise<FeedbackRating[]> {
    const { data, error } = await supabase
      .from('feedback_ratings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateFeedback(
    id: string,
    updates: { rating?: 'thumbs_up' | 'thumbs_down'; comment?: string }
  ): Promise<FeedbackRating> {
    const sentimentScore =
      updates.rating === 'thumbs_up' ? 0.8 : updates.rating === 'thumbs_down' ? -0.6 : undefined;

    const { data, error } = await supabase
      .from('feedback_ratings')
      .update({
        ...updates,
        ...(sentimentScore !== undefined && { sentiment_score: sentimentScore }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
