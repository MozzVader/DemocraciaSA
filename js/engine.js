// ============================================
// DEMOCRACIA S.A. V1 — Motor del Juego
// Estado global, game loop, click, compra
// ============================================

var Game = (() => {

  // ── Config ────────────────────────────────────────────────────
  var TICK_MS = 100;            // 10 ticks por segundo
  var TICK_SEG = 0.1;           // segundos por tick
  var UI_REFRESH_TICKS = 10;    // actualizar UI cada 1 segundo
  var AUTO_SAVE_MS = 30000;     // guardar cada 30s

  // ── Estado ────────────────────────────────────────────────────
  var pesos = 0;
  var pesosTotales = 0;         // acumulados (para prestige futuro)
  var pesosPorClic = 1;         // click power base
  var clicsTotales = 0;
  var tiempoJugado = 0;         // segundos
  var tickCount = 0;
  var ultimoSave = 0;
  var loopId = null;

  // Generadores: clon de GENERADORES con .cantidad agregada
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
        revelado: false,    // true cuando pesos >= precioBase (o ya compró)
      };
    });

    // El primero siempre es visible
    generadores[0].revelado = true;

    // Cargar save si existe
    Save.load();

    // Arrancar loop
    ultimoSave = Date.now();
    loopId = setInterval(gameTick, TICK_MS);

    // Setup de eventos
    setupEvents();
  }

  // ── Game Loop ─────────────────────────────────────────────────
  function gameTick() {
    // 1. Calcular PPS
    var pps = Formulas.ppsTotal(generadores);
    var delta = pps * TICK_SEG;

    // 2. Generar pesos
    pesos += delta;
    pesosTotales += delta;

    // 3. Tiempo jugado
    tiempoJugado += TICK_SEG;

    // 4. Tick counter
    tickCount++;

    // 5. Actualizar UI cada segundo
    if (tickCount % UI_REFRESH_TICKS === 0) {
      UI.actualizar();
    }

    // 6. Auto-save
    if (Date.now() - ultimoSave >= AUTO_SAVE_MS) {
      Save.save();
      ultimoSave = Date.now();
    }
  }

  // ── Click Handler ─────────────────────────────────────────────
  function click(pesosGanados) {
    var ganancia = pesosGanados || pesosPorClic;
    pesos += ganancia;
    pesosTotales += ganancia;
    clicsTotales++;
    actualizarRevelados();
    UI.actualizar();
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
    gen.revelado = true;

    actualizarRevelados();
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

  // ── Gate de visibilidad ───────────────────────────────────────
  // Un generador se revela cuando pesos >= su precioBase
  function actualizarRevelados() {
    for (var i = 0; i < generadores.length; i++) {
      if (!generadores[i].revelado && pesos >= generadores[i].precioBase) {
        generadores[i].revelado = true;
      }
    }
  }

  // ── Selector de cantidad ──────────────────────────────────────
  function setCantidad(qty) {
    cantidadCompra = qty;
    UI.actualizar(); // refresca precios mostrados
  }

  // ── Getters ───────────────────────────────────────────────────
  function getPesos() { return pesos; }
  function getPesosTotales() { return pesosTotales; }
  function getPesosPorClic() { return pesosPorClic; }
  function getClicsTotales() { return clicsTotales; }
  function getTiempoJugado() { return tiempoJugado; }
  function getGeneradores() { return generadores; }
  function getCantidadCompra() { return cantidadCompra; }

  // ── Restore desde save ────────────────────────────────────────
  function restore(data) {
    pesos = data.pesos || 0;
    pesosTotales = data.pesosTotales || 0;
    clicsTotales = data.clicsTotales || 0;
    tiempoJugado = data.tiempoJugado || 0;

    if (data.generadores) {
      for (var i = 0; i < data.generadores.length; i++) {
        var sg = data.generadores[i];
        for (var j = 0; j < generadores.length; j++) {
          if (generadores[j].id === sg.id) {
            generadores[j].cantidad = sg.cantidad || 0;
            if (generadores[j].cantidad > 0) {
              generadores[j].revelado = true;
            }
            break;
          }
        }
      }
    }

    actualizarRevelados();
  }

  // ── Reset del juego ──────────────────────────────────────────
  function resetJuego() {
    pesos = 0;
    pesosTotales = 0;
    clicsTotales = 0;
    tiempoJugado = 0;
    tickCount = 0;
    cantidadCompra = 1;

    for (var i = 0; i < generadores.length; i++) {
      generadores[i].cantidad = 0;
      generadores[i].revelado = (i === 0); // solo el primero visible
    }

    // Borrar save
    Save.reset();

    // Re-render y actualizar
    UI.renderGeneradores();
    UI.actualizar();
  }

  // ── Setup eventos ─────────────────────────────────────────────
  function setupEvents() {
    // Click en el botón principal
    var clickerBtn = document.querySelector('.clicker-btn');
    if (clickerBtn) {
      clickerBtn.addEventListener('click', function () {
        click();
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
    getPesos: getPesos,
    getPesosTotales: getPesosTotales,
    getPesosPorClic: getPesosPorClic,
    getClicsTotales: getClicsTotales,
    getTiempoJugado: getTiempoJugado,
    getGeneradores: getGeneradores,
    getCantidadCompra: getCantidadCompra,
    resetJuego: resetJuego,
    _restore: restore,
  };

})();
