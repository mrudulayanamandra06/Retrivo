// RETRIVO CLAIM & RECOVERY SERVICE
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, KEYS } from './storageService';
import { notificationService } from './notificationService';

const isDatabaseMode = () => isSupabaseConfigured() && Boolean(supabase);

async function logActivity(actorId, action, entityType, entityId, metadata = {}) {
  if (!isDatabaseMode()) return;
  const { error } = await supabase.from('activity_logs').insert({
    actor_id: actorId, action, entity_type: entityType, entity_id: entityId, metadata
  });
  if (error) console.error('Activity log could not be saved:', error.message);
}

export const claimService = {
  isSupabase: isDatabaseMode(),

  async submitClaim({ item_id, proof_description, private_verification_details }, currentUser) {
    if (!currentUser) throw new Error('You must be signed in to submit an ownership claim.');

    if (isDatabaseMode()) {
      const { data: item, error: itemError } = await supabase.from('items').select('*').eq('id', item_id).single();
      if (itemError || !item) throw new Error('Item not found.');
      if (item.item_type !== 'found') throw new Error('Claims can only be submitted for found-item reports.');
      if (item.user_id === currentUser.id) throw new Error('You cannot claim an item you reported yourself.');
      if (['recovered', 'closed'].includes(item.status)) throw new Error('This item is no longer accepting claims.');

      const { data: existing, error: existingError } = await supabase
        .from('claims').select('id,status').eq('item_id', item_id).eq('claimant_id', currentUser.id);
      if (existingError) throw existingError;
      if ((existing || []).some(c => c.status !== 'rejected')) {
        throw new Error('You already have an active claim for this item.');
      }

      const { data: claim, error } = await supabase.from('claims').insert({
        item_id,
        claimant_id: currentUser.id,
        proof_description: proof_description.trim(),
        private_verification_details: private_verification_details.trim(),
        status: 'pending'
      }).select().single();
      if (error) throw error;

      if (item.status === 'active') {
        const { error: updateError } = await supabase.from('items').update({ status: 'under_claim' }).eq('id', item_id);
        if (updateError) throw updateError;
      }
      await notificationService.createNotification({
        user_id: item.user_id,
        title: 'New Ownership Claim Received',
        message: `${currentUser.full_name} submitted an ownership claim for "${item.title}".`,
        notification_type: 'claim_received', related_item_id: item.id, related_claim_id: claim.id
      });
      await logActivity(currentUser.id, 'claim_submitted', 'claim', claim.id, { item_title: item.title });
      return claim;
    }

    const items = getStoredData(KEYS.ITEMS);
    const item = items.find(i => i.id === item_id);
    if (!item) throw new Error('Item not found.');
    if (item.item_type !== 'found') throw new Error('Claims can only be submitted for found-item reports.');
    if (item.user_id === currentUser.id) throw new Error('You cannot submit an ownership claim on an item you reported yourself.');
    if (['recovered', 'closed'].includes(item.status)) throw new Error('This item has already been recovered or closed.');

    const claims = getStoredData(KEYS.CLAIMS);
    const existing = claims.find(c => c.item_id === item_id && c.claimant_id === currentUser.id && c.status !== 'rejected');
    if (existing) throw new Error('You have already submitted an active claim for this item.');

    const newClaim = {
      id: `claim-${Date.now()}`, item_id, claimant_id: currentUser.id,
      proof_description: proof_description.trim(),
      private_verification_details: private_verification_details.trim(),
      status: 'pending', reviewer_id: null, review_note: null,
      handover_date: null, handover_location: null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    };
    claims.unshift(newClaim);
    setStoredData(KEYS.CLAIMS, claims);
    if (item.status === 'active') {
      item.status = 'under_claim';
      setStoredData(KEYS.ITEMS, items);
    }
    await notificationService.createNotification({
      user_id: item.user_id, title: 'New Ownership Claim Received',
      message: `${currentUser.full_name} has submitted an ownership verification claim for "${item.title}".`,
      notification_type: 'claim_received', related_item_id: item.id, related_claim_id: newClaim.id
    });
    const activity = getStoredData(KEYS.ACTIVITY);
    activity.unshift({ id: `act-${Date.now()}`, actor_id: currentUser.id, action: 'claim_submitted', entity_type: 'claim', entity_id: newClaim.id, metadata: { item_title: item.title }, created_at: new Date().toISOString() });
    setStoredData(KEYS.ACTIVITY, activity);
    return newClaim;
  },


  async getAllClaims() {
    if (isDatabaseMode()) {
      const { data, error } = await supabase.from('claims')
        .select('*, item:items(*), claimant:profiles_public!claims_claimant_id_fkey(full_name,avatar_url,department)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    const claims = getStoredData(KEYS.CLAIMS);
    const items = getStoredData(KEYS.ITEMS);
    const users = getStoredData(KEYS.USERS);
    return claims.map(c => ({ ...c, item: items.find(i => i.id === c.item_id) || null, claimant: users.find(u => u.id === c.claimant_id) || { full_name: 'Campus Member' } }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getClaimsForUser(userId) {
    if (!userId) return [];
    if (isDatabaseMode()) {
      const { data, error } = await supabase.from('claims').select('*, item:items(*)').eq('claimant_id', userId).order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    const claims = getStoredData(KEYS.CLAIMS);
    const items = getStoredData(KEYS.ITEMS);
    const users = getStoredData(KEYS.USERS);
    return claims.filter(c => c.claimant_id === userId).map(c => ({
      ...c, item: items.find(i => i.id === c.item_id) || null,
      reviewer: users.find(u => u.id === c.reviewer_id) || null
    })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getClaimsForItem(itemId, currentUser) {
    if (!itemId || !currentUser) return [];
    if (isDatabaseMode()) {
      const { data, error } = await supabase.from('claims')
        .select('*, claimant:profiles_public!claims_claimant_id_fkey(full_name,avatar_url,department), reviewer:profiles_public!claims_reviewer_id_fkey(full_name)')
        .eq('item_id', itemId).order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    const items = getStoredData(KEYS.ITEMS);
    const item = items.find(i => i.id === itemId);
    if (!item) return [];
    const isOwner = item.user_id === currentUser.id;
    const isAdmin = currentUser.role === 'admin';
    const users = getStoredData(KEYS.USERS);
    let filtered = getStoredData(KEYS.CLAIMS).filter(c => c.item_id === itemId);
    if (!isOwner && !isAdmin) filtered = filtered.filter(c => c.claimant_id === currentUser.id);
    return filtered.map(c => ({
      ...c, claimant: users.find(u => u.id === c.claimant_id) || { full_name: 'Campus Claimant' },
      reviewer: users.find(u => u.id === c.reviewer_id) || null
    }));
  },

  async reviewClaim(claimId, { status, review_note }, currentUser) {
    if (!currentUser) throw new Error('Unauthorized');
    if (!['under_review', 'approved', 'rejected'].includes(status)) throw new Error('Invalid claim status.');

    if (isDatabaseMode()) {
      const { data: claim, error: claimError } = await supabase.from('claims').select('*, item:items(*)').eq('id', claimId).single();
      if (claimError || !claim) throw new Error('Claim not found or access denied.');
      const item = claim.item;
      if (currentUser.role !== 'admin' && item?.user_id !== currentUser.id) throw new Error('Permission denied: only the finder or campus admin can review this claim.');
      const { data: updated, error } = await supabase.from('claims').update({
        status, reviewer_id: currentUser.id, review_note: review_note || null
      }).eq('id', claimId).select().single();
      if (error) throw error;
      if (status === 'rejected') {
        const { data: remaining, error: remainingError } = await supabase.from('claims').select('id,status').eq('item_id', claim.item_id).in('status', ['pending', 'under_review']);
        if (remainingError) throw remainingError;
        if (!remaining?.length) await supabase.from('items').update({ status: 'active' }).eq('id', claim.item_id).eq('status', 'under_claim');
      }
      const title = status === 'approved' ? 'Claim Approved! Ownership Verified' : status === 'rejected' ? 'Claim Not Verified' : 'Claim Under Review';
      const type = status === 'approved' ? 'claim_approved' : status === 'rejected' ? 'claim_rejected' : 'claim_under_review';
      await notificationService.createNotification({ user_id: claim.claimant_id, title,
        message: status === 'approved' ? `Your claim for "${item.title}" was approved. Coordinate a safe handover.` : status === 'rejected' ? `Your claim for "${item.title}" was not verified. ${review_note || ''}` : `Your claim for "${item.title}" is now under review.`,
        notification_type: type, related_item_id: item.id, related_claim_id: claim.id });
      await logActivity(currentUser.id, `claim_${status}`, 'claim', claim.id, { item_title: item.title });
      return { ...updated, item };
    }

    const claims = getStoredData(KEYS.CLAIMS);
    const claimIndex = claims.findIndex(c => c.id === claimId);
    if (claimIndex === -1) throw new Error('Claim not found.');
    const claim = claims[claimIndex];
    const items = getStoredData(KEYS.ITEMS);
    const item = items.find(i => i.id === claim.item_id);
    if (currentUser.role !== 'admin' && item?.user_id !== currentUser.id) throw new Error('Permission denied: You can only review claims on items you found.');
    claims[claimIndex] = { ...claim, status, reviewer_id: currentUser.id, review_note: review_note || claim.review_note, updated_at: new Date().toISOString() };
    setStoredData(KEYS.CLAIMS, claims);
    if (status === 'rejected') {
      const stillActive = claims.some(c => c.item_id === claim.item_id && ['pending', 'under_review'].includes(c.status));
      if (!stillActive && item) { item.status = 'active'; setStoredData(KEYS.ITEMS, items); }
    }
    const title = status === 'approved' ? 'Claim Approved! Ownership Verified' : status === 'rejected' ? 'Claim Not Verified' : 'Claim Under Review';
    const type = status === 'approved' ? 'claim_approved' : status === 'rejected' ? 'claim_rejected' : 'claim_under_review';
    await notificationService.createNotification({ user_id: claim.claimant_id, title,
      message: `Your claim for "${item?.title}" was updated to ${status}. ${review_note || ''}`,
      notification_type: type, related_item_id: item?.id, related_claim_id: claim.id });
    return claims[claimIndex];
  },

  async completeHandover(claimId, { handover_location, notes }, currentUser) {
    if (!currentUser) throw new Error('Unauthorized');
    if (isDatabaseMode()) {
      const { data: claim, error: claimError } = await supabase.from('claims').select('*, item:items(*)').eq('id', claimId).single();
      if (claimError || !claim) throw new Error('Claim not found or access denied.');
      const item = claim.item;
      if (currentUser.role !== 'admin' && item?.user_id !== currentUser.id) throw new Error('Only the finder or campus admin can confirm handover.');
      if (claim.status !== 'approved') throw new Error('Only an approved claim can be handed over.');
      const finalLocation = handover_location || item.storage_location || 'Campus Security Office';
      const { data: updatedClaim, error: updateClaimError } = await supabase.from('claims').update({
        status: 'completed', handover_date: new Date().toISOString(), handover_location: finalLocation,
        review_note: notes ? `${claim.review_note || ''} Handover: ${notes}`.trim() : claim.review_note
      }).eq('id', claimId).select().single();
      if (updateClaimError) throw updateClaimError;
      const { data: updatedItem, error: updateItemError } = await supabase.from('items').update({ status: 'recovered' }).eq('id', item.id).select().single();
      if (updateItemError) throw updateItemError;
      const { data: matches } = await supabase.from('matches').select('lost_item_id').eq('found_item_id', item.id).gte('score', 70);
      for (const match of matches || []) await supabase.from('items').update({ status: 'recovered' }).eq('id', match.lost_item_id);
      await notificationService.createNotification({ user_id: claim.claimant_id, title: 'Item Successfully Recovered!', message: `Your item "${item.title}" has been marked as recovered.`, notification_type: 'item_recovered', related_item_id: item.id, related_claim_id: claim.id });
      await notificationService.createNotification({ user_id: item.user_id, title: 'Recovery Handover Complete!', message: `Handover for "${item.title}" has been completed.`, notification_type: 'item_recovered', related_item_id: item.id, related_claim_id: claim.id });
      await logActivity(currentUser.id, 'item_recovered', 'item', item.id, { item_title: item.title, claimant_id: claim.claimant_id, handover_location: finalLocation });
      return { claim: updatedClaim, item: updatedItem };
    }

    const claims = getStoredData(KEYS.CLAIMS);
    const claimIndex = claims.findIndex(c => c.id === claimId);
    if (claimIndex === -1) throw new Error('Claim not found.');
    const claim = claims[claimIndex];
    if (claim.status !== 'approved') throw new Error('Only an approved claim can be handed over.');
    const items = getStoredData(KEYS.ITEMS);
    const itemIndex = items.findIndex(i => i.id === claim.item_id);
    if (itemIndex === -1) throw new Error('Item not found.');
    const item = items[itemIndex];
    if (currentUser.role !== 'admin' && item.user_id !== currentUser.id) throw new Error('Only the finder or campus admin can confirm handover.');
    claims[claimIndex] = { ...claim, status: 'completed', handover_date: new Date().toISOString(), handover_location: handover_location || item.storage_location || 'Campus Security Office', review_note: notes ? `${claim.review_note || ''} Handover: ${notes}` : claim.review_note, updated_at: new Date().toISOString() };
    setStoredData(KEYS.CLAIMS, claims);
    items[itemIndex].status = 'recovered';
    items[itemIndex].updated_at = new Date().toISOString();
    const relatedMatch = getStoredData(KEYS.MATCHES).find(m => m.found_item_id === item.id && m.score >= 70);
    if (relatedMatch) { const lostIndex = items.findIndex(i => i.id === relatedMatch.lost_item_id); if (lostIndex !== -1) items[lostIndex].status = 'recovered'; }
    setStoredData(KEYS.ITEMS, items);
    await notificationService.createNotification({ user_id: claim.claimant_id, title: 'Item Successfully Recovered!', message: `Your item "${item.title}" has been officially marked as recovered.`, notification_type: 'item_recovered', related_item_id: item.id, related_claim_id: claim.id });
    await notificationService.createNotification({ user_id: item.user_id, title: 'Recovery Handover Complete!', message: `Handover for "${item.title}" completed.`, notification_type: 'item_recovered', related_item_id: item.id, related_claim_id: claim.id });
    const activity = getStoredData(KEYS.ACTIVITY);
    activity.unshift({ id: `act-${Date.now()}`, actor_id: currentUser.id, action: 'item_recovered', entity_type: 'item', entity_id: item.id, metadata: { item_title: item.title, claimant_id: claim.claimant_id }, created_at: new Date().toISOString() });
    setStoredData(KEYS.ACTIVITY, activity);
    return { claim: claims[claimIndex], item: items[itemIndex] };
  }
};
