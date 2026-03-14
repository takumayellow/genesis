"use client";

import { useCallback, useRef } from "react";

interface StepCompleteSoundOptions {
  readonly volume?: number;
  readonly enabled?: boolean;
}

interface StepCompleteSoundReturn {
  readonly playComplete: () => void;
  readonly playUncheck: () => void;
}

function createAudioContext(): AudioContext | null {
  try {
    return new AudioContext();
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  volume: number,
  startTime: number,
  type: OscillatorType = "sine"
): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(volume, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function useStepCompleteSound(
  options: StepCompleteSoundOptions = {}
): StepCompleteSoundReturn {
  const { volume = 0.3, enabled = true } = options;
  const audioContextRef = useRef<AudioContext | null>(null);

  const getContext = useCallback((): AudioContext | null => {
    if (audioContextRef.current === null) {
      audioContextRef.current = createAudioContext();
    }

    const ctx = audioContextRef.current;
    if (ctx !== null && ctx.state === "suspended") {
      ctx.resume();
    }

    return ctx;
  }, []);

  const playComplete = useCallback(() => {
    if (!enabled) return;

    const ctx = getContext();
    if (ctx === null) return;

    const now = ctx.currentTime;

    // Rising two-note chime (C5 -> E5)
    playTone(ctx, 523.25, 0.15, volume, now, "sine");
    playTone(ctx, 659.25, 0.25, volume * 0.8, now + 0.1, "sine");
  }, [enabled, volume, getContext]);

  const playUncheck = useCallback(() => {
    if (!enabled) return;

    const ctx = getContext();
    if (ctx === null) return;

    const now = ctx.currentTime;

    // Soft descending click (E5 -> C5)
    playTone(ctx, 659.25, 0.08, volume * 0.4, now, "sine");
    playTone(ctx, 523.25, 0.1, volume * 0.3, now + 0.05, "sine");
  }, [enabled, volume, getContext]);

  return { playComplete, playUncheck };
}

export function StepCompleteSound({
  children,
  onComplete,
  onUncheck,
  completed,
  volume = 0.3,
  enabled = true,
}: {
  readonly children: React.ReactNode;
  readonly onComplete?: () => void;
  readonly onUncheck?: () => void;
  readonly completed: boolean;
  readonly volume?: number;
  readonly enabled?: boolean;
}) {
  const { playComplete, playUncheck } = useStepCompleteSound({
    volume,
    enabled,
  });

  const handleClick = () => {
    if (completed) {
      playUncheck();
      onUncheck?.();
    } else {
      playComplete();
      onComplete?.();
    }
  };

  return (
    <div onClick={handleClick} role="button" tabIndex={0}>
      {children}
    </div>
  );
}
