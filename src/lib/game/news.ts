import type { GamePhase } from './types';

interface NewsItem {
  text: string;
  phase: GamePhase;
}

const HEADLINES: NewsItem[] = [
  // === MUNICIPAL ===
  { text: '"Concejal sorprendido contando sobres en el bano del restaurante. Dice que clasificaba correspondencia."', phase: 'municipal' },
  { text: '"El intendente firma ordenanza que beneficia a amigos personales. Nombra 47 amigos."', phase: 'municipal' },
  { text: '"Think Tank municipal revela que el 100% de los encuestados apoya al concejal que los encuesto."', phase: 'municipal' },
  { text: '"Funcionario invierte todo su sueldo en cocteles de gala. Su abogado dice que es gasto representativo."', phase: 'municipal' },
  { text: '"La oposicion denuncia irregularidades. Nadie los escucha porque estaban en un coctel de gala."', phase: 'municipal' },
  { text: '"Periodista descubre que el presupuesto municipal se gasta en asesoramientos. Son 12 sobrinos."', phase: 'municipal' },
  { text: '"Empresa fantasma dona a campana electoral. Su director es el portero del concejo."', phase: 'municipal' },
  { text: '"Auditoria revela que el 80% del presupuesto se fue en viaticos de investigacion. A Cancun."', phase: 'municipal' },
  { text: '"El defensor del pueblo resulto ser sobrino del alcalde. Coincidencias del destino."', phase: 'municipal' },
  { text: '"Transparencia: el municipio publica sus gastos. Todos los numeros estan tachados."', phase: 'municipal' },

  // === PROVINCIAL ===
  { text: '"Senador pide investigar interferencia extranjera en las elecciones. Su financista es suizo."', phase: 'provincial' },
  { text: '"Think Tank revela que bajar impuestos a los ricos genera empleo. Sorpresa: el estudio lo pago un rico."', phase: 'provincial' },
  { text: '"El gobernador anuncia plan de transparencia. No incluye su propio financiamiento."', phase: 'provincial' },
  { text: '"Consultora politica cobra $5M por manejo de crisis. La crisis es que los pagan demasiado."', phase: 'provincial' },
  { text: '"Medio de comunicacion cambia su linea editorial. El nuevo dueno es un amigo de la democracia."', phase: 'provincial' },
  { text: '"Funcionario renuncia para trabajar en el sector privado. Al dia siguiente ingresa a empresa que regulaba."', phase: 'provincial' },
  { text: '"La Corte falla 5-4 a favor del financiador del juez que escribio la opinion de la mayoria."', phase: 'provincial' },
  { text: '"Diputado aprueba ley de etica publica. El es el primero en violarla."', phase: 'provincial' },
  { text: '"Encuesta: el 73% de los ciudadanos confia en las instituciones. La encuesta se pago con dinero publico."', phase: 'provincial' },
  { text: '"Lobby cobra $200/hora por reuniones con legisladores. La reunion dura 5 minutos."', phase: 'provincial' },

  // === HEGEMONIC ===
  { text: '"El presidente anuncia reforma constitucional. No recuerda quien se la sugirio."', phase: 'hegemonic' },
  { text: '"La oposicion acepta dialogo. En el restaurante de tu propiedad."', phase: 'hegemonic' },
  { text: '"Inflacion baja. Tus economistas dicen que era obvio. Los demas economistas no existen."', phase: 'hegemonic' },
  { text: '"La OEA envia observadores electorales. Los observadores son tus ex-empleados."', phase: 'hegemonic' },
  { text: '"WikiLeaks revela que Democracia S.A. es cliente frecuente. Fuentes dicen que es un placer hacer negocios."', phase: 'hegemonic' },
  { text: '"El FMI aprueba un prestamo de $50B. El director del FMI ceno en tu casa la noche anterior."', phase: 'hegemonic' },
  { text: '"El Congreso aprueba la Ley de Honestidad Politica. Todos votan a favor sin leerla. Como siempre."', phase: 'hegemonic' },
  { text: '"El expresidente admite que nunca tomo una decision sola. Menciona un amigo influyente. Su abogado dice que era su gato."', phase: 'hegemonic' },
  { text: '"Los tres poderes del Estado confirman que trabajan en armonia. Coinciden en que vos decis que hacer."', phase: 'hegemonic' },
  { text: '"La calidad democratica es del 0%. El gobierno la califica de exito rotundo."', phase: 'hegemonic' },
];

export function getRandomHeadline(phase: GamePhase, exclude?: string): string {
  const pool = HEADLINES.filter(h => h.phase === phase);
  const available = exclude ? pool.filter(h => h.text !== exclude) : pool;
  if (available.length === 0) return pool[0]?.text ?? 'Sin noticias nuevas... por ahora.';
  return available[Math.floor(Math.random() * available.length)];
}
