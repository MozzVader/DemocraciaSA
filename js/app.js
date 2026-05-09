// ============================================
// DEMOCRACIA S.A. — UI & Application
// ============================================

(function() {
  'use strict';

  var engine = new GameEngine();
  var TICK_INTERVAL = 100;
  var SAVE_INTERVAL = 30000;
  var NEWS_INTERVAL = 12000;
  var headlineText = '';
  var floats = [];

  // ---- DOM Cache ----
  var dom = {};

  function cacheDom() {
    // Header
    dom.influenciaDisplay = document.getElementById('influencia-display');
    dom.influenciaPerSec = document.getElementById('influencia-per-sec');
    dom.dineroDisplay = document.getElementById('dinero-display');
    dom.phaseLabel = document.getElementById('phase-label');

    // Mobile clicker
    dom.totalInfluencia = document.getElementById('total-influencia');
    dom.prodPerSec = document.getElementById('prod-per-sec');
    dom.clickPower = document.getElementById('click-power');
    dom.totalClicks = document.getElementById('total-clicks');
    dom.clickerBtn = document.getElementById('clicker-btn');
    dom.clickerArea = document.getElementById('clicker-area');
    dom.floatsContainer = document.getElementById('floats-container');

    // Desktop clicker
    dom.totalInfluenciaD = document.getElementById('total-influencia-desktop');
    dom.prodPerSecD = document.getElementById('prod-per-sec-desktop');
    dom.clickPowerD = document.getElementById('click-power-desktop');
    dom.totalClicksD = document.getElementById('total-clicks-desktop');
    dom.clickerBtnD = document.getElementById('clicker-btn-desktop');
    dom.clickerAreaD = document.getElementById('clicker-area-desktop');

    // Lists
    dom.generatorList = document.getElementById('generator-list');
    dom.upgradeList = document.getElementById('upgrade-list');
    dom.milestoneList = document.getElementById('milestone-list');
    dom.generatorListD = document.getElementById('generator-list-desktop');
    dom.upgradeListD = document.getElementById('upgrade-list-desktop');
    dom.milestoneListD = document.getElementById('milestone-list-desktop');

    // Stats (desktop)
    dom.statsDinero = document.getElementById('stats-dinero');
    dom.statsDineroPerSec = document.getElementById('stats-dinero-per-sec');
    dom.statsProduction = document.getElementById('stats-production');
    dom.qualityValue = document.getElementById('quality-value');
    dom.qualityBar = document.getElementById('quality-bar');
    dom.qualityQuote = document.getElementById('quality-quote');
    dom.statsPhase = document.getElementById('stats-phase');
    dom.milestonesCount = document.getElementById('milestones-count');
    dom.nextMilestoneName = document.getElementById('next-milestone-name');
    dom.nextMilestoneBar = document.getElementById('next-milestone-bar');
    dom.nextMilestoneContainer = document.getElementById('next-milestone-container');
    dom.playTime = document.getElementById('play-time');

    // Badges
    dom.upgradeBadge = document.getElementById('upgrade-badge');
    dom.upgradeBadgeD = document.getElementById('upgrade-badge-desktop');

    // News
    dom.headlineText = document.getElementById('headline-text');

    // Buy amount (all buttons)
    dom.buyAmountBtns = document.querySelectorAll('.buy-amount-btn');

    // Footer
    dom.footerSave = document.getElementById('footer-save');
    dom.footerGuide = document.getElementById('footer-guide');
    dom.footerReset = document.getElementById('footer-reset');

    // Mobile tabs
    dom.tabGeneradores = document.getElementById('tab-generadores');
    dom.tabOperaciones = document.getElementById('tab-operaciones');
    dom.tabLogros = document.getElementById('tab-logros');
    dom.panelGeneradores = document.getElementById('panel-generadores');
    dom.panelOperaciones = document.getElementById('panel-operaciones');
    dom.panelLogros = document.getElementById('panel-logros');

    // Toasts
    dom.toastContainer = document.getElementById('toast-container');

    // Footer year
    document.getElementById('footer-year').textContent = new Date().getFullYear();
  }

  // ---- Helper: set text on one or two elements ----
  function setText(el1, el2, text) {
    if (el1) el1.textContent = text;
    if (el2) el2.textContent = text;
  }

  // ---- Render Functions ----

  function renderHeader() {
    var s = engine.state;
    var pps = engine.getProductionPerSecond();
    dom.influenciaDisplay.textContent = formatNumber(s.influencia);
    dom.influenciaPerSec.textContent = '+' + formatPerSecond(pps) + '/s';
    dom.dineroDisplay.textContent = formatNumber(s.dinero);
    var pe = PHASE_EMOJIS[s.currentPhase] || '';
    var pt = PHASE_LABELS[s.currentPhase] || '';
    dom.phaseLabel.textContent = pe + ' ' + pt;
  }

  function renderClicker() {
    var s = engine.state;
    var pps = engine.getProductionPerSecond();
    var cp = engine.getClickPower();
    setText(dom.totalInfluencia, dom.totalInfluenciaD, formatNumber(s.influencia));
    setText(dom.prodPerSec, dom.prodPerSecD, formatPerSecond(pps) + '/s');
    setText(dom.clickPower, dom.clickPowerD, formatPerSecond(cp) + '/click');
    setText(dom.totalClicks, dom.totalClicksD, s.totalClicks.toLocaleString());
  }

  function buildGeneratorHTML() {
    var s = engine.state;
    var html = '';
    for (var i = 0; i < GENERATORS.length; i++) {
      var gen = GENERATORS[i];
      if (!isGeneratorUnlocked(gen.id, s.currentPhase)) continue;
      var owned = s.generators[gen.id] ? s.generators[gen.id].owned : 0;
      var displayAmount, displayCost;

      if (engine.buyAmount === -1) {
        displayAmount = getMaxBuyable(gen.id, owned, s.influencia);
        displayCost = displayAmount > 0
          ? getGeneratorCostBulk(gen.id, owned, displayAmount)
          : getGeneratorCost(gen.id, owned);
      } else {
        displayAmount = engine.buyAmount;
        displayCost = getGeneratorCostBulk(gen.id, owned, engine.buyAmount);
      }

      var canAfford = s.influencia >= displayCost;
      html += '<div class="gen-card' + (canAfford ? ' affordable' : '') + '" data-gen-id="' + gen.id + '">';
      html += '<span class="gen-emoji">' + gen.emoji + '</span>';
      html += '<div class="gen-info">';
      html += '<div class="gen-header"><span class="gen-name">' + gen.name + '</span><span class="gen-owned">' + owned + '</span></div>';
      html += '<div class="gen-quote">' + gen.quote + '</div>';
      html += '<div class="gen-footer"><span class="gen-cost">Costo: ' + formatNumber(displayCost);
      if (engine.buyAmount !== 1) html += ' <span class="gen-amount">(' + (displayAmount === 0 ? '-' : displayAmount) + ')</span>';
      html += '</span><span class="gen-production">+' + formatNumber(gen.baseProduction) + '/s c/u</span></div>';
      html += '</div></div>';
    }
    return html;
  }

  function renderGenerators() {
    var html = buildGeneratorHTML();
    dom.generatorList.innerHTML = html;
    if (dom.generatorListD) dom.generatorListD.innerHTML = html;
    bindGeneratorClicks(dom.generatorList);
    if (dom.generatorListD) bindGeneratorClicks(dom.generatorListD);
  }

  function bindGeneratorClicks(container) {
    var cards = container.querySelectorAll('.gen-card');
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', function() {
        engine.buyGenerator(this.dataset.genId);
      });
    }
  }

  function buildUpgradesHTML() {
    var s = engine.state;
    var available = [];
    for (var i = 0; i < UPGRADES.length; i++) {
      if (canPurchaseUpgrade(s, UPGRADES[i])) available.push(UPGRADES[i]);
    }

    if (available.length === 0) {
      return '<div class="empty-message">"Ninguna operaci\u00F3n disponible todav\u00EDa, seguí construyendo influencia..."</div>';
    }

    var html = '';
    for (var i = 0; i < available.length; i++) {
      var u = available[i];
      var costDisplay = u.costResource === 'influencia' ? formatNumber(u.cost) : formatDinero(u.cost);
      var hasResource = u.costResource === 'influencia' ? s.influencia >= u.cost : s.dinero >= u.cost;
      html += '<div class="upgrade-card' + (hasResource ? ' affordable' : '') + '" data-upgrade-id="' + u.id + '">';
      html += '<span class="upgrade-emoji">' + u.emoji + '</span>';
      html += '<div class="upgrade-info">';
      html += '<div class="upgrade-name">' + u.name + '</div>';
      html += '<div class="upgrade-desc">' + u.description + '</div>';
      html += '<div class="upgrade-cost">Costo: ' + costDisplay;
      if (u.costResource === 'dinero') html += ' (dinero)';
      html += '</div></div></div>';
    }
    return html;
  }

  function renderUpgrades() {
    var html = buildUpgradesHTML();
    dom.upgradeList.innerHTML = html;
    if (dom.upgradeListD) dom.upgradeListD.innerHTML = html;
    bindUpgradeClicks(dom.upgradeList);
    if (dom.upgradeListD) bindUpgradeClicks(dom.upgradeListD);

    // Update badges
    var count = engine.state.purchasedUpgrades.length;
    var total = UPGRADES.length;
    if (dom.upgradeBadge) dom.upgradeBadge.textContent = count + '/' + total;
    if (dom.upgradeBadgeD) dom.upgradeBadgeD.textContent = count + '/' + total;
  }

  function bindUpgradeClicks(container) {
    var cards = container.querySelectorAll('.upgrade-card');
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', function() {
        engine.purchaseUpgrade(this.dataset.upgradeId);
      });
    }
  }

  function buildMilestonesHTML() {
    var s = engine.state;
    var html = '';
    for (var i = 0; i < MILESTONES.length; i++) {
      var m = MILESTONES[i];
      var isUnlocked = s.unlockedMilestones.indexOf(m.id) !== -1;
      html += '<div class="milestone-card' + (isUnlocked ? ' unlocked' : '') + '">';
      html += '<span class="milestone-emoji">' + (isUnlocked ? m.emoji : '\u{1F512}') + '</span>';
      html += '<div class="milestone-info"><div class="milestone-name">' + m.name + '</div>';
      html += '<div class="milestone-desc">' + (isUnlocked ? m.description : '???') + '</div></div>';
      if (isUnlocked) html += '<span class="milestone-check">\u2713</span>';
      html += '</div>';
    }
    return html;
  }

  function renderMilestones() {
    var html = buildMilestonesHTML();
    dom.milestoneList.innerHTML = html;
    if (dom.milestoneListD) dom.milestoneListD.innerHTML = html;
  }

  function renderStats() {
    var s = engine.state;
    var quality = getDemocraticQuality(s.totalInfluencia);
    var quote = getDemocracyQuote(quality);
    var dps = engine.getDineroPerSecond();
    var pps = engine.getProductionPerSecond();

    dom.statsDinero.textContent = '$' + formatNumber(s.dinero);
    dom.statsDineroPerSec.textContent = '+$' + formatNumber(dps) + '/s';
    dom.statsProduction.textContent = formatNumber(pps) + '/s';

    dom.qualityValue.textContent = quality + '%';
    dom.qualityValue.style.color = quality > 60 ? '#22c55e' : quality > 30 ? '#f59e0b' : '#ef4444';
    dom.qualityBar.style.width = quality + '%';
    dom.qualityBar.style.backgroundColor = quality > 60 ? '#22c55e' : quality > 30 ? '#f59e0b' : '#ef4444';
    dom.qualityQuote.textContent = quote;

    var pe = PHASE_EMOJIS[s.currentPhase] || '';
    var pt = PHASE_LABELS[s.currentPhase] || '';
    dom.statsPhase.textContent = pe + ' ' + pt;

    var unlockedCount = s.unlockedMilestones.length;
    var totalMilestones = MILESTONES.length;
    dom.milestonesCount.textContent = unlockedCount + '/' + totalMilestones;

    var nextMilestone = null;
    var nextProgress = 0;
    for (var i = 0; i < MILESTONES.length; i++) {
      if (s.unlockedMilestones.indexOf(MILESTONES[i].id) === -1) {
        nextMilestone = MILESTONES[i];
        break;
      }
    }

    if (unlockedCount === totalMilestones) {
      dom.nextMilestoneContainer.innerHTML = '<div class="milestone-all-done">\u{1F3C6} Todos desbloqueados</div>';
    } else if (nextMilestone) {
      var req = nextMilestone.requirement;
      if (req.type === 'totalInfluencia') nextProgress = Math.min(100, (s.totalInfluencia / req.value) * 100);
      else if (req.type === 'totalDinero') nextProgress = Math.min(100, (s.totalDinero / req.value) * 100);
      dom.nextMilestoneName.textContent = nextMilestone.emoji + ' ' + nextMilestone.name;
      dom.nextMilestoneBar.style.width = nextProgress + '%';
    }

    dom.playTime.textContent = 'Tiempo de juego: ' + formatTime(s.playTime);
  }

  function renderAll() {
    renderHeader();
    renderClicker();
    renderGenerators();
    renderUpgrades();
    renderStats();
    renderMilestones();
  }

  // ---- Float Numbers ----

  function addFloat(container, x, value) {
    var el = document.createElement('div');
    el.className = 'float-number';
    el.textContent = '+' + formatNumber(value);
    el.style.left = x + '%';
    container.appendChild(el);
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
  }

  // ---- News Ticker ----

  function updateNews() {
    var newHeadline = getRandomHeadline(engine.state.currentPhase, headlineText);
    headlineText = newHeadline;
    dom.headlineText.style.opacity = '0';
    dom.headlineText.style.transform = 'translateY(10px)';
    setTimeout(function() {
      dom.headlineText.textContent = newHeadline;
      dom.headlineText.style.opacity = '1';
      dom.headlineText.style.transform = 'translateY(0)';
    }, 300);
  }

  // ---- Toast System ----

  function showToast(milestone) {
    var toast = document.createElement('div');
    toast.className = 'toast';
    var rewardText = '';
    switch (milestone.reward.type) {
      case 'clickMultiplier': rewardText = '+' + milestone.reward.value + ' influencia por clic'; break;
      case 'productionMultiplier': rewardText = 'x' + milestone.reward.value + ' producci\u00F3n total'; break;
      case 'unlockedPhase': rewardText = 'Nueva fase desbloqueada'; break;
    }
    toast.innerHTML =
      '<div class="toast-accent"></div>' +
      '<div class="toast-icon">' + milestone.emoji + '</div>' +
      '<div class="toast-content">' +
        '<div class="toast-label">Logro Desbloqueado</div>' +
        '<div class="toast-title">' + milestone.name + '</div>' +
        '<div class="toast-desc">' + milestone.description + '</div>' +
        '<div class="toast-reward">' + rewardText + '</div>' +
      '</div>' +
      '<div class="toast-progress"></div>';
    dom.toastContainer.appendChild(toast);
    setTimeout(function() {
      toast.classList.add('toast-exit');
      setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 500);
    }, 5000);
  }

  // ---- Buy Amount ----

  function updateBuyAmountBtns() {
    for (var i = 0; i < dom.buyAmountBtns.length; i++) {
      var btn = dom.buyAmountBtns[i];
      var val = parseInt(btn.dataset.amount);
      btn.classList.toggle('active', val === engine.buyAmount);
    }
  }

  // ---- Mobile Tabs ----

  function switchTab(tabName) {
    var tabs = [dom.tabGeneradores, dom.tabOperaciones, dom.tabLogros];
    var panels = [dom.panelGeneradores, dom.panelOperaciones, dom.panelLogros];
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].dataset.tab === tabName);
      panels[i].style.display = panels[i].id === 'panel-' + tabName ? '' : 'none';
    }
  }

  // ---- Dialogs ----

  function openDialog(id) {
    document.getElementById(id).classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDialog(id) {
    document.getElementById(id).classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---- Event Binding ----

  function bindEvents() {
    // Mobile clicker
    dom.clickerBtn.addEventListener('click', function(e) {
      engine.click();
      var rect = dom.clickerArea.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      addFloat(dom.floatsContainer, x, engine.getClickPower());
    });

    // Desktop clicker
    dom.clickerBtnD.addEventListener('click', function(e) {
      engine.click();
      var rect = dom.clickerAreaD.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      addFloat(dom.clickerAreaD, x, engine.getClickPower());
    });

    // Buy amount
    for (var i = 0; i < dom.buyAmountBtns.length; i++) {
      dom.buyAmountBtns[i].addEventListener('click', function() {
        engine.buyAmount = parseInt(this.dataset.amount);
        updateBuyAmountBtns();
      });
    }

    // Footer
    dom.footerSave.addEventListener('click', function() { engine.save(); });
    dom.footerGuide.addEventListener('click', function() { openDialog('guide-dialog'); });
    dom.footerReset.addEventListener('click', function() { openDialog('reset-dialog'); });

    // Reset dialog
    document.getElementById('reset-cancel').addEventListener('click', function() { closeDialog('reset-dialog'); });
    document.getElementById('reset-confirm').addEventListener('click', function() {
      engine.reset();
      closeDialog('reset-dialog');
    });

    // Guide dialog
    document.getElementById('guide-close').addEventListener('click', function() { closeDialog('guide-dialog'); });

    // Dialog backdrop
    var overlays = document.querySelectorAll('.dialog-overlay');
    for (var i = 0; i < overlays.length; i++) {
      overlays[i].addEventListener('click', function(e) {
        if (e.target === this) closeDialog(this.id);
      });
    }

    // Mobile tabs
    dom.tabGeneradores.addEventListener('click', function() { switchTab('generadores'); });
    dom.tabOperaciones.addEventListener('click', function() { switchTab('operaciones'); });
    dom.tabLogros.addEventListener('click', function() { switchTab('logros'); });

    // State change listener
    engine.subscribe(renderAll);
    engine.onMilestone = showToast;

    // Before unload
    window.addEventListener('beforeunload', function() { engine.save(); });
  }

  // ---- Game Loop ----

  function startGameLoop() {
    setInterval(function() { engine.tick(TICK_INTERVAL); }, TICK_INTERVAL);
    setInterval(function() { engine.save(); }, SAVE_INTERVAL);
    setInterval(updateNews, NEWS_INTERVAL);
  }

  // ---- Init ----

  function init() {
    cacheDom();
    var loaded = engine.load();
    if (!loaded) engine.state = createInitialState();
    updateBuyAmountBtns();
    bindEvents();
    renderAll();
    updateNews();
    startGameLoop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
