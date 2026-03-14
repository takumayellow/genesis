"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/header";
import { Check, Clock, Copy, BookOpen } from "lucide-react";

interface Lesson {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly estimatedMinutes: number;
  readonly codeExample?: string;
}

interface ModuleData {
  readonly title: string;
  readonly description: string;
  readonly lessons: readonly Lesson[];
}

const MODULE_DATA: Record<string, ModuleData> = {
  react: {
    title: "React入門",
    description:
      "コンポーネントベースのUI開発を基礎から学びます。実際にTodoアプリを作りながらReactの中核概念を理解しましょう。",
    lessons: [
      {
        id: "react-01",
        title: "Reactとは何か？ - SPA と宣言的UI",
        description:
          "ReactがなぜUIライブラリとして広く使われているのか、SPAの概念と宣言的UIのメリットを理解します。",
        estimatedMinutes: 15,
      },
      {
        id: "react-02",
        title: "JSX の基本 - HTMLライクな構文",
        description:
          "JSXの書き方、式の埋め込み、条件分岐・リスト描画のパターンを学びます。",
        estimatedMinutes: 20,
        codeExample: `function Greeting({ name }: { name: string }) {
  return (
    <div className="p-4">
      <h1>こんにちは、{name}さん！</h1>
      <p>Reactの世界へようこそ。</p>
    </div>
  );
}`,
      },
      {
        id: "react-03",
        title: "コンポーネントと props",
        description:
          "UIを再利用可能なコンポーネントに分割し、propsでデータを渡す方法を学びます。readonly と型定義のベストプラクティスも扱います。",
        estimatedMinutes: 25,
        codeExample: `interface ButtonProps {
  readonly label: string;
  readonly variant?: "primary" | "secondary";
  readonly onClick: () => void;
}

function Button({ label, variant = "primary", onClick }: ButtonProps) {
  const base = "rounded px-4 py-2 text-sm font-bold transition-colors";
  const styles = variant === "primary"
    ? "bg-blue-500 text-white hover:bg-blue-600"
    : "border border-gray-300 text-gray-700 hover:bg-gray-50";

  return (
    <button className={base + " " + styles} onClick={onClick}>
      {label}
    </button>
  );
}`,
      },
      {
        id: "react-04",
        title: "useState - 状態管理の基本",
        description:
          "useStateフックを使ってコンポーネントに状態を持たせる方法。カウンターやフォーム入力の例を通じて学びます。",
        estimatedMinutes: 25,
        codeExample: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        +1
      </button>
    </div>
  );
}`,
      },
      {
        id: "react-05",
        title: "イベント処理とフォーム",
        description:
          "onChange、onSubmit などのイベントハンドラと、制御コンポーネントによるフォーム管理を学びます。",
        estimatedMinutes: 20,
      },
      {
        id: "react-06",
        title: "useEffect - 副作用の管理",
        description:
          "データフェッチやDOMの直接操作など、レンダリング以外の処理をuseEffectで行う方法と、クリーンアップの重要性を学びます。",
        estimatedMinutes: 30,
        codeExample: `function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      const res = await fetch("/api/users/" + userId);
      const data = await res.json();
      if (!cancelled) setUser(data);
    }

    fetchUser();
    return () => { cancelled = true; };
  }, [userId]);

  if (!user) return <p>読み込み中...</p>;
  return <p>{user.name}</p>;
}`,
      },
      {
        id: "react-07",
        title: "リストとキー",
        description:
          "配列データをmapでレンダリングする方法とkey属性の重要性。パフォーマンスへの影響も解説します。",
        estimatedMinutes: 15,
      },
      {
        id: "react-08",
        title: "条件付きレンダリングのパターン",
        description:
          "三項演算子、&&演算子、early return など、条件に応じてUIを出し分けるパターンを整理します。",
        estimatedMinutes: 15,
      },
      {
        id: "react-09",
        title: "カスタムフック - ロジックの再利用",
        description:
          "useStateやuseEffectを組み合わせたカスタムフックを作り、コンポーネント間でロジックを共有する方法を学びます。",
        estimatedMinutes: 25,
        codeExample: `function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      },
      {
        id: "react-10",
        title: "実践: Todo アプリを作ろう",
        description:
          "これまで学んだ知識を総動員して、CRUD機能を持つTodoアプリを完成させます。コンポーネント分割、状態管理、イベント処理を実践します。",
        estimatedMinutes: 45,
      },
    ],
  },
  "html-css": {
    title: "HTML & CSS基礎",
    description: "Webページの構造とスタイリングの基本を学びます。",
    lessons: [
      { id: "hc-01", title: "HTMLの基本構造", description: "DOCTYPE、head、body の役割を理解します。", estimatedMinutes: 15 },
      { id: "hc-02", title: "セマンティックHTML", description: "header、main、section など意味のあるタグの使い分けを学びます。", estimatedMinutes: 15 },
      { id: "hc-03", title: "CSSセレクタとカスケード", description: "セレクタの種類と優先度のルールを理解します。", estimatedMinutes: 20 },
      { id: "hc-04", title: "Flexbox レイアウト", description: "FlexboxでUIレイアウトを柔軟に組む方法を学びます。", estimatedMinutes: 25 },
      { id: "hc-05", title: "CSS Grid レイアウト", description: "Gridで2次元レイアウトを構築する方法を学びます。", estimatedMinutes: 25 },
      { id: "hc-06", title: "レスポンシブデザイン", description: "メディアクエリとモバイルファーストの考え方を学びます。", estimatedMinutes: 20 },
      { id: "hc-07", title: "CSS変数とモダンCSS", description: "カスタムプロパティ、clamp()、container queries を紹介します。", estimatedMinutes: 20 },
      { id: "hc-08", title: "実践: プロフィールカード", description: "学んだ知識でレスポンシブなカードUIを作ります。", estimatedMinutes: 30 },
    ],
  },
  "git-github": {
    title: "Git & GitHub",
    description: "バージョン管理とチーム開発の基本を学びます。",
    lessons: [
      { id: "gg-01", title: "Git の基本概念", description: "リポジトリ、コミット、ブランチの概念を理解します。", estimatedMinutes: 15 },
      { id: "gg-02", title: "基本操作: add, commit, push", description: "日常的に使う基本コマンドを実践します。", estimatedMinutes: 20 },
      { id: "gg-03", title: "ブランチ運用", description: "ブランチの作成・マージ・削除の流れを学びます。", estimatedMinutes: 20 },
      { id: "gg-04", title: "プルリクエストの作り方", description: "PRの作成からレビュー、マージまでの流れを体験します。", estimatedMinutes: 25 },
      { id: "gg-05", title: "コンフリクトの解消", description: "コンフリクトが起きる原因と解消方法を学びます。", estimatedMinutes: 20 },
      { id: "gg-06", title: "実践: チーム開発シミュレーション", description: "擬似的なチーム開発をGitHub上で体験します。", estimatedMinutes: 30 },
    ],
  },
  javascript: {
    title: "JavaScript基礎",
    description: "モダンJavaScriptの基礎を習得します。",
    lessons: [
      { id: "js-01", title: "変数と型", description: "let/const、プリミティブ型、型変換を学びます。", estimatedMinutes: 15 },
      { id: "js-02", title: "関数とアロー関数", description: "関数宣言・式、アロー関数の使い分けを学びます。", estimatedMinutes: 20 },
      { id: "js-03", title: "配列の操作", description: "map、filter、reduce など高階関数を使った配列操作を学びます。", estimatedMinutes: 25 },
      { id: "js-04", title: "オブジェクトと分割代入", description: "オブジェクトの操作、スプレッド構文、分割代入を学びます。", estimatedMinutes: 20 },
      { id: "js-05", title: "非同期処理 - Promise", description: "Promiseの仕組みとチェーンの書き方を理解します。", estimatedMinutes: 25 },
      { id: "js-06", title: "非同期処理 - async/await", description: "async/awaitで非同期コードを読みやすく書く方法を学びます。", estimatedMinutes: 20 },
      { id: "js-07", title: "ES Modules", description: "import/export によるモジュール分割を学びます。", estimatedMinutes: 15 },
      { id: "js-08", title: "エラーハンドリング", description: "try/catch とカスタムエラーの使い方を学びます。", estimatedMinutes: 15 },
      { id: "js-09", title: "DOM 操作の基本", description: "querySelector、イベントリスナーの基本を学びます。", estimatedMinutes: 20 },
      { id: "js-10", title: "実践: クイズアプリ", description: "学んだ知識でインタラクティブなクイズアプリを作ります。", estimatedMinutes: 40 },
    ],
  },
  typescript: {
    title: "TypeScript入門",
    description: "型安全な開発の第一歩を踏み出しましょう。",
    lessons: [
      { id: "ts-01", title: "TypeScriptとは", description: "JavaScriptとの違い、型チェックの仕組みを理解します。", estimatedMinutes: 15 },
      { id: "ts-02", title: "基本的な型", description: "string、number、boolean、配列、オブジェクトの型注釈を学びます。", estimatedMinutes: 20 },
      { id: "ts-03", title: "interface と type", description: "型の定義方法と使い分けを学びます。", estimatedMinutes: 20 },
      { id: "ts-04", title: "Union型とリテラル型", description: "柔軟な型表現でより安全なコードを書きます。", estimatedMinutes: 20 },
      { id: "ts-05", title: "ジェネリクス", description: "型パラメータを使って汎用的な関数・型を作ります。", estimatedMinutes: 25 },
      { id: "ts-06", title: "ユーティリティ型", description: "Partial、Pick、Omit など便利な組み込み型を学びます。", estimatedMinutes: 25 },
      { id: "ts-07", title: "実践: 型安全なAPIクライアント", description: "学んだ知識で型安全なfetchラッパーを作ります。", estimatedMinutes: 30 },
    ],
  },
  tailwind: {
    title: "Tailwind CSS",
    description: "ユーティリティファーストのCSSフレームワークを学びます。",
    lessons: [
      { id: "tw-01", title: "Tailwind CSSの考え方", description: "ユーティリティファーストとは何かを理解します。", estimatedMinutes: 15 },
      { id: "tw-02", title: "レイアウトとスペーシング", description: "flex、grid、margin、padding のユーティリティを学びます。", estimatedMinutes: 20 },
      { id: "tw-03", title: "カラーとタイポグラフィ", description: "色、フォントサイズ、フォントウェイトの指定方法を学びます。", estimatedMinutes: 15 },
      { id: "tw-04", title: "レスポンシブとダークモード", description: "ブレークポイントとdarkバリアントの使い方を学びます。", estimatedMinutes: 20 },
      { id: "tw-05", title: "実践: UIコンポーネント集", description: "ボタン、カード、フォームをTailwindで作ります。", estimatedMinutes: 30 },
    ],
  },
  nextjs: {
    title: "Next.js基礎",
    description: "Next.js 15 の主要機能を体系的に学びます。",
    lessons: [
      { id: "nj-01", title: "Next.jsの概要", description: "Next.jsが解決する課題とApp Routerの概念を理解します。", estimatedMinutes: 15 },
      { id: "nj-02", title: "ファイルベースルーティング", description: "ディレクトリ構造とルーティングの対応を学びます。", estimatedMinutes: 20 },
      { id: "nj-03", title: "Server Components", description: "サーバーコンポーネントとクライアントコンポーネントの違いを理解します。", estimatedMinutes: 25 },
      { id: "nj-04", title: "データフェッチ", description: "Server Componentでのデータ取得パターンを学びます。", estimatedMinutes: 25 },
      { id: "nj-05", title: "レイアウトとテンプレート", description: "layout.tsx、loading.tsx、error.tsx の使い方を学びます。", estimatedMinutes: 20 },
      { id: "nj-06", title: "Server Actions", description: "フォーム送信やデータ更新をServer Actionsで行う方法を学びます。", estimatedMinutes: 25 },
      { id: "nj-07", title: "ミドルウェアと認証", description: "middlewareの仕組みと認証パターンを理解します。", estimatedMinutes: 20 },
      { id: "nj-08", title: "実践: ブログアプリ", description: "CRUD機能を持つブログをNext.jsで作ります。", estimatedMinutes: 45 },
    ],
  },
  "team-dev": {
    title: "チーム開発の進め方",
    description: "実務で求められるチーム開発のワークフローを学びます。",
    lessons: [
      { id: "td-01", title: "Issue駆動開発", description: "Issueを起点とした開発フローを理解します。", estimatedMinutes: 15 },
      { id: "td-02", title: "コードレビューの作法", description: "良いPRの書き方とレビューの仕方を学びます。", estimatedMinutes: 20 },
      { id: "td-03", title: "CI/CDの基本", description: "GitHub Actionsでテスト・ビルドを自動化する方法を学びます。", estimatedMinutes: 25 },
      { id: "td-04", title: "コーディング規約とLint", description: "ESLint・Prettierでチームのコード品質を保つ方法を学びます。", estimatedMinutes: 15 },
      { id: "td-05", title: "スクラムの基本", description: "スプリント、デイリースタンドアップ、レトロスペクティブを理解します。", estimatedMinutes: 20 },
      { id: "td-06", title: "実践: チームワークフロー演習", description: "模擬プロジェクトでIssue作成からマージまでを体験します。", estimatedMinutes: 30 },
    ],
  },
};

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
      className="flex items-center gap-1 rounded bg-white px-2 py-1 text-xs text-gray-500 shadow-sm hover:bg-gray-50 transition-colors"
    >
      {copied ? (
        <>
          <Check className="size-3" /> コピー済
        </>
      ) : (
        <>
          <Copy className="size-3" /> コピー
        </>
      )}
    </button>
  );
}

