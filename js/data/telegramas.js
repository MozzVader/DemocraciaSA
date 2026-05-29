// ============================================
// DEMOCRACIA S.A. V1 — Datos de Telegramas
// 45 telegramas: 25 buenos, 5 malos, 15 meta
// Pesos de spawn: bueno=10, malo=10, meta=1
// Efectos aplicados al aceptar; rechazar = sin efecto
// Telegramas con reqGenId: aparecen siempre pero
//   no dan efecto si el jugador no tiene el generador
// ============================================

// genId reference:
//  0 Militante,  1 Puntero,        2 Unidad Básica,
//  3 Sindicato,   4 Municipio,      5 Ministerio,
//  6 Banco Público, 7 Operador Político, 8 Grupo Económico,
//  9 Exportadores, 10 Cueva Financiera, 11 Fondo Fiduciario,
// 12 Banco Central, 13 Organismo Intl., 14 Socio Estratégico,
// 15 Mercado Global, 16 Fondo Buitre, 17 El FMI, 18 El Estado

const TELEGRAMAS_DATA = [

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  BUENOS (25) — peso 10 c/u                                 ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── 1: x1816 click / 7s (9 de Julio 1816) ──────────────────
  { id: 1,  texto: 'El Papa bendijo tu campaña. Tu popularidad sube un momentito.',                                         tipo: 'bueno', peso: 10, efecto: { tipo: 'clickMult', mult: 1816, duracion: 7 } },
  { id: 15, texto: 'Un Estudio de Impacto Bursátil muestra que nadie confía en tu oposición. Bueno para vos.',               tipo: 'bueno', peso: 10, efecto: { tipo: 'clickMult', mult: 1816, duracion: 7 } },
  { id: 19, texto: 'La Corte Suprema falló a tu favor por unanimidad. Qué raro.',                                            tipo: 'bueno', peso: 10, efecto: { tipo: 'clickMult', mult: 1816, duracion: 7 } },

  // ── 2: PpS x25 / 5s (25 de Mayo) ────────────────────────────
  { id: 2,  texto: 'Un vecino del barrio te regaló una torta. El moral del equipo mejora.',                                   tipo: 'bueno', peso: 10, efecto: { tipo: 'ppsMult', mult: 25, duracion: 5 } },
  { id: 8,  texto: 'La oposición se peleó sola y la ley tiene media sanción en el Congreso.',                               tipo: 'bueno', peso: 10, efecto: { tipo: 'ppsMult', mult: 25, duracion: 5 } },
  { id: 9,  texto: 'El Congreso aprobó tu ley en solo 15 minutos. Récord histórico.',                                        tipo: 'bueno', peso: 10, efecto: { tipo: 'ppsMult', mult: 25, duracion: 5 } },

  // ── 3: Instant x10 PpS de generador (req genId) ─────────────
  { id: 3,  texto: 'Se cayó el sistema del ANSES y por error te depositaron el sueldo de todos.',                             tipo: 'bueno', peso: 10, efecto: { tipo: 'instantGenPPS', genId: 4, mult: 10 },  reqGenId: 4 },
  { id: 6,  texto: 'El FMI pidió una extensión del plazo. Respiremos por ahora.',                                            tipo: 'bueno', peso: 10, efecto: { tipo: 'instantGenPPS', genId: 17, mult: 10 }, reqGenId: 17 },
  { id: 7,  texto: 'Un inversor anónimo donó a la campaña. No preguntes de dónde sale.',                                     tipo: 'bueno', peso: 10, efecto: { tipo: 'instantGenPPS', genId: 7, mult: 10 },  reqGenId: 7 },
  { id: 10, texto: 'Un burócrata descubrió dinero olvidado en un cajón. Es mucho.',                                           tipo: 'bueno', peso: 10, efecto: { tipo: 'instantGenPPS', genId: 12, mult: 10 }, reqGenId: 12 },
  { id: 13, texto: 'Se bloqueó la cuenta de un crítico importante en Twitter. Coincidencias.',                                 tipo: 'bueno', peso: 10, efecto: { tipo: 'instantGenPPS', genId: 7, mult: 10 },  reqGenId: 7 },
  { id: 16, texto: 'El Banco Central "encontró" reservas que no estaban en el balance.',                                      tipo: 'bueno', peso: 10, efecto: { tipo: 'instantGenPPS', genId: 12, mult: 10 }, reqGenId: 12 },
  { id: 17, texto: 'Un sindicato aliado anunció un paro de 48 horas... pero a tu favor.',                                    tipo: 'bueno', peso: 10, efecto: { tipo: 'instantGenPPS', genId: 3, mult: 10 },  reqGenId: 3 },

  // ── 4: +10% pesos actuales (instantáneo) ─────────────────────
  { id: 4,  texto: 'Tu último discurso se hizo viral en TikTok. Los jóvenes están contigo.',                                 tipo: 'bueno', peso: 10, efecto: { tipo: 'instantPesosPercent', percent: 10 } },
  { id: 11, texto: 'El programa de TV más visto de Argentina te mencionó. Publicidad gratis.',                               tipo: 'bueno', peso: 10, efecto: { tipo: 'instantPesosPercent', percent: 10 } },
  { id: 14, texto: 'Un funcionario renunció y dejó la oficina ordenada. Dudo que sea real.',                                  tipo: 'bueno', peso: 10, efecto: { tipo: 'instantPesosPercent', percent: 10 } },
  { id: 18, texto: 'Un argentino en el exterior mandó remesas. Muchas remesas.',                                              tipo: 'bueno', peso: 10, efecto: { tipo: 'instantPesosPercent', percent: 10 } },
  { id: 21, texto: 'Un influencer con millones de seguidores te dedicó un post.',                                            tipo: 'bueno', peso: 10, efecto: { tipo: 'instantPesosPercent', percent: 10 } },
  { id: 25, texto: 'Un auditor externo "no encontró irregularidades". Contrataste al auditor.',                               tipo: 'bueno', peso: 10, efecto: { tipo: 'instantPesosPercent', percent: 10 } },

  // ── 5: +1 generador (req genId) ─────────────────────────────
  { id: 5,  texto: 'Un medio internacional te entrevistó. La imagen exterior mejora.',                                        tipo: 'bueno', peso: 10, efecto: { tipo: 'addGenerator', genId: 15, cantidad: 1 }, reqGenId: 15 },
  { id: 12, texto: 'Un empresario ofreció construir una escuela "de forma desinteresada".',                                    tipo: 'bueno', peso: 10, efecto: { tipo: 'addGenerator', genId: 2, cantidad: 1 },  reqGenId: 2 },
  { id: 20, texto: 'Un "errorsito" en el presupuesto asignó plata extra a tu ministerio.',                                    tipo: 'bueno', peso: 10, efecto: { tipo: 'addGenerator', genId: 5, cantidad: 1 },  reqGenId: 5 },
  { id: 23, texto: 'Un barco cargado de soja llegó a puerto sin que nadie lo esperara.',                                      tipo: 'bueno', peso: 10, efecto: { tipo: 'addGenerator', genId: 9, cantidad: 1 },  reqGenId: 9 },
  { id: 24, texto: 'El intendente aliado inauguró 3 obras en un día. Al menos en el papel.',                                   tipo: 'bueno', peso: 10, efecto: { tipo: 'addGenerator', genId: 4, cantidad: 10 }, reqGenId: 4 },

  // ── 6: PpS x2 / 5 min ───────────────────────────────────────
  { id: 22, texto: 'Tu imagen en las encuestas subió 5 puntos. Probablemente sea error de medición.',                           tipo: 'bueno', peso: 10, efecto: { tipo: 'ppsMult', mult: 2, duracion: 300 } },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  MALOS (5) — peso 10 c/u                                  ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── PpS -50% ────────────────────────────────────────────────
  { id: 26, texto: 'Un audio filtrado muestra a un aliado diciendo cosas feas sobre vos.',                                    tipo: 'malo',  peso: 10, efecto: { tipo: 'ppsMult', mult: 0.5, duracion: 120 } },
  { id: 30, texto: 'Un ministro renunció en pleno programa de televisión. No es un buen look.',                                tipo: 'malo',  peso: 10, efecto: { tipo: 'ppsMult', mult: 0.5, duracion: 120 } },

  // ── PpS -50% / 5 min (el más cruel) ─────────────────────────
  { id: 27, texto: 'La inflación mensual fue peor de lo esperado. Otra vez.',                                                  tipo: 'malo',  peso: 10, efecto: { tipo: 'ppsMult', mult: 0.5, duracion: 300 } },

  // ── -2% pesos acumulados ────────────────────────────────────
  { id: 28, texto: 'NOLSALP. Un periodista de investigación publicó algo incómodo. Nada grave... por ahora.',                tipo: 'malo',  peso: 10, efecto: { tipo: 'removePesosAcumPercent', percent: 2 } },

  // ── -10% pesos actuales ──────────────────────────────────────
  { id: 29, texto: 'Se te cayó el micrófono en vivo y dijiste algo que no tenías que decir.',                                 tipo: 'malo',  peso: 10, efecto: { tipo: 'removePesosPercent', percent: 10 } },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  META (15) — peso 1 c/u (≈4.8% del total)                 ║
  // ║  5 dan logro, 10 no hacen nada                            ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Con logro ──────────────────────────────────────────────────
  { id: 31, texto: '"No la ven"',                                                                                               tipo: 'meta',   peso: 1,  efecto: { tipo: 'achievement', logroId: 121 } },
  { id: 32, texto: '"Definitivamente, es cine"',                                                                                 tipo: 'meta',   peso: 1,  efecto: { tipo: 'achievement', logroId: 122 } },
  { id: 40, texto: '"Todo marcha acorde al Plan"',                                                                             tipo: 'meta',   peso: 1,  efecto: { tipo: 'achievement', logroId: 123 } },
  { id: 43, texto: '"Tenés que cerrar el estadio..."',                                                                         tipo: 'meta',   peso: 1,  efecto: { tipo: 'achievement', logroId: 124 } },
  { id: 45, texto: '"ANULO MUFA."',                                                                                             tipo: 'meta',   peso: 1,  efecto: { tipo: 'achievement', logroId: 125 } },

  // ── Sin efecto (puro flavor) ─────────────────────────────────
  { id: 33, texto: '"El jugador está trabajando más que varios municipios."',                                                 tipo: 'meta',   peso: 1,  efecto: null },
  { id: 34, texto: '"Los números siguen creciendo aunque nadie entiende por qué."',                                          tipo: 'meta',   peso: 1,  efecto: null },
  { id: 35, texto: '"El Mercado se regula solo"',                                                                               tipo: 'meta',   peso: 1,  efecto: null },
  { id: 36, texto: '"Es un montón"',                                                                                            tipo: 'meta',   peso: 1,  efecto: null },
  { id: 37, texto: '"¿Quién autorizó esta cantidad de ministerios?"',                                                         tipo: 'meta',   peso: 1,  efecto: null },
  { id: 38, texto: '"El mejor país del mundo"',                                                                                tipo: 'meta',   peso: 1,  efecto: null },
  { id: 39, texto: '"Te juro que este número parecía razonable cuando lo escribí."',                                           tipo: 'meta',   peso: 1,  efecto: null },
  { id: 41, texto: '"¿Te acordás del \'de\'? A veces falta, a veces sobra. Igual que el presupuesto nacional."',              tipo: 'meta',   peso: 1,  efecto: null },
  { id: 42, texto: '"Este telegrama fue aprobado por la Ley de Medios. No, no sabemos cuál."',                               tipo: 'meta',   peso: 1,  efecto: null },
  { id: 44, texto: '"Muchaaaaaaaachoooooooos..."',                                                                             tipo: 'meta',   peso: 1,  efecto: null },
];
