/**
 * Democracia S.A. — Formato de números y tiempo
 *
 * Soporta 3 notaciones seleccionables por el jugador:
 *   - "corta":  K, M, B, T, Qa, Qi, Sx, Sp, Oc, No, Dc …
 *   - "larga":  mil, millón, mil millones, billón, mil billones …
 *   - "cientifica": 1.5e3, 2.3e9 …
 */

const Formato = (() => {

  // ── Notación corta (estilo incremental estándar) ──────────────
  const cortaSufijos = [
    { valor: 1e63,  sufijo: 'Vg'   },   // Vigintillion
    { valor: 1e60,  sufijo: 'Nd'   },   // Novemdecillion
    { valor: 1e57,  sufijo: 'Od'   },   // Octodecillion
    { valor: 1e54,  sufijo: 'Spd'  },   // Septendecillion
    { valor: 1e51,  sufijo: 'Sxd'  },   // Sexdecillion
    { valor: 1e48,  sufijo: 'Qid'  },   // Quindecillion
    { valor: 1e45,  sufijo: 'Qad'  },   // Quattuordecillion
    { valor: 1e42,  sufijo: 'Td'   },   // Tredecillion
    { valor: 1e39,  sufijo: 'Dd'   },   // Duodecillion
    { valor: 1e36,  sufijo: 'Ud'   },   // Undecillion
    { valor: 1e33,  sufijo: 'Dc'   },   // Decillion
    { valor: 1e30,  sufijo: 'No'   },   // Nonillion
    { valor: 1e27,  sufijo: 'Oc'   },   // Octillion
    { valor: 1e24,  sufijo: 'Sp'   },   // Septillion
    { valor: 1e21,  sufijo: 'Sx'   },   // Sextillion
    { valor: 1e18,  sufijo: 'Qi'   },   // Quintillion
    { valor: 1e15,  sufijo: 'Qa'   },   // Quadrillion
    { valor: 1e12,  sufijo: 'T'    },   // Trillion
    { valor: 1e9,   sufijo: 'B'    },   // Billion
    { valor: 1e6,   sufijo: 'M'    },   // Million
    { valor: 1e3,   sufijo: 'K'    },   // Thousand
  ];

  // ── Notación larga (español, escala corta argentina) ──────────
  // En Argentina "billón" = mil millones (escala corta),
  // pero usamos el español formal con "mil millones" para 10^9.
  const largaSufijos = [
    { valor: 1e63,  singular: 'vigintillón',       plural: 'vigintillones'       },
    { valor: 1e60,  singular: 'novemdecillón',     plural: 'novemdecillones'     },
    { valor: 1e57,  singular: 'octodecillón',      plural: 'octodecillones'      },
    { valor: 1e54,  singular: 'septendecillón',    plural: 'septendecillones'    },
    { valor: 1e51,  singular: 'sexdecillón',       plural: 'sexdecillones'       },
    { valor: 1e48,  singular: 'quindecillón',      plural: 'quindecillones'      },
    { valor: 1e45,  singular: 'quattuordecillón',  plural: 'quattuordecillones'  },
    { valor: 1e42,  singular: 'tredecillón',       plural: 'tredecillones'       },
    { valor: 1e39,  singular: 'duodecillón',       plural: 'duodecillones'       },
    { valor: 1e36,  singular: 'undecillón',        plural: 'undecillones'        },
    { valor: 1e33,  singular: 'decillón',          plural: 'decillones'          },
    { valor: 1e30,  singular: 'nonillón',          plural: 'nonillones'          },
    { valor: 1e27,  singular: 'octillón',          plural: 'octillones'          },
    { valor: 1e24,  singular: 'septillón',         plural: 'septillones'         },
    { valor: 1e21,  singular: 'sextillón',         plural: 'sextillones'         },
    { valor: 1e18,  singular: 'quintillón',        plural: 'quintillones'        },
    { valor: 1e15,  singular: 'cuatrillón',        plural: 'cuatrillones'        },
    { valor: 1e12,  singular: 'billón',            plural: 'billones'            },
    { valor: 1e9,   singular: 'mil millones',      plural: 'mil millones'        },
    { valor: 1e6,   singular: 'millón',            plural: 'millones'            },
    { valor: 1e3,   singular: 'mil',               plural: 'mil'                 },
  ];

  // ── Notación preferida del jugador ────────────────────────────
  let _notacion = 'corta'; // 'corta' | 'larga' | 'cientifica'

  /**
   * Establecer la notación preferida.
   * @param {'corta'|'larga'|'cientifica'} tipo
   */
  function setNotacion(tipo) {
    if (['corta', 'larga', 'cientifica'].includes(tipo)) {
      _notacion = tipo;
    }
  }

  /** Obtener la notación actual */
  function getNotacion() {
    return _notacion;
  }

  /**
   * Formatear un número según la notación seleccionada.
   * @param {number} n
   * @param {number} [decimales] - Cantidad de decimales (default auto: 1 para grande, 0 para chico)
   * @returns {string}
   */
  function numero(n, decimales) {
    if (typeof n !== 'number' || isNaN(n)) return '0';
    if (n < 0) return '-' + numero(-n, decimales);

    // Menor a mil: sin sufijo
    if (n < 1000) {
      return decimales != null
        ? n.toFixed(decimales)
        : Math.floor(n).toString();
    }

    switch (_notacion) {

      case 'corta':   return _corta(n, decimales);
      case 'larga':   return _larga(n, decimales);
      case 'cientifica': return _cientifica(n, decimales);

      default:        return _corta(n, decimales);
    }
  }

  // ── Implementaciones privadas ─────────────────────────────────

  function _corta(n, decimales) {
    for (const s of cortaSufijos) {
      if (n < s.valor) continue;  // saltar sufijos demasiado grandes
      const cantidad = n / s.valor;
      const d = decimales != null ? decimales : 1;
      return cantidad.toFixed(d) + ' ' + s.sufijo;
    }
    return n.toExponential(2);
  }

  function _larga(n, decimales) {
    for (const s of largaSufijos) {
      if (n < s.valor) continue;  // saltar sufijos demasiado grandes
      const cantidad = n / s.valor;
      const d = decimales != null ? decimales : 1;
      const cantidadEntera = Math.floor(cantidad);
      const sufijo = (cantidadEntera === 1) ? s.singular : s.plural;
      return cantidad.toFixed(d) + ' ' + sufijo;
    }
    return n.toExponential(2);
  }

  function _cientifica(n, decimales) {
    const d = decimales != null ? decimales : 2;
    if (n >= 1e6) return n.toExponential(d);
    // Para números menores, usar formato normal
    return n.toLocaleString('es-AR', {
      maximumFractionDigits: d,
      minimumFractionDigits: 0
    });
  }

  /**
   * Formatear una cantidad de segundos a texto legible.
   * @param {number} segundos
   * @returns {string}
   */
  function tiempo(segundos) {
    if (typeof segundos !== 'number' || isNaN(segundos) || segundos < 0) return '0s';

    if (segundos < 60) return Math.floor(segundos) + 's';

    if (segundos < 3600) {
      const m = Math.floor(segundos / 60);
      const s = Math.floor(segundos % 60);
      return s > 0 ? m + 'm ' + s + 's' : m + 'm';
    }

    if (segundos < 86400) {
      const h = Math.floor(segundos / 3600);
      const m = Math.floor((segundos % 3600) / 60);
      return m > 0 ? h + 'h ' + m + 'm' : h + 'h';
    }

    const dias = Math.floor(segundos / 86400);
    const h = Math.floor((segundos % 86400) / 3600);
    return h > 0 ? dias + 'd ' + h + 'h' : dias + 'd';
  }

  // ── API pública ───────────────────────────────────────────────
  return {
    setNotacion,
    getNotacion,
    numero,
    tiempo,
  };

})();
