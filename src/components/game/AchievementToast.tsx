'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MilestoneConfig } from '@/lib/game/types';

interface ToastData {
  id: number;
  milestone: MilestoneConfig;
}

let toastId = 0;
const TOAST_DURATION = 5000;
const MAX_VISIBLE_TOASTS = 3;

const queue: MilestoneConfig[] = [];
let isProcessing = false;

function formatReward(milestone: MilestoneConfig): string {
  const r = milestone.reward;
  switch (r.type) {
    case 'clickMultiplier':
      return `+${r.value} influencia por clic`;
    case 'productionMultiplier':
      return `x${r.value} produccion total`;
    case 'unlockedPhase':
      return `Nueva fase desbloqueada`;
    default:
      return '';
  }
}

export function AchievementToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const processingRef = useRef(false);

  const addToast = useCallback((milestone: MilestoneConfig) => {
    queue.push(milestone);
    if (!processingRef.current) {
      processQueue();
    }
  }, []);

  function processQueue() {
    if (queue.length === 0) {
      processingRef.current = false;
      return;
    }
    processingRef.current = true;

    // Only add from queue if we have room
    setToasts((prev) => {
      const available = MAX_VISIBLE_TOASTS - prev.length;
      if (available <= 0) return prev;

      const toAdd = queue.splice(0, available);
      const newToasts = [...prev];
      for (const milestone of toAdd) {
        const id = ++toastId;
        const data: ToastData = { id, milestone };
        newToasts.push(data);
        setTimeout(() => {
          setToasts((p) => p.filter((t) => t.id !== id));
        }, TOAST_DURATION);
      }
      return newToasts;
    });

    // Check queue again after a short delay
    setTimeout(() => processQueue(), 200);
  }

  // Expose addToast globally so game-store can call it
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__achievementToast = addToast;
    return () => {
      delete (window as unknown as Record<string, unknown>).__achievementToast;
    };
  }, [addToast]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 80, x: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, x: 60, scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className="pointer-events-auto w-80 max-w-[calc(100vw-2rem)]"
          >
            <div
              className="relative overflow-hidden rounded-lg border"
              style={{
                borderColor: 'rgba(212, 175, 55, 0.4)',
                background: 'linear-gradient(135deg, rgba(15, 23, 41, 0.97) 0%, rgba(20, 15, 5, 0.97) 100%)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.08), inset 0 1px 0 rgba(212, 175, 55, 0.15)',
              }}
            >
              {/* Gold top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] gold-accent-line" />

              <div className="p-3 pl-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center text-2xl gold-icon-box"
                  >
                    {toast.milestone.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="text-[9px] uppercase tracking-[0.2em] font-bold mb-0.5 text-gold">
                      Logro Desbloqueado
                    </div>
                    <div className="text-sm font-bold text-foreground leading-tight truncate">
                      {toast.milestone.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground italic mt-0.5 leading-snug line-clamp-2">
                      {toast.milestone.description}
                    </div>

                    {/* Reward */}
                    <div
                      className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono"
                      style={{
                        color: '#22c55e',
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      {formatReward(toast)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar that shrinks over duration */}
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-gold"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: TOAST_DURATION / 1000, ease: 'linear' }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Trigger an achievement toast from outside React (e.g. from Zustand store).
 */
export function showAchievementToast(milestone: MilestoneConfig) {
  const addToast = (window as unknown as Record<string, ((m: MilestoneConfig) => void) | undefined>).__achievementToast;
  if (addToast) addToast(milestone);
}
