import type { GameState, UpgradeConfig } from './types';
import { GENERATORS, UPGRADES, MILESTONES } from './config';

/**
 * Calculate the cost to buy the next generator of a given type.
 */
export function getGeneratorCost(generatorId: string, owned: number): number {
  const config = GENERATORS.find((g) => g.id === generatorId);
  if (!config) return Infinity;
  return Math.floor(config.baseCost * Math.pow(config.costMultiplier, owned));
}

/**
 * Calculate the total production per second (influencia/s).
 */
export function getProductionPerSecond(state: GameState): number {
  let total = 0;

  for (const genConfig of GENERATORS) {
    const genState = state.generators[genConfig.id];
    if (!genState || genState.owned === 0) continue;

    let production = genConfig.baseProduction * genState.owned;

    // Apply generator multipliers from upgrades
    for (const upgradeId of state.purchasedUpgrades) {
      const upgrade = UPGRADES.find((u) => u.id === upgradeId);
      if (
        upgrade &&
        upgrade.effect.type === 'generatorMultiplier' &&
        upgrade.effect.targetId === genConfig.id
      ) {
        production *= upgrade.effect.value;
      }
    }

    total += production;
  }

  // Apply global production multipliers from milestones
  const milestoneMultiplier = getMilestoneProductionMultiplier(state);
  total *= milestoneMultiplier;

  return total;
}

/**
 * Calculate click power (influencia per click).
 */
export function getClickPower(state: GameState): number {
  let power = 1;

  for (const upgradeId of state.purchasedUpgrades) {
    const upgrade = UPGRADES.find((u) => u.id === upgradeId);
    if (upgrade && upgrade.effect.type === 'clickMultiplier') {
      power += upgrade.effect.value;
    }
  }

  // Milestone click multipliers
  for (const milestoneId of state.unlockedMilestones) {
    const milestone = MILESTONES.find((m) => m.id === milestoneId);
    if (milestone && milestone.reward.type === 'clickMultiplier') {
      power += milestone.reward.value as number;
    }
  }

  return Math.floor(power);
}

/**
 * Calculate dinero production rate based on influencia production.
 */
export function getDineroPerSecond(state: GameState): number {
  const infPerSec = getProductionPerSecond(state);
  let dineroRate = infPerSec * 0.1; // base conversion: 10% of influencia

  for (const upgradeId of state.purchasedUpgrades) {
    const upgrade = UPGRADES.find((u) => u.id === upgradeId);
    if (upgrade && upgrade.effect.type === 'passiveInfluencia') {
      dineroRate *= (1 + upgrade.effect.value);
    }
  }

  return dineroRate;
}

/**
 * Get the total milestone production multiplier.
 */
function getMilestoneProductionMultiplier(state: GameState): number {
  let multiplier = 1;
  for (const milestoneId of state.unlockedMilestones) {
    const milestone = MILESTONES.find((m) => m.id === milestoneId);
    if (milestone && milestone.reward.type === 'productionMultiplier') {
      multiplier *= milestone.reward.value as number;
    }
  }
  return multiplier;
}

/**
 * Check if an upgrade can be purchased.
 */
export function canPurchaseUpgrade(state: GameState, upgrade: UpgradeConfig): boolean {
  if (state.purchasedUpgrades.includes(upgrade.id)) return false;

  // Check resource cost
  const resource = upgrade.costResource === 'influencia' ? state.influencia : state.dinero;
  if (resource < upgrade.cost) return false;

  // Check requirement
  const req = upgrade.requirement;
  switch (req.type) {
    case 'totalInfluencia':
      return state.totalInfluencia >= req.value;
    case 'totalDinero':
      return state.totalDinero >= req.value;
    case 'generatorCount':
      if (req.targetId) {
        return (state.generators[req.targetId]?.owned ?? 0) >= req.value;
      }
      return false;
    case 'upgradePurchased':
      return state.purchasedUpgrades.includes(req.targetId ?? '');
    default:
      return false;
  }
}

/**
 * Check if a generator is unlocked based on current phase.
 */
export function isGeneratorUnlocked(generatorId: string, currentPhase: string): boolean {
  const gen = GENERATORS.find((g) => g.id === generatorId);
  if (!gen) return false;
  return isPhaseUnlocked(gen.phase, currentPhase);
}

/**
 * Check if a phase is unlocked.
 */
function isPhaseUnlocked(genPhase: string, currentPhase: string): boolean {
  const phases = ['municipal', 'provincial', 'hegemonic'];
  return phases.indexOf(genPhase) <= phases.indexOf(currentPhase);
}

/**
 * Get the current phase based on total influencia.
 */
export function getCurrentPhase(totalInfluencia: number): 'municipal' | 'provincial' | 'hegemonic' {
  if (totalInfluencia >= 20000000) return 'hegemonic';
  if (totalInfluencia >= 12000) return 'provincial';
  return 'municipal';
}

/**
 * Calculate "democratic quality" (0-100) based on total influencia.
 * This is a satirical inverse metric.
 */
export function getDemocraticQuality(totalInfluencia: number): number {
  // Starts at 100, decreases logarithmically
  if (totalInfluencia <= 0) return 100;
  const quality = 100 - Math.log10(totalInfluencia + 1) * 8;
  return Math.max(0, Math.min(100, Math.round(quality)));
}
