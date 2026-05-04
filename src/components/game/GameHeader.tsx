'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { useAuthStore } from '@/store/auth-store';
import { AuthDialog } from '@/components/game/AuthDialog';
import { formatNumber, formatPerSecond } from '@/lib/game/formatters';
import { PHASE_LABELS, PHASE_EMOJIS } from '@/lib/game/config';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Cloud, CloudOff } from 'lucide-react';

export function GameHeader() {
  const influencia = useGameStore((s) => s.influencia);
  const dinero = useGameStore((s) => s.dinero);
  const productionPerSecond = useGameStore((s) => s.productionPerSecond());
  const currentPhase = useGameStore((s) => s.currentPhase);

  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [authOpen, setAuthOpen] = useState(false);

  const isLoggedIn = !!user;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || '';

  return (
    <>
      <header className="border-b border-border/30 px-4 py-3" style={{ background: 'rgba(10, 10, 18, 0.95)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Title */}
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-lg md:text-xl font-bold tracking-wide flex-shrink-0">
              <span style={{ color: '#d4af37' }}>DEMOCRACIA</span>
              <span className="text-muted-foreground">.SA</span>
            </h1>
            <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground font-mono">
              {PHASE_EMOJIS[currentPhase]} {PHASE_LABELS[currentPhase]}
            </span>
          </div>

          {/* Resources + Auth */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:block text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                Influencia
              </div>
              <div className="text-sm md:text-base font-bold tabular-nums" style={{ color: '#d4af37' }}>
                {formatNumber(influencia)}
                <span className="text-xs text-muted-foreground ml-1">(+{formatPerSecond(productionPerSecond)}/s)</span>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                Dinero
              </div>
              <div className="text-sm md:text-base font-bold text-green-400 tabular-nums">
                ${formatNumber(dinero).replace('$', '')}
              </div>
            </div>

            {/* Auth button */}
            <div className="flex items-center gap-1.5">
              {isLoggedIn ? (
                <>
                  <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded border border-border/30" title="Guardado en la nube activo">
                    <Cloud className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] text-muted-foreground font-mono max-w-[120px] truncate">
                      {displayName}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => signOut()}
                    title="Cerrar sesion"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded border border-border/30" title="Guardado local only">
                    <CloudOff className="w-3 h-3 text-muted-foreground/50" />
                    <span className="text-[10px] text-muted-foreground/50 font-mono">Local</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setAuthOpen(true)}
                  >
                    <LogIn className="w-3.5 h-3.5 sm:mr-1.5" />
                    <span className="hidden sm:inline text-xs">Sesion</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
