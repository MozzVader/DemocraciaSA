import type { GamePhase } from './types';

interface NewsItem {
  text: string;
  phase: GamePhase;
}

const HEADLINES: NewsItem[] = [
  // === MUNICIPAL ===
  { text: '"Concejal sorprendido contando sobres en el baño del restaurante. Dice que clasificaba correspondencia."', phase: 'municipal' },
  { text: '"El intendente firma ordenanza que beneficia a amigos personales. Nombra 47 amigos."', phase: 'municipal' },
  { text: '"Think Tank municipal revela que el 100% de los encuestados apoya al concejal que los encuestó."', phase: 'municipal' },
  { text: '"Funcionario invierte todo su sueldo en cocteles de gala. Su abogado dice que es gasto representativo."', phase: 'municipal' },
  { text: '"La oposición denuncia irregularidades. Nadie los escucha porque estaban en un coctel de gala."', phase: 'municipal' },
  { text: '"Periodista descubre que el presupuesto municipal se gasta en asesoramientos. Son 12 sobrinos."', phase: 'municipal' },
  { text: '"Empresa fantasma dona a campaña electoral. Su director es el portero del concejo."', phase: 'municipal' },
  { text: '"Auditoría revela que el 80% del presupuesto se fue en viáticos de investigación. A Cancún."', phase: 'municipal' },
  { text: '"El defensor del pueblo resultó ser sobrino del alcalde. Coincidencias del destino."', phase: 'municipal' },
  { text: '"Transparencia: el municipio publica sus gastos. Todos los números están tachados."', phase: 'municipal' },

  // Noticias argentinas municipales
  { text: '"El cepo al dólar fue un éxito: los que ya tenían dólares no tuvieron problemas."', phase: 'municipal' },
  { text: '"Polémica por los viajes al exterior: el funcionario aseguró que era por trabajo y los esquíes eran incidentales."', phase: 'municipal' },
  { text: '"El Congreso debate si declarar feriado nacional el día después de cada feriado"', phase: 'municipal' },
  { text: '"Panaderos advierten: el pan ahora se venderá por suscripción mensual"', phase: 'municipal' },
  { text: '"Revelan que el colectivo llega tarde para fomentar la paciencia social"', phase: 'municipal' },
  { text: '"Gobierno lanza programa \'Precios Cuidados Emocionales\' para evitar crisis existenciales en el súper"', phase: 'municipal' },
  { text: '"Sindicato convoca paro contra medida que todavía no fue anunciada"', phase: 'municipal' },
  { text: '"El funcionario renunció por motivos personales. Mañana asume en otro cargo."', phase: 'municipal' },

  // === PROVINCIAL ===
  { text: '"Senador pide investigar interferencia extranjera en las elecciones. Su financista es suizo."', phase: 'provincial' },
  { text: '"Think Tank revela que bajar impuestos a los ricos genera empleo. Sorpresa: el estudio lo pagó un rico."', phase: 'provincial' },
  { text: '"El gobernador anuncia plan de transparencia. No incluye su propio financiamiento."', phase: 'provincial' },
  { text: '"Consultora política cobra $5M por manejo de crisis. La crisis es que los pagan demasiado."', phase: 'provincial' },
  { text: '"Medio de comunicación cambia su línea editorial. El nuevo dueño es un amigo de la democracia."', phase: 'provincial' },
  { text: '"Funcionario renuncia para trabajar en el sector privado. Al día siguiente ingresa a empresa que regulaba."', phase: 'provincial' },
  { text: '"La Corte falla 5-4 a favor del financiador del juez que escribió la opinión de la mayoría."', phase: 'provincial' },
  { text: '"Diputado aprueba ley de ética pública. Él es el primero en violarla."', phase: 'provincial' },
  { text: '"Encuesta: el 73% de los ciudadanos confía en las instituciones. La encuesta se pagó con dinero público."', phase: 'provincial' },
  { text: '"Lobby cobra $200/hora por reuniones con legisladores. La reunión dura 5 minutos."', phase: 'provincial' },

  // Noticias argentinas provinciales
  { text: '"Nueva auditoría revela que nadie sabe dónde está el dinero, pero todos están de acuerdo en que se gastó bien."', phase: 'provincial' },
  { text: '"Dólar blue another day: la brecha ya es más ancha que la 9 de Julio."', phase: 'provincial' },
  { text: '"La casta se renueva: cambian las caras, el sueldo y el auto, pero no el sistema."', phase: 'provincial' },
  { text: '"Se aprobó la ley de medios: ahora los amigos tienen más canales."', phase: 'provincial' },
  { text: '"Opinología: dos economistas, tres opiniones, cero soluciones."', phase: 'provincial' },
  { text: '"El debate presidencial duró dos horas. Los argentinos siguen esperando desde 1983."', phase: 'provincial' },
  { text: '"Inflación mensual: el gobierno prefiere hablar de inflación interanual, suena más estable."', phase: 'provincial' },
  { text: '"Nuevo aumento de tarifas: la promesa era que iba a bajar, pero quedó en que sube menos que antes."', phase: 'provincial' },
  { text: '"La oposición presentó un proyecto. El oficialismo lo aplaudió. Nadie lo leyó."', phase: 'provincial' },
  { text: '"Encuesta: el 87% de los argentinos está cansado de las encuestas."', phase: 'provincial' },
  { text: '"El clima económico será inestable con probabilidad de aumentos aislados"', phase: 'provincial' },
  { text: '"Expertos señalan que la oposición ya tiene plan B, C y D, falta el A"', phase: 'provincial' },
  { text: '"Expertos recomiendan respirar hondo antes de mirar el resumen de la tarjeta"', phase: 'provincial' },
  { text: '"Lanzan curso intensivo para entender promociones del supermercado"', phase: 'provincial' },
  { text: '"Documento opositor propone \'cambiar el rumbo\' sin especificar hacia dónde"', phase: 'provincial' },
  { text: '"Diputado propone indexar la realidad a la inflación para \'evitar distorsiones\'"', phase: 'provincial' },
  { text: '"Analistas confirman que el plan económico consiste en \'ver qué pasa\'"', phase: 'provincial' },
  { text: '"Senado aprueba ley para que las discusiones políticas incluyan al menos un dato real"', phase: 'provincial' },
  { text: '"Nuevo programa: \'Precios Sorprendidos\', donde nadie sabe cuánto va a pagar"', phase: 'provincial' },
  { text: '"Referente asegura que el país necesita diálogo, pero no \'con esos\'"', phase: 'provincial' },
  { text: '"Nuevo índice mide cuánto dura la alegría después de cobrar"', phase: 'provincial' },
  { text: '"Encuesta revela que la mitad del país cree que la otra mitad entiende lo que está pasando"', phase: 'provincial' },
  { text: '"Economista heterodoxo explica que emitir no genera inflación \'si se hace con cariño\'"', phase: 'provincial' },
  { text: '"Dirigente aclara que no es interna, es \'debate enriquecedor con gritos\'"', phase: 'provincial' },
  { text: '"Espacio progresista lanza app para indignarse de forma más eficiente"', phase: 'provincial' },

  // === IMPERIO ===
  { text: '"El presidente anuncia reforma constitucional. No recuerda quién se la sugirió."', phase: 'imperio' },
  { text: '"La oposición acepta diálogo. En el restaurante de tu propiedad."', phase: 'imperio' },
  { text: '"Inflación baja. Tus economistas dicen que era obvio. Los demás economistas no existen."', phase: 'imperio' },
  { text: '"La OEA envía observadores electorales. Los observadores son tus ex-empleados."', phase: 'imperio' },
  { text: '"WikiLeaks revela que Democracia S.A. es cliente frecuente. Fuentes dicen que es un placer hacer negocios."', phase: 'imperio' },
  { text: '"El FMI aprueba un préstamo de $50B. El director del FMI cenó en tu casa la noche anterior."', phase: 'imperio' },
  { text: '"El Congreso aprueba la Ley de Honestidad Política. Todos votan a favor sin leerla. Como siempre."', phase: 'imperio' },
  { text: '"El expresidente admite que nunca tomó una decisión sola. Menciona un amigo influyente. Su abogado dice que era su gato."', phase: 'imperio' },
  { text: '"Los tres poderes del Estado confirman que trabajan en armonía. Coinciden en que vos decís qué hacer."', phase: 'imperio' },
  { text: '"La calidad democrática es del 0%. El gobierno la califica de éxito rotundo."', phase: 'imperio' },

  // Noticias argentinas imperio
  { text: '"Devaluación express: los que se adelantaron ganan, los que no... votan de nuevo."', phase: 'imperio' },
  { text: '"El FMI pide más ajuste. La respuesta del gobierno: otro viaje a Nueva York."', phase: 'imperio' },
  { text: '"Funcionario explica que la incertidumbre \'es parte del atractivo del país\'"', phase: 'imperio' },
  { text: '"Se establece que toda cadena nacional deberá incluir un plot twist"', phase: 'imperio' },
  { text: '"La oposición denuncia con firmeza lo mismo que defendía hace seis meses"', phase: 'imperio' },
  { text: '"Dirigente opositor afirma que ahora sí tienen un rumbo claro de cara a las próximas elecciones, pero no lo quieren spoilear"', phase: 'imperio' },
  { text: '"Bloque opositor critica falta de consenso y propone más desacuerdos"', phase: 'imperio' },
  { text: '"Gobierno anuncia medida histórica; oposición la rechaza; ciudadanos googlean \'qué significa\'"', phase: 'imperio' },
  { text: '"Oficialismo asegura que todo mejora; oposición que todo empeora; país entra en estado cuántico"', phase: 'imperio' },
  { text: '"Gobierno lanza plan; oposición lanza crítica; ciudadanos lanzan suspiros"', phase: 'imperio' },
  { text: '"Oficialismo y oposición coinciden en que el problema es el otro"', phase: 'imperio' },
  { text: '"Se anuncia acuerdo político que será desacordado en las próximas horas"', phase: 'imperio' },
  { text: '"Encuesta revela que el país está mejor, peor y más o menos igual al mismo tiempo"', phase: 'imperio' },
  { text: '"Expertos recomiendan no discutir de política en cenas para preservar vínculos humanos"', phase: 'imperio' },
  { text: '"Columna: \'No entiendo nada, pero tengo una postura firme\'"', phase: 'imperio' },
];

export function getRandomHeadline(phase: GamePhase, exclude?: string): string {
  const pool = HEADLINES.filter(h => h.phase === phase);
  const available = exclude ? pool.filter(h => h.text !== exclude) : pool;
  if (available.length === 0) return pool[0]?.text ?? 'Sin noticias nuevas... por ahora.';
    return available[Math.floor(Math.random() * available.length)].text;
}
