import { supabase } from '@/lib/supabase';
import type { GameState } from './types';

const ANON_ID_KEY = 'democracia_sa_anon_id';
const SUPABASE_TABLE = 'democracia_sa_saves';

function getAnonId(): string {
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

export async function saveToCloud(state: GameState): Promise<void> {
  try {
    const anonId = getAnonId();
    const { error } = await supabase
      .from(SUPABASE_TABLE)
      .upsert(
        {
          anonymous_id: anonId,
          game_state: state as unknown as Record<string, unknown>,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'anonymous_id' }
      );
    if (error) console.error('Cloud save failed:', error.message);
  } catch (e) {
    console.error('Cloud save error:', e);
  }
}

export async function loadFromCloud(): Promise<GameState | null> {
  try {
    const anonId = getAnonId();
    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .select('game_state')
      .eq('anonymous_id', anonId)
      .single();

    if (error || !data) return null;
    return data.game_state as GameState;
  } catch (e) {
    console.error('Cloud load error:', e);
    return null;
  }
}

export async function hasCloudSave(): Promise<boolean> {
  try {
    const anonId = getAnonId();
    const { count, error } = await supabase
      .from(SUPABASE_TABLE)
      .select('*', { count: 'exact', head: true })
      .eq('anonymous_id', anonId);

    if (error) return false;
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}
