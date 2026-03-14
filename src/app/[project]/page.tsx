"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import { isDemoMode, getDemoTasks } from "@/lib/demo-mode";

export default function ProjectDashboard() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const projectId = params.project as string;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) return null;

  const tasks = isDemoMode()
    ? getDemoTasks().map((task) => {
        const completedSteps = task.steps.filter((s) => s.completed).length;
        const progress = Math.round(
          (completedSteps / task.steps.length) * 100
        );
        return {
          id: task.id,
          title: task.title,
          progress,
          status: task.status,
        };
      })
    : [
        {
          id: "task-1",
          title: "環境構築",
          progress: 100,
          status: "completed" as const,
        },
        {
          id: "task-2",
          title: "Gitの基本操作",
          progress: 100,
          status: "completed" as const,
        },
        {
          id: "task-3",
          title: "Reactコンポーネント入門",
          progress: 80,
          status: "published" as const,
        },
        {
          id: "task-4",
          title: "LPのヘッダー作成",
          progress: 40,
          status: "published" as const,
        },
        {
          id: "task-5",
          title: "フッターの実装",
          progress: 0,
          status: "draft" as const,
        },
      ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header breadcrumbs={[{ label: projectId }]} />
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-bold text-black">あなたのタスク</h1>
            <Link
              href={`/${projectId}/learn`}
              className="text-sm text-blue-500 hover:underline"
            >
              教材を見る
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/${projectId}/tasks/${task.id}`}
                className="flex items-center justify-between rounded border border-gray-200 bg-white p-4 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  {task.status === "completed" ? (
                    <CheckCircle className="size-5 text-green-500" />
                  ) : (
                    <Clock className="size-5 text-gray-300" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-black">
                      {task.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1 w-24 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {task.progress}%
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="size-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
