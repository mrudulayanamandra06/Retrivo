// RETRIVO LOCAL DATA SERVICE & PERSISTENCE ENGINE
import {
  INITIAL_USERS,
  INITIAL_ITEMS,
  INITIAL_MATCHES,
  INITIAL_CLAIMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY
} from './seedData';

const KEYS = {
  USERS: 'retrivo_users',
  ITEMS: 'retrivo_items',
  MATCHES: 'retrivo_matches',
  CLAIMS: 'retrivo_claims',
  NOTIFICATIONS: 'retrivo_notifications',
  ACTIVITY: 'retrivo_activity',
  SESSION: 'retrivo_session'
};

// Initialize storage with starter data and always ensure the sample student exists.
// This is intentionally idempotent: it preserves accounts created by the user and
// repairs older browser storage that may contain an empty or incomplete users array.
export function initStorage() {
  const storedUsers = getStoredData(KEYS.USERS);
  const safeUsers = Array.isArray(storedUsers) ? storedUsers : [];
  const sampleStudent = INITIAL_USERS.find(user => user.email.toLowerCase() === 'lalli@campus.ac.in');
  const sampleExists = safeUsers.some(user => user?.email?.toLowerCase() === 'lalli@campus.ac.in');

  if (sampleStudent && !sampleExists) {
    safeUsers.push({ ...sampleStudent });
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(safeUsers.length ? safeUsers : INITIAL_USERS));
  if (!localStorage.getItem(KEYS.ITEMS)) {
    localStorage.setItem(KEYS.ITEMS, JSON.stringify(INITIAL_ITEMS));
  }
  if (!localStorage.getItem(KEYS.MATCHES)) {
    localStorage.setItem(KEYS.MATCHES, JSON.stringify(INITIAL_MATCHES));
  }
  if (!localStorage.getItem(KEYS.CLAIMS)) {
    localStorage.setItem(KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(KEYS.ACTIVITY)) {
    localStorage.setItem(KEYS.ACTIVITY, JSON.stringify(INITIAL_ACTIVITY));
  }

  // Clear the old automatically selected starter session once; users must sign in themselves.
  if (!localStorage.getItem('retrivo_auth_cleanup_v1')) {
    try {
      const previousSession = JSON.parse(localStorage.getItem(KEYS.SESSION) || 'null');
      if (previousSession?.id === 'user-lalli') localStorage.removeItem(KEYS.SESSION);
    } catch {
      localStorage.removeItem(KEYS.SESSION);
    }
    localStorage.setItem('retrivo_auth_cleanup_v1', 'complete');
  }
}

export function getStoredData(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return [];
  }
}

export function setStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export { KEYS };
