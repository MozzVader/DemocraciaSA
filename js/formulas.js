// ============================================
// DEMOCRACIA S.A. V1 — Fórmulas
// Cálculos de precio, PPS y lotes
// ============================================

const Formulas = (() => {

  // ── Multiplicador por operaciones (inyectado por Operaciones module) ──
  var _getMultFn = null;

  /**
   * Registra la función que devuelve el multiplicador de un generador.
   * Operaciones module debe llamar: Formulas.setMultFn(function(genId) { ... })
   * @param {function} fn - Recibe genId, devuelve number (ej: 2, 4, 8...)
   */
  function setMultFn(fn) {
    _getMultFn = fn;
  }

  /**
   * Devuelve el multiplicador actual de un generador.
   * Si no hay módulo de operaciones cargado, retorna 1.
   * @param {number} genId
   * @returns {number}
   */
  function getMult(genId) {
    return _getMultFn ? _getMultFn(genId) : 1;
  }

  // ── Bonus territorial para Militante (inyectado por Operaciones) ──
  var _getTerrBonusFn = null;

  /**
   * Registra la función que devuelve el bonus territorial.
   * @param {function} fn - No recibe args, devuelve number
   */
  function setTerrBonusFn(fn) {
    _getTerrBonusFn = fn;
  }

  /**
   * Devuelve el bonus territorial actual para Militante.
   * @returns {number}
   */
  function getTerrBonus() {
    return _getTerrBonusFn ? _getTerrBonusFn() : 0;
  }

  /**
   * Precio de la próxima unidad de un generador.
   * precio = precioBase * FACTOR_PRECIO ^ cantidad
   * @param {object} gen - Generador con precioBase y cantidad
   * @returns {number}
   */
  function precioSiguiente(gen) {
    return gen.precioBase * Math.pow(FACTOR_PRECIO, gen.cantidad);
  }

  /**
   * Precio de comprar `n` unidades de golpe (suma geométrica).
   * precioLote = precioProxima * (r^n - 1) / (r - 1)
   * @param {object} gen - Generador con precioBase y cantidad
   * @param {number} n - Cantidad a comprar
   * @returns {number}
   */
  function precioLote(gen, n) {
    if (n <= 0) return 0;
    if (n === 1) return precioSiguiente(gen);
    var r = FACTOR_PRECIO;
    var precioProxima = gen.precioBase * Math.pow(r, gen.cantidad);
    return precioProxima * (Math.pow(r, n) - 1) / (r - 1);
  }

  /**
   * Máximo de unidades que el jugador puede comprar con `dinero`.
   * Usa búsqueda binaria para no iterar uno por uno.
   * @param {object} gen - Generador
   * @param {number} dinero - Pesos disponibles
   * @returns {number}
   */
  function maxComprable(gen, dinero) {
    // Límite superior: nunca más de 9999 de una vez
    var lo = 0, hi = 9999, mid;
    while (lo < hi) {
      mid = Math.ceil((lo + hi + 1) / 2);
      if (precioLote(gen, mid) <= dinero) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    return lo;
  }

  /**
   * PPS total del juego (generadores base × multiplicador de operaciones).
   * Para Militante (id=0): suma el bonus territorial antes de multiplicar.
   * @param {Array} generadores - Array de generadores con .cantidad, .ppsBase, .id
   * @returns {number}
   */
  function ppsTotal(generadores) {
    var total = 0;
    var terrBonus = getTerrBonus();
    for (var i = 0; i < generadores.length; i++) {
      var g = generadores[i];
      var mult = getMult(g.id);
      if (g.id === 0) {
        // Militante: incluye bonus territorial
        total += (g.cantidad * g.ppsBase + terrBonus) * mult;
      } else {
        total += g.cantidad * g.ppsBase * mult;
      }
    }
    return total;
  }

  /**
   * PPS individual de un generador.
   * Para Militante (id=0): incluye bonus territorial.
   * @param {object} gen
   * @returns {number}
   */
  function ppsGenerador(gen) {
    var mult = getMult(gen.id);
    if (gen.id === 0) {
      return (gen.cantidad * gen.ppsBase + getTerrBonus()) * mult;
    }
    return gen.cantidad * gen.ppsBase * mult;
  }

  // ── API pública ───────────────────────────────────────────────
  return {
    precioSiguiente,
    precioLote,
    maxComprable,
    ppsTotal,
    ppsGenerador,
    setMultFn,
    getMult,
    setTerrBonusFn,
    getTerrBonus,
  };

})();
