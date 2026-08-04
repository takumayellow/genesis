"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Check } from "lucide-react";
import type { Task } from "@/lib/types";

interface RichStep {
  やること: string;
  公式教材のリンク: string;
  ヘルプ: string;
  答え: string;
}

export interface RichTaskData {
  issueUrl?: string;
  目的?: string;
  説明?: string;
  必要な知識?: string;
  ロードマップ?: string;
  ステップ?: RichStep[];
}

interface RichTaskViewProps {
  readonly richData: RichTaskData;
  readonly task: Task;
  readonly onToggleCompletion: (stepId: string) => void;
}

function AccordionStep({
  step,
  index,
  legacyStep,
  onToggle,
}: {
  readonly step: RichStep;
  readonly index: number;
  readonly legacyStep?: { id: string; completed: boolean };
  readonly onToggle?: (stepId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const checkboxId = legacyStep ? `step-check-${legacyStep.id}` : undefined;

  return (
    <div className="rounded border border-gray-200 bg-white overflow-hidden">
      <div className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
        {legacyStep && onToggle && checkboxId ? (
          <>
            <input
              type="checkbox"
              id={checkboxId}
              checked={legacyStep.completed}
              onChange={() => onToggle(legacyStep.id)}
              className="sr-only"
            />
            <label
              htmlFor={checkboxId}
              className={`flex size-5 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors ${
                legacyStep.completed
                  ? "border-transparent bg-blue-500"
                  : "border-gray-300 bg-white hover:border-blue-300"
              }`}
            >
              {legacyStep.completed && (
                <Check className="size-3 text-white" strokeWidth={3} />
              )}
            </label>
          </>
        ) : (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
            {index + 1}
          </span>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 items-center justify-between text-left"
        >
          <span
            className={`flex-1 text-sm font-medium ${
              legacyStep?.completed ? "text-gray-400 line-through" : "text-black"
            }`}
          >
            {step.やること}
          </span>
          {expanded ? (
            <ChevronUp className="size-4 shrink-0 text-gray-400" />
          ) : (
            <ChevronDown className="size-4 shrink-0 text-gray-400" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          {step.公式教材のリンク && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                公式教材
              </span>
              {/^https?:\/\//.test(step.公式教材のリンク) ? (
                <a
                  href={step.公式教材のリンク}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-500 hover:underline break-all"
                >
                  {step.公式教材のリンク}
                  <ExternalLink className="size-3 shrink-0" />
                </a>
              ) : (
                <span className="text-xs text-gray-500 break-all">
                  {step.公式教材のリンク}
                </span>
              )}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              ヘルプ
            </span>
            <p className="text-sm leading-6 text-gray-700">{step.ヘルプ}</p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              答え
            </span>
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {step.答え}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function RichTaskView({
  richData,
  task,
  onToggleCompletion,
}: RichTaskViewProps) {
  const steps = richData.ステップ ?? [];
  // Use richData.ステップ as the source of truth for total count to avoid
  // mismatch when task.steps (legacy) and richData.ステップ differ in length.
  const totalCount = steps.length > 0 ? steps.length : task.steps.length;
  const completedCount = task.steps
    .slice(0, totalCount)
    .filter((s) => s.completed).length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl px-8 py-8 flex flex-col gap-6">
      {/* ヘッダー */}
      <div className="rounded border border-gray-200 bg-white p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-black">{richData.目的}</h1>
          {richData.issueUrl && (
            <a
              href={richData.issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-gray-50 transition-colors"
            >
              Issue
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>

        {/* 進捗バー */}
        {totalCount > 0 && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                進捗状況
              </span>
              <span className="text-xs font-bold text-blue-500">
                {completedCount}/{totalCount} ({progressPercent}%)
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 説明 */}
      {richData.説明 && (
        <div className="rounded border border-gray-200 bg-white p-6 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            説明
          </span>
          <p className="text-sm leading-6 text-gray-700">{richData.説明}</p>
        </div>
      )}

      {/* 必要な知識 */}
      {richData.必要な知識 && (
        <div className="rounded border border-gray-200 bg-white p-6 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            必要な知識
          </span>
          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
            {richData.必要な知識}
          </p>
        </div>
      )}

      {/* ロードマップ */}
      {richData.ロードマップ && (
        <div className="rounded border border-gray-200 bg-white p-6 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            ロードマップ
          </span>
          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
            {richData.ロードマップ}
          </p>
        </div>
      )}

      {/* ステップ（アコーディオン） */}
      {steps.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-black">
            ステップ ({steps.length})
          </span>
          {steps.map((step, index) => {
            // legacyStep is matched by position (index) because richData.ステップ
            // has no stable ID. If a stable ID becomes available in the future,
            // replace this with an ID-based lookup for reliable mapping.
            const legacyStep = task.steps[index];
            return (
              <AccordionStep
                key={legacyStep?.id ?? index}
                step={step}
                index={index}
                legacyStep={legacyStep ? { id: legacyStep.id, completed: legacyStep.completed } : undefined}
                onToggle={onToggleCompletion}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
