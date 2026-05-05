'use client';

import { useGameStore } from '@/store/game-store';
import { UPGRADES } from '@/lib/game/config';
import { formatNumber, formatDinero } from '@/lib/game/formatters';
import { canPurchaseUpgrade } from '@/lib/game/calculator';
import { Card } from '@/components/ui/card';
import { FileteadoCorner } from '@/components/game/FileteadoCorner';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export function UpgradesPanel() {
  const state = useGameStore();
  const purchaseUpgrade = useGameStore((s) => s.purchaseUpgrade);

  // Get available upgrades (not yet purchased and requirements met)
  const availableUpgrades = UPGRADES.filter((u) => canPurchaseUpgrade(state, u));
  const purchasedCount = state.purchasedUpgrades.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2"
          style={{ color: '#d4af37' }}>
          {'\u2B50'} Operaciones Especiales
        </h2>
        <Badge variant="secondary" className="text-xs font-mono">
          {purchasedCount}/{UPGRADES.length}
        </Badge>
      </div>

      {availableUpgrades.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-6 italic">
          &quot;Ninguna operacion disponible todavia. Segu\u00ED construyendo influencia...&quot;
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
          {availableUpgrades.map((upgrade) => {
            const costDisplay = upgrade.costResource === 'influencia'
              ? formatNumber(upgrade.cost)
              : formatDinero(upgrade.cost);
            const hasResource = upgrade.costResource === 'influencia'
              ? state.influencia >= upgrade.cost
              : state.dinero >= upgrade.cost;

            return (
              <motion.div
                key={upgrade.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`relative overflow-hidden p-3 cursor-pointer select-none transition-all duration-200 border ${
                    hasResource
                      ? 'border-[#d4af37]/50 hover:border-[#d4af37] hover:bg-white/10'
                      : 'border-[#d4af37]/20 opacity-70'
                  }`}
                  style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                  onClick={() => purchaseUpgrade(upgrade.id)}
                >
                  <div className="absolute bottom-1 right-1.5 pointer-events-none text-[#d4af37]/[0.35]">
                    <FileteadoCorner />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">{upgrade.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate" style={{ color: hasResource ? '#d4af37' : undefined }}>
                        {upgrade.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {upgrade.description}
                      </div>
                      <div className="text-xs font-mono mt-1" style={{ color: hasResource ? '#d4af37' : '#666' }}>
                        Costo: {costDisplay}
                        {upgrade.costResource === 'dinero' && ' (dinero)'}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
