'use client';

import { useGameStore } from '@/store/game-store';
import { formatNumber, formatPerSecond } from '@/lib/game/formatters';
import { PHASE_LABELS, PHASE_EMOJIS } from '@/lib/game/config';

export function GameHeader() {
  const influencia = useGameStore((s) => s.influencia);
  const dinero = useGameStore((s) => s.dinero);
  const productionPerSecond = useGameStore((s) => s.productionPerSecond());
  const currentPhase = useGameStore((s) => s.currentPhase);

  return (
    <header className="border-b border-border/30 px-4 py-3" style={{ background: 'rgba(10, 10, 18, 0.95)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg md:text-xl font-bold tracking-wide">
            <span style={{ color: '#d4af37' }}>DEMOCRACIA</span>
            <span className="text-muted-foreground">.SA</span>
          </h1>
          <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground font-mono">
            {PHASE_EMOJIS[currentPhase]} {PHASE_LABELS[currentPhase]}
          </span>
        </div>

        {/* Resources */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
              Influencia
            </div>
            <div className="text-sm md:text-base font-bold tabular-nums" style={{ color: '#d4af37' }}>
              {formatNumber(influencia)}
              <span className="text-xs text-muted-foreground ml-1">(+{formatPerSecond(productionPerSecond)}/s)</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
              Dinero
            </div>
            <div className="text-sm md:text-base font-bold text-green-400 tabular-nums">
              ${formatNumber(dinero).replace('$', '')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
