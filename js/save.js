// ============================================
// DEMOCRACIA S.A. V1 — Save / Load
// localStorage con versionado
// ============================================

var Save = (() => {

  var SAVE_KEY = 'democracia_sa_save';
  var VERSION = 4;
  var dataInicioTimestamp = null; // timestamp de primera sesión

  function getInicioTimestamp() {
    if (!dataInicioTimestamp) {
      // Si no hay timestamp, usar ahora (primera vez)
      dataInicioTimestamp = Date.now();
    }
    return dataInicioTimestamp;
  }

  function setInicioTimestamp(ts) {
    dataInicioTimestamp = ts;
  }

  function getBilletesState() {
    var panel = document.getElementById('panel-center');
    return panel ? !panel.classList.contains('billetes-off') : true;
  }

  function setBilletesState(enabled) {
    var panel = document.getElementById('panel-center');
    if (panel) {
      panel.classList.toggle('billetes-off', !enabled);
    }
  }

  function save() {
    try {
      var generadores = Game.getGeneradores();

      var data = {
        version: VERSION,
        timestamp: Date.now(),
        pesos: Game.getPesos(),
        pesosTotales: Game.getPesosTotales(),
        clicsTotales: Game.getClicsTotales(),
        pesosPorClicTotales: Game.getPesosPorClicTotales(),
        tiempoJugado: Game.getTiempoJugado(),
        notacion: Formato.getNotacion(),
        billetes: getBilletesState(),
        logros: (typeof Logros !== 'undefined' && Logros.getDesbloqueados) ? Logros.getDesbloqueados() : [],
        operaciones: (typeof Operaciones !== 'undefined' && Operaciones.getCompradas) ? Operaciones.getCompradas() : [],
        inicioTimestamp: dataInicioTimestamp,
        generadores: generadores.map(function (g) {
          return {
            id: g.id,
            cantidad: g.cantidad,
          };
        }),
      };

      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error al guardar:', e);
    }
  }

  function load() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;

      var data = JSON.parse(raw);
      if (!data || !data.version) return false;

      var generadores = Game.getGeneradores();

      // Restaurar valores
      // Accedemos al scope de Game mediante sus getters (ya inicializado)
      // Como load() se llama desde Game.init() después de clonar generadores,
      // necesitamos asignar directamente
      if (typeof Game._restore === 'function') {
        Game._restore(data);
      }

      // Restaurar notación si existe
      if (data.notacion) {
        Formato.setNotacion(data.notacion);
      }

      // Restaurar estado de billetes (default: activados)
      if (data.billetes === false) {
        setBilletesState(false);
      }

      // Restaurar logros desbloqueados
      if (data.logros && typeof Logros !== 'undefined' && Logros.restore) {
        Logros.restore(data.logros);
      }

      // Restaurar operaciones compradas (con migración v3→v4)
      if (data.operaciones && typeof Operaciones !== 'undefined' && Operaciones.restore) {
        var ops = data.operaciones;
        if (data.version < 4) {
          ops = migrateOpsV3toV4(ops);
        }
        Operaciones.restore(ops);
      }

      // Restaurar timestamp de inicio
      if (data.inicioTimestamp) {
        Save.setInicioTimestamp(data.inicioTimestamp);
      }

      return true;
    } catch (e) {
      console.error('Error al cargar save:', e);
      return false;
    }
  }

  function reset() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      // ignore
    }
  }

  // ── Migración de ops v3 → v4 ───────────────────────────────
  // v3: Militante ops ids 1-10 (×2 simples), Puntero+ ids 11-190
  // v4: Militante ops ids 1-15 (Thousand Fingers), Puntero+ ids 16-195
  // Acción: eliminar viejas ops Militante (1-10), renumerar resto (+5)
  function migrateOpsV3toV4(ops) {
    var migrated = [];
    for (var i = 0; i < ops.length; i++) {
      var id = ops[i];
      if (id >= 1 && id <= 10) {
        // Vieja op Militante: eliminar (ya no existe)
        continue;
      }
      if (id >= 11 && id <= 190) {
        // Op gen no-militante: renumerar +5
        migrated.push(id + 5);
      } else {
        // Click ops (1000+): sin cambios
        migrated.push(id);
      }
    }
    return migrated;
  }

  return {
    save: save,
    load: load,
    reset: reset,
    getInicioTimestamp: getInicioTimestamp,
    setInicioTimestamp: setInicioTimestamp,
  };

})();
