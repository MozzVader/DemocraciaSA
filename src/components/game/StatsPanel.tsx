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
  const state = useGameStore();
  const quality = getDemocraticQuality(state.totalInfluencia);
  const quote = getDemocracyQuote(quality);
  const productionPerSecond = useGameStore((s) => s.productionPerSecond());
  const dineroPerSecond = useGameStore((s) => s.dineroPerSecond());

  const unlockedCount = state.unlockedMilestones.length;
  const totalMilestones = MILESTONES.length;

  // Next milestone
  const nextMilestone = MILESTONES.find((m) => !state.unlockedMilestones.includes(m.id));
  let nextProgress = 0;
  if (nextMilestone) {
    const req = nextMilestone.requirement;
    switch (req.type) {
      case 'totalInfluencia':
        nextProgress = Math.min(100, (state.totalInfluencia / req.value) * 100);
        break;
      case 'totalDinero':
        nextProgress = Math.min(100, (state.totalDinero / req.value) * 100);
        break;
    }
  }

  return (
    <div className="space-y-4">
      {/* Phase */}
      <Card className="p-4 border-[#d4af37]/30" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
          Fase Actual
        </div>
        <div className="text-lg font-bold" style={{ color: '#d4af37' }}>
          {PHASE_EMOJIS[state.currentPhase]} {PHASE_LABELS[state.currentPhase]}
        </div>
      </Card>

      {/* Resources */}
      <Card className="p-4 border-[#d4af37]/30" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="space-y-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Dinero</div>
            <div className="text-xl font-bold text-green-400 font-mono tabular-nums">
              ${formatNumber(state.dinero).replace('$', '')}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              +${formatNumber(dineroPerSecond)}/s
            </div>
          </div>
          <div className="border-t border-border/50 pt-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Produccion Total
            </div>
            <div className="text-lg font-bold font-mono tabular-nums" style={{ color: '#d4af37' }}>
              {formatNumber(productionPerSecond)}/s
            </div>
          </div>
        </div>
      </Card>

      {/* Democratic Quality */}
      <Card className="p-4 border-[#d4af37]/30" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Calidad Democratica
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl font-bold tabular-nums"
            style={{
              color: quality > 60 ? '#22c55e' : quality > 30 ? '#f59e0b' : '#ef4444',
            }}>
            {quality}%
          </div>
        </div>
        <Progress value={quality} className="h-2 mb-2"
          style={{
            '--progress-color': quality > 60 ? '#22c55e' : quality > 30 ? '#f59e0b' : '#ef4444',
          } as React.CSSProperties} />
        <div className="text-xs italic text-muted-foreground">
          {quote}
        </div>
      </Card>

      {/* Milestones Progress */}
      <Card className="p-4 border-[#d4af37]/30" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Logros ({unlockedCount}/{totalMilestones})
        </div>
        {nextMilestone && (
          <div className="space-y-1">
            <div className="text-sm font-medium">{nextMilestone.emoji} {nextMilestone.name}</div>
            <Progress value={nextProgress} className="h-1.5" />
          </div>
        )}
        {unlockedCount === totalMilestones && (
          <div className="text-sm font-bold" style={{ color: '#d4af37' }}>
            {'\uD83C\uDFC6'} Todos los logros desbloqueados
          </div>
        )}
      </Card>

      {/* Play time */}
      <div className="text-xs text-muted-foreground font-mono text-center">
        Tiempo de juego: {formatTime(state.playTime)}
      </div>
    </div>
  );
}

export function MilestonesPanel() {
  const unlockedMilestones = useGameStore((s) => s.unlockedMilestones);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2"
        style={{ color: '#d4af37' }}>
        {'\uD83C\uDFC6'} Logros
      </h2>

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
              className={`p-3 border ${
                isUnlocked ? 'border-[#d4af37]/40' : 'border-[#d4af37]/15'
              }`}
              style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl flex-shrink-0">
                  {isUnlocked ? milestone.emoji : '\uD83D\uDD12'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${isUnlocked ? '' : 'text-muted-foreground'}`}
                    style={isUnlocked ? { color: '#d4af37' } : undefined}>
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
  );
}
