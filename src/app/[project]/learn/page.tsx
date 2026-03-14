"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import Link from "next/link";
import {
  BookOpen,
  Code,
  GitBranch,
  Palette,
  FileCode2,
  Globe,
  Users,
  Star,
  Layers,
} from "lucide-react";

type Difficulty = "入門" | "初級" | "中級";

interface LearningModule {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: typeof Code;
  readonly lessons: number;
  readonly estimatedHours: number;
  readonly difficulty: Difficulty;
  readonly recommended: boolean;
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  入門: "bg-green-100 text-green-700",
  初級: "bg-blue-100 text-blue-700",
  中級: "bg-purple-100 text-purple-700",
};

const LEARNING_MODULES: readonly LearningModule[] = [
  {
    id: "html-css",
    title: "HTML & CSS基礎",
    description:
      "Webページの構造（HTML）と見た目（CSS）の基本を学びます。セマンティックなマークアップやレスポンシブデザインの考え方も扱います。",
    icon: Code,
    lessons: 8,
    estimatedHours: 3,
    difficulty: "入門",
    recommended: false,
  },
  {
    id: "git-github",
    title: "Git & GitHub",
    description:
      "バージョン管理の基礎からブランチ運用、プルリクエストの作り方まで。チーム開発に欠かせないスキルを実践的に学びます。",
    icon: GitBranch,
    lessons: 6,
    estimatedHours: 2,
    difficulty: "入門",
    recommended: false,
  },
  {
    id: "javascript",
    title: "JavaScript基礎",
    description:
      "変数・関数・配列・オブジェクトなどの基本文法から、非同期処理（async/await）やES Modules まで、モダンJSの基礎を習得します。",
    icon: FileCode2,
    lessons: 10,
    estimatedHours: 5,
    difficulty: "初級",
    recommended: false,
  },
  {
    id: "typescript",
    title: "TypeScript入門",
    description:
      "型の基本からジェネリクス、ユーティリティ型まで。型安全な開発の第一歩を踏み出しましょう。",
    icon: FileCode2,
    lessons: 7,
    estimatedHours: 3,
    difficulty: "初級",
    recommended: false,
  },
  {
    id: "react",
    title: "React入門",
    description:
      "コンポーネント、props、state、useEffect など React の中核概念を学びます。実際にTodoアプリを作りながら理解を深めましょう。",
    icon: BookOpen,
    lessons: 10,
    estimatedHours: 5,
    difficulty: "初級",
    recommended: true,
  },
  {
    id: "tailwind",
    title: "Tailwind CSS",
    description:
      "ユーティリティファーストのCSSフレームワーク。クラス名だけで素早くUIを構築するテクニックとレスポンシブ対応を学びます。",
    icon: Palette,
    lessons: 5,
    estimatedHours: 2,
    difficulty: "入門",
    recommended: false,
  },
  {
    id: "nextjs",
    title: "Next.js基礎",
    description:
      "App Router、Server Components、データフェッチ、ルーティングなど、Next.js 15 の主要機能を体系的に学びます。",
    icon: Globe,
    lessons: 8,
    estimatedHours: 4,
    difficulty: "中級",
    recommended: false,
  },
  {
    id: "team-dev",
    title: "チーム開発の進め方",
    description:
      "Issue駆動開発、コードレビューの作法、CI/CD、スクラムの基本など、実務で求められるチーム開発のワークフローを学びます。",
    icon: Users,
    lessons: 6,
    estimatedHours: 2,
    difficulty: "中級",
    recommended: false,
  },
];

export default function LearnPage() {
  const params = useParams();
  const projectId = params.project as string;

  const totalModules = LEARNING_MODULES.length;
  const totalLessons = LEARNING_MODULES.reduce((s, m) => s + m.lessons, 0);
  const totalHours = LEARNING_MODULES.reduce(
    (s, m) => s + m.estimatedHours,
    0,
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        breadcrumbs={[
          { label: projectId, href: `/${projectId}` },
          { label: "教材" },
        ]}
      />
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-xl font-bold text-black">学習教材</h1>
          <p className="mb-6 text-sm text-gray-400">
            プロジェクトで必要な知識をじっくり学びましょう。カードをクリックして各モジュールの詳細へ進めます。
          </p>

          <div className="mb-4 flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Layers className="size-3" />
              {"全 " + totalModules + " モジュール"}
            </span>
            <span>{"計 " + totalLessons + " レッスン"}</span>
            <span>{"約 " + totalHours + " 時間"}</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {LEARNING_MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.id}
                  href={`/${projectId}/learn/${mod.id}`}
                  className="group relative flex flex-col gap-3 rounded border border-gray-200 bg-white p-6 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  {mod.recommended && (
                    <span className="absolute -top-2 right-4 flex items-center gap-1 rounded bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-yellow-900 shadow-sm">
                      <Star className="size-3" />
                      おすすめ
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <Icon className="size-5 text-blue-500" />
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${DIFFICULTY_STYLES[mod.difficulty]}`}
                    >
                      {mod.difficulty}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-black">
                      {mod.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-gray-400">
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
