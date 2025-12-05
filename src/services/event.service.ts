import { supabase } from '../lib/supabase';
import { DisruptionEvent } from '../types';

export const eventService = {
  async getEvents(limit = 100): Promise<DisruptionEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getActiveEvents(): Promise<DisruptionEvent[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .lte('start_date', now)
      .gte('end_date', now)
      .order('severity', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getEventsByCity(city: string): Promise<DisruptionEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .contains('affected_cities', [city])
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getEventsBySeverity(severity: string): Promise<DisruptionEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('severity', severity)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getEventStats() {
    const { data, error } = await supabase
      .from('events')
      .select('*');

    if (error) throw error;

    const events = data || [];
    const severityCounts = {
      Critical: events.filter(e => e.severity === 'Critical').length,
      High: events.filter(e => e.severity === 'High').length,
      Medium: events.filter(e => e.severity === 'Medium').length,
      Low: events.filter(e => e.severity === 'Low').length,
    };

    const avgDuration = events.reduce((sum, e) => sum + e.duration_days, 0) / events.length;

    return {
      totalEvents: events.length,
      severityCounts,
      avgDuration,
      activeEvents: events.filter(e => {
        const now = new Date();
        return new Date(e.start_date) <= now && new Date(e.end_date) >= now;
      }).length,
    };
  },
};
