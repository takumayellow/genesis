"use client";

import { ExternalLink, Check, Copy, BookOpen, Paintbrush } from "lucide-react";
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

const DESIGN_SPEC = [
  { property: "背景色", value: "bg-gray-50", raw: "#F9FAFB" },
  { property: "カード背景", value: "bg-white", raw: "#FFFFFF" },
  { property: "ボーダー", value: "border-gray-200", raw: "#E5E7EB" },
  { property: "テキスト（見出し）", value: "text-black font-bold", raw: "#000000" },
  { property: "テキスト（本文）", value: "text-gray-600 text-sm", raw: "#4B5563" },
  { property: "テキスト（補助）", value: "text-gray-400 text-xs", raw: "#9CA3AF" },
  { property: "アクセント", value: "bg-blue-500", raw: "#3B82F6" },
  { property: "角丸", value: "rounded", raw: "4px" },
  { property: "パディング", value: "p-8", raw: "32px" },
];

const RECOMMENDED_RESOURCES = [
  {
    title: "React公式ドキュメント - コンポーネントとprops",
    url: "https://ja.react.dev/learn/passing-props-to-a-component",
    tag: "React",
  },
  {
    title: "Tailwind CSS - ユーティリティファースト",
    url: "https://tailwindcss.com/docs/utility-first",
    tag: "CSS",
  },
  {
    title: "Next.js - App Router入門",
    url: "https://nextjs.org/docs/app",
    tag: "Next.js",
  },
  {
    title: "TypeScript Handbook - 基本的な型",
    url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
    tag: "TypeScript",
  },
];

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

        <DesignSpecSection />

        <RecommendedResources referenceUrl={activeStep?.referenceUrl} />
      </div>
    </main>
  );
}

function DesignSpecSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded border border-gray-200 bg-white p-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-left"
      >
        <div className="flex size-8 items-center justify-center rounded bg-purple-50">
          <Paintbrush className="size-4 text-purple-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-black">デザイン仕様</h3>
          <p className="text-xs text-gray-400">
            Tailwind CSS クラスとFigmaデザイントークン
          </p>
        </div>
        <span className="text-xs text-gray-400">
          {expanded ? "閉じる" : "開く"}
        </span>
      </button>

      {expanded && (
        <div className="mt-2 overflow-hidden rounded border border-gray-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-3 py-2 text-left font-bold text-gray-500">
                  プロパティ
                </th>
                <th className="px-3 py-2 text-left font-bold text-gray-500">
                  Tailwind クラス
                </th>
                <th className="px-3 py-2 text-left font-bold text-gray-500">
                  値
                </th>
              </tr>
            </thead>
            <tbody>
              {DESIGN_SPEC.map((spec) => (
                <tr
                  key={spec.property}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="px-3 py-2 text-gray-600">{spec.property}</td>
                  <td className="px-3 py-2">
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-blue-600">
                      {spec.value}
                    </code>
                  </td>
                  <td className="px-3 py-2 font-mono text-gray-400">
                    {spec.raw}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RecommendedResources({
  referenceUrl,
}: {
  readonly referenceUrl?: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded bg-blue-50">
          <BookOpen className="size-4 text-blue-500" />
        </div>
        <h3 className="text-sm font-bold text-black">おすすめ教材</h3>
      </div>

      <div className="flex flex-col gap-2">
        {referenceUrl && (
          <a
            href={referenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                推奨
              </span>
              <span>{referenceUrl}</span>
            </div>
            <ExternalLink className="size-3" />
          </a>
        )}
        {RECOMMENDED_RESOURCES.map((resource) => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded border border-gray-100 px-4 py-3 text-sm text-gray-700 hover:border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                {resource.tag}
              </span>
              <span>{resource.title}</span>
            </div>
            <ExternalLink className="size-3 text-gray-300" />
          </a>
        ))}
      </div>
    </div>
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
  const completedCount = task.steps.filter((s) => s.completed).length;
  const totalCount = task.steps.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
          要件
        </h3>
        <p className="text-sm leading-6 text-black">{task.description}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
            完了条件
          </h3>
          <span className="text-xs text-gray-400">
            {completedCount}/{totalCount} 完了 ({progressPercent}%)
          </span>
        </div>
        <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex flex-col gap-2">
          {task.steps.map((step) => (
            <label
              key={step.id}
              className="flex cursor-pointer items-center gap-3 rounded border border-gray-100 px-3 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <button
                onClick={() => onToggleCompletion(step.id)}
                className={`flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${
                  step.completed
                    ? "border-transparent bg-blue-500"
                    : "border-gray-300 bg-white hover:border-blue-300"
                }`}
              >
                {step.completed && (
                  <Check className="size-3 text-white" strokeWidth={3} />
                )}
              </button>
              <span
                className={`text-sm ${
                  step.completed ? "text-gray-400 line-through" : "text-black"
                }`}
              >
                {step.title}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
