// ============================================
// DEMOCRACIA S.A. — Game Type Definitions
// ============================================

export type GamePhase = 'municipal' | 'provincial' | 'imperio';

export interface GeneratorConfig {
  id: string;
  name: string;
  emoji: string;
  description: string;
  quote: string;
  phase: GamePhase;
  baseCost: number;
  baseProduction: number; // influence per second
  costMultiplier: number;
}

export interface GeneratorState {
  id: string;
  owned: number;
  totalProduced: number;
}

export interface UpgradeConfig {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cost: number;
  costResource: 'influencia' | 'dinero';
  effect: UpgradeEffect;
  requirement: UpgradeRequirement;
}

export interface UpgradeEffect {
  type: 'clickMultiplier' | 'generatorMultiplier' | 'unlockGenerator' | 'passiveInfluencia';
  targetId?: string;
  value: number;
}

export interface UpgradeRequirement {
  type: 'generatorCount' | 'totalInfluencia' | 'totalDinero' | 'upgradePurchased';
  targetId?: string;
  value: number;
}

export interface MilestoneConfig {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirement: {
    type: 'totalInfluencia' | 'totalDinero' | 'generatorsOwned' | 'upgradeCount';
    value: number;
  };
  reward: {
    type: 'clickMultiplier' | 'productionMultiplier' | 'unlockedPhase';
    value: number | GamePhase;
  };
}

export interface GameState {
  // Resources
  influencia: number;
  totalInfluencia: number;
  dinero: number;
  totalDinero: number;

  // Generators
  generators: Record<string, GeneratorState>;

  // Upgrades
  purchasedUpgrades: string[];

  // Milestones
  unlockedMilestones: string[];
  currentPhase: GamePhase;

  // Meta
  lastSave: number;
  lastTick: number;
  totalClicks: number;
  playTime: number; // seconds
}

export interface GameActions {
  click: () => void;
  buyGenerator: (id: string) => void;
  buyUpgrade: (id: string) => void;
  tick: (deltaMs: number) => void;
  checkMilestones: () => void;
  save: () => void;
  load: () => boolean;
  reset: () => void;
}
