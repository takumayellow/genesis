"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProgressAnimationProps {
  readonly completedCount: number;
  readonly totalCount: number;
  readonly onMilestone?: (milestone: number) => void;
}

interface Sparkle {
  readonly id: number;
  readonly x: number;
  readonly y: number;
}

const MILESTONES = [25, 50, 75, 100] as const;

function getMilestoneLabel(milestone: number): string {
  switch (milestone) {
    case 25:
      return "1/4 達成！";
    case 50:
      return "半分達成！";
    case 75:
      return "あと少し！";
    case 100:
      return "完了！";
    default:
      return "";
  }
}

function getProgressColor(percentage: number): string {
  if (percentage >= 100) return "bg-emerald-500";
  if (percentage >= 75) return "bg-blue-400";
  if (percentage >= 50) return "bg-blue-500";
  return "bg-blue-600";
}

function createSparkles(): readonly Sparkle[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 40,
    y: (Math.random() - 0.5) * 40,
  }));
}

export function ProgressAnimation({
  completedCount,
  totalCount,
  onMilestone,
}: ProgressAnimationProps) {
  const [celebratingMilestone, setCelebratingMilestone] = useState<
    number | null
  >(null);
  const [previousPercentage, setPreviousPercentage] = useState(0);

  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const sparkles = useMemo(
    () => (celebratingMilestone !== null ? createSparkles() : []),
    [celebratingMilestone]
  );

  useEffect(() => {
    const hitMilestone = MILESTONES.find(
      (m) => previousPercentage < m && percentage >= m
    );

    if (hitMilestone !== undefined) {
      setCelebratingMilestone(hitMilestone);
      onMilestone?.(hitMilestone);

      const timer = setTimeout(() => setCelebratingMilestone(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [percentage, previousPercentage, onMilestone]);

  useEffect(() => {
    setPreviousPercentage(percentage);
  }, [percentage]);

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          進捗: {completedCount}/{totalCount}
        </span>
        <motion.span
          key={percentage}
          initial={{ scale: 1.4, color: "#3B82F6" }}
          animate={{ scale: 1, color: "#9CA3AF" }}
          transition={{ duration: 0.4 }}
        >
          {percentage}%
        </motion.span>
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <motion.div
          className={`h-full rounded-full ${getProgressColor(percentage)}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence>
        {celebratingMilestone !== null && (
          <motion.div
            className="absolute -top-8 left-1/2 flex items-center justify-center"
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -10, x: "-50%" }}
            transition={{ duration: 0.3 }}
          >
            <span className="whitespace-nowrap rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white shadow-md">
              {getMilestoneLabel(celebratingMilestone)}
            </span>

            {sparkles.map((sparkle) => (
              <motion.div
                key={sparkle.id}
                className="absolute size-1.5 rounded-full bg-amber-400"
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: 0,
                  x: sparkle.x,
                  y: sparkle.y,
                  scale: 1,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
