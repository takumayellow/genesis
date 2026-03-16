"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import type { AnalyzedTask } from "@/app/api/analyze-issue/route";

export default function NewTaskPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const projectId = params.project as string;

  const [issueUrl, setIssueUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analyzedTask, setAnalyzedTask] = useState<AnalyzedTask | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setAnalyzedTask(null);

    try {
      // Step 1: Fetch GitHub Issue info
      const issueRes = await fetch("/api/github/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueUrl }),
      });

      if (!issueRes.ok) {
        throw new Error("GitHub Issueの取得に失敗しました");
      }

      const issueData = await issueRes.json();

      // Step 2: Analyze with Gemini
      const analyzeRes = await fetch("/api/analyze-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueUrl,
          issueTitle: issueData.title,
          issueBody: issueData.body,
        }),
      });

      if (!analyzeRes.ok) {
        throw new Error("タスク分解に失敗しました");
      }

      const analyzed: AnalyzedTask = await analyzeRes.json();
      setAnalyzedTask(analyzed);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "エラーが発生しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !analyzedTask) return;

    setSaving(true);
    setError(null);

    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        projectId,
        issueUrl: analyzedTask.issueUrl,
        目的: analyzedTask.目的,
        説明: analyzedTask.説明,
        必要な知識: analyzedTask.必要な知識,
        ロードマップ: analyzedTask.ロードマップ,
        ステップ: analyzedTask.ステップ,
        // Legacy fields for compatibility with existing TaskDetail component
        title: analyzedTask.目的,
        description: analyzedTask.説明,
        steps: analyzedTask.ステップ.map((s, i) => ({
          id: `step-${i + 1}`,
          title: s.やること,
          description: s.ヘルプ,
          estimatedMinutes: 15,
          referenceUrl: s.公式教材のリンク || undefined,
          completed: false,
        })),
        assigneeId: user.uid,
        status: "published",
        createdAt: new Date(),
      });

      router.push(`/${projectId}/tasks/${docRef.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "保存に失敗しました";
      setError(message);
      setSaving(false);
    }
  };

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        breadcrumbs={[
          { label: projectId, href: `/${projectId}` },
          { label: "タスク", href: `/${projectId}` },
          { label: "新規タスク作成" },
        ]}
      />
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-xl font-bold text-black">
            <Sparkles className="mr-2 inline size-5 text-blue-500" />
            Issue からタスクを生成
          </h1>

          {/* URL入力フォーム */}
          <div className="mb-6 flex flex-col gap-4 rounded border border-gray-200 bg-white p-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-black">
                GitHub Issue URL
              </label>
              <input
                type="url"
                value={issueUrl}
                onChange={(e) => setIssueUrl(e.target.value)}
                placeholder="https://github.com/org/repo/issues/123"
                className="rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !issueUrl.trim()}
              className="flex items-center justify-center gap-2 rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  AI分析中...
                </>
              ) : (
                "Issueを分析してタスク生成"
              )}
            </button>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 生成結果 */}
          {analyzedTask && (
            <div className="flex flex-col gap-4">
              {/* 目的・説明・必要な知識・ロードマップ */}
              <div className="rounded border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-bold text-black">
                  {analyzedTask.目的}
                </h2>

                <div className="mb-4 flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    説明
                  </span>
                  <p className="text-sm text-gray-700">{analyzedTask.説明}</p>
                </div>

                <div className="mb-4 flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    必要な知識
                  </span>
                  <p className="whitespace-pre-wrap text-sm text-gray-700">
                    {analyzedTask.必要な知識}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    ロードマップ
                  </span>
                  <p className="whitespace-pre-wrap text-sm text-gray-700">
                    {analyzedTask.ロードマップ}
                  </p>
                </div>
              </div>

              {/* ステップ一覧（アコーディオン） */}
              <div className="flex flex-col gap-1">
                <span className="mb-1 text-sm font-semibold text-black">
                  ステップ ({analyzedTask.ステップ.length})
                </span>
                {analyzedTask.ステップ.map((step, index) => (
                  <div
                    key={index}
                    className="rounded border border-gray-200 bg-white overflow-hidden"
                  >
                    <button
                      onClick={() => toggleStep(index)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-black">
                          {step.やること}
                        </span>
                      </div>
                      {expandedStep === index ? (
                        <ChevronUp className="size-4 shrink-0 text-gray-400" />
                      ) : (
                        <ChevronDown className="size-4 shrink-0 text-gray-400" />
                      )}
                    </button>
                    {expandedStep === index && (
                      <div className="border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
                        {step.公式教材のリンク && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400">
                              公式教材
                            </span>
                            <a
                              href={step.公式教材のリンク}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline break-all"
                            >
                              {step.公式教材のリンク}
                            </a>
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-gray-400">
                            ヘルプ
                          </span>
                          <p className="text-sm text-gray-700">{step.ヘルプ}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-gray-400">
                            答え
                          </span>
                          <p className="whitespace-pre-wrap text-sm text-gray-700">
                            {step.答え}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 保存ボタン */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  "タスクとして保存"
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
