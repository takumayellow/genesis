"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { TaskDetail } from "@/components/task-detail";
import type { Task, TaskStep } from "@/lib/types";

export default function TaskPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const projectId = params.project as string;
  const taskId = params.taskId as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    const fetchTask = async () => {
      try {
        const taskDoc = await getDoc(doc(db, "tasks", taskId));
        if (taskDoc.exists()) {
          setTask({ id: taskDoc.id, ...taskDoc.data() } as Task);
        }
      } catch {
        // Task not found - use demo data
        setTask(createDemoTask(taskId, projectId));
      }
      setLoading(false);
    };

    if (!authLoading) {
      fetchTask();
    }
  }, [taskId, projectId, user, authLoading, router]);

  const handleToggleCompletion = useCallback(
    async (stepId: string) => {
      if (!task) return;

      const updatedSteps = task.steps.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      );

      const updatedTask = { ...task, steps: updatedSteps };
      setTask(updatedTask);

      try {
        await updateDoc(doc(db, "tasks", task.id), { steps: updatedSteps });
      } catch {
        // Firestore update failed, keep local state
      }
    },
    [task]
  );

  const handleStepClick = useCallback((stepId: string) => {
    setActiveStepId(stepId);
  }, []);

  const handleStartStep = useCallback((stepId: string) => {
    setActiveStepId(stepId);
  }, []);

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-400">読み込み中...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-400">
          タスクが見つかりませんでした
        </div>
      </div>
    );
  }

  const completedSteps = task.steps.filter((s) => s.completed).length;
  const progress = Math.round((completedSteps / task.steps.length) * 100);
  const activeStep =
    task.steps.find((s) => s.id === activeStepId) ?? null;

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header
        breadcrumbs={[
          { label: "カリキュラム", href: `/${projectId}` },
          { label: task.title },
        ]}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          title={task.title}
          description={task.description}
          steps={task.steps}
          activeStepId={activeStepId}
          progress={progress}
          onStepClick={handleStepClick}
          onStartStep={handleStartStep}
        />
        <TaskDetail
          task={task}
          activeStep={activeStep}
          onToggleCompletion={handleToggleCompletion}
        />
      </div>
    </div>
  );
}

function createDemoTask(taskId: string, projectId: string): Task {
  return {
    id: taskId,
    projectId,
    title: "LPのヘッダー作成",
    description:
      "Flexboxレイアウトをマスターして、メインナビゲーションコンポーネントを構築しましょう。",
    assigneeId: "",
    status: "published",
    createdAt: new Date(),
    steps: [
      {
        id: "step-1",
        title: "Flexboxのドキュメントを読む",
        description: "MDNのFlexboxガイドを読んで基本概念を理解します。",
        estimatedMinutes: 10,
        referenceUrl:
          "https://developer.mozilla.org/ja/docs/Web/CSS/CSS_flexible_box_layout",
        completed: true,
      },
      {
        id: "step-2",
        title: "リポジトリをクローンする",
        description: "開発用のブランチを作成してローカルに準備します。",
        estimatedMinutes: 5,
        command: "git checkout -b feature/header",
        completed: true,
      },
      {
        id: "step-3",
        title: "Header.tsx の構造を理解する",
        description: "提供されたスターターコードを分析します。",
        estimatedMinutes: 10,
        referenceUrl: "https://react.dev/learn",
        completed: false,
      },
      {
        id: "step-4",
        title: "ナビゲーションリンクの実装",
        description: "Flexboxを使ってナビゲーションリンクを横並びに配置します。",
        estimatedMinutes: 15,
        completed: false,
      },
      {
        id: "step-5",
        title: "Tailwind クラスの適用",
        description:
          "デザイン仕様に合わせてTailwind CSSクラスを適用します。",
        estimatedMinutes: 20,
        command:
          'className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200"',
        completed: false,
      },
    ],
  };
}
