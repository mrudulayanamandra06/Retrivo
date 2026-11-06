// RETRIVO ITEM SERVICE
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, KEYS } from './storageService';
import { findMatchesForItem } from './matchService';
import { notificationService } from './notificationService';
import { uploadItemPhoto, resolveItemPhoto, resolveItemPhotos } from './itemPhotoService';

export const itemService = {
  isSupabase: isSupabaseConfigured(),

  async getItems(filters = {}) {
    const {
      query = '',
      type = '', // 'lost', 'found', or ''
      category = '',
      status = '', // 'active', 'recovered', 'closed', or ''
      sort = 'newest' // 'newest', 'oldest'
    } = filters;

    if (this.isSupabase && supabase) {
      let req = supabase.from('items').select('*, user:profiles_public(full_name, avatar_url, department)');
      if (type) req = req.eq('item_type', type);
      if (category) req = req.eq('category', category);
      if (status) req = req.eq('status', status);
      if (query) {
        req = req.or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`);
      }
      req = req.order('event_date', { ascending: sort === 'oldest' });
      const { data, error } = await req;
      if (error) throw error;
      return resolveItemPhotos(data || []);
    } else {
      let items = getStoredData(KEYS.ITEMS);
      const users = getStoredData(KEYS.USERS);

      // Attach user preview
      items = items.map(item => ({
        ...item,
        user: users.find(u => u.id === item.user_id) || {
          full_name: 'Campus Member',
          email: 'community@campus.ac.in',
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
        }
      }));

      // Search Filter
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        items = items.filter(
          item =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            (item.location && item.location.toLowerCase().includes(q)) ||
            (item.distinguishing_features && item.distinguishing_features.toLowerCase().includes(q))
        );
      }

      // Type Filter
      if (type) {
        items = items.filter(item => item.item_type === type);
      }

      // Category Filter
      if (category) {
        items = items.filter(item => item.category === category);
      }

      // Status Filter
      if (status) {
        items = items.filter(item => item.status === status);
      }

      // Sorting
      items.sort((a, b) => {
        const dA = new Date(a.event_date || a.created_at);
        const dB = new Date(b.event_date || b.created_at);
        return sort === 'oldest' ? dA - dB : dB - dA;
      });

      return items;
    }
  },

  async getItemById(id) {
    if (this.isSupabase && supabase) {
      const { data, error } = await supabase
        .from('items')
        .select('*, user:profiles_public(full_name, avatar_url, department)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data ? { ...data, image_url: await resolveItemPhoto(data.image_url) } : null;
    } else {
      const items = getStoredData(KEYS.ITEMS);
      const item = items.find(i => i.id === id);
      if (!item) return null;
      const users = getStoredData(KEYS.USERS);
      const user = users.find(u => u.id === item.user_id) || null;
      return { ...item, user };
    }
  },

  async createItem(formData, currentUser) {
    if (!currentUser) throw new Error('You must be logged in to report an item.');

    let imageUrl = formData.image_url || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800';
    if (formData.image_file) imageUrl = await uploadItemPhoto(formData.image_file, currentUser.id);

    const newItem = {
      ...(this.isSupabase ? {} : { id: `item-${Date.now()}` }),
      user_id: currentUser.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      item_type: formData.item_type, // 'lost' | 'found'
      location: formData.location.trim(),
      event_date: formData.event_date,
      approximate_time: formData.approximate_time || '',
      image_url: imageUrl,
      distinguishing_features: formData.distinguishing_features || '',
      reward_information: formData.reward_information || null,
      storage_location: formData.storage_location || null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.isSupabase && supabase) {
      const { id, created_at, updated_at, ...databasePayload } = newItem;
      const { data, error } = await supabase.from('items').insert([databasePayload]).select().single();
      if (error) throw error;
      data.image_url = await resolveItemPhoto(data.image_url);

      // Persist an audit event for the new report.
      const { error: activityError } = await supabase.from('activity_logs').insert({
        actor_id: currentUser.id,
        action: `item_reported_${data.item_type}`,
        entity_type: 'item',
        entity_id: data.id,
        metadata: { title: data.title, location: data.location }
      });
      if (activityError) console.error('Could not save item activity:', activityError.message);

      // Compare against opposite-type active reports and persist explainable matches.
      const oppositeType = data.item_type === 'lost' ? 'found' : 'lost';
      const { data: candidates, error: candidateError } = await supabase.from('items')
        .select('*').eq('item_type', oppositeType).not('status', 'in', '(recovered,closed)');
      if (candidateError) throw candidateError;
      const matchesFound = findMatchesForItem(data, candidates || []);
      for (const match of matchesFound) {
        const matchPayload = {
          lost_item_id: match.lost_item_id,
          found_item_id: match.found_item_id,
          score: match.score,
          explanation: match.explanation,
          matched_attributes: match.matched_attributes,
          status: 'suggested'
        };
        const { data: savedMatch, error: matchError } = await supabase.from('matches')
          .upsert(matchPayload, { onConflict: 'lost_item_id,found_item_id', ignoreDuplicates: true })
          .select().maybeSingle();
        if (matchError) {
          console.error('Could not persist match:', matchError.message);
          continue;
        }
        const counterpart = (candidates || []).find(candidate => candidate.id === match.counterpart.id);
        if (counterpart && savedMatch) {
          await notificationService.createNotification({
            user_id: counterpart.user_id,
            title: `Potential Match Discovered (${match.score}%)`,
            message: `A possible match was found between "${data.title}" and your report "${counterpart.title}". Review the match details in Retrivo.`,
            notification_type: 'match_found', related_item_id: data.id
          });
          await notificationService.createNotification({
            user_id: currentUser.id,
            title: `Potential Match Discovered (${match.score}%)`,
            message: `Your report "${data.title}" may match "${counterpart.title}". Review the match details in Retrivo.`,
            notification_type: 'match_found', related_item_id: counterpart.id
          });
        }
      }
      return data;
    } else {
      const items = getStoredData(KEYS.ITEMS);
      items.unshift(newItem);
      setStoredData(KEYS.ITEMS, items);

      // Record Activity Log
      const activity = getStoredData(KEYS.ACTIVITY);
      activity.unshift({
        id: `act-${Date.now()}`,
        actor_id: currentUser.id,
        action: `item_reported_${newItem.item_type}`,
        entity_type: 'item',
        entity_id: newItem.id,
        metadata: { title: newItem.title, location: newItem.location },
        created_at: new Date().toISOString()
      });
      setStoredData(KEYS.ACTIVITY, activity);

      // TRIGGER SMART MATCHING ENGINE AUTOMATICALLY
      const matchesFound = findMatchesForItem(newItem, items);
      if (matchesFound.length > 0) {
        const existingMatches = getStoredData(KEYS.MATCHES);
        for (const match of matchesFound) {
          // Avoid duplicate match pair
          const exists = existingMatches.some(
            m => m.lost_item_id === match.lost_item_id && m.found_item_id === match.found_item_id
          );
          if (!exists) {
            existingMatches.push(match);

            // Notify both the newly reporting user and the counter-party
            const counterpartUser = match.counterpart.user_id;

            // Notification for counterpart
            await notificationService.createNotification({
              user_id: counterpartUser,
              title: `Potential Match Discovered! (${match.score}%)`,
              message: `Retrivo AI engine matched your ${match.counterpart.title} with a newly reported item "${newItem.title}" at ${newItem.location}.`,
              notification_type: 'match_found',
              related_item_id: newItem.id
            });

            // Notification for current reporter
            await notificationService.createNotification({
              user_id: currentUser.id,
              title: `Instant Match Found! (${match.score}%)`,
              message: `Your newly listed "${newItem.title}" has a strong match candidate: "${match.counterpart.title}".`,
              notification_type: 'match_found',
              related_item_id: match.counterpart.id
            });
          }
        }
        setStoredData(KEYS.MATCHES, existingMatches);
      }

      return newItem;
    }
  },

  async updateItem(id, updates, currentUser) {
    if (this.isSupabase && supabase) {
      const { data, error } = await supabase
        .from('items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const items = getStoredData(KEYS.ITEMS);
      const index = items.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Item not found.');

      // Security check: Only owner or admin can update
      if (items[index].user_id !== currentUser.id && currentUser.role !== 'admin') {
        throw new Error('Unauthorized: You can only edit your own reports.');
      }

      items[index] = {
        ...items[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      setStoredData(KEYS.ITEMS, items);
      return items[index];
    }
  },

  async closeItem(id, currentUser, reason = 'Closed by owner') {
    return this.updateItem(id, { status: 'closed' }, currentUser);
  },

  async deleteItem(id, currentUser) {
    if (this.isSupabase && supabase) {
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (error) throw error;
    } else {
      const items = getStoredData(KEYS.ITEMS);
      const target = items.find(i => i.id === id);
      if (!target) throw new Error('Item not found.');
      if (target.user_id !== currentUser.id && currentUser.role !== 'admin') {
        throw new Error('Unauthorized to delete this item.');
      }
      const filtered = items.filter(i => i.id !== id);
      setStoredData(KEYS.ITEMS, filtered);
    }
  },

  async getStatistics() {
    let items = [];
    let claims = [];

    if (this.isSupabase && supabase) {
      const { data: iData } = await supabase.from('items').select('status, item_type');
      const { data: cData } = await supabase.from('claims').select('status');
      items = iData || [];
      claims = cData || [];
    } else {
      items = getStoredData(KEYS.ITEMS);
      claims = getStoredData(KEYS.CLAIMS);
    }

    const totalItems = items.length;
    const recoveredCount = items.filter(i => i.status === 'recovered').length;
    const activeCount = items.filter(i => i.status === 'active').length;
    const lostCount = items.filter(i => i.item_type === 'lost' && i.status === 'active').length;
    const foundCount = items.filter(i => i.item_type === 'found' && i.status === 'active').length;
    const pendingClaims = claims.filter(c => c.status === 'pending' || c.status === 'under_review').length;

    return {
      totalItems,
      recoveredCount,
      activeCount,
      lostCount,
      foundCount,
      pendingClaims
    };
  }
};
