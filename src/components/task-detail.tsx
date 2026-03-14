"use client";

import { ExternalLink, Check, Copy } from "lucide-react";
import { useState } from "react";
import type { Task, TaskStep } from "@/lib/types";

interface TaskDetailProps {
  readonly task: Task;
  readonly activeStep: TaskStep | null;
  readonly onToggleCompletion: (stepId: string) => void;
}

function CopyButton({ text }: { readonly text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 rounded bg-white/80 px-2 py-1 text-xs text-gray-600 hover:bg-white transition-colors"
    >
      {copied ? (
        <>
          <Check className="size-3" />
          コピー済
        </>
      ) : (
        <>
          <Copy className="size-3" />
          コピー
        </>
      )}
    </button>
  );
}

export function TaskDetail({
  task,
  activeStep,
  onToggleCompletion,
}: TaskDetailProps) {
  return (
    <main className="flex-1 overflow-auto bg-white px-16 py-12">
      <div className="flex max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-6 rounded border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-800">
                  公開中
                </span>
                <span className="text-xs font-medium text-gray-400">
                  講師によって作成されました
                </span>
              </div>
              <h2 className="text-2xl font-bold text-black">{task.title}</h2>
            </div>
            <a
              href={`https://github.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded border border-gray-200 px-4 py-2 text-sm font-medium text-blue-500 hover:bg-gray-50 transition-colors"
            >
              GitHubで見る
              <ExternalLink className="size-3" />
            </a>
          </div>

          {activeStep ? (
            <ActiveStepDetail step={activeStep} />
          ) : (
            <TaskOverview task={task} onToggleCompletion={onToggleCompletion} />
          )}
        </div>

        {activeStep?.referenceUrl && (
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-normal text-black">おすすめ教材</h3>
            <a
              href={activeStep.referenceUrl}
              className="text-sm text-blue-500 hover:underline"
            >
              {activeStep.referenceUrl}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

function ActiveStepDetail({ step }: { readonly step: TaskStep }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
          現在のステップ
        </h3>
        <p className="text-lg font-bold text-black">{step.title}</p>
        <p className="text-sm leading-6 text-gray-600">{step.description}</p>
      </div>

      {step.command && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
            コマンド
          </h3>
          <div className="relative overflow-hidden rounded border border-gray-200 bg-gray-100 px-4 py-3">
            <code className="font-mono text-sm text-black">{step.command}</code>
            <div className="absolute right-2 top-2">
              <CopyButton text={step.command} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskOverview({
  task,
  onToggleCompletion,
}: {
  readonly task: Task;
  readonly onToggleCompletion: (stepId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
          要件
        </h3>
        <p className="text-sm leading-6 text-black">{task.description}</p>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
          完了条件
        </h3>
        <div className="flex flex-col gap-2">
          {task.steps.map((step) => (
            <label
              key={step.id}
              className="flex cursor-pointer items-center gap-2"
            >
              <button
                onClick={() => onToggleCompletion(step.id)}
                className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                  step.completed
                    ? "border-transparent bg-blue-500"
                    : "border-gray-300 bg-white"
                }`}
              >
                {step.completed && (
                  <Check className="size-3 text-white" strokeWidth={3} />
                )}
              </button>
              <span className="text-sm text-black">{step.title}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
