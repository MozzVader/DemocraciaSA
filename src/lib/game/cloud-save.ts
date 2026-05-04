import type { GameState } from './types';
import { supabase, SAVES_TABLE } from '@/lib/supabase';

/**
 * Get the current authenticated session.
 * Returns null if not authenticated.
 */
async function getAuthSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session ?? null;
  } catch {
    return null;
  }
}

/**
 * Extract display name from user metadata.
 */
function extractDisplayName(session: { user: { user_metadata?: Record<string, unknown>; email?: string } } | null): string {
  const meta = session?.user?.user_metadata;
  if (!meta) return '';
  return (meta.full_name as string) || (meta.name as string) || (session.user.email as string) || '';
}

/**
 * Save game state to cloud — only works if authenticated.
 * Uses upsert for simplicity (insert or update in one call).
 */
export async function saveToCloud(state: GameState): Promise<void> {
  const session = await getAuthSession();
  if (!session) return;

  try {
    const { error } = await supabase
      .from(SAVES_TABLE)
      .upsert(
        {
          anonymous_id: session.user.id,
          display_name: extractDisplayName(session),
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
  const session = await getAuthSession();
  if (!session) return null;

  try {
    const { data, error } = await supabase
      .from(SAVES_TABLE)
      .select('game_state')
      .eq('anonymous_id', session.user.id)
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
  const session = await getAuthSession();
  if (!session) return false;

  try {
    const { count, error } = await supabase
      .from(SAVES_TABLE)
      .select('id', { count: 'exact', head: true })
      .eq('anonymous_id', session.user.id);

    if (error) return false;
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}
