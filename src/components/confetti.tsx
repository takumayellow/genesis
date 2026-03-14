"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly color: string;
  readonly size: number;
  readonly delay: number;
}

interface ConfettiProps {
  readonly trigger: boolean;
  readonly onComplete?: () => void;
  readonly particleCount?: number;
}

const COLORS = [
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#06B6D4", // cyan-500
] as const;

function createPieces(count: number): readonly ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -(Math.random() * 20 + 10),
    rotation: Math.random() * 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 8 + 4,
    delay: Math.random() * 0.3,
  }));
}

export function Confetti({
  trigger,
  onComplete,
  particleCount = 40,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<readonly ConfettiPiece[]>([]);
  const [visible, setVisible] = useState(false);

  const handleComplete = useCallback(() => {
    setVisible(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (!trigger) return;

    setPieces(createPieces(particleCount));
    setVisible(true);

    const timer = setTimeout(handleComplete, 2000);
    return () => clearTimeout(timer);
  }, [trigger, particleCount, handleComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: `${piece.y}vh`,
                rotate: 0,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                y: "110vh",
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
                scale: [0, 1, 0.5],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                delay: piece.delay,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: piece.size > 8 ? "50%" : "2px",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
