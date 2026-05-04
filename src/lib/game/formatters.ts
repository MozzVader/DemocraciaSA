/**
 * Format large numbers in a readable way.
 * 999 -> "999"
 * 1000 -> "1.00K"
 * 1500000 -> "1.50M"
 * 1000000000 -> "1.00B"
 */
export function formatNumber(n: number): string {
  if (n < 0) return `-${formatNumber(-n)}`;
  if (n < 1000) return Math.floor(n).toString();

  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  const tier = Math.floor(Math.log10(Math.abs(n)) / 3);

  if (tier === 0) return Math.floor(n).toString();
  if (tier >= suffixes.length) return n.toExponential(2);

  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = n / scale;

  return scaled.toFixed(2) + suffix;
}

/**
 * Format number with full decimal precision for per-second display.
 */
export function formatPerSecond(n: number): string {
  if (n < 0) return `-${formatPerSecond(-n)}`;
  if (n < 1000) return n.toFixed(1);

  return formatNumber(n);
}

/**
 * Format currency (dinero) with $ symbol.
 */
export function formatDinero(n: number): string {
  return `$${formatNumber(n)}`;
}

/**
 * Format time duration in seconds to readable string.
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
}

/**
 * Get a satirical quote based on democratic quality.
 */
export function getDemocracyQuote(quality: number): string {
  if (quality >= 90) return '"La democracia funciona... mas o menos."';
  if (quality >= 75) return '"Algunos funcionarios empezaron a tener agendas muy alineadas."';
  if (quality >= 60) return '"Las leyes se parecen mucho a las propuestas de ciertos think tanks."';
  if (quality >= 45) return '"Los medios ya no saben si informan o hacen propaganda."';
  if (quality >= 30) return '"La oposicion existe, pero recibe el mismo financiamiento."';
  if (quality >= 15) return '"El presidente es irrelevante. Tu si importas."';
  if (quality > 0) return '"Democracia, Inc. Es todo tuyo."';
  return '"No cambiaste el mundo. Compraste los que lo cambian."';
}
