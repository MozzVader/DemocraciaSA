// ============================================
// DEMOCRACIA S.A. V1 — Datos de Operaciones Click
// 19 operaciones que boostean el valor del click
// Se desbloquean según pesos por click (click power)
// Cada una suma +1% del PpS al valor del click
// ============================================

const OPERACIONES_CLICK_DATA = [
  // ── 1: Voluntario ──────────────────────────────────────────
  { id: 1001, nombre: 'Voluntario',               trigger: 1e3,      precio: 5e4,            bonusText: '+1% PpS al click', icono: 'click-patacon' },

  // ── 2: Afiliado ────────────────────────────────────────────
  { id: 1002, nombre: 'Afiliado',                 trigger: 1e5,      precio: 5e6,            bonusText: '+1% PpS al click', icono: 'click-moneda' },

  // ── 3: Puntero ─────────────────────────────────────────────
  { id: 1003, nombre: 'Puntero',                  trigger: 1e7,      precio: 5e8,            bonusText: '+1% PpS al click', icono: 'click-billete' },

  // ── 4: Dirigente ───────────────────────────────────────────
  { id: 1004, nombre: 'Dirigente',                trigger: 1e9,      precio: 5e10,           bonusText: '+1% PpS al click', icono: 'click-cheque' },

  // ── 5: Concejal ───────────────────────────────────────────
  { id: 1005, nombre: 'Concejal',                 trigger: 1e11,     precio: 5e12,           bonusText: '+1% PpS al click', icono: 'click-tarjeta' },

  // ── 6: Intendente ──────────────────────────────────────────
  { id: 1006, nombre: 'Intendente',               trigger: 1e13,     precio: 5e14,           bonusText: '+1% PpS al click', icono: 'click-bono' },

  // ── 7: Diputado ────────────────────────────────────────────
  { id: 1007, nombre: 'Diputado',                 trigger: 1e15,     precio: 5e16,           bonusText: '+1% PpS al click', icono: 'click-letra' },

  // ── 8: Senador ─────────────────────────────────────────────
  { id: 1008, nombre: 'Senador',                  trigger: 1e17,     precio: 5e18,           bonusText: '+1% PpS al click', icono: 'click-pagare' },

  // ── 9: Gobernador ──────────────────────────────────────────
  { id: 1009, nombre: 'Gobernador',               trigger: 1e19,     precio: 5e20,           bonusText: '+1% PpS al click', icono: 'click-dolar' },

  // ── 10: Ministro ──────────────────────────────────────────
  { id: 1010, nombre: 'Ministro',                 trigger: 1e21,     precio: 5e22,           bonusText: '+1% PpS al click', icono: 'click-dolarblue' },

  // ── 11: Vicepresidente ────────────────────────────────────
  { id: 1011, nombre: 'Vicepresidente',           trigger: 1e23,     precio: 5e24,           bonusText: '+1% PpS al click', icono: 'click-dolarmep' },

  // ── 12: Presidente ─────────────────────────────────────────
  { id: 1012, nombre: 'Presidente',               trigger: 1e25,     precio: 5e26,           bonusText: '+1% PpS al click', icono: 'click-swift' },

  // ── 13: Presidente Reelecto ────────────────────────────────
  { id: 1013, nombre: 'Presidente Reelecto',      trigger: 1e27,     precio: 5e28,           bonusText: '+1% PpS al click', icono: 'click-crypto' },

  // ── 14: Presidente Vitalicio ───────────────────────────────
  { id: 1014, nombre: 'Presidente Vitalicio',     trigger: 1e29,     precio: 5e29,           bonusText: '+1% PpS al click', icono: 'click-adr' },

  // ── 15: Caudillo Supremo ───────────────────────────────────
  { id: 1015, nombre: 'Caudillo Supremo',         trigger: 1e31,     precio: 5e32,           bonusText: '+1% PpS al click', icono: 'click-soberano' },

  // ── 16: Líder Espiritual ───────────────────────────────────
  { id: 1016, nombre: 'Líder Espiritual',         trigger: 1e33,     precio: 5e34,           bonusText: '+1% PpS al click', icono: 'click-fmi' },

  // ── 17: Dios de la Patria Grande ──────────────────────────
  { id: 1017, nombre: 'Dios de la Patria Grande', trigger: 1e35,     precio: 5e35,           bonusText: '+1% PpS al click', icono: 'click-sp500' },

  // ── 18: Emperador ──────────────────────────────────────────
  { id: 1018, nombre: 'Emperador',                trigger: 1e37,     precio: 5e38,           bonusText: '+1% PpS al click', icono: 'click-brent' },

  // ── 19: Amo del Universo ───────────────────────────────────
  { id: 1019, nombre: 'Amo del Universo',        trigger: 1e39,     precio: 5e40,           bonusText: '+1% PpS al click', icono: 'click-onza' },
];