export default function ModulePage() {
  const params = useParams();
  const projectId = params.project as string;
  const moduleId = params.moduleId as string;
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(),
  );

  const moduleData = MODULE_DATA[moduleId];

  const toggleLesson = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  if (!moduleData) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header
          breadcrumbs={[
            { label: projectId, href: `/${projectId}` },
            { label: "教材", href: `/${projectId}/learn` },
            { label: moduleId },
          ]}
        />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-gray-400">
            モジュールが見つかりませんでした。
          </p>
        </main>
      </div>
    );
  }

  const totalMinutes = moduleData.lessons.reduce(
    (sum, l) => sum + l.estimatedMinutes,
    0,
  );
  const completedCount = completedLessons.size;
  const progressPercent =
    moduleData.lessons.length > 0
      ? Math.round((completedCount / moduleData.lessons.length) * 100)
      : 0;

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeLabel =
    totalMinutes >= 60
      ? hours + "時間" + (mins > 0 ? mins + "分" : "")
      : totalMinutes + "分";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        breadcrumbs={[
          { label: projectId, href: `/${projectId}` },
          { label: "教材", href: `/${projectId}/learn` },
          { label: moduleData.title },
        ]}
      />
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="mb-2 text-xl font-bold text-black">
              {moduleData.title}
            </h1>
            <p className="mb-4 text-sm text-gray-400">
              {moduleData.description}
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <BookOpen className="size-3" />
                {moduleData.lessons.length} レッスン
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {"約 " + timeLabel}
              </span>
              <span>
                {"進捗: " +
                  completedCount +
                  "/" +
                  moduleData.lessons.length +
                  " (" +
                  progressPercent +
                  "%)"}
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: progressPercent + "%" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {moduleData.lessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className={
                    "rounded border bg-white transition-colors " +
                    (isCompleted
                      ? "border-green-200 bg-green-50/30"
                      : "border-gray-200")
                  }
                >
                  <div className="flex items-start gap-4 p-5">
                    <button
                      onClick={() => toggleLesson(lesson.id)}
                      className={
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border transition-colors " +
                        (isCompleted
                          ? "border-transparent bg-green-500"
                          : "border-gray-300 bg-white hover:border-green-300")
                      }
                    >
                      {isCompleted && (
                        <Check
                          className="size-3 text-white"
                          strokeWidth={3}
                        />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3
                          className={
                            "text-sm font-bold " +
                            (isCompleted
                              ? "text-gray-400 line-through"
                              : "text-black")
                          }
                        >
                          {lesson.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-gray-400">
                        {lesson.description}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-300">
                        <Clock className="size-3" />
                        {lesson.estimatedMinutes}分
                      </div>

                      {lesson.codeExample && (
                        <div className="mt-4">
                          <div className="group relative overflow-hidden rounded border border-gray-200 bg-gray-100">
                            <div className="absolute right-2 top-2 z-10">
                              <CopyButton text={lesson.codeExample} />
                            </div>
                            <pre className="overflow-x-auto px-4 py-3">
                              <code className="font-mono text-xs text-black">
                                {lesson.codeExample}
                              </code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
