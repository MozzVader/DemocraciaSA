// ============================================
// DEMOCRACIA S.A. — Módulo de Telegramas
// Random events con timer, buffs, spawn
// ============================================

var Telegramas = (() => {

  // ── Config ────────────────────────────────────────────────────
  var TICK_SEG = 0.1;           // heredado del motor (100ms por tick)
  var FIRST_MIN_SEC = 90;       // primer telegrama: mínimo 90s
  var FIRST_MAX_SEC = 120;      // primer telegrama: máximo 120s
  var BASE_MIN_SEC = 300;        // base: mínimo 5 min (mejorable con ops)
  var BASE_MAX_SEC = 600;        // base: máximo 10 min (mejorable con ops)
  var TIMER_SECONDS = 20;        // tiempo para responder (mejorable con ops)
  var SPAWN_EXP = 5;             // exponente de la fórmula de spawn

  // ── Estado: Buffs activos ─────────────────────────────────────
  var buffs = [];   // { tipo: 'clickMult'|'ppsMult', mult, restante (segundos) }

  // ── Estado: Contadores ──────────────────────────────────────────
  var aceptados = 0;
  var rechazados = 0;

  // ── Estado: Spawn ──────────────────────────────────────────────
  var activo = false;              // hay un telegrama mostrándose?
  var telegramaActual = null;      // referencia al telegrama mostrado
  var tiempoDesdeResolucion = 0;  // segundos desde último resolve
  var primerSpawnDone = false;     // ya apareció el primer telegrama?

  // ── Estado: Timer ──────────────────────────────────────────────
  var timerRestante = 0;
  var timerIntervalId = null;
  var spawnTimeoutId = null;  // timeout para pre-spawn glow → render

  // ── DOM refs ──────────────────────────────────────────────────
  var $area = null;
  var $doricRight = null;

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    $area = document.getElementById('telegramas-area') || document.querySelector('.telegramas-area');
    // Columna dórica derecha (segunda)
    var columns = document.querySelectorAll('.doric-column');
    $doricRight = columns.length > 1 ? columns[1] : null;
  }

  // ── Tick — llamado desde el game loop (cada tick = 0.1s) ────
  function tick() {
    // 1. Decrementar buffs
    tickBuffs();

    // 2. Si hay telegrama activo, no hacer spawn check
    if (activo) return;

    // 3. Incrementar tiempo desde resolución
    tiempoDesdeResolucion += TICK_SEG;

    // 4. Calcular min/max según si es primer spawn o no
    var minTime = primerSpawnDone ? BASE_MIN_SEC : FIRST_MIN_SEC;
    var maxTime = primerSpawnDone ? BASE_MAX_SEC : FIRST_MAX_SEC;

    // 5. Antes del minTime no hay chance
    if (tiempoDesdeResolucion < minTime) return;

    // 6. Fórmula de probabilidad: ((elapsed - min) / (max - min)) ^ exp
    var clamped = Math.min(tiempoDesdeResolucion, maxTime);
    var prob = Math.pow((clamped - minTime) / (maxTime - minTime), SPAWN_EXP);

    if (Math.random() < prob) {
      spawn();
    }
  }

  // ── Tick buffs ────────────────────────────────────────────────
  function tickBuffs() {
    var i = buffs.length;
    while (i--) {
      buffs[i].restante -= TICK_SEG;
      if (buffs[i].restante <= 0) {
        buffs.splice(i, 1);
      }
    }
  }

  // ── Getters de multiplicadores ───────────────────────────────
  function getClickMult() {
    var mult = 1;
    for (var i = 0; i < buffs.length; i++) {
      if (buffs[i].tipo === 'clickMult') mult *= buffs[i].mult;
    }
    return mult;
  }

  function getPPSMult() {
    var mult = 1;
    for (var i = 0; i < buffs.length; i++) {
      if (buffs[i].tipo === 'ppsMult') mult *= buffs[i].mult;
    }
    return mult;
  }

  function hasActiveBuffs() {
    return buffs.length > 0;
  }

  function getBuffTimeRemaining() {
    var max = 0;
    for (var i = 0; i < buffs.length; i++) {
      if (buffs[i].restante > max) max = buffs[i].restante;
    }
    return max;
  }

  // ── Agregar buff ──────────────────────────────────────────────
  function addBuff(tipo, mult, duracion) {
    buffs.push({ tipo: tipo, mult: mult, restante: duracion });
  }

  // ── Seleccionar telegrama aleatorio ponderado ────────────────
  function seleccionar() {
    var pesoTotal = 0;
    for (var i = 0; i < TELEGRAMAS_DATA.length; i++) {
      pesoTotal += TELEGRAMAS_DATA[i].peso;
    }
    var r = Math.random() * pesoTotal;
    var acum = 0;
    for (var i = 0; i < TELEGRAMAS_DATA.length; i++) {
      acum += TELEGRAMAS_DATA[i].peso;
      if (r < acum) return TELEGRAMAS_DATA[i];
    }
    return TELEGRAMAS_DATA[0];
  }

  // ── Spawn ────────────────────────────────────────────────────
  function spawn() {
    if (activo) return;
    activo = true;  // bloquear inmediatamente para evitar double spawn

    // Pre-spawn glow en columna dórica (aviso visual)
    triggerCooldownGlow();

    telegramaActual = seleccionar();
    primerSpawnDone = true;

    // Delay breve para que el glow sea visible antes de que entre el telegrama
    spawnTimeoutId = setTimeout(function () {
      spawnTimeoutId = null;
      renderTelegrama(telegramaActual);
      timerRestante = TIMER_SECONDS;
      timerIntervalId = setInterval(tickTimer, 1000);
      updateTimerDisplay();
    }, 1500);
  }

  // ── Render telegrama en el DOM ───────────────────────────────
  function renderTelegrama(tel) {
    if (!$area) return;

    var tipoClass = '';
    switch (tel.tipo) {
      case 'bueno': tipoClass = 'telegrama-bueno'; break;
      case 'malo':  tipoClass = 'telegrama-malo';  break;
      case 'meta':  tipoClass = 'telegrama-meta';  break;
    }

    $area.innerHTML =
      '<div class="telegrama telegrama-entrando ' + tipoClass + '" id="telegrama-activo">' +
        '<div class="telegrama-head">' +
          '<span class="telegrama-badge"><span class="telegrama-pulse"></span>TELEGRAMA</span>' +
          '<span class="telegrama-timer" id="telegrama-timer">00:' + pad2(TIMER_SECONDS) + '</span>' +
        '</div>' +
        '<p class="telegrama-text">' + escapeHTML(tel.texto) + '</p>' +
        '<div class="telegrama-actions">' +
          '<button class="telegrama-btn accept" id="telegrama-accept">Aceptar</button>' +
          '<button class="telegrama-btn reject" id="telegrama-reject">Rechazar</button>' +
        '</div>' +
      '</div>';

    // Bind events
    document.getElementById('telegrama-accept').addEventListener('click', function () {
      resolver(true);
    });
    document.getElementById('telegrama-reject').addEventListener('click', function () {
      resolver(false);
    });

    // Trigger entrance animation (remove entrando class on next frame)
    requestAnimationFrame(function () {
      var el = document.getElementById('telegrama-activo');
      if (el) el.classList.remove('telegrama-entrando');
    });
  }

  // ── Tick timer (cada segundo) ───────────────────────────────
  function tickTimer() {
    timerRestante = Math.max(0, timerRestante - 1);
    updateTimerDisplay();

    if (timerRestante <= 0) {
      // Tiempo agotado = rechazar automáticamente
      resolver(false);
    }
  }

  // ── Update timer display ──────────────────────────────────────
  function updateTimerDisplay() {
    var $timer = document.getElementById('telegrama-timer');
    if (!$timer) return;

    var secs = Math.ceil(timerRestante);
    var mins = Math.floor(secs / 60);
    var s = secs % 60;
    $timer.textContent = pad2(mins) + ':' + pad2(s);

    // Rojo cuando <= 10s
    if (secs <= 10) {
      $timer.classList.add('telegrama-timer-urgente');
    } else {
      $timer.classList.remove('telegrama-timer-urgente');
    }
  }

  // ── Resolver (aceptar o rechazar) ─────────────────────────────
  function resolver(aceptado) {
    if (!activo) return;

    // Limpiar intervalo
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
    }

    var tel = telegramaActual;

    if (aceptado && tel.efecto) {
      aplicarEfecto(tel);
      aceptados++;
    } else if (aceptado && !tel.efecto) {
      // Meta sin efecto, flavor text
      showToast('Telegrama recibido.', 'meta');
      aceptados++;
    } else {
      // Rechazado
      showToast('Telegrama rechazado.', 'neutral');
      rechazados++;
    }

    // Forzar actualización inmediata de la UI (no esperar al próximo tick de 1s)
    if (typeof UI !== 'undefined' && UI.actualizar) UI.actualizar();
    if (typeof Game !== 'undefined' && Game._actualizarEtapas) Game._actualizarEtapas();
    if (typeof Operaciones !== 'undefined' && Operaciones.actualizarUI) Operaciones.actualizarUI();

    // Animación de salida (fade, no slide)
    var el = document.getElementById('telegrama-activo');
    if (el) {
      el.classList.add('telegrama-saliendo');
      setTimeout(function () {
        if ($area) $area.innerHTML = '';
      }, 600);
    } else {
      if ($area) $area.innerHTML = '';
    }

    // Reset estado
    activo = false;
    telegramaActual = null;
    tiempoDesdeResolucion = 0;
  }

  // ── Aplicar efecto ────────────────────────────────────────────
  function aplicarEfecto(tel) {
    var ef = tel.efecto;

    // Si requiere generador, verificar que el jugador lo tenga
    if (tel.reqGenId !== undefined) {
      var gens = Game.getGeneradores();
      var tiene = false;
      for (var i = 0; i < gens.length; i++) {
        if (gens[i].id === tel.reqGenId && gens[i].cantidad > 0) {
          tiene = true;
          break;
        }
      }
      if (!tiene) {
        showToast('No contás con lo necesario para aprovechar esto.', 'warning');
        return;
      }
    }

    switch (ef.tipo) {

      // ── Click multiplier temporal ──
      case 'clickMult':
        addBuff('clickMult', ef.mult, ef.duracion);
        showToast('Click x' + ef.mult + ' por ' + fmtDur(ef.duracion) + '!', 'bueno');
        break;

      // ── PpS multiplier temporal ──
      case 'ppsMult':
        addBuff('ppsMult', ef.mult, ef.duracion);
        if (ef.mult >= 1) {
          showToast('PpS x' + ef.mult + ' por ' + fmtDur(ef.duracion) + '!', 'bueno');
        } else {
          showToast('PpS x' + ef.mult + ' por ' + fmtDur(ef.duracion) + '...', 'malo');
        }
        break;

      // ── Instantáneo: x10 PpS de un generador ──
      case 'instantGenPPS': {
        var gens = Game.getGeneradores();
        var gen = null;
        for (var i = 0; i < gens.length; i++) {
          if (gens[i].id === ef.genId) { gen = gens[i]; break; }
        }
        if (gen && gen.cantidad > 0) {
          var genPPS = Formulas.ppsGenerador(gen);
          var ganancia = genPPS * ef.mult;
          Game.agregarPesos(ganancia);
          showToast('+' + Formato.numero(ganancia) + ' instantáneos!', 'bueno');
        }
        break;
      }

      // ── +N% pesos actuales ──
      case 'instantPesosPercent': {
        var current = Game.getPesos();
        var ganancia = current * (ef.percent / 100);
        Game.agregarPesos(ganancia);
        showToast('+' + Formato.numero(ganancia) + ' (+' + ef.percent + '% actual)!', 'bueno');
        break;
      }

      // ── +N generadores ──
      case 'addGenerator': {
        var gens = Game.getGeneradores();
        for (var i = 0; i < gens.length; i++) {
          if (gens[i].id === ef.genId) {
            gens[i].cantidad += ef.cantidad;
            break;
          }
        }
        // Forzar actualización
        if (typeof Game._actualizarEtapas === 'function') Game._actualizarEtapas();
        if (typeof UI !== 'undefined' && UI.actualizar) UI.actualizar();
        var nombre = getGenNombre(ef.genId);
        showToast('+' + ef.cantidad + ' ' + nombre + (ef.cantidad > 1 ? 's' : '') + '!', 'bueno');
        break;
      }

      // ── -N% pesos acumulados (de current) ──
      case 'removePesosAcumPercent': {
        var acum = Game.getPesosTotales();
        var perdida = acum * (ef.percent / 100);
        Game.quitarPesos(perdida);
        showToast('-' + Formato.numero(perdida) + ' (-' + ef.percent + '% acumulado)!', 'malo');
        break;
      }

      // ── -N% pesos actuales ──
      case 'removePesosPercent': {
        var current = Game.getPesos();
        var perdida = current * (ef.percent / 100);
        Game.quitarPesos(perdida);
        showToast('-' + Formato.numero(perdida) + ' (-' + ef.percent + '% actual)!', 'malo');
        break;
      }

      // ── Logro ──
      case 'achievement':
        if (typeof Logros !== 'undefined' && Logros.grant) {
          Logros.grant(ef.logroId);
        }
        // El logro muestra su propio toast, no mostramos otro
        break;
    }
  }

  // ── Toast de feedback ──────────────────────────────────────────
  function showToast(msg, tipo) {
    if (tipo === 'achievement') return;

    var container = document.getElementById('logros-toast-container');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'logros-toast telegrama-toast';

    // Color del borde según tipo
    switch (tipo) {
      case 'bueno':   toast.style.borderLeftColor = '#22c55e'; break;
      case 'malo':    toast.style.borderLeftColor = '#ef4444'; break;
      case 'warning': toast.style.borderLeftColor = '#f59e0b'; break;
      case 'meta':    toast.style.borderLeftColor = '#a78bfa'; break;
      default:        toast.style.borderLeftColor = '#64748b'; break;
    }

    var iconText = '';
    switch (tipo) {
      case 'bueno':   iconText = '&#9989;'; break;
      case 'malo':    iconText = '&#9888;'; break;
      case 'warning': iconText = '&#128203;'; break;
      case 'meta':    iconText = '&#128220;'; break;
      default:        iconText = '&#128236;'; break;
    }

    toast.innerHTML =
      '<div class="logros-toast-icon">' + iconText + '</div>' +
      '<div class="logros-toast-info">' +
        '<div class="logros-toast-name">Telegrama</div>' +
        '<div class="logros-toast-desc">' + msg + '</div>' +
      '</div>' +
      '<button class="logros-toast-close">&times;</button>';

    toast.querySelector('.logros-toast-close').addEventListener('click', function (e) {
      e.stopPropagation();
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    });

    container.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('visible');
    });

    setTimeout(function () {
      toast.classList.remove('visible');
      toast.classList.add('hiding');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, 7000);
  }

  // ── Glow en columna dórica derecha (pre-spawn warning) ────────
  function triggerCooldownGlow() {
    if (!$doricRight) return;
    $doricRight.classList.remove('doric-glow');
    // Force reflow para reiniciar la animación
    void $doricRight.offsetWidth;
    $doricRight.classList.add('doric-glow');
    setTimeout(function () {
      if ($doricRight) $doricRight.classList.remove('doric-glow');
    }, 2500);
  }

  // ── Limpiar (reset del juego) ─────────────────────────────────
  function limpiar() {
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
    }
    if (spawnTimeoutId) {
      clearTimeout(spawnTimeoutId);
      spawnTimeoutId = null;
    }
    buffs = [];
    aceptados = 0;
    rechazados = 0;
    activo = false;
    telegramaActual = null;
    tiempoDesdeResolucion = 0;
    primerSpawnDone = false;
    timerRestante = 0;
    if ($area) $area.innerHTML = '';
  }

  // ── Helpers ───────────────────────────────────────────────────
  function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function fmtDur(secs) {
    if (secs < 60) return secs + 's';
    var m = Math.floor(secs / 60);
    var s = secs % 60;
    return s === 0 ? m + 'min' : m + 'min ' + s + 's';
  }

  function escapeHTML(str) {
    // Mínimo escape para texto de telegrama
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function getGenNombre(genId) {
    for (var i = 0; i < GENERADORES.length; i++) {
      if (GENERADORES[i].id === genId) return GENERADORES[i].nombre;
    }
    return '?';
  }

  // ── Getters contadores ───────────────────────────────────────
  function getAceptados() { return aceptados; }
  function getRechazados() { return rechazados; }

  // ── API pública ──────────────────────────────────────────────
  return {
    init: init,
    tick: tick,
    getClickMult: getClickMult,
    getPPSMult: getPPSMult,
    hasActiveBuffs: hasActiveBuffs,
    getBuffTimeRemaining: getBuffTimeRemaining,
    addBuff: addBuff,
    getAceptados: getAceptados,
    getRechazados: getRechazados,
    limpiar: limpiar,
  };

})();
