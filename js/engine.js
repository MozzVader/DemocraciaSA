// ============================================
// DEMOCRACIA S.A. — Game Engine
// ============================================

const LOCAL_SAVE_KEY = 'democracia_sa_save';

// ---- Formatters ----

function formatNumber(n) {
  if (n < 0) return '-' + formatNumber(-n);
  if (n < 1000) return Math.floor(n).toString();
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  const tier = Math.floor(Math.log10(Math.abs(n)) / 3);
  if (tier === 0) return Math.floor(n).toString();
  if (tier >= suffixes.length) return n.toExponential(2);
  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = n / scale;
  return scaled.toFixed(2) + suffix;
}

function formatPerSecond(n) {
  if (n < 0) return '-' + formatPerSecond(-n);
  if (n < 1000) return n.toFixed(1);
  return formatNumber(n);
}

function formatDinero(n) {
  return '$' + formatNumber(n);
}

function formatTime(seconds) {
  if (seconds < 60) return Math.floor(seconds) + 's';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ' + Math.floor(seconds % 60) + 's';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ' + Math.floor((seconds % 3600) / 60) + 'm';
  return Math.floor(seconds / 86400) + 'd ' + Math.floor((seconds % 86400) / 3600) + 'h';
}

function getDemocracyQuote(quality) {
  if (quality >= 90) return '"La democracia funciona... m\u00E1s o menos."';
  if (quality >= 75) return '"Algunos funcionarios empezaron a tener agendas muy alineadas."';
  if (quality >= 60) return '"Las leyes se parecen mucho a las propuestas de ciertos think tanks."';
  if (quality >= 45) return '"Los medios ya no saben si informan o hacen propaganda."';
  if (quality >= 30) return '"La oposici\u00F3n existe, pero recibe el mismo financiamiento."';
  if (quality >= 15) return '"El presidente es irrelevante. Tu s\u00ED importas."';
  if (quality > 0) return '"Democracia, Inc. Es todo tuyo."';
  return '"No cambiaste el mundo. Compraste los que lo cambian."';
}

// ---- Calculator ----

function getGeneratorCost(generatorId, owned) {
  const config = GENERATORS.find(function(g) { return g.id === generatorId; });
  if (!config) return Infinity;
  return Math.floor(config.baseCost * Math.pow(config.costMultiplier, owned));
}

function getGeneratorCostBulk(generatorId, owned, amount) {
  const config = GENERATORS.find(function(g) { return g.id === generatorId; });
  if (!config || amount <= 0) return 0;
  const r = config.costMultiplier;
  const base = config.baseCost * Math.pow(r, owned);
  const total = base * (Math.pow(r, amount) - 1) / (r - 1);
  return Math.ceil(total);
}

