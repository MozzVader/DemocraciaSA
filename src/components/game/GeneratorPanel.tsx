'use client';

import { useGameStore, type BuyAmount } from '@/store/game-store';
import { GENERATORS } from '@/lib/game/config';
import { formatNumber } from '@/lib/game/formatters';
import { getGeneratorCost, isGeneratorUnlocked, getMaxBuyable, getGeneratorCostBulk } from '@/lib/game/calculator';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const BUY_OPTIONS: { value: BuyAmount; label: string }[] = [
  { value: 1, label: 'x1' },
  { value: 10, label: 'x10' },
  { value: -1, label: 'Max' },
];

export function GeneratorPanel() {
  const generators = useGameStore((s) => s.generators);
  const influencia = useGameStore((s) => s.influencia);
  const buyGenerator = useGameStore((s) => s.buyGenerator);
  const currentPhase = useGameStore((s) => s.currentPhase);
  const buyAmount = useGameStore((s) => s.buyAmount);
  const setBuyAmount = useGameStore((s) => s.setBuyAmount);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2"
          style={{ color: '#d4af37' }}>
          {'\uD83D\uDE80'} Red de Influencia
        </h2>
        <div className="flex items-center gap-1">
          {BUY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setBuyAmount(opt.value)}
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border transition-all duration-150 ${
                buyAmount === opt.value
                  ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10'
                  : 'border-border/40 text-muted-foreground hover:border-border/70'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
        {GENERATORS.map((gen) => {
          const state = generators[gen.id];
          const owned = state?.owned ?? 0;
          const unlocked = isGeneratorUnlocked(gen.id, currentPhase);

          if (!unlocked) return null;

          // Calculate display cost and amount based on buy mode
          let displayAmount: number;
          let displayCost: number;

          if (buyAmount === -1) {
            displayAmount = getMaxBuyable(gen.id, owned, influencia);
            displayCost = displayAmount > 0
              ? getGeneratorCostBulk(gen.id, owned, displayAmount)
              : getGeneratorCost(gen.id, owned);
          } else {
            displayAmount = buyAmount;
            displayCost = getGeneratorCostBulk(gen.id, owned, buyAmount);
          }

          const canAfford = influencia >= getGeneratorCost(gen.id, owned);

          return (
            <AnimatePresence key={gen.id}>
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`p-3 cursor-pointer select-none transition-all duration-200 border ${
                    canAfford
                      ? 'border-[#d4af37]/50 hover:border-[#d4af37] hover:bg-white/10'
                      : 'border-[#d4af37]/20 opacity-60'
                  }`}
                  style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
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
                          {owned}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate italic">
                        {gen.quote}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-mono" style={{ color: canAfford ? '#d4af37' : '#666' }}>
                          Costo: {formatNumber(displayCost)}
                          {buyAmount !== 1 && (
                            <span className="text-muted-foreground ml-1">
                              ({displayAmount === 0 ? '-' : displayAmount})
                            </span>
                          )}
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
