'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { InfluenceClicker } from '@/components/game/InfluenceClicker';
import { GeneratorPanel } from '@/components/game/GeneratorPanel';
import { UpgradesPanel } from '@/components/game/UpgradesPanel';
import { StatsPanel, MilestonesPanel } from '@/components/game/StatsPanel';
import { GameHeader } from '@/components/game/GameHeader';
import { useGameStore } from '@/store/game-store';
import { useGameLoop } from '@/hooks/use-game-loop';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type TabValue = 'generadores' | 'operaciones' | 'logros';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabValue>('generadores');
  const reset = useGameStore((s) => s.reset);
  const save = useGameStore((s) => s.save);

  // Initialize game loop
  useGameLoop();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a12' }}>
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-[0.02]"
          style={{ background: 'radial-gradient(circle, #8b0000 0%, transparent 70%)' }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <GameHeader />

      <main className="flex-1 relative">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col">
            {/* Clicker Section */}
            <InfluenceClicker />

            {/* Tabs for panels */}
            <div className="px-4 pb-6">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
                <TabsList className="grid w-full grid-cols-3 bg-transparent border-b border-border/30 rounded-none h-auto p-0">
                  <TabsTrigger
                    value="generadores"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#d4af37] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-[#d4af37] pb-2 text-xs font-semibold uppercase tracking-wider"
                  >
                    {'\uD83D\uDE80'} Generadores
                  </TabsTrigger>
                  <TabsTrigger
                    value="operaciones"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#d4af37] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-[#d4af37] pb-2 text-xs font-semibold uppercase tracking-wider"
                  >
                    {'\u2B50'} Operaciones
                  </TabsTrigger>
                  <TabsTrigger
                    value="logros"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#d4af37] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-[#d4af37] pb-2 text-xs font-semibold uppercase tracking-wider"
                  >
                    {'\uD83C\uDFC6'} Logros
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="generadores" className="mt-4">
                  <GeneratorPanel />
                </TabsContent>
                <TabsContent value="operaciones" className="mt-4">
                  <UpgradesPanel />
                </TabsContent>
                <TabsContent value="logros" className="mt-4">
                  <MilestonesPanel />
                </TabsContent>
              </Tabs>
            </div>

            {/* Stats */}
            <div className="px-4 pb-6">
              <StatsPanel />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-[280px_1fr_300px] gap-6 p-6">
            {/* Left Sidebar - Stats */}
            <aside className="space-y-4 sticky top-4 self-start">
              <StatsPanel />
            </aside>

            {/* Center - Clicker + Generators */}
            <div className="space-y-6">
              <InfluenceClicker />
              <GeneratorPanel />
            </div>

            {/* Right Sidebar - Upgrades + Milestones */}
            <aside className="space-y-6 sticky top-4 self-start">
              <UpgradesPanel />
              <MilestonesPanel />
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(10, 10, 18, 0.95)' }}>
        <div className="text-[10px] text-muted-foreground/50 font-mono tracking-wider">
          DOCUMENTO CLASIFICADO &middot; DEMOCRACIA S.A. &copy; {new Date().getFullYear()}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => save()}
          >
            Guardar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-destructive hover:text-destructive"
              >
                Reiniciar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reiniciar el juego?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se perdera todo tu progreso. Esta accion no se puede deshacer.
                  Los votantes que influiste quedaran libres... por ahora.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => reset()}>
                  Reiniciar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </footer>
    </div>
  );
}
