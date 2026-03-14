"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import Link from "next/link";
import { BookOpen, Code, GitBranch, Palette } from "lucide-react";

const LEARNING_MODULES = [
  {
    id: "html-css",
    title: "HTML & CSS 基礎",
    description: "Webページの構造とスタイリングの基本を学びます。",
    icon: Code,
    lessons: 8,
    estimatedHours: 3,
  },
  {
    id: "git-github",
    title: "Git & GitHub",
    description: "バージョン管理とチーム開発の基本を学びます。",
    icon: GitBranch,
    lessons: 6,
    estimatedHours: 2,
  },
  {
    id: "react",
    title: "React 入門",
    description: "コンポーネントベースのUI開発を学びます。",
    icon: BookOpen,
    lessons: 10,
    estimatedHours: 5,
  },
  {
    id: "tailwind",
    title: "Tailwind CSS",
    description: "ユーティリティファーストのCSS フレームワークを学びます。",
    icon: Palette,
    lessons: 5,
    estimatedHours: 2,
  },
];

export default function LearnPage() {
  const params = useParams();
  const projectId = params.project as string;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        breadcrumbs={[
          { label: projectId, href: `/${projectId}` },
          { label: "教材" },
        ]}
      />
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-xl font-bold text-black">学習教材</h1>
          <p className="mb-6 text-sm text-gray-400">
            プロジェクトで必要な知識をじっくり学びましょう。
          </p>

          <div className="grid grid-cols-2 gap-4">
            {LEARNING_MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.id}
                  href={`/${projectId}/learn/${mod.id}`}
                  className="flex flex-col gap-3 rounded border border-gray-200 bg-white p-6 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="flex size-10 items-center justify-center rounded bg-blue-50">
                    <Icon className="size-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-black">
                      {mod.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      {mod.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-300">
                    <span>{mod.lessons} レッスン</span>
                    <span>約{mod.estimatedHours}時間</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
