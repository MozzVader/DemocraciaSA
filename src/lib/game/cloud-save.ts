import type { GameState } from './types';

const SUPABASE_URL = 'https://ixhbxiwshawebxvcrwxc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4aGJ4aXdzaGF3ZWJ4dmNyd3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzM5NDYsImV4cCI6MjA5MzE0OTk0Nn0.XgojEBFNRMkJFMVV0n5_s1ltZChF65X0XHLkUeJO-rY';
const TABLE = 'democracia_sa_saves';
const ANON_ID_KEY = 'democracia_sa_anon_id';

function getAnonId(): string {
const SUPABASE_URL = 'https://ixhbxiwshawebxvcrwxc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4aGJ4aXdzaGF3ZWJ4dmNyd3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzM5NDYsImV4cCI6MjA5MzE0OTk0Nn0.XgojEBFNRMkJFMVV0n5_s1ltZChF65X0XHLkUeJO-rY';
const TABLE = 'democracia_sa_saves';
const ANON_ID_KEY = 'democracia_sa_anon_id';

function getAnonId(): string {
  // 1. Check localStorage
  let id = localStorage.getItem(ANON_ID_KEY);
  if (id) return id;

  // 2. Check cookie (survives localStorage clearing)
  const cookieMatch = document.cookie.match(new RegExp('(^| )' + ANON_ID_KEY + '=([^;]+)'));
  if (cookieMatch) {
    id = cookieMatch[2];
    localStorage.setItem(ANON_ID_KEY, id);
    return id;
  }

  // 3. Create new and store in both
  id = crypto.randomUUID();
  localStorage.setItem(ANON_ID_KEY, id);
  const expires = new Date(Date.now() + 365 * 86400000).toUTCString();
  document.cookie = `${ANON_ID_KEY}=${id};expires=${expires};path=/;SameSite=Lax`;
  return id;
}

function headers(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Prefer': 'return=minimal',
  };
}

export async function saveToCloud(state: GameState): Promise<void> {
  try {
    const anonId = getAnonId();
    await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: { ...headers(), 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({
        anonymous_id: anonId,
        game_state: state,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error('Cloud save error:', e);
  }
}

export async function loadFromCloud(): Promise<GameState | null> {
  try {
    const anonId = getAnonId();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?anonymous_id=eq.${anonId}&select=game_state`,
      { headers: headers() }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.length === 0) return null;
    return data[0].game_state as GameState;
  } catch (e) {
    console.error('Cloud load error:', e);
    return null;
  }
}

export async function hasCloudSave(): Promise<boolean> {
  try {
    const anonId = getAnonId();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?anonymous_id=eq.${anonId}&select=id`,
      { headers: headers() }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

function headers(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Prefer': 'return=minimal',
  };
}

export async function saveToCloud(state: GameState): Promise<void> {
  try {
    const anonId = getAnonId();
    await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: { ...headers(), 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({
        anonymous_id: anonId,
        game_state: state,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error('Cloud save error:', e);
  }
}

export async function loadFromCloud(): Promise<GameState | null> {
  try {
    const anonId = getAnonId();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?anonymous_id=eq.${anonId}&select=game_state`,
      { headers: headers() }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.length === 0) return null;
    return data[0].game_state as GameState;
  } catch (e) {
    console.error('Cloud load error:', e);
    return null;
  }
}

export async function hasCloudSave(): Promise<boolean> {
  try {
    const anonId = getAnonId();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?anonymous_id=eq.${anonId}&select=id`,
      { headers: { ...headers(), 'Prefer': 'count=exact' } }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}
