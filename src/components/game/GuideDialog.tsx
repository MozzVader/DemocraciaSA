'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { BookOpen } from 'lucide-react';

interface GuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SECTIONS = [
  {
    emoji: '🗳️',
    title: 'Influenciar',
    text: 'Clickeá el boton central para ganar influencia. A medida que compres mejoras, cada clic rendira mas. No te canses, la democracia necesita dedicatorion.',
  },
  {
    emoji: '🚀',
    title: 'Red de Influencia',
    text: 'Los generadores producen influencia automaticamente por segundo. Cada uno es mas caro pero genera mas. Compra multiples con los botones x1, x10 o Max.',
  },
  {
    emoji: '⭐',
    title: 'Operaciones Especiales',
    text: 'Son mejoras unicas que se desbloquean al cumplir ciertas condiciones: una cantidad de influencia acumulada, un numero de generadores comprados, o ambos. Algunas mejoran tus clics, otras duplican la produccion de un generador, y otras aumentan tu dinero pasivo.',
  },
  {
    emoji: '🏆',
    title: 'Logros',
    text: 'Se desbloquean automaticamente a medida que acumulas influencia total. Cada logro otorga una bonificacion permanente a tu produccion o a tus clics. No se pueden perder.',
  },
  {
    emoji: '📰',
    title: 'El Rotativo',
    text: 'Son noticias satiricas que cambian solas. No afectan el juego, pero mantienen el morale alto.',
  },
  {
    emoji: '📊',
    title: 'Las Fases',
    text: 'El juego tiene 3 fases que se desbloquean con tu influencia: Municipal, Provincial/Nacional e Imperio. Cada fase habilita nuevos generadores mas poderosos.',
  },
];

export function GuideDialog({ open, onOpenChange }: GuideDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg border-0 p-0 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 41, 0.97) 0%, rgba(20, 15, 5, 0.97) 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.08), inset 0 1px 0 rgba(212, 175, 55, 0.15)',
        }}
      >
        {/* Gold top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #d4af37 30%, #f59e0b 50%, #d4af37 70%, transparent 100%)' }}
        />

        <div className="p-5">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-center flex items-center justify-center gap-2" style={{ color: '#d4af37' }}>
              <BookOpen className="w-5 h-5" />
              Como Se Juega
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground italic">
              &quot;Todo lo que necesitas saber para conquistar el sistema.&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {SECTIONS.map((section, i) => (
              <div key={i}>
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center text-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                    }}
                  >
                    {section.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold" style={{ color: '#d4af37' }}>
                      {section.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {section.text}
                    </div>
                  </div>
                </div>
                {i < SECTIONS.length - 1 && (
                  <Separator className="mt-4 border-[#d4af37]/10" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-[#d4af37]/15 text-center">
            <div className="text-[10px] text-muted-foreground/60 italic">
              &quot;El poder no se pregunta, se toma. Pero primero hay que leer el manual.&quot;
            </div>
          </div>
        </div>

        {/* Gold bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #d4af37 30%, #f59e0b 50%, #d4af37 70%, transparent 100%)' }}
        />
      </DialogContent>
    </Dialog>
  );
}
