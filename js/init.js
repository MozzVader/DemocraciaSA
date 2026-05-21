// ============================================
// DEMOCRACIA S.A. V1 — Init
// Punto de entrada: orquesta el boot
// ============================================

// Auto-save al cerrar
window.addEventListener('beforeunload', function () {
  Save.save();
});
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') {
    Save.save();
  }
});

// Boot cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  // 1. Inicializar UI (modals, tabs, ticker, render generadores)
  UI.init();

  // 2. Inicializar motor (clona generadores, carga save, arranca loop, setup click)
  Game.init();

  // 3. Primer render de UI con datos cargados
  UI.actualizar();
});
