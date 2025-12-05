import { supabase } from '../lib/supabase';
import { Chat } from '../types';
import { ragService } from './rag.service';

export const chatService = {
  async createChat(chat: {
    decision_id?: string;
    user_id: string;
    message: string;
    sender: 'user' | 'ai';
    context?: Record<string, unknown>;
  }): Promise<Chat> {
    const { data, error } = await supabase
      .from('chats')
      .insert(chat)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getChatsByDecision(decisionId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('decision_id', decisionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getChatsByUser(userId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async generateAIResponse(userMessage: string, context?: Record<string, unknown>): Promise<string> {
    // Use RAG service for intelligent, data-grounded responses
    const response = await ragService.getAIChatResponse(userMessage, context);
    
    // Small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));

    return response;
  },
};
