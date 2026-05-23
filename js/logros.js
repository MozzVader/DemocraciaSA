// ============================================
// DEMOCRACIA S.A. — Módulo de Logros
// Check, unlock, toast, render modal, save
// ============================================

var Logros = (() => {

  // ── Config ────────────────────────────────────────────────────
  var MAX_TOASTS = 3;
  var ICON_PLACEHOLDER = '\u{1F3C6}';  // 🏆 fallback si no carga la imagen
  var ICON_LOCKED = '\u2753';            // ❓ para bloqueados
  var ICON_PATH = 'assets/logros/'; // base path de iconos (se concatena con logro.icono)

  // ── Estado privado ────────────────────────────────────────────
  var desbloqueados = {};   // { id: timestamp }
  var toastQueue = [];      // cola de toasts pendientes
  var activeToasts = 0;     // toasts visibles actualmente

  // ── DOM refs ──────────────────────────────────────────────────
  var $grid = null;
  var $badge = null;
  var $subtitle = null;
  var $tooltip = null;
  var $toastContainer = null;

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    $grid = document.getElementById('logros-grid');
    $badge = document.getElementById('logros-badge');
    $subtitle = document.getElementById('logros-subtitle');
    $toastContainer = document.getElementById('logros-toast-container');

    // Crear tooltip único (reutilizable)
    $tooltip = document.createElement('div');
    $tooltip.className = 'logro-tooltip';
    $tooltip.style.display = 'none';
    document.body.appendChild($tooltip);

    // Renderizar grid
    render();

    // Setup tooltip hover
    setupTooltip();
  }

  // ── HTML del icono de un logro (img con fallback emoji) ──
  function logroIconHTML(icono) {
    return '<img src="' + ICON_PATH + icono + '.png" alt="" onerror="this.outerHTML=\'\u{1F3C6}\'">';
  }

  // ── Obtener valor de un stat del juego ───────────────────────
  function getStatValue(stat) {
    switch (stat) {
      case 'pesosTotales':  return Game.getPesosTotales();
      case 'clicsTotales':  return Game.getClicsTotales();
      case 'tiempoJugado':  return Game.getTiempoJugado();
      case 'pps':           return Game.getPPS();
      case 'clics':         return Game.getPesosPorClicTotales();
      default: return 0;
    }
  }

  // ── Tick — llamado cada segundo desde el game loop ───────────
  function tick() {
    for (var i = 0; i < LOGROS_DATA.length; i++) {
      var logro = LOGROS_DATA[i];
      if (desbloqueados[logro.id]) continue;

      var statVal = getStatValue(logro.cond.stat);
      if (statVal >= logro.cond.val) {
        desbloquear(logro.id);
      }
    }
  }

  // ── Desbloquear un logro ─────────────────────────────────────
  function desbloquear(id) {
    if (desbloqueados[id]) return;

    var logro = null;
    for (var i = 0; i < LOGROS_DATA.length; i++) {
      if (LOGROS_DATA[i].id === id) {
        logro = LOGROS_DATA[i];
        break;
      }
    }
    if (!logro) return;

    desbloqueados[id] = Date.now();

    // Actualizar item en el grid
    var item = $grid ? $grid.querySelector('[data-logro-id="' + id + '"]') : null;
    if (item) {
      item.classList.remove('locked');
      item.classList.add('unlocked');
      item.innerHTML = '<span class="logro-icon">' + logroIconHTML(logro.icono) + '</span>';
    }

    // Actualizar badge y subtitle
    actualizarBadge();

    // Mostrar toast
    mostrarToast(logro);
  }

  // ── Renderizar grid completo ─────────────────────────────────
  function render() {
    if (!$grid) return;

    $grid.innerHTML = '';

    for (var i = 0; i < LOGROS_DATA.length; i++) {
      var logro = LOGROS_DATA[i];
      var item = document.createElement('div');
      item.className = 'logro-item';
      item.dataset.logroId = logro.id;

      if (desbloqueados[logro.id]) {
        item.classList.add('unlocked');
        item.innerHTML = '<span class="logro-icon">' + logroIconHTML(logro.icono) + '</span>';
      } else {
        item.classList.add('locked');
        item.innerHTML = '<span class="logro-icon">' + ICON_LOCKED + '</span>';
      }

      $grid.appendChild(item);
    }

    actualizarBadge();
  }

  // ── Actualizar badge y subtitle ──────────────────────────────
  function actualizarBadge() {
    var count = Object.keys(desbloqueados).length;
    var total = LOGROS_DATA.length;

    if ($badge) {
      $badge.textContent = count;
      $badge.style.display = count > 0 ? '' : 'none';
    }

    if ($subtitle) {
      $subtitle.textContent = count + ' de ' + total + ' desbloqueados';
    }
  }

  // ── Toast de desbloqueo ──────────────────────────────────────
  function mostrarToast(logro) {
    toastQueue.push(logro);
    procesarQueue();
  }

  function procesarQueue() {
    while (toastQueue.length > 0 && activeToasts < MAX_TOASTS) {
      var logro = toastQueue.shift();
      crearToast(logro);
    }
  }

  function crearToast(logro) {
    if (!$toastContainer) return;

    activeToasts++;

    var toast = document.createElement('div');
    toast.className = 'logros-toast';

    toast.innerHTML =
      '<div class="logros-toast-icon">' + logroIconHTML(logro.icono) + '</div>' +
      '<div class="logros-toast-info">' +
        '<div class="logros-toast-name">' + logro.nombre + '</div>' +
        '<div class="logros-toast-desc">' + logro.desc + '</div>' +
      '</div>' +
      '<button class="logros-toast-close">&times;</button>';

    // Cerrar con X
    toast.querySelector('.logros-toast-close').addEventListener('click', function (e) {
      e.stopPropagation();
      cerrarToast(toast);
    });

    $toastContainer.appendChild(toast);

    // Trigger animación de entrada
    requestAnimationFrame(function () {
      toast.classList.add('visible');
    });
  }

  function cerrarToast(el) {
    if (!el || !el.parentNode) return;

    el.classList.remove('visible');
    el.classList.add('hiding');

    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      activeToasts--;
      procesarQueue();
    }, 350);
  }

  // ── Tooltip custom en hover ──────────────────────────────────
  function setupTooltip() {
    if (!$grid) return;

    $grid.addEventListener('mouseover', function (e) {
      var item = e.target.closest('.logro-item');
      if (!item) return;
      showTooltip(item);
    });

    $grid.addEventListener('mouseout', function (e) {
      var item = e.target.closest('.logro-item');
      if (!item) return;

      // Verificar que salimos del item (no hacia un hijo)
      var related = e.relatedTarget;
      if (related && item.contains(related)) return;

      hideTooltip();
    });

    // Ocultar al scroll dentro del modal
    var modalBody = $grid.closest('.modal-body');
    if (modalBody) {
      modalBody.addEventListener('scroll', hideTooltip);
    }
  }

  function showTooltip(item) {
    if (!$tooltip) return;

    var id = parseInt(item.dataset.logroId, 10);
    var isUnlocked = !!desbloqueados[id];

    var logro = null;
    for (var i = 0; i < LOGROS_DATA.length; i++) {
      if (LOGROS_DATA[i].id === id) {
        logro = LOGROS_DATA[i];
        break;
      }
    }

    if (isUnlocked && logro) {
      $tooltip.innerHTML =
        '<div class="logro-tooltip-icon">' + logroIconHTML(logro.icono) + '</div>' +
        '<div class="logro-tooltip-content">' +
          '<div class="logro-tooltip-name">' + logro.nombre + '</div>' +
          '<div class="logro-tooltip-desc">' + logro.desc + '</div>' +
        '</div>';
    } else {
      $tooltip.innerHTML =
        '<div class="logro-tooltip-icon">' + ICON_LOCKED + '</div>' +
        '<div class="logro-tooltip-content">' +
          '<div class="logro-tooltip-name">???</div>' +
          '<div class="logro-tooltip-desc">??? ??? ???</div>' +
        '</div>';
    }

    // Posicionar
    var itemRect = item.getBoundingClientRect();
    $tooltip.style.display = 'flex';
    var tooltipRect = $tooltip.getBoundingClientRect();

    var top = itemRect.top - tooltipRect.height - 10;
    var left = itemRect.left + (itemRect.width / 2) - (tooltipRect.width / 2);

    // Si no hay espacio arriba, mostrar abajo
    if (top < 10) {
      top = itemRect.bottom + 10;
    }

    // Clamp horizontal
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
    desbloqueados = {};
    if (ids && Array.isArray(ids)) {
      for (var i = 0; i < ids.length; i++) {
        desbloqueados[ids[i]] = 1;
      }
    }
    render();
  }

  // ── Limpiar (reset del juego) ────────────────────────────────
  function limpiar() {
    desbloqueados = {};
    toastQueue = [];
    activeToasts = 0;

    // Limpiar toasts visibles
    if ($toastContainer) {
      $toastContainer.innerHTML = '';
    }

    // Re-render grid
    render();

    // Ocultar tooltip
    hideTooltip();
  }

  // ── Getters ───────────────────────────────────────────────────
  function getDesbloqueados() {
    return Object.keys(desbloqueados).map(function (k) { return parseInt(k, 10); });
  }

  function getTotal() {
    return LOGROS_DATA.length;
  }

  // ── API pública ───────────────────────────────────────────────
  return {
    init: init,
    tick: tick,
    render: render,
    getDesbloqueados: getDesbloqueados,
    getTotal: getTotal,
    restore: restore,
    limpiar: limpiar,
  };

})();
