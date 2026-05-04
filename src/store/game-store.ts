import { create } from 'zustand';
import type { GameState } from '@/lib/game/types';
import { createInitialState, saveGame, loadGame, getOfflineDelta, loadCloudSave, checkCloudSaveExists } from '@/lib/game/save';
import {
  getGeneratorCost,
  getGeneratorCostBulk,
  getMaxBuyable,
  getProductionPerSecond,
  getClickPower,
  getDineroPerSecond,
  canPurchaseUpgrade,
  getCurrentPhase,
} from '@/lib/game/calculator';
import { GENERATORS, UPGRADES, MILESTONES } from '@/lib/game/config';
import { showAchievementToast } from '@/components/game/AchievementToast';

export type BuyAmount = 1 | 10 | -1; // -1 = Max

interface GameStore extends GameState {
  productionPerSecond: () => number;
  dineroPerSecond: () => number;
  clickPower: () => number;
  generatorCost: (id: string) => number;
  canBuyUpgrade: (id: string) => boolean;
  loading: boolean;
  buyAmount: BuyAmount;

  click: () => void;
  buyGenerator: (id: string) => void;
  purchaseUpgrade: (id: string) => void;
  tick: (deltaMs: number) => void;
  checkMilestones: () => void;
  save: () => void;
  load: () => boolean;
  reset: () => void;
  init: (isAuthenticated: boolean) => Promise<void>;
  setBuyAmount: (amount: BuyAmount) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),
  loading: true,
  buyAmount: 1 as BuyAmount,

  productionPerSecond: () => getProductionPerSecond(get()),
  dineroPerSecond: () => getDineroPerSecond(get()),
  clickPower: () => getClickPower(get()),
  generatorCost: (id: string) => {
    const state = get();
    const owned = state.generators[id]?.owned ?? 0;
    if (state.buyAmount === -1) {
      const max = getMaxBuyable(id, owned, state.influencia);
      return max > 0 ? getGeneratorCostBulk(id, owned, max) : getGeneratorCost(id, owned);
    }
    return getGeneratorCostBulk(id, owned, state.buyAmount);
  },
  canBuyUpgrade: (id: string) => {
    const upgrade = UPGRADES.find((u) => u.id === id);
    if (!upgrade) return false;
    return canPurchaseUpgrade(get(), upgrade);
  },

  click: () => {
    const power = getClickPower(get());
    set((state) => ({
      influencia: state.influencia + power,
      totalInfluencia: state.totalInfluencia + power,
      totalClicks: state.totalClicks + 1,
    }));
  },

  buyGenerator: (id: string) => {
    const state = get();
    const owned = state.generators[id]?.owned ?? 0;

    let amount: number;
    let cost: number;

    if (state.buyAmount === -1) {
      amount = getMaxBuyable(id, owned, state.influencia);
      if (amount <= 0) return;
      cost = getGeneratorCostBulk(id, owned, amount);
    } else {
      amount = state.buyAmount;
      cost = getGeneratorCostBulk(id, owned, amount);
      if (state.influencia < cost) return;
    }

    set((s) => {
      const newGenerators = { ...s.generators };
      const gen = { ...newGenerators[id] };
      gen.owned += amount;
      newGenerators[id] = gen;
      return { influencia: s.influencia - cost, generators: newGenerators };
    });
  },

  setBuyAmount: (amount: BuyAmount) => set({ buyAmount: amount }),

  purchaseUpgrade: (id: string) => {
    const state = get();
    const upgrade = UPGRADES.find((u) => u.id === id);
    if (!upgrade || !canPurchaseUpgrade(state, upgrade)) return;

    set((s) => ({
      influencia: upgrade.costResource === 'influencia' ? s.influencia - upgrade.cost : s.influencia,
      dinero: upgrade.costResource === 'dinero' ? s.dinero - upgrade.cost : s.dinero,
      purchasedUpgrades: [...s.purchasedUpgrades, id],
    }));
  },

  tick: (deltaMs: number) => {
    const state = get();
    const deltaSec = deltaMs / 1000;
    const infGain = getProductionPerSecond(state) * deltaSec;
    const dineroGain = getDineroPerSecond(state) * deltaSec;

    set((s) => ({
      influencia: s.influencia + infGain,
      totalInfluencia: s.totalInfluencia + infGain,
      dinero: s.dinero + dineroGain,
      totalDinero: s.totalDinero + dineroGain,
      playTime: s.playTime + deltaSec,
      currentPhase: getCurrentPhase(s.totalInfluencia),
    }));

    get().checkMilestones();
  },

  checkMilestones: () => {
    const state = get();
    for (const milestone of MILESTONES) {
      if (state.unlockedMilestones.includes(milestone.id)) continue;
      const req = milestone.requirement;
      let met = false;
      switch (req.type) {
        case 'totalInfluencia':
          met = state.totalInfluencia >= req.value;
          break;
        case 'totalDinero':
          met = state.totalDinero >= req.value;
          break;
        case 'generatorsOwned':
          met = Object.values(state.generators).reduce((sum, g) => sum + g.owned, 0) >= req.value;
          break;
        case 'upgradeCount':
          met = state.purchasedUpgrades.length >= req.value;
          break;
      }
      if (met) {
        set((s) => ({
          unlockedMilestones: [...s.unlockedMilestones, milestone.id],
        }));
        showAchievementToast(milestone);
      }
    }
  },

  save: () => saveGame(get()),

  load: () => {
    const loaded = loadGame();
    if (!loaded) return false;
    set({
      ...loaded,
      lastTick: Date.now(),
      currentPhase: getCurrentPhase(loaded.totalInfluencia),
    });
    const offlineDelta = getOfflineDelta(loaded.lastTick);
    if (offlineDelta > 5000) {
      get().tick(offlineDelta);
    }
    return true;
  },

  reset: () => {
    set(createInitialState());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('democracia_sa_save');
    }
  },

  init: async (isAuthenticated: boolean) => {
    if (isAuthenticated) {
      // Authenticated: try cloud first, fall back to localStorage
      const cloudExists = await checkCloudSaveExists();
      if (cloudExists) {
        const cloudState = await loadCloudSave();
        if (cloudState) {
          set({
            ...cloudState,
            lastTick: Date.now(),
            currentPhase: getCurrentPhase(cloudState.totalInfluencia),
            loading: false,
          });
          const offlineDelta = getOfflineDelta(cloudState.lastTick);
          if (offlineDelta > 5000) {
            get().tick(offlineDelta);
          }
          return;
        }
      }
      // Cloud has no save — try localStorage as fallback
      const loaded = get().load();
      if (!loaded) {
        set(createInitialState());
      }
      set({ loading: false });
    } else {
      // Not authenticated: localStorage only
      const loaded = get().load();
      if (!loaded) {
        set(createInitialState());
      }
      set({ loading: false });
    }
  },
}));
