import { supabase } from '../lib/supabase';
import { AnalyticsLog } from '../types';

export const analyticsService = {
  async logEvent(event: {
    user_id: string;
    event_type: string;
    event_data?: Record<string, unknown>;
  }): Promise<AnalyticsLog> {
    const { data, error } = await supabase
      .from('analytics_logs')
      .insert({
        ...event,
        event_data: event.event_data || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAnalytics(userId: string): Promise<AnalyticsLog[]> {
    const { data, error } = await supabase
      .from('analytics_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async calculateMetrics(userId: string) {
    const decisions = await supabase
      .from('decisions')
      .select('*')
      .eq('user_id', userId);

    const feedback = await supabase
      .from('feedback_ratings')
      .select('*')
      .eq('user_id', userId);

    const totalDecisions = decisions.data?.length || 0;
    const completedDecisions = decisions.data?.filter((d) => d.status === 'completed').length || 0;
    const conflictDecisions = decisions.data?.filter((d) => d.conflict).length || 0;

    const positiveFeedback = feedback.data?.filter((f) => f.rating === 'thumbs_up').length || 0;
    const totalFeedback = feedback.data?.length || 0;

    const avgDecisionTime =
      decisions.data?.reduce((sum, d) => sum + d.decision_time_seconds, 0) / totalDecisions || 0;

    const avgConfidence =
      decisions.data?.reduce((sum, d) => sum + d.ai_confidence_score, 0) / totalDecisions || 0;

    return {
      totalDecisions,
      completedDecisions,
      conflictRate: totalDecisions > 0 ? (conflictDecisions / totalDecisions) * 100 : 0,
      alignmentRate: totalDecisions > 0 ? ((totalDecisions - conflictDecisions) / totalDecisions) * 100 : 0,
      avgDecisionTime: Math.round(avgDecisionTime),
      avgConfidence: Math.round(avgConfidence * 10) / 10,
      satisfactionRate: totalFeedback > 0 ? (positiveFeedback / totalFeedback) * 100 : 0,
      totalFeedback,
    };
  },
};
