// ============================================
// DEMOCRACIA S.A. V1 — Fórmulas
// Cálculos de precio, PPS y lotes
// ============================================

const Formulas = (() => {

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
   * PPS total del juego con multiplicadores de operaciones.
   * @param {Array} generadores - Array de generadores con .cantidad y .ppsBase
   * @returns {number}
   */
  function ppsTotal(generadores) {
    var total = 0;
    for (var i = 0; i < generadores.length; i++) {
      var base = generadores[i].cantidad * generadores[i].ppsBase;
      // Aplicar multiplicador de operaciones si existe
      var mult = 1;
      if (typeof Operaciones !== 'undefined' && Operaciones.getMultiplier) {
        mult = Operaciones.getMultiplier(generadores[i].id);
      }
      total += base * mult;
    }
    return total;
  }

  /**
   * PPS individual de un generador (cantidad * ppsBase).
   * @param {object} gen
   * @returns {number}
   */
  function ppsGenerador(gen) {
    return gen.cantidad * gen.ppsBase;
  }

  // ── API pública ───────────────────────────────────────────────
  return {
    precioSiguiente,
    precioLote,
    maxComprable,
    ppsTotal,
    ppsGenerador,
  };

})();
