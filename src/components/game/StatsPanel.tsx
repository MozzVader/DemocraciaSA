'use client';

import { useGameStore } from '@/store/game-store';
import { MILESTONES } from '@/lib/game/config';
import { getDemocraticQuality } from '@/lib/game/calculator';
import { formatNumber, getDemocracyQuote, formatTime } from '@/lib/game/formatters';
import { PHASE_LABELS, PHASE_EMOJIS } from '@/lib/game/config';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export function StatsPanel() {
  const currentPhase = useGameStore((s) => s.currentPhase);
  const dinero = useGameStore((s) => s.dinero);
  const totalInfluencia = useGameStore((s) => s.totalInfluencia);
  const totalDinero = useGameStore((s) => s.totalDinero);
  const unlockedMilestones = useGameStore((s) => s.unlockedMilestones);
  const playTime = useGameStore((s) => s.playTime);
  const productionPerSecond = useGameStore((s) => s.productionPerSecond());
  const dineroPerSecond = useGameStore((s) => s.dineroPerSecond());

  const quality = getDemocraticQuality(totalInfluencia);
  const quote = getDemocracyQuote(quality);
  const unlockedCount = unlockedMilestones.length;
  const totalMilestones = MILESTONES.length;

  // Next milestone
  const nextMilestone = MILESTONES.find((m) => !unlockedMilestones.includes(m.id));
  let nextProgress = 0;
  if (nextMilestone) {
    const req = nextMilestone.requirement;
    switch (req.type) {
      case 'totalInfluencia':
        nextProgress = Math.min(100, (totalInfluencia / req.value) * 100);
        break;
      case 'totalDinero':
        nextProgress = Math.min(100, (totalDinero / req.value) * 100);
        break;
    }
  }

  return (
    <div className="space-y-3">
      {/* 2x2 Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Dinero — top left */}
        <Card className="p-3 border-gold/30 glass-card">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Dinero
          </div>
          <div className="text-lg font-bold text-green-400 font-mono tabular-nums mt-0.5">
            ${formatNumber(dinero).replace('$', '')}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">
            +${formatNumber(dineroPerSecond)}/s
          </div>
          <div className="border-t border-border/50 mt-2 pt-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Produccion
            </div>
            <div className="text-sm font-bold font-mono tabular-nums text-gold">
              {formatNumber(productionPerSecond)}/s
            </div>
          </div>
        </Card>

        {/* Calidad Democratica — top right */}
        <Card className="p-3 border-gold/30 glass-card">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Calidad Democratica
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="text-2xl font-bold tabular-nums"
              style={{
                color: quality > 60 ? '#22c55e' : quality > 30 ? '#f59e0b' : '#ef4444',
              }}>
              {quality}%
            </div>
          </div>
          <Progress value={quality} className="h-1.5 mb-1.5"
            style={{
              '--progress-color': quality > 60 ? '#22c55e' : quality > 30 ? '#f59e0b' : '#ef4444',
            } as React.CSSProperties} />
          <div className="text-[10px] italic text-muted-foreground leading-tight">
            {quote}
          </div>
        </Card>

        {/* Fase Actual — bottom left */}
        <Card className="p-3 border-gold/30 glass-card">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Fase Actual
          </div>
          <div className="text-base font-bold text-gold mt-0.5">
            {PHASE_EMOJIS[currentPhase]} {PHASE_LABELS[currentPhase]}
          </div>
        </Card>

        {/* Logros — bottom right */}
        <Card className="p-3 border-gold/30 glass-card">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Logros ({unlockedCount}/{totalMilestones})
          </div>
          {nextMilestone && (
            <div className="space-y-1">
              <div className="text-xs font-medium">{nextMilestone.emoji} {nextMilestone.name}</div>
              <Progress value={nextProgress} className="h-1.5" />
            </div>
          )}
          {unlockedCount === totalMilestones && (
            <div className="text-xs font-bold text-gold">
              {'\uD83C\uDFC6'} Todos desbloqueados
            </div>
          )}
        </Card>
      </div>

      {/* Play time */}
      <div className="text-[10px] text-muted-foreground font-mono text-center">
        Tiempo de juego: {formatTime(playTime)}
      </div>
    </div>
  );
}

export function MilestonesPanel() {
  const unlockedMilestones = useGameStore((s) => s.unlockedMilestones);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-3">
      <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2 text-gold flex-shrink-0">
        {'\uD83C\uDFC6'} Logros
      </h2>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar space-y-3">
      {MILESTONES.map((milestone) => {
        const isUnlocked = unlockedMilestones.includes(milestone.id);
        return (
          <motion.div
            key={milestone.id}
            initial={false}
            animate={{
              opacity: isUnlocked ? 1 : 0.3,
              scale: isUnlocked ? 1 : 0.95,
            }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className={`p-3 border ${isUnlocked ? 'border-gold/40' : 'border-gold/15'} glass-card`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl flex-shrink-0">
                  {isUnlocked ? milestone.emoji : '\uD83D\uDD12'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${isUnlocked ? 'text-gold' : 'text-muted-foreground'}`}>
                    {milestone.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {isUnlocked ? milestone.description : '???'}
                  </div>
                </div>
                {isUnlocked && (
                  <span className="text-green-400 text-xs font-bold flex-shrink-0">{'\u2713'}</span>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
      </div>
    </div>
  );
}
