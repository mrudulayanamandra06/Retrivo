// RETRIVO AUTHENTICATION SERVICE
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, KEYS } from './storageService';

export const authService = {
  isSupabase: isSupabaseConfigured(),

  async getCurrentUser() {
    if (this.isSupabase && supabase) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return profile || { id: user.id, email: user.email, full_name: user.user_metadata?.full_name || user.email, role: 'student', country: user.user_metadata?.country || 'India' };
    } else {
      const raw = localStorage.getItem(KEYS.SESSION);
      return raw ? JSON.parse(raw) : null;
    }
  },

  async login(email, password) {
    if (this.isSupabase && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      return profile || { id: data.user.id, email: data.user.email, full_name: data.user.user_metadata?.full_name || data.user.email, role: 'student', country: data.user.user_metadata?.country || 'India' };
    } else {
      const users = getStoredData(KEYS.USERS);
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('No registered account found with this email.');
      }
      if (user.password && user.password !== password) {
        throw new Error('Invalid password provided.');
      }
      localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
      return user;
    }
  },

  async register({ full_name, email, password, department = '', phone = '', country = 'India', role = 'student' }) {
    if (this.isSupabase && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, department, phone, country, role }
        }
      });
      if (error) throw error;
      if (!data.user) return null;
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
      if (profileError) throw profileError;
      return profile || { id: data.user.id, email: data.user.email, full_name, role: 'student', country };
    } else {
      const users = getStoredData(KEYS.USERS);
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email address already exists.');
      }

      const newUser = {
        id: `user-${Date.now()}`,
        full_name,
        email,
        password,
        department: department || 'General Campus Community',
        phone: phone || '',
        country: country || 'India',
        role: role === 'admin' ? 'student' : role, // Prevent self-elevation to admin
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}&backgroundColor=203B36,E9A15B`,
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      setStoredData(KEYS.USERS, users);
      localStorage.setItem(KEYS.SESSION, JSON.stringify(newUser));
      return newUser;
    }
  },



  async logout() {
    if (this.isSupabase && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(KEYS.SESSION);
    }
  },

  async updateProfile(userId, updates) {
    if (this.isSupabase && supabase) {
      // Prevent role update from client
      const { role, ...safeUpdates } = updates;
      const { data, error } = await supabase
        .from('profiles')
        .update(safeUpdates)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const users = getStoredData(KEYS.USERS);
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) throw new Error('User not found.');

      // Prevent non-admin self role escalation
      const { role, ...safeUpdates } = updates;
      users[index] = { ...users[index], ...safeUpdates, updated_at: new Date().toISOString() };
      setStoredData(KEYS.USERS, users);

      const currentUser = JSON.parse(localStorage.getItem(KEYS.SESSION) || '{}');
      if (currentUser.id === userId) {
        localStorage.setItem(KEYS.SESSION, JSON.stringify(users[index]));
      }
      return users[index];
    }
  },

  async getAllUsers() {
    if (this.isSupabase && supabase) {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data;
    } else {
      return getStoredData(KEYS.USERS);
    }
  }
};
