'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { InfluenceClicker } from '@/components/game/InfluenceClicker';
import { GeneratorPanel } from '@/components/game/GeneratorPanel';
import { UpgradesPanel } from '@/components/game/UpgradesPanel';
import { StatsPanel, MilestonesPanel } from '@/components/game/StatsPanel';
import { GameHeader } from '@/components/game/GameHeader';
import { NewsTicker } from '@/components/game/NewsTicker';
import { AchievementToast } from '@/components/game/AchievementToast';
import { GuideDialog } from '@/components/game/GuideDialog';
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
  const [guideOpen, setGuideOpen] = useState(false);
  const reset = useGameStore((s) => s.reset);
  const save = useGameStore((s) => s.save);

  useGameLoop();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }}
        />
      </div>

      <GameHeader />
      <NewsTicker />

      <main className="flex-1 relative">
        <div className="max-w-7xl mx-auto">
          <div className="md:hidden flex flex-col">
            <InfluenceClicker />

            <div className="px-4 pb-6">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
                <TabsList className="grid w-full grid-cols-3 bg-transparent border-b border-border/30 rounded-none h-auto p-0">
                  <TabsTrigger
                    value="generadores"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-gold pb-2 text-xs font-semibold uppercase tracking-wider"
                  >
                    {'\uD83D\uDE80'} Generadores
                  </TabsTrigger>
                  <TabsTrigger
                    value="operaciones"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-gold pb-2 text-xs font-semibold uppercase tracking-wider"
                  >
                    {'\u2B50'} Operaciones
                  </TabsTrigger>
                  <TabsTrigger
                    value="logros"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-gold pb-2 text-xs font-semibold uppercase tracking-wider"
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

            <div className="px-4 pb-6">
              <StatsPanel />
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-[280px_1fr_300px] gap-6 p-6">
            <aside className="space-y-4 sticky top-16 self-start max-h-[calc(100vh-5rem)] overflow-y-auto pr-1 custom-scrollbar">
              <StatsPanel />
            </aside>

            <div className="space-y-6">
              <InfluenceClicker />
              <GeneratorPanel />
            </div>

            <aside className="space-y-6 sticky top-16 self-start max-h-[calc(100vh-5rem)] overflow-y-auto pr-1 custom-scrollbar">
              <UpgradesPanel />
              <MilestonesPanel />
            </aside>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 z-40 border-t border-gold/20 px-4 py-3 flex items-center justify-between glass-dark">
        <div className="text-[10px] text-muted-foreground/50 font-mono tracking-wider">
          DOCUMENTO CLASIFICADO &middot; DEMOCRACIA S.A. &copy; {new Date().getFullYear()}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setGuideOpen(true)}
          >
            <BookOpen className="w-3.5 h-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Guía</span>
          </Button>
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

      <AchievementToast />
      <GuideDialog open={guideOpen} onOpenChange={setGuideOpen} />
    </div>
  );
}
