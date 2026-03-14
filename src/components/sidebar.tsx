"use client";

import { Check } from "lucide-react";
import type { TaskStep } from "@/lib/types";

interface SidebarProps {
  readonly title: string;
  readonly description: string;
  readonly steps: readonly TaskStep[];
  readonly activeStepId: string | null;
  readonly progress: number;
  readonly onStepClick: (stepId: string) => void;
  readonly onStartStep: (stepId: string) => void;
}

export function Sidebar({
  title,
  description,
  steps,
  activeStepId,
  progress,
  onStepClick,
  onStartStep,
}: SidebarProps) {
  return (
    <aside className="flex w-[384px] min-w-[320px] flex-col border-r border-gray-200 bg-white">
      <div className="flex flex-col gap-2 px-8 pb-10 pt-8">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
            進捗状況
          </span>
          <span className="text-xs font-bold text-blue-500">
            {progress}% 完了
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <h1 className="pt-4 text-lg font-bold text-black">{title}</h1>
        <p className="text-sm leading-6 text-gray-400">{description}</p>
      </div>

      <div className="flex flex-col gap-1 px-4 pb-8">
        {steps.map((step) => {
          const isActive = step.id === activeStepId;
          const isLocked = !step.completed && step.id !== activeStepId;
          const firstIncomplete = steps.find((s) => !s.completed);
          const isNextStep = firstIncomplete?.id === step.id;

          if (isActive || isNextStep) {
            return (
              <div key={step.id} className="py-2">
                <div
                  className="flex flex-col gap-3 rounded border border-blue-100 bg-blue-50/50 p-4 cursor-pointer"
                  onClick={() => onStepClick(step.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex shrink-0 items-start pt-0.5">
                      <div className="flex size-4 items-center justify-center rounded border-2 border-blue-500">
                        <div className="size-2 rounded-full bg-blue-500" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-black">
                        {step.title}
                      </span>
                      <span className="text-xs text-gray-400">
                        {step.description}
                      </span>
                    </div>
                  </div>
                  <div className="pl-7">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartStep(step.id);
                      }}
                      className="rounded bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 transition-colors"
                    >
                      ステップを開始
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={step.id}
              className={`flex gap-3 rounded p-3 cursor-pointer hover:bg-gray-50 ${
                isLocked ? "opacity-60" : ""
              }`}
              onClick={() => onStepClick(step.id)}
            >
              <div className="flex shrink-0 items-start pt-0.5">
                {step.completed ? (
                  <div className="flex size-[18px] items-center justify-center rounded bg-blue-500">
                    <Check className="size-4 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="size-4 rounded border border-gray-300 bg-gray-50" />
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-black">
                  {step.title}
                </span>
                <span className="text-xs text-gray-400">
                  目安時間: {step.estimatedMinutes}分
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
