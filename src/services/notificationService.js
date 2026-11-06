// RETRIVO NOTIFICATION SERVICE
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, KEYS } from './storageService';

export const notificationService = {
  isSupabase: isSupabaseConfigured(),

  async getUserNotifications(userId) {
    if (!userId) return [];
    if (this.isSupabase && supabase) {
      const { data, error } = await supabase.from('notifications').select('*')
        .eq('user_id', userId).order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    return getStoredData(KEYS.NOTIFICATIONS).filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async markAsRead(notificationId) {
    if (this.isSupabase && supabase) {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
      if (error) throw error;
      return;
    }
    const all = getStoredData(KEYS.NOTIFICATIONS);
    const index = all.findIndex(n => n.id === notificationId);
    if (index !== -1) { all[index].is_read = true; setStoredData(KEYS.NOTIFICATIONS, all); }
  },

  async markAllAsRead(userId) {
    if (!userId) return;
    if (this.isSupabase && supabase) {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
      if (error) throw error;
      return;
    }
    const all = getStoredData(KEYS.NOTIFICATIONS);
    setStoredData(KEYS.NOTIFICATIONS, all.map(n => n.user_id === userId ? { ...n, is_read: true } : n));
  },

  async createNotification({ user_id, title, message, notification_type = 'system', related_item_id = null, related_claim_id = null }) {
    if (this.isSupabase && supabase) {
      // Let PostgreSQL generate the UUID and timestamp; locally generated IDs are used in browser storage.
      const { data, error } = await supabase.from('notifications').insert({
        user_id, title, message, notification_type, related_item_id, related_claim_id
      }).select().single();
      if (error) throw error;
      return data;
    }
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id, title, message, notification_type, related_item_id, related_claim_id,
      is_read: false, created_at: new Date().toISOString()
    };
    const all = getStoredData(KEYS.NOTIFICATIONS);
    all.unshift(newNotif);
    setStoredData(KEYS.NOTIFICATIONS, all);
    return newNotif;
  }
};
