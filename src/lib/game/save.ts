import type { GameState, GeneratorState } from './types';
import { GENERATORS } from './config';

const SAVE_KEY = 'democracia_sa_save';

/**
 * Create the initial game state.
 */
export function createInitialState(): GameState {
  const generators: Record<string, GeneratorState> = {};
  for (const gen of GENERATORS) {
    generators[gen.id] = {
      id: gen.id,
      owned: 0,
      totalProduced: 0,
    };
  }

  return {
    influencia: 0,
    totalInfluencia: 0,
    dinero: 0,
    totalDinero: 0,
    generators,
    purchasedUpgrades: [],
    unlockedMilestones: [],
    currentPhase: 'municipal',
    lastSave: Date.now(),
    lastTick: Date.now(),
    totalClicks: 0,
    playTime: 0,
  };
}

/**
 * Save game state to localStorage.
 */
export function saveGame(state: GameState): void {
  try {
    const saveData = {
      ...state,
      lastSave: Date.now(),
      lastTick: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

/**
 * Load game state from localStorage.
 */
export function loadGame(): GameState | null {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data) as GameState;

    // Ensure all generators exist (in case new ones were added)
    for (const gen of GENERATORS) {
      if (!parsed.generators[gen.id]) {
        parsed.generators[gen.id] = {
          id: gen.id,
          owned: 0,
          totalProduced: 0,
        };
      }
    }

    return parsed;
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
}

/**
 * Check if a save exists.
 */
export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

/**
 * Delete save data.
 */
export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

/**
 * Calculate offline progress (time between lastTick and now).
 * Returns the delta in milliseconds.
 */
export function getOfflineDelta(lastTick: number): number {
  const now = Date.now();
  const delta = now - lastTick;
  // Cap at 24 hours to prevent insane offline gains
  return Math.min(delta, 24 * 60 * 60 * 1000);
}
