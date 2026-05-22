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

  // 3. Inicializar motor (clona generadores, carga save, arranca loop, setup click)
  Game.init();

  // 4. Inicializar calidad democrática (fluctuación random)
  if (typeof Calidad !== 'undefined' && Calidad.init) {
    Calidad.init();
  }

  // 5. Render de generadores con datos reales del motor
  UI.renderGeneradores();

  // 6. Primer refresh de UI
  UI.actualizar();
});
