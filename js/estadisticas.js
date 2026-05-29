// ============================================
// DEMOCRACIA S.A. V1 — Módulo de Estadísticas
// Modal dinámico con stats + operaciones compradas
// ============================================

var Estadisticas = (() => {

  // ── Config ────────────────────────────────────────────────────
  var ICON_PATH = 'assets/operaciones/';
  var ICON_FALLBACK = '\u{1F4CB}';  // 📋

  // ── DOM refs ──────────────────────────────────────────────────
  var $modalBody = null;
  var $tooltip = null;

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    $modalBody = document.getElementById('stats-body');
    if (!$modalBody) return;

    // Crear tooltip
    $tooltip = document.createElement('div');
    $tooltip.className = 'logro-tooltip';
    $tooltip.style.display = 'none';
    document.body.appendChild($tooltip);

    // Setup tooltip
    setupTooltip();
  }

  // ── Renderizar contenido del modal ────────────────────────────
  function render() {
    if (!$modalBody) return;

    var html = '';

    // Sección 1: Estadísticas generales
    html += renderStatsGenerales();

    // Sección 2: Operaciones compradas
    html += renderOpsCompradas();

    $modalBody.innerHTML = html;

    // Re-setup tooltip para los nuevos elementos
    setupTooltip();
  }

  // ── Sección: Estadísticas Generales ───────────────────────────
  function renderStatsGenerales() {
    var pesos = Game.getPesos();
    var pesosTotales = Game.getPesosTotales();
    var pps = Game.getPPS();
    var multiplicador = 1;
    if (typeof Operaciones !== 'undefined' && Operaciones.getMultiplicadorTotal) {
      multiplicador = Operaciones.getMultiplicadorTotal();
    }
    var clics = Game.getClicsTotales();
    var clickPower = Game.getPesosPorClic();
    var pesosPorClicTotales = Game.getPesosPorClicTotales();
    var tiempoJugado = Game.getTiempoJugado();

    // Generadores comprados total
    var gens = Game.getGeneradores();
    var gensComprados = 0;
    for (var i = 0; i < gens.length; i++) {
      gensComprados += gens[i].cantidad;
    }

    // Multiplicador en porcentaje
    var multPorcentaje = Math.round((multiplicador - 1) * 100);

    // Partida iniciada
    var inicioTS = Save.getInicioTimestamp();
    var diasAtras = 'hoy';
    if (inicioTS) {
      var diffMs = Date.now() - inicioTS;
      var diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDias === 0) diasAtras = 'hoy';
      else if (diffDias === 1) diasAtras = 'ayer';
      else diasAtras = 'hace ' + diffDias + ' d\u00EDas';
    }

    // Clicks de telegramas (placeholder пока no existe módulo)
    var telegramasClicks = 0;

    var stats = [
      { label: 'Pesos acumulados', value: '$ ' + Formato.numero(pesos), icon: '\u{1F4B5}' },
      { label: 'Pesos generados (en esta run)', value: '$ ' + Formato.numero(pesosTotales), icon: '\u{1F4B0}' },
      { label: 'Pesos generados (en total)', value: '$ ' + Formato.numero(pesosTotales), icon: '\u{1F4C8}' },
      { label: 'Partida iniciada', value: diasAtras, icon: '\u{1F4C5}' },
      { label: 'Generadores comprados', value: Formato.numero(gensComprados, 0), icon: '\u{1F3DB}\u{FE0F}' },
      { label: 'Pesos por segundo', value: Formato.numero(pps) + (multPorcentaje > 0 ? ' (mult: +' + multPorcentaje + '%)' : ''), icon: '\u26A1' },
      { label: 'Pesos por click', value: Formato.numero(clickPower), icon: '\u{1F446}' },
      { label: 'Clicks al Sol de Mayo', value: Formato.numero(clics, 0), icon: '\u{2600}\u{FE0F}' },
      { label: 'Pesos generados a mano', value: '$ ' + Formato.numero(pesosPorClicTotales), icon: '\u{270B}' },
      { label: 'Clicks de Telegramas', value: telegramasClicks + ' (en total: ' + telegramasClicks + ')', icon: '\u{1F4E8}' },
    ];

    var html = '<div class="stats-section">';
    html += '<h3 class="stats-section-title">\u{1F4CA} Estad\u00EDsticas generales</h3>';
    html += '<div class="stats-grid stats-wide">';

    for (var i = 0; i < stats.length; i++) {
      var s = stats[i];
      html += '<div class="stat-item">';
      html += '  <span class="stat-label">' + s.label + '</span>';
      html += '  <span class="stat-value">' + s.value + '</span>';
      html += '</div>';
    }

    html += '</div></div>';
    return html;
  }

  // ── Sección: Operaciones Compradas ────────────────────────────
  function renderOpsCompradas() {
    var compradas = [];
    if (typeof Operaciones !== 'undefined' && Operaciones.getCompradas) {
      var ids = Operaciones.getCompradas();
      for (var i = 0; i < ids.length; i++) {
        for (var j = 0; j < OPERACIONES_DATA.length; j++) {
          if (OPERACIONES_DATA[j].id === ids[i]) {
            compradas.push(OPERACIONES_DATA[j]);
            break;
          }
        }
      }
    }

    var html = '<div class="stats-section">';
    html += '<h3 class="stats-section-title">\u{1F527} Operaciones compradas (' + compradas.length + ')</h3>';

    if (compradas.length === 0) {
      html += '<p class="stats-empty">Todav\u00EDa no compraste ninguna operaci\u00F3n.</p>';
    } else {
      html += '<div class="ops-grid">';
      for (var i = 0; i < compradas.length; i++) {
        var op = compradas[i];
        html += '<div class="op-item unlocked" data-op-id="' + op.id + '" data-op-name="' + op.nombre.replace(/"/g, '&quot;') + '" data-op-bonus="' + op.bonusText.replace(/"/g, '&quot;') + '">';
        html += '  <span class="logro-icon"><img src="' + ICON_PATH + op.icono + '.png" alt="" onerror="this.outerHTML=\'' + ICON_FALLBACK + '\'"></span>';
        html += '</div>';
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  // ── Tooltip para operaciones compradas ───────────────────────
  function setupTooltip() {
    if (!$modalBody || !$tooltip) return;

    $modalBody.addEventListener('mouseover', function (e) {
      var item = e.target.closest('.op-item');
      if (!item) return;
      showTooltip(item);
    });

    $modalBody.addEventListener('mouseout', function (e) {
      var item = e.target.closest('.op-item');
      if (!item) return;

      var related = e.relatedTarget;
      if (related && item.contains(related)) return;

      hideTooltip();
    });

    var scrollable = $modalBody.closest('.modal-body');
    if (scrollable) {
      scrollable.addEventListener('scroll', hideTooltip);
    }
  }

  function showTooltip(item) {
    if (!$tooltip) return;

    var name = item.dataset.opName || '';
    var bonus = item.dataset.opBonus || '';

    $tooltip.innerHTML =
      '<div class="logro-tooltip-icon">' + item.querySelector('.logro-icon').innerHTML + '</div>' +
      '<div class="logro-tooltip-content">' +
        '<div class="logro-tooltip-name">' + name + '</div>' +
        '<div class="logro-tooltip-desc">' + bonus + '</div>' +
      '</div>';

    var itemRect = item.getBoundingClientRect();
    $tooltip.style.display = 'flex';
    var tooltipRect = $tooltip.getBoundingClientRect();

    var top = itemRect.top - tooltipRect.height - 10;
    var left = itemRect.left + (itemRect.width / 2) - (tooltipRect.width / 2);

    if (top < 10) {
      top = itemRect.bottom + 10;
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

  // ── API pública ───────────────────────────────────────────────
  return {
    init: init,
    render: render,
  };

})();
