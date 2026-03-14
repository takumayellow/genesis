"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Toast {
  readonly id: string;
  readonly message: string;
  readonly icon: string;
}

interface AchievementToastProps {
  readonly toasts: readonly Toast[];
  readonly onDismiss: (id: string) => void;
  readonly autoHideMs?: number;
}

const MILESTONE_MESSAGES = {
  firstStep: { message: "初めてのステップ完了！", icon: "🌱" },
  quarter: { message: "25%達成！順調です！", icon: "🔥" },
  half: { message: "半分達成！", icon: "⭐" },
  threeQuarters: { message: "75%達成！あと少し！", icon: "🚀" },
  complete: { message: "タスク完了おめでとう！🎉", icon: "🏆" },
} as const;

type MilestoneKey = keyof typeof MILESTONE_MESSAGES;

function createToast(key: MilestoneKey): Toast {
  const milestone = MILESTONE_MESSAGES[key];
  return {
    id: `${key}-${Date.now()}`,
    message: milestone.message,
    icon: milestone.icon,
  };
}

export function useAchievementToasts() {
  const [toasts, setToasts] = useState<readonly Toast[]>([]);

  const showAchievement = useCallback((key: MilestoneKey) => {
    const toast = createToast(key);
    setToasts((prev) => [...prev, toast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showAchievement, dismissToast };
}

function ToastItem({
  toast,
  onDismiss,
  autoHideMs,
}: {
  readonly toast: Toast;
  readonly onDismiss: (id: string) => void;
  readonly autoHideMs: number;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), autoHideMs);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss, autoHideMs]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg"
    >
      <span className="text-xl">{toast.icon}</span>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-black">{toast.message}</span>
        <motion.div
          className="mt-1 h-0.5 rounded-full bg-blue-500"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: autoHideMs / 1000, ease: "linear" }}
        />
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="閉じる"
      >
        &times;
      </button>
    </motion.div>
  );
}

export function AchievementToast({
  toasts,
  onDismiss,
  autoHideMs = 3000,
}: AchievementToastProps) {
  return (
    <div className="pointer-events-auto fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
            autoHideMs={autoHideMs}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
