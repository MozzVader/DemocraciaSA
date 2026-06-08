// ============================================
// DEMOCRACIA S.A. V1 — Motor del Juego
// Estado global, game loop, click, compra
// ============================================

var Game = (() => {

  // ── Config ────────────────────────────────────────────────────
  var TICK_MS = 100;            // 10 ticks por segundo
  var TICK_SEG = 0.1;           // segundos por tick
  var UI_REFRESH_TICKS = 10;    // actualizar UI completa cada 1 segundo
  var MONEY_REFRESH_TICKS = 2;  // actualizar dinero cada 200ms
  var AUTO_SAVE_MS = 30000;     // guardar cada 30s
  var OFFLINE_MAX_SEG = 7200;  // maximo offline: 2 horas

  // ── Estado ────────────────────────────────────────────────────
  var pesos = 0;
  var pesosTotales = 0;         // acumulados (para prestige futuro)
  var pesosPorClic = 1;         // click power base
  var clicsTotales = 0;
  var pesosPorClicTotales = 0;  // lifetime: no resetea en prestige
  var tiempoJugado = 0;         // segundos
  var tickCount = 0;
  var ultimoSave = 0;
  var loopId = null;
  var ultimaVisibilidad = 0;  // timestamp de ultima vez que la pestaña fue visible

  // Generadores: clon de GENERADORES con .cantidad y .etapa agregados
  // Etapas de develado:
  //   0 = oculto (no aparece en la lista)
  //   1 = misterio ("???" + icono oscuro, muestra que existe)
  //   2 = revelado (nombre + precio visible, grisado, no comprable)
  //   3 = comprable (todo normal)
  var generadores = [];

  // Cantidad seleccionada para compra
  var cantidadCompra = 1;       // 1, 10 o -1 (max)

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    // Clonar datos estáticos y agregar estado mutable
    generadores = GENERADORES.map(function (g) {
      return {
        id: g.id,
        nombre: g.nombre,
        precioBase: g.precioBase,
        ppsBase: g.ppsBase,
        icono: g.icono,
        desc: g.desc,
        cantidad: 0,
        etapa: 0,         // 0=oculto, 1=misterio, 2=revelado, 3=comprable
      };
    });

    // El primero siempre es comprable
    generadores[0].etapa = 3;

    // Cargar save si existe
    Save.load();

    // Arrancar loop
    ultimoSave = Date.now();
    ultimaVisibilidad = Date.now();
    loopId = setInterval(gameTick, TICK_MS);

    // Setup de eventos
    setupEvents();
  }

  // ── Game Loop ─────────────────────────────────────────────────
  function gameTick() {
    // 1. Calcular PPS (base) y aplicar buffs de telegramas
    var pps = Formulas.ppsTotal(generadores);
    if (typeof Telegramas !== 'undefined') {
      pps *= Telegramas.getPPSMult();
      Telegramas.tick();
    }
    var delta = pps * TICK_SEG;

    // 2. Generar pesos
    pesos += delta;
    pesosTotales += delta;

    // 3. Calidad democrática (fluctuación random)
    if (typeof Calidad === 'object' && Calidad.tick) {
      Calidad.tick();
    }

    // 4. Tiempo jugado
    tiempoJugado += TICK_SEG;

    // 4. Tick counter
    tickCount++;

    // 5. Actualizar dinero rápido (200ms)
    if (tickCount % MONEY_REFRESH_TICKS === 0) {
      UI.actualizarDinero();
    }

    // 6. Actualizar UI completa cada segundo (etapas, generadores, ops, logros)
    if (tickCount % UI_REFRESH_TICKS === 0) {
      actualizarEtapas();
      UI.actualizar();
      if (typeof Logros !== 'undefined' && Logros.tick) {
        Logros.tick();
      }

      // Actualizar operaciones (check desbloqueos, refrescar UI)
      if (typeof Operaciones !== 'undefined' && Operaciones.actualizarUI) {
        Operaciones.actualizarUI();
      }
    }

    // 6. Tick billetes (cada tick)
    Billetes.tick(pps);

    // 7. Auto-save
    if (Date.now() - ultimoSave >= AUTO_SAVE_MS) {
      Save.save();
      ultimoSave = Date.now();
    }
  }

  // ── Click Handler ─────────────────────────────────────────────
  function click(pesosGanados) {
    var ganancia = pesosGanados || getPesosPorClic();
    pesos += ganancia;
    pesosTotales += ganancia;
    clicsTotales++;
    pesosPorClicTotales += ganancia;
    actualizarEtapas();
  }

  // ── Compra de Generador ───────────────────────────────────────
  function comprar(idGen) {
    var gen = generadores[idGen];
    if (!gen) return false;

    var cantidad = getCantidadEfectiva(gen);
    if (cantidad <= 0) return false;

    var precio = Formulas.precioLote(gen, cantidad);
    if (pesos < precio) return false;

    // Descontar y agregar
    pesos -= precio;
    gen.cantidad += cantidad;
    actualizarEtapas();
    UI.actualizar();
    return true;
  }

  /**
   * Determina cuántas unidades comprar según el selector (x1, x10, Max).
   */
  function getCantidadEfectiva(gen) {
    if (cantidadCompra === -1) {
      // Max: calcular cuántas puede comprar
      return Formulas.maxComprable(gen, pesos);
    }
    // Verificar que puede pagar al menos esa cantidad
    var precio = Formulas.precioLote(gen, cantidadCompra);
    return (pesos >= precio) ? cantidadCompra : 0;
  }

  // ── Gate de visibilidad (4 etapas) ──────────────────────────
  // Umbral = precioBase del generador
  //   pesosTotales < 33% umbral  → etapa 0 (oculto)
  //  33%–66% umbral             → etapa 1 ("???" misterio)
  //  66%–100% umbral            → etapa 2 (revelado grisado)
  //   pesosTotales >= umbral    → etapa 3 (comprable)
  function actualizarEtapas() {
    for (var i = 0; i < generadores.length; i++) {
      var gen = generadores[i];
      // Si ya compró al menos uno, siempre etapa 3
      if (gen.cantidad > 0) {
        gen.etapa = 3;
        continue;
      }
      var umbral = gen.precioBase;
      var ratio = pesosTotales / umbral;
      var nuevaEtapa;
      if (ratio >= 1) {
        nuevaEtapa = 3;       // comprable
      } else if (ratio >= 0.66) {
        nuevaEtapa = 2;       // revelado grisado
      } else if (ratio >= 0.33) {
        nuevaEtapa = 1;       // misterio "???"
      } else {
        nuevaEtapa = 0;       // oculto
      }
      // Solo subir etapa, nunca bajar (evitar que un generador se oculte)
      if (nuevaEtapa > gen.etapa) {
        gen.etapa = nuevaEtapa;
      }
      // Pero si llegó a etapa 3 (comprable) y después no tiene suficiente, baja a 2
      if (gen.etapa === 3 && pesos < gen.precioBase) {
        gen.etapa = 2;
      }
    }
  }

  // ── Selector de cantidad ──────────────────────────────────────
  function setCantidad(qty) {
    cantidadCompra = qty;
    UI.actualizar(); // refresca precios mostrados
  }

  // ── Gastar pesos ──────────────────────────────────────────────
  function gastar(cantidad) {
    if (pesos < cantidad) return false;
    pesos -= cantidad;
    return true;
  }

  // ── Getters ───────────────────────────────────────────────────
  function getPesos() { return pesos; }
  function getPesosTotales() { return pesosTotales; }
  /**
   * Click power dinámico.
   * click = base(1) + bonus click-ops (cantCompradas × PpS × 0.01)
   * Futuro: multiplicar por telegramas bonuses.
   */
  function getPesosPorClic() {
    var base = 1;
    var bonus = 0;
    if (typeof Operaciones !== 'undefined' && Operaciones.getClickBonus) {
      bonus = Operaciones.getClickBonus();
    }
    var click = base + bonus;
    // Aplicar buffs de telegramas
    if (typeof Telegramas !== 'undefined') {
      click *= Telegramas.getClickMult();
    }
    return click;
  }
  function getClicsTotales() { return clicsTotales; }
  function getPesosPorClicTotales() { return pesosPorClicTotales; }
  function getTiempoJugado() { return tiempoJugado; }
  function getPPS() {
    var pps = Formulas.ppsTotal(generadores);
    if (typeof Telegramas !== 'undefined') {
      pps *= Telegramas.getPPSMult();
    }
    return pps;
  }
  function getGeneradores() { return generadores; }
  function getCantidadCompra() { return cantidadCompra; }
  function getUltimaVisibilidad() { return ultimaVisibilidad; }
  function setUltimaVisibilidad(ts) { ultimaVisibilidad = ts; }

  // ── Restore desde save ────────────────────────────────────────
  function restore(data) {
    pesos = data.pesos || 0;
    pesosTotales = data.pesosTotales || 0;
    clicsTotales = data.clicsTotales || 0;
    pesosPorClicTotales = data.pesosPorClicTotales || 0;
    tiempoJugado = data.tiempoJugado || 0;

    if (data.generadores) {
      for (var i = 0; i < data.generadores.length; i++) {
        var sg = data.generadores[i];
        for (var j = 0; j < generadores.length; j++) {
          if (generadores[j].id === sg.id) {
            generadores[j].cantidad = sg.cantidad || 0;
            if (generadores[j].cantidad > 0) {
              generadores[j].etapa = 3;
            }
            break;
          }
        }
      }
    }

    actualizarEtapas();
  }

  // ── Progreso offline ───────────────────────────────────────
  /**
   * Calcula y aplica las ganancias de tiempo offline.
   * @returns {{ ganados: number, segundos: number } | null} null si no hay ganancias
   */
  function applyOfflineProgress() {
    var ahora = Date.now();
    var tiempoAusente = (ahora - ultimaVisibilidad) / 1000;

    // Menos de 5 segundos: ignorar (evitar falsos positivos)
    if (tiempoAusente < 5) return null;

    // Cap a OFFLINE_MAX_SEG
    var tiempoOffline = Math.min(tiempoAusente, OFFLINE_MAX_SEG);

    // Calcular PPS actual
    var pps = Formulas.ppsTotal(generadores);
    if (pps <= 0) {
      ultimaVisibilidad = ahora;
      return null;
    }

    // Calcular ganancia
    var pesosGanados = pps * tiempoOffline;

    // Aplicar
    pesos += pesosGanados;
    pesosTotales += pesosGanados;
    tiempoJugado += tiempoOffline;

    // Actualizar timestamp
    ultimaVisibilidad = ahora;

    // Actualizar etapas y UI
    actualizarEtapas();
    UI.actualizar();

    return {
      ganados: pesosGanados,
      segundos: tiempoOffline,
    };
  }

  // ── Agregar pesos (para telegramas y efectos instantáneos) ──
  function agregarPesos(cantidad) {
    pesos += cantidad;
    pesosTotales += cantidad;
  }

  // ── Quitar pesos (efectos negativos, clamped a 0) ───────────
  function quitarPesos(cantidad) {
    pesos = Math.max(0, pesos - cantidad);
  }

  // ── Exponer actualizarEtapas (para telegramas) ─────────────────
  function _actualizarEtapas() {
    actualizarEtapas();
  }

  // ── Reset del juego ──────────────────────────────────────────
  function resetJuego() {
    pesos = 0;
    pesosTotales = 0;
    clicsTotales = 0;
    pesosPorClicTotales = 0;
    tiempoJugado = 0;
    tickCount = 0;
    cantidadCompra = 1;
    ultimaVisibilidad = Date.now();

    for (var i = 0; i < generadores.length; i++) {
      generadores[i].cantidad = 0;
      generadores[i].etapa = (i === 0) ? 3 : 0; // solo el primero comprable
    }

    // Borrar save
    Save.reset();

    // Limpiar billetes
    Billetes.limpiar();

    // Limpiar logros
    if (typeof Logros !== 'undefined' && Logros.limpiar) {
      Logros.limpiar();
    }

    // Limpiar operaciones
    if (typeof Operaciones !== 'undefined' && Operaciones.limpiar) {
      Operaciones.limpiar();
    }

    // Limpiar telegramas
    if (typeof Telegramas !== 'undefined' && Telegramas.limpiar) {
      Telegramas.limpiar();
    }

    // Re-render y actualizar
    UI.renderGeneradores();
    UI.actualizar();
  }

  // ── Click float (número flotante dorado) ──────────────────────
  function spawnClickFloat(e, container) {
    var el = document.createElement('span');
    el.className = 'click-float';
    el.textContent = '+$' + Formato.numero(getPesosPorClic());

    // Posición relativa al contenedor (clicker-area)
    var area = container.closest('.clicker-area') || container;
    var rect = area.getBoundingClientRect();
    var x = e.clientX - rect.left + (Math.random() - 0.5) * 30;
    var y = e.clientY - rect.top - 10;
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    area.style.position = area.style.position || 'relative';
    area.appendChild(el);

    // Limpiar después de la animación
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1000);
  }

  // ── Setup eventos ─────────────────────────────────────────────
  function setupEvents() {
    // Click en el botón principal
    var clickerBtn = document.querySelector('.clicker-btn');
    if (clickerBtn) {
      clickerBtn.addEventListener('click', function (e) {
        var ganancia = getPesosPorClic();
        click(ganancia);
        spawnClickFloat(e, clickerBtn);
        Billetes.spawnClick(ganancia);
      });
    }

    // Selector de cantidad
    document.querySelectorAll('.qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var qty = parseInt(btn.dataset.qty, 10);
        setCantidad(qty);

        // Actualizar active
        document.querySelectorAll('.qty-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
      });
    });
  }

  // ── API pública ───────────────────────────────────────────────
  return {
    init: init,
    click: click,
    comprar: comprar,
    gastar: gastar,
    getPesos: getPesos,
    getPesosTotales: getPesosTotales,
    getPesosPorClic: getPesosPorClic,
    getClicsTotales: getClicsTotales,
    getPesosPorClicTotales: getPesosPorClicTotales,
    getTiempoJugado: getTiempoJugado,
    getPPS: getPPS,
    getGeneradores: getGeneradores,
    getCantidadCompra: getCantidadCompra,
    resetJuego: resetJuego,
    applyOfflineProgress: applyOfflineProgress,
    getUltimaVisibilidad: getUltimaVisibilidad,
    setUltimaVisibilidad: setUltimaVisibilidad,
    agregarPesos: agregarPesos,
    quitarPesos: quitarPesos,
    _actualizarEtapas: _actualizarEtapas,
    _restore: restore,
  };

})();
