// ============================================
// DEMOCRACIA S.A. V1 — Save / Load
// localStorage con versionado
// ============================================

var Save = (() => {

  var SAVE_KEY = 'democracia_sa_save';
  var VERSION = 2;

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
        tiempoJugado: Game.getTiempoJugado(),
        notacion: Formato.getNotacion(),
        billetes: getBilletesState(),
        logros: (typeof Logros !== 'undefined' && Logros.getDesbloqueados) ? Logros.getDesbloqueados() : [],
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

  return {
    save: save,
    load: load,
    reset: reset,
  };

})();