function getMaxBuyable(generatorId, owned, resource) {
  const config = GENERATORS.find(function(g) { return g.id === generatorId; });
  if (!config || resource <= 0) return 0;
  const r = config.costMultiplier;
  const base = config.baseCost * Math.pow(r, owned);
  if (base > resource) return 0;
  let lo = 1, hi = 1;
  while (getGeneratorCostBulk(generatorId, owned, hi * 2) <= resource) hi *= 2;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (getGeneratorCostBulk(generatorId, owned, mid) <= resource) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

function getProductionPerSecond(state) {
  let total = 0;
  for (let i = 0; i < GENERATORS.length; i++) {
    const genConfig = GENERATORS[i];
    const genState = state.generators[genConfig.id];
    if (!genState || genState.owned === 0) continue;
    let production = genConfig.baseProduction * genState.owned;
    for (let j = 0; j < state.purchasedUpgrades.length; j++) {
      const upgrade = UPGRADES.find(function(u) { return u.id === state.purchasedUpgrades[j]; });
      if (upgrade && upgrade.effect.type === 'generatorMultiplier' && upgrade.effect.targetId === genConfig.id) {
        production *= upgrade.effect.value;
      }
    }
    total += production;
  }
  const milestoneMultiplier = getMilestoneProductionMultiplier(state);
  total *= milestoneMultiplier;
  return total;
}

function getClickPower(state) {
  let power = 1;
  for (let i = 0; i < state.purchasedUpgrades.length; i++) {
    const upgrade = UPGRADES.find(function(u) { return u.id === state.purchasedUpgrades[i]; });
    if (upgrade && upgrade.effect.type === 'clickMultiplier') {
      power += upgrade.effect.value;
    }
  }
  for (let i = 0; i < state.unlockedMilestones.length; i++) {
    const milestone = MILESTONES.find(function(m) { return m.id === state.unlockedMilestones[i]; });
    if (milestone && milestone.reward.type === 'clickMultiplier') {
      power += milestone.reward.value;
    }
  }
  return Math.floor(power);
}

function getDineroPerSecond(state) {
  const infPerSec = getProductionPerSecond(state);
  let dineroRate = infPerSec * 0.1;
  for (let i = 0; i < state.purchasedUpgrades.length; i++) {
    const upgrade = UPGRADES.find(function(u) { return u.id === state.purchasedUpgrades[i]; });
    if (upgrade && upgrade.effect.type === 'passiveInfluencia') {
      dineroRate *= (1 + upgrade.effect.value);
    }
  }
  return dineroRate;
}

function getMilestoneProductionMultiplier(state) {
  let multiplier = 1;
  for (let i = 0; i < state.unlockedMilestones.length; i++) {
    const milestone = MILESTONES.find(function(m) { return m.id === state.unlockedMilestones[i]; });
    if (milestone && milestone.reward.type === 'productionMultiplier') {
      multiplier *= milestone.reward.value;
    }
  }
  return multiplier;
}

function canPurchaseUpgrade(state, upgrade) {
  if (state.purchasedUpgrades.indexOf(upgrade.id) !== -1) return false;
  const resource = upgrade.costResource === 'influencia' ? state.influencia : state.dinero;
  if (resource < upgrade.cost) return false;
  const req = upgrade.requirement;
  switch (req.type) {
    case 'totalInfluencia':
      return state.totalInfluencia >= req.value;
    case 'totalDinero':
      return state.totalDinero >= req.value;
    case 'generatorCount':
      if (req.targetId) {
        return (state.generators[req.targetId] ? state.generators[req.targetId].owned : 0) >= req.value;
      }
      return false;
    case 'upgradePurchased':
      return state.purchasedUpgrades.indexOf(req.targetId || '') !== -1;
    default:
      return false;
  }
}

function isGeneratorUnlocked(generatorId, currentPhase) {
  const gen = GENERATORS.find(function(g) { return g.id === generatorId; });
  if (!gen) return false;
  const phases = ['municipal', 'provincial', 'imperio'];
  return phases.indexOf(gen.phase) <= phases.indexOf(currentPhase);
}

function getCurrentPhase(totalInfluencia) {
  if (totalInfluencia >= 20000000) return 'imperio';
  if (totalInfluencia >= 12000) return 'provincial';
  return 'municipal';
}

function getDemocraticQuality(totalInfluencia) {
  if (totalInfluencia <= 0) return 100;
  const quality = 100 - Math.log10(totalInfluencia + 1) * 8;
  return Math.max(0, Math.min(100, Math.round(quality)));
}

// ---- State Management ----

function createInitialState() {
  const generators = {};
  for (let i = 0; i < GENERATORS.length; i++) {
    generators[GENERATORS[i].id] = { id: GENERATORS[i].id, owned: 0, totalProduced: 0 };
  }
  return {
    influencia: 0,
    totalInfluencia: 0,
    dinero: 0,
    totalDinero: 0,
    generators: generators,
    purchasedUpgrades: [],
    unlockedMilestones: [],
    currentPhase: 'municipal',
    lastSave: Date.now(),
    lastTick: Date.now(),
    totalClicks: 0,
    playTime: 0,
  };
}

// ---- Save / Load ----

function saveGame(state) {
  try {
    const saveData = Object.assign({}, state, { lastSave: Date.now(), lastTick: Date.now() });
    localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

function loadGame() {
  try {
    const data = localStorage.getItem(LOCAL_SAVE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    for (let i = 0; i < GENERATORS.length; i++) {
      if (!parsed.generators[GENERATORS[i].id]) {
        parsed.generators[GENERATORS[i].id] = { id: GENERATORS[i].id, owned: 0, totalProduced: 0 };
      }
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
}

function deleteSave() {
  localStorage.removeItem(LOCAL_SAVE_KEY);
}

function getOfflineDelta(lastTick) {
  const now = Date.now();
  const delta = now - lastTick;
  return Math.min(delta, 24 * 60 * 60 * 1000);
}

// ---- Game Engine Class ----

function GameEngine() {
  this.state = createInitialState();
  this.buyAmount = 1;
  this.listeners = [];
  this.onMilestone = null;
}

GameEngine.prototype.subscribe = function(fn) {
  this.listeners.push(fn);
};

GameEngine.prototype.notify = function() {
  for (let i = 0; i < this.listeners.length; i++) {
    this.listeners[i](this.state);
  }
};

GameEngine.prototype.click = function() {
  const power = getClickPower(this.state);
  this.state.influencia += power;
  this.state.totalInfluencia += power;
  this.state.totalClicks++;
  this.notify();
};

GameEngine.prototype.buyGenerator = function(id) {
  const owned = this.state.generators[id] ? this.state.generators[id].owned : 0;
  let amount, cost;

  if (this.buyAmount === -1) {
    amount = getMaxBuyable(id, owned, this.state.influencia);
    if (amount <= 0) return;
    cost = getGeneratorCostBulk(id, owned, amount);
  } else {
    amount = this.buyAmount;
    cost = getGeneratorCostBulk(id, owned, amount);
    if (this.state.influencia < cost) return;
  }

  this.state.influencia -= cost;
  this.state.generators[id].owned += amount;
  this.notify();
};

GameEngine.prototype.purchaseUpgrade = function(id) {
  const upgrade = UPGRADES.find(function(u) { return u.id === id; });
  if (!upgrade || !canPurchaseUpgrade(this.state, upgrade)) return;

  if (upgrade.costResource === 'influencia') {
    this.state.influencia -= upgrade.cost;
  } else {
    this.state.dinero -= upgrade.cost;
  }
  this.state.purchasedUpgrades.push(id);
  this.notify();
};

GameEngine.prototype.tick = function(deltaMs) {
  const deltaSec = deltaMs / 1000;
  const infGain = getProductionPerSecond(this.state) * deltaSec;
  const dineroGain = getDineroPerSecond(this.state) * deltaSec;

  this.state.influencia += infGain;
  this.state.totalInfluencia += infGain;
  this.state.dinero += dineroGain;
  this.state.totalDinero += dineroGain;
  this.state.playTime += deltaSec;
  this.state.currentPhase = getCurrentPhase(this.state.totalInfluencia);

  return this.checkMilestones();
};

GameEngine.prototype.checkMilestones = function() {
  var newlyUnlocked = [];
  for (let i = 0; i < MILESTONES.length; i++) {
    const milestone = MILESTONES[i];
    if (this.state.unlockedMilestones.indexOf(milestone.id) !== -1) continue;

    const req = milestone.requirement;
    let met = false;
    switch (req.type) {
      case 'totalInfluencia':
        met = this.state.totalInfluencia >= req.value;
        break;
      case 'totalDinero':
        met = this.state.totalDinero >= req.value;
        break;
      case 'generatorsOwned':
        met = Object.values(this.state.generators).reduce(function(sum, g) { return sum + g.owned; }, 0) >= req.value;
        break;
      case 'upgradeCount':
        met = this.state.purchasedUpgrades.length >= req.value;
        break;
    }
    if (met) {
      this.state.unlockedMilestones.push(milestone.id);
      newlyUnlocked.push(milestone);
      if (this.onMilestone) this.onMilestone(milestone);
    }
  }
  return newlyUnlocked;
};

GameEngine.prototype.save = function() {
  saveGame(this.state);
};

GameEngine.prototype.load = function() {
  const loaded = loadGame();
  if (!loaded) return false;
  this.state = loaded;
  this.state.lastTick = Date.now();
  this.state.currentPhase = getCurrentPhase(this.state.totalInfluencia);
  const offlineDelta = getOfflineDelta(loaded.lastTick);
  if (offlineDelta > 5000) {
    this.tick(offlineDelta);
  }
  this.notify();
  return true;
};

GameEngine.prototype.reset = function() {
  this.state = createInitialState();
  deleteSave();
  this.notify();
};

GameEngine.prototype.getProductionPerSecond = function() {
  return getProductionPerSecond(this.state);
};

GameEngine.prototype.getDineroPerSecond = function() {
  return getDineroPerSecond(this.state);
};

GameEngine.prototype.getClickPower = function() {
  return getClickPower(this.state);
};
