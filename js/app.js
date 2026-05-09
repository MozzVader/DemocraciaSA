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
    dom.influenciaDisplay = document.getElementById('influencia-amount');
    dom.influenciaPerSec = document.getElementById('influencia-rate');
    dom.dineroDisplay = document.getElementById('dinero-amount');
    dom.phaseLabel = document.getElementById('current-phase');

    // Auth
    dom.authBtn = document.getElementById('auth-btn');
    dom.authLabel = document.getElementById('auth-label');
    dom.loginModal = document.getElementById('login-modal');
    dom.authTabLogin = document.getElementById('auth-tab-login');
    dom.authTabRegister = document.getElementById('auth-tab-register');
    dom.authFormLogin = document.getElementById('auth-form-login');
    dom.authFormRegister = document.getElementById('auth-form-register');
    dom.loginEmail = document.getElementById('login-email');
    dom.loginPassword = document.getElementById('login-password');
    dom.loginError = document.getElementById('login-error');
    dom.loginSubmit = document.getElementById('login-submit');
    dom.registerEmail = document.getElementById('register-email');
    dom.registerPassword = document.getElementById('register-password');
    dom.registerError = document.getElementById('register-error');
    dom.registerSubmit = document.getElementById('register-submit');
    dom.googleLoginBtn = document.getElementById('google-login-btn');

    // Mobile clicker
    dom.totalInfluencia = document.getElementById('clicker-influencia');
    dom.prodPerSec = document.getElementById('clicker-rate');
    dom.clickPower = document.getElementById('clicker-strength');
    dom.totalClicks = document.getElementById('click-counter');
    dom.clickerBtn = document.getElementById('influence-button');
    dom.clickerArea = document.getElementById('button-zone');
    dom.floatsContainer = document.getElementById('floating-numbers');

    // Desktop clicker
    dom.totalInfluenciaD = document.getElementById('clicker-influencia-desktop');
    dom.prodPerSecD = document.getElementById('clicker-rate-desktop');
    dom.clickPowerD = document.getElementById('clicker-strength-desktop');
    dom.totalClicksD = document.getElementById('click-counter-desktop');
    dom.clickerBtnD = document.getElementById('influence-button-desktop');
    dom.clickerAreaD = document.getElementById('button-zone-desktop');

    // Lists
    dom.generatorList = document.getElementById('generators-list');
    dom.upgradeList = document.getElementById('operations-list');
    dom.milestoneList = document.getElementById('achievements-list');
    dom.generatorListD = document.getElementById('generators-list-desktop');
    dom.upgradeListD = document.getElementById('operations-list-desktop');
    dom.milestoneListD = document.getElementById('achievements-list-desktop');

    // Stats (desktop)
    dom.statsDinero = document.getElementById('stat-dinero');
    dom.statsDineroPerSec = document.getElementById('stat-dinero-rate');
    dom.statsProduction = document.getElementById('stat-production-rate');
    dom.qualityValue = document.getElementById('quality-number');
    dom.qualityBar = document.getElementById('quality-meter');
    dom.qualityQuote = document.getElementById('quality-commentary');
    dom.statsPhase = document.getElementById('stat-current-phase');
    dom.milestonesCount = document.getElementById('achievements-progress');
    dom.nextMilestoneName = document.getElementById('next-achievement-name');
    dom.nextMilestoneBar = document.getElementById('next-achievement-bar');
    dom.nextMilestoneContainer = document.getElementById('next-achievement-container');
    dom.playTime = document.getElementById('session-timer');

    // Badges
    dom.upgradeBadge = document.getElementById('operations-counter');
    dom.upgradeBadgeD = document.getElementById('operations-counter-desktop');

    // News
    dom.headlineText = document.getElementById('ticker-headline');

    // Buy amount (all buttons)
    dom.buyAmountBtns = document.querySelectorAll('.quantity-option');

    // Footer
    dom.footerSave = document.getElementById('button-save');
    dom.footerGuide = document.getElementById('button-guide');
    dom.footerReset = document.getElementById('button-reset');

    // Mobile tabs
    dom.tabGeneradores = document.getElementById('tab-generators');
    dom.tabOperaciones = document.getElementById('tab-operations');
    dom.tabLogros = document.getElementById('tab-achievements');
    dom.panelGeneradores = document.getElementById('panel-generators');
    dom.panelOperaciones = document.getElementById('panel-operations');
    dom.panelLogros = document.getElementById('panel-achievements');

    // Toasts
    dom.toastContainer = document.getElementById('notification-area');

    // Footer year
    document.getElementById('current-year').textContent = new Date().getFullYear();
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
      html += '<div class="generator-card' + (canAfford ? ' can-afford' : '') + '" data-gen-id="' + gen.id + '">';
      html += '<span class="card-icon">' + gen.emoji + '</span>';
      html += '<div class="card-details">';
      html += '<div class="card-top"><span class="card-name">' + gen.name + '</span><span class="card-count">' + owned + '</span></div>';
      html += '<div class="card-quote">' + gen.quote + '</div>';
      html += '<div class="card-bottom"><span class="card-price">Costo: ' + formatNumber(displayCost);
      if (engine.buyAmount !== 1) html += ' <span class="card-quantity">(' + (displayAmount === 0 ? '-' : displayAmount) + ')</span>';
      html += '</span><span class="card-output">+' + formatNumber(gen.baseProduction) + '/s c/u</span></div>';
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
    var cards = container.querySelectorAll('.generator-card');
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
      return '<div class="empty-notice">"Ninguna operaci\u00F3n disponible todav\u00EDa, seguí construyendo influencia..."</div>';
    }

    var html = '';
    for (var i = 0; i < available.length; i++) {
      var u = available[i];
      var costDisplay = u.costResource === 'influencia' ? formatNumber(u.cost) : formatDinero(u.cost);
      var hasResource = u.costResource === 'influencia' ? s.influencia >= u.cost : s.dinero >= u.cost;
      html += '<div class="operation-card' + (hasResource ? ' can-afford' : '') + '" data-upgrade-id="' + u.id + '">';
      html += '<span class="card-icon">' + u.emoji + '</span>';
      html += '<div class="card-details">';
      html += '<div class="card-name">' + u.name + '</div>';
      html += '<div class="card-description">' + u.description + '</div>';
      html += '<div class="card-price">Costo: ' + costDisplay;
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
    var cards = container.querySelectorAll('.operation-card');
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
      html += '<div class="achievement-card' + (isUnlocked ? ' unlocked' : '') + '">';
      html += '<span class="achievement-icon">' + (isUnlocked ? m.emoji : '\u{1F512}') + '</span>';
      html += '<div class="achievement-details"><div class="achievement-name">' + m.name + '</div>';
      html += '<div class="achievement-description">' + (isUnlocked ? m.description : '???') + '</div></div>';
      if (isUnlocked) html += '<span class="achievement-checkmark">\u2713</span>';
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
      dom.nextMilestoneContainer.innerHTML = '<div class="all-achievements-unlocked">\u{1F3C6} Todos desbloqueados</div>';
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
    el.className = 'floating-number';
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
    var notificationToast = document.createElement('div');
    notificationToast.className = 'notification-toast';
    var rewardText = '';
    switch (milestone.reward.type) {
      case 'clickMultiplier': rewardText = '+' + milestone.reward.value + ' influencia por clic'; break;
      case 'productionMultiplier': rewardText = 'x' + milestone.reward.value + ' producci\u00F3n total'; break;
      case 'unlockedPhase': rewardText = 'Nueva fase desbloqueada'; break;
    }
    notificationToast.innerHTML =
      '<div class="notification-accent"></div>' +
      '<div class="notification-icon">' + milestone.emoji + '</div>' +
      '<div class="notification-body">' +
        '<div class="notification-type">Logro Desbloqueado</div>' +
        '<div class="notification-heading">' + milestone.name + '</div>' +
        '<div class="notification-text">' + milestone.description + '</div>' +
        '<div class="notification-reward">' + rewardText + '</div>' +
      '</div>' +
      '<div class="notification-timer"></div>';
    dom.toastContainer.appendChild(notificationToast);
    setTimeout(function() {
      notificationToast.classList.add('notification-exit');
      setTimeout(function() { if (notificationToast.parentNode) notificationToast.parentNode.removeChild(notificationToast); }, 500);
    }, 5000);
  }

  // ---- Auth UI ----

  function updateAuthButton() {
    if (SupabaseAuth.isLoggedIn()) {
      var name = SupabaseAuth.getUserDisplayName();
      var email = SupabaseAuth.getUserEmail();
      var short = name.split(' ')[0];
      if (short.length > 10) short = email.split('@')[0];
      dom.authLabel.textContent = short;
      dom.authBtn.classList.add('auth-logged-in');
      dom.authBtn.title = name + ' (' + email + ') — Click para cerrar sesion';
    } else {
      dom.authLabel.textContent = 'Entrar';
      dom.authBtn.classList.remove('auth-logged-in');
      dom.authBtn.title = 'Iniciar sesion';
    }
  }

  function switchAuthTab(tab) {
    dom.authTabLogin.classList.toggle('active', tab === 'login');
    dom.authTabRegister.classList.toggle('active', tab === 'register');
    dom.authFormLogin.style.display = tab === 'login' ? '' : 'none';
    dom.authFormRegister.style.display = tab === 'register' ? '' : 'none';
    dom.loginError.textContent = '';
    dom.registerError.textContent = '';
  }

  function handleAuthBtnClick() {
    if (SupabaseAuth.isLoggedIn()) {
      // Logout
      SupabaseAuth.signOut().then(function() {
        updateAuthButton();
      });
    } else {
      // Open login dialog
      openDialog('login-modal');
    }
  }

  function handleLogin() {
    var email = dom.loginEmail.value.trim();
    var password = dom.loginPassword.value;
    if (!email || !password) {
      dom.loginError.textContent = 'Completá email y contrasena.';
      return;
    }
    dom.loginSubmit.disabled = true;
    dom.loginSubmit.textContent = 'Ingresando...';
    dom.loginError.textContent = '';
    SupabaseAuth.signInWithEmail(email, password).then(function(result) {
      dom.loginSubmit.disabled = false;
      dom.loginSubmit.textContent = 'Ingresar';
      if (result.error) {
        var msg = result.error.message;
        if (msg.indexOf('Invalid login') !== -1 || msg.indexOf('Invalid credentials') !== -1) {
          msg = 'Email o contrasena incorrectos.';
        } else if (msg.indexOf('Email not confirmed') !== -1) {
          msg = 'Verificá tu email antes de iniciar sesion.';
        }
        dom.loginError.textContent = msg;
      } else {
        closeDialog('login-modal');
        dom.loginEmail.value = '';
        dom.loginPassword.value = '';
        loadCloudSave();
      }
    }).catch(function() {
      dom.loginSubmit.disabled = false;
      dom.loginSubmit.textContent = 'Ingresar';
      dom.loginError.textContent = 'Error de conexion. Intentá de nuevo.';
    });
  }

  function handleRegister() {
    var email = dom.registerEmail.value.trim();
    var password = dom.registerPassword.value;
    if (!email || !password) {
      dom.registerError.textContent = 'Completá email y contrasena.';
      return;
    }
    if (password.length < 6) {
      dom.registerError.textContent = 'La contrasena debe tener al menos 6 caracteres.';
      return;
    }
    dom.registerSubmit.disabled = true;
    dom.registerSubmit.textContent = 'Creando...';
    dom.registerError.textContent = '';
    SupabaseAuth.signUpWithEmail(email, password).then(function(result) {
      dom.registerSubmit.disabled = false;
      dom.registerSubmit.textContent = 'Crear Cuenta';
      if (result.error) {
        var msg = result.error.message;
        if (msg.indexOf('already registered') !== -1 || msg.indexOf('already in use') !== -1) {
          msg = 'Ese email ya está registrado.';
        }
        dom.registerError.textContent = msg;
      } else {
        dom.registerError.textContent = '';
        dom.registerEmail.value = '';
        dom.registerPassword.value = '';
        switchAuthTab('login');
        dom.loginEmail.value = email;
        dom.loginError.textContent = '';
        dom.loginError.style.color = '#4ade80';
        dom.loginError.textContent = 'Cuenta creada. Verificá tu email e iniciá sesion.';
        setTimeout(function() { dom.loginError.style.color = ''; }, 4000);
      }
    }).catch(function() {
      dom.registerSubmit.disabled = false;
      dom.registerSubmit.textContent = 'Crear Cuenta';
      dom.registerError.textContent = 'Error de conexion. Intentá de nuevo.';
    });
  }

  function handleGoogleLogin() {
    SupabaseAuth.signInWithGoogle();
  }

  function loadCloudSave() {
    if (!SupabaseAuth.isLoggedIn()) return;
    SupabaseAuth.cloudLoad().then(function(cloudState) {
      if (!cloudState) return;
      // Merge: use cloud data if it has more totalInfluencia
      if (cloudState.totalInfluencia > engine.state.totalInfluencia) {
        engine.state = cloudState;
        engine.state.lastTick = Date.now();
        engine.state.currentPhase = getCurrentPhase(engine.state.totalInfluencia);
        // Ensure all generators exist
        for (var i = 0; i < GENERATORS.length; i++) {
          if (!engine.state.generators[GENERATORS[i].id]) {
            engine.state.generators[GENERATORS[i].id] = { id: GENERATORS[i].id, owned: 0, totalProduced: 0 };
          }
        }
        saveGame(engine.state);
        engine.notify();
      }
    });
  }

  function saveToCloud() {
    if (!SupabaseAuth.isLoggedIn()) return;
    SupabaseAuth.cloudSave(engine.state);
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
    // Auth
    dom.authBtn.addEventListener('click', handleAuthBtnClick);
    dom.authTabLogin.addEventListener('click', function() { switchAuthTab('login'); });
    dom.authTabRegister.addEventListener('click', function() { switchAuthTab('register'); });
    dom.loginSubmit.addEventListener('click', handleLogin);
    dom.registerSubmit.addEventListener('click', handleRegister);
    dom.googleLoginBtn.addEventListener('click', handleGoogleLogin);
    // Enter key on forms
    dom.loginPassword.addEventListener('keydown', function(e) { if (e.key === 'Enter') handleLogin(); });
    dom.registerPassword.addEventListener('keydown', function(e) { if (e.key === 'Enter') handleRegister(); });

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
    dom.footerSave.addEventListener('click', function() {
      engine.save();
      saveToCloud();
    });
    dom.footerGuide.addEventListener('click', function() { openDialog('help-modal'); });
    dom.footerReset.addEventListener('click', function() { openDialog('confirm-modal'); });

    // Reset dialog
    document.getElementById('confirm-cancel').addEventListener('click', function() { closeDialog('confirm-modal'); });
    document.getElementById('confirm-accept').addEventListener('click', function() {
      engine.reset();
      saveToCloud();
      closeDialog('confirm-modal');
    });

    // Guide dialog
    document.getElementById('help-close').addEventListener('click', function() { closeDialog('help-modal'); });

    // Dialog backdrop
    var overlays = document.querySelectorAll('.modal-backdrop');
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
    window.addEventListener('beforeunload', function() {
      engine.save();
      saveToCloud();
    });
  }

  // ---- Game Loop ----

  function startGameLoop() {
    setInterval(function() { engine.tick(TICK_INTERVAL); }, TICK_INTERVAL);
    setInterval(function() {
      engine.save();
      saveToCloud();
    }, SAVE_INTERVAL);
    setInterval(updateNews, NEWS_INTERVAL);
  }

  // ---- Init ----

  function init() {
    cacheDom();

    // Init Supabase Auth
    if (typeof SupabaseAuth !== 'undefined') {
      SupabaseAuth.init();
      SupabaseAuth.setOnAuthChange(function(user) {
        updateAuthButton();
        if (user) {
          // Logged in: try loading cloud save
          loadCloudSave();
        }
      });
    }

    // Load game from localStorage
    var loaded = engine.load();
    if (!loaded) engine.state = createInitialState();

    updateBuyAmountBtns();
    updateAuthButton();
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
