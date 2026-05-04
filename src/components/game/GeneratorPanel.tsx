'use client';

import { useGameStore } from '@/store/game-store';
import { GENERATORS } from '@/lib/game/config';
import { formatNumber } from '@/lib/game/formatters';
import { getGeneratorCost, isGeneratorUnlocked } from '@/lib/game/calculator';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export function GeneratorPanel() {
  const generators = useGameStore((s) => s.generators);
  const influencia = useGameStore((s) => s.influencia);
  const buyGenerator = useGameStore((s) => s.buyGenerator);
  const currentPhase = useGameStore((s) => s.currentPhase);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
        style={{ color: '#d4af37' }}>
        {'\uD83D\uDE80'} Red de Influencia
      </h2>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
        {GENERATORS.map((gen) => {
          const state = generators[gen.id];
          const owned = state?.owned ?? 0;
          const cost = getGeneratorCost(gen.id, owned);
          const unlocked = isGeneratorUnlocked(gen.id, currentPhase);
          const canAfford = influencia >= cost;

          if (!unlocked) return null;

          return (
            <AnimatePresence key={gen.id}>
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`p-3 cursor-pointer transition-all duration-200 border ${
                    canAfford
                      ? 'border-[#d4af37]/40 hover:border-[#d4af37]/80 hover:bg-[#d4af37]/5'
                      : 'border-border/50 opacity-60'
                  }`}
                  style={{ background: 'rgba(15, 23, 41, 0.8)' }}
                  onClick={() => buyGenerator(gen.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">{gen.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm truncate" style={{ color: canAfford ? '#d4af37' : undefined }}>
                          {gen.name}
                        </span>
                        <span className="text-xs font-mono tabular-nums text-muted-foreground flex-shrink-0">
                          {owned}x
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate italic">
                        {gen.quote}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-mono" style={{ color: canAfford ? '#d4af37' : '#666' }}>
                          Costo: {formatNumber(cost)}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          +{formatNumber(gen.baseProduction)}/s c/u
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
}
