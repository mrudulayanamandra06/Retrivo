import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { findMatchesForItem } from './matchService';

// Calculate explainable match suggestions from locally stored campus reports.
export async function getMatchesForItem(targetItem, allItems = []) {
  if (!targetItem) return [];
  if (isSupabaseConfigured() && supabase) {
    const column = targetItem.item_type === 'lost' ? 'lost_item_id' : 'found_item_id';
    const { data, error } = await supabase.from('matches')
      .select('*, lost_item:items!matches_lost_item_id_fkey(*), found_item:items!matches_found_item_id_fkey(*)')
      .eq(column, targetItem.id).order('score', { ascending: false });
    if (error) throw error;
    return (data || []).map(match => {
      const counterpart = targetItem.item_type === 'lost' ? match.found_item : match.lost_item;
      return { ...match, counterpart,
        classification: match.score >= 80 ? 'Strong potential match' : match.score >= 60 ? 'Possible match' : 'Low-confidence match',
        badgeVariant: match.score >= 80 ? 'badge-active' : match.score >= 60 ? 'badge-pending' : 'badge-closed'
      };
    }).filter(match => match.counterpart);
  }
  return findMatchesForItem(targetItem, allItems);
}
