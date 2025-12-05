import { supabase } from '../lib/supabase';
import { Decision, DecisionFactor } from '../types';

export const decisionService = {
  async createDecision(decision: {
    user_id: string;
    decision_name: string;
    supplier_a_id: string;
    supplier_b_id: string;
    supplier_c_id: string;
  }): Promise<Decision> {
    const { data, error } = await supabase
      .from('decisions')
      .insert(decision)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDecision(
    id: string,
    updates: {
      ai_selected_supplier?: string;
      human_selected_supplier?: string;
      final_selected_supplier?: string;
      ai_confidence_score?: number;
      decision_factors?: DecisionFactor[];
      conflict?: boolean;
      decision_time_seconds?: number;
      status?: 'pending' | 'completed' | 'exported';
    }
  ): Promise<Decision> {
    const { data, error } = await supabase
      .from('decisions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDecisions(userId: string): Promise<Decision[]> {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getDecisionById(id: string): Promise<Decision | null> {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async deleteDecision(id: string): Promise<void> {
    const { error } = await supabase.from('decisions').delete().eq('id', id);
    if (error) throw error;
  },
};
