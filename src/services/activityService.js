import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, KEYS } from './storageService';

export const activityService = {
  async getForUser(userId, limit = 10) {
    if (!userId) return [];
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('activity_logs').select('*')
        .eq('actor_id', userId).order('created_at', { ascending: false }).limit(limit);
      if (error) throw error;
      return data || [];
    }
    return getStoredData(KEYS.ACTIVITY).filter(a => a.actor_id === userId || a.actor_id === 'system')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, limit);
  },

  async getAll(limit = 100) {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('activity_logs').select('*')
        .order('created_at', { ascending: false }).limit(limit);
      if (error) throw error;
      return data || [];
    }
    return getStoredData(KEYS.ACTIVITY).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, limit);
  }
};
