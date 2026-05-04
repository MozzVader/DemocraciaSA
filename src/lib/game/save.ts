import type { GameState, GeneratorState } from './types';
import { GENERATORS } from './config';
import { saveToCloud, loadFromCloud, hasCloudSave } from './cloud-save';

const LOCAL_SAVE_KEY = 'democracia_sa_save';

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

export function saveGame(state: GameState): void {
  try {
    const saveData = {
      ...state,
      lastSave: Date.now(),
      lastTick: Date.now(),
    };
    // Always save locally
    localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(saveData));
    // Cloud save is handled inside — it checks auth automatically
    saveToCloud(saveData);
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

export function loadGame(): GameState | null {
  try {
    const data = localStorage.getItem(LOCAL_SAVE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data) as GameState;

    // Ensure all generators exist
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

export function hasSave(): boolean {
  return localStorage.getItem(LOCAL_SAVE_KEY) !== null;
}

export function deleteSave(): void {
  localStorage.removeItem(LOCAL_SAVE_KEY);
}

export async function loadCloudSave(): Promise<GameState | null> {
  const cloudState = await loadFromCloud();
  if (!cloudState) return null;

  // Ensure all generators exist
  for (const gen of GENERATORS) {
    if (!cloudState.generators[gen.id]) {
      cloudState.generators[gen.id] = {
        id: gen.id,
        owned: 0,
        totalProduced: 0,
      };
    }
  }

  // Also save locally as backup
  localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(cloudState));
  return cloudState;
}

export async function checkCloudSaveExists(): Promise<boolean> {
  return hasCloudSave();
}

export function getOfflineDelta(lastTick: number): number {
  const now = Date.now();
  const delta = now - lastTick;
  return Math.min(delta, 24 * 60 * 60 * 1000);
}
