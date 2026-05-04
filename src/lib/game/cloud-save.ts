import type { GameState } from './types';
import { supabase, SAVES_TABLE } from '@/lib/supabase';

/**
 * Check if there's an authenticated user.
 * Returns the user ID if authenticated, null otherwise.
 */
async function getAuthUserId(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Save game state to cloud — only works if authenticated.
 * Uses upsert for simplicity (insert or update in one call).
 */
export async function saveToCloud(state: GameState): Promise<void> {
  const userId = await getAuthUserId();
  if (!userId) return;

  try {
    const { error } = await supabase
      .from(SAVES_TABLE)
      .upsert(
        {
          anonymous_id: userId,
          game_state: state,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'anonymous_id' },
      );

    if (error) {
      console.error('Cloud save error:', error.message);
    }
  } catch (e) {
    console.error('Cloud save error:', e);
  }
}

/**
 * Load game state from cloud — only works if authenticated.
 */
export async function loadFromCloud(): Promise<GameState | null> {
  const userId = await getAuthUserId();
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from(SAVES_TABLE)
      .select('game_state')
      .eq('anonymous_id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return data.game_state as GameState;
  } catch (e) {
    console.error('Cloud load error:', e);
    return null;
  }
}

/**
 * Check if a cloud save exists — only works if authenticated.
 */
export async function hasCloudSave(): Promise<boolean> {
  const userId = await getAuthUserId();
  if (!userId) return false;

  try {
    const { count, error } = await supabase
      .from(SAVES_TABLE)
      .select('id', { count: 'exact', head: true })
      .eq('anonymous_id', userId);

    if (error) return false;
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}
