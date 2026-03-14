"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Sparkles } from "lucide-react";
import type { TaskStep } from "@/lib/types";

export default function GenerateTaskPage() {
  const params = useParams();
  const { user } = useAuth();
  const projectId = params.project as string;

  const [issueUrl, setIssueUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedSteps, setGeneratedSteps] = useState<TaskStep[]>([]);
  const [issueTitle, setIssueTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedSteps([]);

    try {
      // Fetch issue details
      const issueRes = await fetch("/api/github/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueUrl }),
      });

      if (!issueRes.ok) {
        throw new Error("GitHub Issueの取得に失敗しました");
      }

      const issueData = await issueRes.json();
      setIssueTitle(issueData.title);

      // Generate steps with Gemini
      const sliceRes = await fetch("/api/gemini/slice-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueTitle: issueData.title,
          issueBody: issueData.body,
          repoUrl: issueUrl.replace(/\/issues\/\d+$/, ""),
        }),
      });

      if (!sliceRes.ok) {
        throw new Error("タスク分解に失敗しました");
      }

      const { steps } = await sliceRes.json();
      const formattedSteps: TaskStep[] = steps.map(
        (s: Omit<TaskStep, "id" | "completed">, i: number) => ({
          ...s,
          id: `step-${i + 1}`,
          completed: false,
        })
      );

      setGeneratedSteps(formattedSteps);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "エラーが発生しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || generatedSteps.length === 0) return;

    try {
      await addDoc(collection(db, "tasks"), {
        projectId,
        title: issueTitle,
        description: `GitHub Issue から自動生成されたタスク`,
        steps: generatedSteps,
        assigneeId: "",
        status: "draft",
        createdAt: new Date(),
      });
      setSaved(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "保存に失敗しました";
      setError(message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        breadcrumbs={[
          { label: projectId, href: `/${projectId}` },
          { label: "タスク生成" },
        ]}
      />
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-xl font-bold text-black">
            <Sparkles className="mr-2 inline size-5 text-blue-500" />
            AIタスク生成
          </h1>

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
              onClick={handleGenerate}
              disabled={loading || !issueUrl.trim()}
              className="flex items-center justify-center gap-2 rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  AI分析中...
                </>
              ) : (
                "極小ステップに分解"
              )}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {generatedSteps.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-black">{issueTitle}</h2>
                {!saved && (
                  <button
                    onClick={handleSave}
                    className="rounded bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600 transition-colors"
                  >
                    タスクとして保存
                  </button>
                )}
                {saved && (
                  <span className="text-sm font-medium text-green-600">
                    保存しました
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {generatedSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="rounded border border-gray-200 bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                        {index + 1}
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-black">
                          {step.title}
                        </span>
                        <span className="text-xs text-gray-400">
                          {step.description}
                        </span>
                        <span className="text-xs text-gray-300">
                          約{step.estimatedMinutes}分
                        </span>
                        {step.command && (
                          <code className="mt-1 rounded bg-gray-100 px-2 py-1 font-mono text-xs text-black">
                            {step.command}
                          </code>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
