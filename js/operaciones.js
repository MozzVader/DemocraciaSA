// ============================================
// DEMOCRACIA S.A. V1 — Módulo de Operaciones
// Tienda dinámica, compra, PpS multiplier
// + Operaciones Click (boost al valor del click)
// ============================================

var Operaciones = (() => {

  // ── Config ────────────────────────────────────────────────────
  var ICON_PATH = 'assets/operaciones/';
  var ICON_FALLBACK = '\u{1F4CB}';  // 📋

  // ── Estado privado ────────────────────────────────────────────
  var compradas = {};   // { id: timestamp }

  // ── DOM refs ──────────────────────────────────────────────────
  var $list = null;
  var $counter = null;
  var $tooltip = null;

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    $list = document.getElementById('upgrade-list');
    $counter = document.getElementById('upgrade-counter');

    // Crear tooltip único (reutilizable)
    $tooltip = document.createElement('div');
    $tooltip.className = 'logro-tooltip';
    $tooltip.style.display = 'none';
    document.body.appendChild($tooltip);

    // Render inicial
    render();

    // Setup tooltip hover
    setupTooltip();
  }

  // ── HTML del icono (img con fallback emoji) ─────────────────
  function opIconHTML(icono) {
    return '<img src="' + ICON_PATH + icono + '.png" alt="" onerror="this.outerHTML=\'' + ICON_FALLBACK + '\'">';
  }

  // ── Obtener generador por ID ─────────────────────────────────
  function getGenById(id) {
    var gens = Game.getGeneradores();
    for (var i = 0; i < gens.length; i++) {
      if (gens[i].id === id) return gens[i];
    }
    return null;
  }

  // ── Verificar si una operación de generador está desbloqueada ──
  function isUnlocked(op) {
    var gen = getGenById(op.genId);
    if (!gen) return false;
    return gen.cantidad >= op.trigger;
  }

  // ── Verificar si una operación click está desbloqueada ────────
  function isClickUnlocked(clickOp) {
    return Game.getPesosPorClicTotales() >= clickOp.trigger;
  }

  // ── Renderizar lista completa de operaciones disponibles ─────
  function render() {
    if (!$list) return;

    $list.innerHTML = '';

    // Operaciones de generador
    for (var i = 0; i < OPERACIONES_DATA.length; i++) {
      var op = OPERACIONES_DATA[i];
      if (compradas[op.id]) continue;
      if (!isUnlocked(op)) continue;
      $list.appendChild(crearCard(op));
    }

    // Operaciones click (mezcladas en la misma lista)
    if (typeof OPERACIONES_CLICK_DATA !== 'undefined') {
      for (var i = 0; i < OPERACIONES_CLICK_DATA.length; i++) {
        var cop = OPERACIONES_CLICK_DATA[i];
        if (compradas[cop.id]) continue;
        if (!isClickUnlocked(cop)) continue;
        $list.appendChild(crearCard(cop));
      }
    }

    actualizarCounter();
  }

  // ── Crear card de operación ──────────────────────────────────
  function crearCard(op) {
    var card = document.createElement('div');
    card.className = 'upgrade-card';
    card.dataset.opId = op.id;

    // Verificar si puede comprar
    var puede = Game.getPesos() >= op.precio;
    if (puede) {
      card.classList.add('available');
    }

    card.innerHTML =
      '<div class="upgrade-icon">' + opIconHTML(op.icono) + '</div>' +
      '<div class="upgrade-info">' +
        '<div class="upgrade-top">' +
          '<span class="upgrade-name">' + op.nombre + '</span>' +
          '<span class="upgrade-cost">$ ' + Formato.numero(op.precio) + '</span>' +
        '</div>' +
        '<p class="upgrade-desc">' + op.bonusText + '</p>' +
      '</div>';

    // Click para comprar
    card.addEventListener('click', function () {
      comprar(op.id);
    });

    return card;
  }

  // ── Actualizar UI (estados muted/available) sin re-render completo ──
  function actualizarUI() {
    if (!$list) return;

    // Contar operaciones actualmente visibles
    var visibleCount = $list.querySelectorAll('.upgrade-card').length;

    // Verificar cuántas deberían ser visibles
    var expectedCount = 0;

    for (var i = 0; i < OPERACIONES_DATA.length; i++) {
      var op = OPERACIONES_DATA[i];
      if (compradas[op.id]) continue;
      if (isUnlocked(op)) expectedCount++;
    }

    if (typeof OPERACIONES_CLICK_DATA !== 'undefined') {
      for (var i = 0; i < OPERACIONES_CLICK_DATA.length; i++) {
        var cop = OPERACIONES_CLICK_DATA[i];
        if (compradas[cop.id]) continue;
        if (isClickUnlocked(cop)) expectedCount++;
      }
    }

    // Si hay diferencia (se desbloquearon nuevas operaciones), re-render completo
    if (expectedCount !== visibleCount) {
      render();
      return;
    }

    // Solo actualizar estados muted/available
    var cards = $list.querySelectorAll('.upgrade-card');
    var pesos = Game.getPesos();

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var opId = parseInt(card.dataset.opId, 10);
      var op = getOpById(opId);
      if (!op) continue;

      if (pesos >= op.precio) {
        card.classList.add('available');
      } else {
        card.classList.remove('available');
      }
    }

    actualizarCounter();
  }

  // ── Actualizar contador del panel head ───────────────────────
  function actualizarCounter() {
    if (!$counter) return;

    var compradasCount = Object.keys(compradas).length;

    // Calcular total desbloqueados (gen ops + click ops)
    var totalUnlocked = 0;
    for (var i = 0; i < OPERACIONES_DATA.length; i++) {
      if (isUnlocked(OPERACIONES_DATA[i])) totalUnlocked++;
    }
    if (typeof OPERACIONES_CLICK_DATA !== 'undefined') {
      for (var i = 0; i < OPERACIONES_CLICK_DATA.length; i++) {
        if (isClickUnlocked(OPERACIONES_CLICK_DATA[i])) totalUnlocked++;
      }
    }

    $counter.textContent = compradasCount + '/' + totalUnlocked;
  }

  // ── Comprar operación ────────────────────────────────────────
  function comprar(id) {
    if (compradas[id]) return;

    var op = getOpById(id);
    if (!op) return;

    var pesos = Game.getPesos();
    if (pesos < op.precio) return;

    // Gastar pesos
    Game.gastar(op.precio);

    // Registrar compra
    compradas[id] = Date.now();

    // Ocultar tooltip (la card va a desaparecer sin disparar mouseout)
    hideTooltip();

    // Re-render (la card desaparece)
    render();

    // Actualizar UI general
    UI.actualizar();
  }

  // ── Obtener operación por ID (busca en ambas listas) ──────────
  function getOpById(id) {
    for (var i = 0; i < OPERACIONES_DATA.length; i++) {
      if (OPERACIONES_DATA[i].id === id) return OPERACIONES_DATA[i];
    }
    if (typeof OPERACIONES_CLICK_DATA !== 'undefined') {
      for (var i = 0; i < OPERACIONES_CLICK_DATA.length; i++) {
        if (OPERACIONES_CLICK_DATA[i].id === id) return OPERACIONES_CLICK_DATA[i];
      }
    }
    return null;
  }

  // ── Multiplicador de PpS para un generador ───────────────────
  // Cada operación comprada da x2, así que con N ops = 2^N
  function getMultiplier(genId) {
    var count = 0;
    for (var i = 0; i < OPERACIONES_DATA.length; i++) {
      if (OPERACIONES_DATA[i].genId === genId && compradas[OPERACIONES_DATA[i].id]) {
        count++;
      }
    }
    return Math.pow(2, count);
  }

  // ── Bonus de click de operaciones click ─────────────────────
  // Suma de todas las ops click compradas × PpS × 0.01
  function getClickBonus() {
    if (typeof OPERACIONES_CLICK_DATA === 'undefined') return 0;

    var pps = Game.getPPS();
    var count = 0;
    for (var i = 0; i < OPERACIONES_CLICK_DATA.length; i++) {
      if (compradas[OPERACIONES_CLICK_DATA[i].id]) count++;
    }
    return count * pps * 0.01;
  }

  // ── Multiplicador total (para display) ───────────────────────
  function getMultiplicadorTotal() {
    // Comparar PPS base vs PPS con multiplicadores
    var gens = Game.getGeneradores();
    var basePPS = 0;
    var boostedPPS = 0;

    for (var i = 0; i < gens.length; i++) {
      var g = gens[i];
      var base = g.cantidad * g.ppsBase;
      var mult = getMultiplier(g.id);
      basePPS += base;
      boostedPPS += base * mult;
    }

    if (basePPS === 0) return 1;
    return boostedPPS / basePPS;
  }

  // ── Tooltip custom en hover ──────────────────────────────────
  function setupTooltip() {
    if (!$list) return;

    $list.addEventListener('mouseover', function (e) {
      var card = e.target.closest('.upgrade-card');
      if (!card) return;
      showTooltip(card);
    });

    $list.addEventListener('mouseout', function (e) {
      var card = e.target.closest('.upgrade-card');
      if (!card) return;

      var related = e.relatedTarget;
      if (related && card.contains(related)) return;

      hideTooltip();
    });

    // Ocultar al scroll
    var panelBody = $list.closest('.panel-body');
    if (panelBody) {
      panelBody.addEventListener('scroll', hideTooltip);
    }
  }

  function showTooltip(card) {
    if (!$tooltip) return;

    var opId = parseInt(card.dataset.opId, 10);
    var op = getOpById(opId);
    if (!op) return;

    $tooltip.innerHTML =
      '<div class="logro-tooltip-icon">' + opIconHTML(op.icono) + '</div>' +
      '<div class="logro-tooltip-content">' +
        '<div class="logro-tooltip-name">' + op.nombre + '</div>' +
        '<div class="logro-tooltip-desc">' + op.bonusText + ' &middot; $ ' + Formato.numero(op.precio) + '</div>' +
      '</div>';

    var cardRect = card.getBoundingClientRect();
    $tooltip.style.display = 'flex';
    var tooltipRect = $tooltip.getBoundingClientRect();

    var top = cardRect.top - tooltipRect.height - 10;
    var left = cardRect.left + (cardRect.width / 2) - (tooltipRect.width / 2);

    if (top < 10) {
      top = cardRect.bottom + 10;
    }

    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }

    $tooltip.style.top = top + 'px';
    $tooltip.style.left = left + 'px';
  }

  function hideTooltip() {
    if ($tooltip) {
      $tooltip.style.display = 'none';
    }
  }

  // ── Restore desde save ───────────────────────────────────────
  function restore(ids) {
    compradas = {};
    if (ids && Array.isArray(ids)) {
      for (var i = 0; i < ids.length; i++) {
        compradas[ids[i]] = 1;
      }
    }
    render();
  }

  // ── Limpiar (reset del juego) ────────────────────────────────
  function limpiar() {
    compradas = {};
    render();
    hideTooltip();
  }

  // ── Getters ───────────────────────────────────────────────────
  function getCompradas() {
    return Object.keys(compradas).map(function (k) { return parseInt(k, 10); });
  }

  function getCompradasCount() {
    return Object.keys(compradas).length;
  }

  // Contar ops de generador compradas (para stats)
  function getCompradasGenCount() {
    var count = 0;
    for (var i = 0; i < OPERACIONES_DATA.length; i++) {
      if (compradas[OPERACIONES_DATA[i].id]) count++;
    }
    return count;
  }

  // Contar ops click compradas (para stats)
  function getCompradasClickCount() {
    if (typeof OPERACIONES_CLICK_DATA === 'undefined') return 0;
    var count = 0;
    for (var i = 0; i < OPERACIONES_CLICK_DATA.length; i++) {
      if (compradas[OPERACIONES_CLICK_DATA[i].id]) count++;
    }
    return count;
  }

  // ── API pública ───────────────────────────────────────────────
  return {
    init: init,
    render: render,
    actualizarUI: actualizarUI,
    comprar: comprar,
    getMultiplier: getMultiplier,
    getClickBonus: getClickBonus,
    getMultiplicadorTotal: getMultiplicadorTotal,
    getCompradas: getCompradas,
    getCompradasCount: getCompradasCount,
    getCompradasGenCount: getCompradasGenCount,
    getCompradasClickCount: getCompradasClickCount,
    restore: restore,
    limpiar: limpiar,
  };

})();
