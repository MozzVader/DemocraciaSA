// ============================================
// DEMOCRACIA S.A. V1 — Init
// Punto de entrada: orquesta el boot
// ============================================

// Auto-save al cerrar
window.addEventListener('beforeunload', function () {
  Save.save();
});

// Progreso offline + save al cambiar pestaña
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') {
    Save.save();
  } else if (document.visibilityState === 'visible') {
    // Calcular progreso offline
    var resultado = Game.applyOfflineProgress();
    if (resultado && resultado.segundos >= 60) {
      UI.showOfflineNotification(resultado.ganados, resultado.segundos);
    }
  }
});

// Boot cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  // 1. Inicializar UI (modals, tabs, ticker — SIN render generadores aún)
  UI.init();

  // 2. Inicializar billetes (antes del motor para que esté listo)
  Billetes.init();

  // 2.5. Inicializar logros (después de billetes, antes del motor)
  if (typeof Logros !== 'undefined' && Logros.init) {
    Logros.init();
  }

  // 2.6. Inicializar estadísticas (antes del motor para estar listo)
  if (typeof Estadisticas !== 'undefined' && Estadisticas.init) {
    Estadisticas.init();
  }

  // 3. Inicializar motor (clona generadores, carga save, arranca loop, setup click)
  Game.init();

  // 3.5. Inicializar operaciones (después del motor para acceder a generadores)
  if (typeof Operaciones !== 'undefined' && Operaciones.init) {
    Operaciones.init();
    // Conectar multiplicador de operaciones con el sistema de fórmulas
    Formulas.setMultFn(function(genId) { return Operaciones.getMultiplier(genId); });
    // Conectar bonus territorial Militante (Thousand Fingers)
    Formulas.setTerrBonusFn(function() { return Operaciones.getTerritorialBonus(); });
  }

  // 4. Inicializar calidad democrática (fluctuación random)
  if (typeof Calidad !== 'undefined' && Calidad.init) {
    Calidad.init();
  }

  // 4.5. Inicializar telegramas (después del motor para acceder a Game)
  if (typeof Telegramas !== 'undefined' && Telegramas.init) {
    Telegramas.init();
  }

  // 5. Render de generadores con datos reales del motor
  UI.renderGeneradores();

  // 6. Primer refresh de UI
  UI.actualizar();

  // 7. Render de estadísticas cuando se abre el modal
  setupStatsModalRefresh();
});

// ── Renderizar stats al abrir el modal ──────────────────────────
function setupStatsModalRefresh() {
  // Usar MutationObserver para detectar cuando se abre el modal
  var statsModal = document.getElementById('modal-stats');
  if (!statsModal) return;

  // Observar cambios de clase en el modal de stats
  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === 'class') {
        if (statsModal.classList.contains('open')) {
          if (typeof Estadisticas !== 'undefined' && Estadisticas.render) {
            Estadisticas.render();
          }
        }
      }
    }
  });

  observer.observe(statsModal, { attributes: true });
}
