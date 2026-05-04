'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/game-store';
import { formatNumber, formatPerSecond } from '@/lib/game/formatters';

export function InfluenceClicker() {
  const click = useGameStore((s) => s.click);
  const influencia = useGameStore((s) => s.influencia);
  const clickPower = useGameStore((s) => s.clickPower());
  const productionPerSecond = useGameStore((s) => s.productionPerSecond());
  const totalClicks = useGameStore((s) => s.totalClicks);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Main Influence Display */}
      <div className="text-center">
        <div className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-1 font-mono">
          Influencia Total
        </div>
        <motion.div
          key={Math.floor(influencia)}
          initial={{ scale: 1.05, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl md:text-7xl font-bold tabular-nums"
          style={{
            color: '#d4af37',
            textShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
          }}
        >
          {formatNumber(influencia)}
        </motion.div>
        <div className="text-xs text-muted-foreground mt-2 font-mono">
          {formatPerSecond(productionPerSecond)}/s &middot; {formatPerSecond(clickPower)}/click
        </div>
      </div>

      {/* Click Button */}
      <div className="relative">
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-10"
          style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }} />

        <motion.button
          onClick={click}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          className="relative w-48 h-48 md:w-56 md:h-56 rounded-full cursor-pointer
            flex flex-col items-center justify-center gap-2
            transition-all duration-150 select-none"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #2a1f0a 0%, #0f1729 60%, #060a14 100%)',
            border: '3px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 0 40px rgba(212, 175, 55, 0.15), inset 0 0 30px rgba(212, 175, 55, 0.05)',
          }}
        >
          <span className="text-6xl md:text-7xl" role="img" aria-label="influencia">
            {'\uD83C\uDFAF'}
          </span>
          <span className="text-sm font-bold tracking-wider uppercase"
            style={{ color: '#d4af37' }}>
            INFLUENCIAR
          </span>
        </motion.button>
      </div>

      {/* Click counter */}
      <div className="text-xs text-muted-foreground font-mono">
        {totalClicks.toLocaleString()} clics totales
      </div>
    </div>
  );
}
