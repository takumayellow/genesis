import type { User, Project, Task, Activity } from "@/lib/types";

export const DEMO_USER: User = {
  uid: "demo-user",
  githubUsername: "tanaka-taro",
  avatarUrl: "",
  role: "member",
  createdAt: new Date("2026-02-01"),
};

export const DEMO_PROJECT: Project = {
  id: "gakusai-web-2026",
  name: "学祭Webサイト2026",
  repoUrl: "https://github.com/devclub/gakusai-2026",
  ownerId: "admin-user",
  memberIds: ["demo-user", "admin-user", "user-2", "user-3", "user-4"],
  createdAt: new Date("2026-02-15"),
};

export const DEMO_TASKS: readonly Task[] = [
  {
    id: "task-1",
    projectId: "gakusai-web-2026",
    title: "環境構築",
    description:
      "Node.js、Git、VSCodeをセットアップして開発環境を整えましょう。ターミナル操作の基本も学びます。",
    assigneeId: "demo-user",
    status: "completed",
    createdAt: new Date("2026-02-16"),
    steps: [
      {
        id: "t1-s1",
        title: "Node.js のインストール",
        description:
          "公式サイトからNode.js LTS版をダウンロードしてインストールします。nvmを使うと複数バージョンの管理が簡単です。",
        estimatedMinutes: 15,
        referenceUrl: "https://nodejs.org/ja",
        command: "node --version && npm --version",
        completed: true,
      },
      {
        id: "t1-s2",
        title: "Git のインストールと初期設定",
        description:
          "Gitをインストールし、ユーザー名とメールアドレスを設定します。",
        estimatedMinutes: 10,
        referenceUrl: "https://git-scm.com/book/ja/v2",
        command:
          'git config --global user.name "Your Name" && git config --global user.email "your@email.com"',
        completed: true,
      },
      {
        id: "t1-s3",
        title: "VSCode のインストールと拡張機能",
        description:
          "VSCodeをインストールし、ESLint、Prettier、Tailwind CSS IntelliSenseの拡張機能を追加します。",
        estimatedMinutes: 10,
        referenceUrl:
          "https://code.visualstudio.com/docs/setup/setup-overview",
        completed: true,
      },
      {
        id: "t1-s4",
        title: "プロジェクトのセットアップ確認",
        description:
          "リポジトリをクローンして、npm installとnpm run devで開発サーバーが起動することを確認します。",
        estimatedMinutes: 10,
        command:
          "git clone https://github.com/devclub/gakusai-2026.git && cd gakusai-2026 && npm install && npm run dev",
        completed: true,
      },
    ],
  },
  {
    id: "task-2",
    projectId: "gakusai-web-2026",
    title: "Gitの基本操作",
    description:
      "ブランチの作成、コミット、プッシュ、プルリクエストの基本的なワークフローを学びます。チーム開発に必要なGit操作をマスターしましょう。",
    assigneeId: "demo-user",
    status: "completed",
    createdAt: new Date("2026-02-20"),
    steps: [
      {
        id: "t2-s1",
        title: "ブランチの作成と切り替え",
        description:
          "feature branchを作成して、mainブランチから分岐した開発を行う方法を学びます。",
        estimatedMinutes: 10,
        referenceUrl:
          "https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E6%A9%9F%E8%83%BD-%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E3%81%A8%E3%83%9E%E3%83%BC%E3%82%B8%E3%81%AE%E5%9F%BA%E6%9C%AC",
        command: "git checkout -b feature/practice",
        completed: true,
      },
      {
        id: "t2-s2",
        title: "変更のステージングとコミット",
        description:
          "git add と git commit を使って変更を記録します。意味のあるコミットメッセージの書き方も学びます。",
        estimatedMinutes: 10,
        referenceUrl:
          "https://developer.mozilla.org/ja/docs/Glossary/Git",
        command: 'git add . && git commit -m "feat: add practice file"',
        completed: true,
      },
      {
        id: "t2-s3",
        title: "リモートへのプッシュ",
        description:
          "ローカルの変更をGitHubにプッシュする方法を学びます。",
        estimatedMinutes: 5,
        command: "git push -u origin feature/practice",
        completed: true,
      },
      {
        id: "t2-s4",
        title: "プルリクエストの作成",
        description:
          "GitHub上でPull Requestを作成し、コードレビューの流れを体験します。",
        estimatedMinutes: 15,
        referenceUrl:
          "https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests",
        completed: true,
      },
      {
        id: "t2-s5",
        title: "コンフリクトの解消",
        description:
          "マージコンフリクトが発生した場合の解消方法を実践的に学びます。",
        estimatedMinutes: 15,
        referenceUrl:
          "https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts",
        completed: true,
      },
    ],
  },
  {
    id: "task-3",
    projectId: "gakusai-web-2026",
    title: "Reactコンポーネント入門",
    description:
      "Reactの基本概念を学び、コンポーネントの作成、props、stateの使い方をマスターします。",
    assigneeId: "demo-user",
    status: "published",
    createdAt: new Date("2026-02-25"),
    steps: [
      {
        id: "t3-s1",
        title: "JSXの基本を理解する",
        description:
          "JSXの構文を学び、HTMLとの違いを理解します。条件付きレンダリングやリストの描画方法も学びます。",
        estimatedMinutes: 20,
        referenceUrl: "https://react.dev/learn/writing-markup-with-jsx",
        completed: true,
      },
      {
        id: "t3-s2",
        title: "コンポーネントの作成",
        description:
          "関数コンポーネントを作成し、ファイル分割の方法を学びます。exportとimportの使い方も確認します。",
        estimatedMinutes: 15,
        referenceUrl:
          "https://react.dev/learn/your-first-component",
        completed: true,
      },
      {
        id: "t3-s3",
        title: "Propsの受け渡し",
        description:
          "親コンポーネントから子コンポーネントへデータを渡す方法を学びます。TypeScriptでの型定義も行います。",
        estimatedMinutes: 20,
        referenceUrl: "https://react.dev/learn/passing-props-to-a-component",
        completed: true,
      },
      {
        id: "t3-s4",
        title: "useStateでの状態管理",
        description:
          "useStateフックを使ってコンポーネント内の状態を管理する方法を学びます。カウンターやトグルなどの実例で練習します。",
        estimatedMinutes: 25,
        referenceUrl: "https://react.dev/reference/react/useState",
        completed: true,
      },
      {
        id: "t3-s5",
        title: "実践: カードコンポーネントの作成",
        description:
          "学んだ知識を活かして、再利用可能なカードコンポーネントを作成します。propsで内容を動的に変更できるようにします。",
        estimatedMinutes: 30,
        command: "npx tsx src/components/Card.tsx",
        completed: false,
      },
    ],
  },
  {
    id: "task-4",
    projectId: "gakusai-web-2026",
    title: "LPのヘッダー作成",
    description:
      "Figmaのデザインカンプを元に、Flexboxレイアウトを活用してメインナビゲーションコンポーネントを構築しましょう。",
    assigneeId: "demo-user",
    status: "published",
    createdAt: new Date("2026-03-01"),
    steps: [
      {
        id: "t4-s1",
        title: "Flexboxのドキュメントを読む",
        description:
          "MDNのFlexboxガイドを読んで、flex-direction、justify-content、align-itemsなどの基本プロパティを理解します。",
        estimatedMinutes: 15,
        referenceUrl:
          "https://developer.mozilla.org/ja/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox",
        completed: true,
      },
      {
        id: "t4-s2",
        title: "featureブランチを作成する",
        description:
          "開発用のブランチを作成してローカル環境を準備します。命名規則に従ってブランチ名を付けましょう。",
        estimatedMinutes: 5,
        command: "git checkout -b feature/header",
        completed: true,
      },
      {
        id: "t4-s3",
        title: "Header.tsx の構造を設計する",
        description:
          "Figmaのデザインを分析し、コンポーネントの構造を設計します。ロゴ、ナビゲーション、CTAボタンの3つのセクションに分けて考えます。",
        estimatedMinutes: 15,
        referenceUrl: "https://react.dev/learn/thinking-in-react",
        completed: false,
      },
      {
        id: "t4-s4",
        title: "ナビゲーションリンクの実装",
        description:
          "Flexboxを使ってナビゲーションリンクを横並びに配置します。hoverエフェクトやアクティブ状態のスタイルも実装します。",
        estimatedMinutes: 20,
        referenceUrl: "https://tailwindcss.com/docs/flex",
        completed: false,
      },
      {
        id: "t4-s5",
        title: "レスポンシブ対応とTailwindクラスの適用",
        description:
          "モバイルではハンバーガーメニュー、デスクトップでは横並びナビゲーションになるようレスポンシブ対応します。",
        estimatedMinutes: 25,
        referenceUrl: "https://tailwindcss.com/docs/responsive-design",
        command:
          'className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200"',
        completed: false,
      },
    ],
  },
  {
    id: "task-5",
    projectId: "gakusai-web-2026",
    title: "フッターの実装",
    description:
      "サイトのフッターセクションを実装します。CSS Gridを使ったレイアウトとリンクの整理を学びます。",
    assigneeId: "demo-user",
    status: "published",
    createdAt: new Date("2026-03-05"),
    steps: [
      {
        id: "t5-s1",
        title: "CSS Gridの基本を学ぶ",
        description:
          "CSS Gridのgrid-template-columns、gap、grid-areaなどの基本プロパティを理解します。",
        estimatedMinutes: 20,
        referenceUrl:
          "https://developer.mozilla.org/ja/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout",
        completed: false,
      },
      {
        id: "t5-s2",
        title: "フッターのワイヤーフレームを確認",
        description:
          "Figmaのデザインカンプからフッターのレイアウトを分析します。カラム構成とコンテンツの配置を整理します。",
        estimatedMinutes: 10,
        completed: false,
      },
      {
        id: "t5-s3",
        title: "Footer.tsx の基本構造を作成",
        description:
          "フッターコンポーネントのファイルを作成し、CSS Gridを使った3カラムレイアウトを実装します。",
        estimatedMinutes: 20,
        referenceUrl: "https://tailwindcss.com/docs/grid-template-columns",
        command: "touch src/components/Footer.tsx",
        completed: false,
      },
      {
        id: "t5-s4",
        title: "リンクリストとSNSアイコンの実装",
        description:
          "各カラムにナビゲーションリンクとSNSアイコンを配置します。lucide-reactのアイコンを活用します。",
        estimatedMinutes: 20,
        referenceUrl: "https://lucide.dev/icons/",
        completed: false,
      },
      {
        id: "t5-s5",
        title: "コピーライトとレスポンシブ対応",
        description:
          "コピーライト表記を追加し、モバイルでは1カラム、タブレット以上で3カラムになるようレスポンシブ対応します。",
        estimatedMinutes: 15,
        referenceUrl: "https://tailwindcss.com/docs/responsive-design",
        completed: false,
      },
    ],
  },
];

function createRelativeDate(minutesAgo: number): Date {
  return new Date(Date.now() - minutesAgo * 60 * 1000);
}

export const DEMO_ACTIVITIES: readonly Activity[] = [
  {
    id: "act-1",
    projectId: "gakusai-web-2026",
    userId: "demo-user",
    type: "step_complete",
    message: "tanaka-taro が「LPのヘッダー作成」のステップ2を完了しました",
    createdAt: createRelativeDate(12),
  },
  {
    id: "act-2",
    projectId: "gakusai-web-2026",
    userId: "user-2",
    type: "push",
    message: "suzuki-hana が feature/about-page にプッシュしました",
    createdAt: createRelativeDate(35),
  },
  {
    id: "act-3",
    projectId: "gakusai-web-2026",
    userId: "demo-user",
    type: "step_complete",
    message: "tanaka-taro が「LPのヘッダー作成」のステップ1を完了しました",
    createdAt: createRelativeDate(48),
  },
  {
    id: "act-4",
    projectId: "gakusai-web-2026",
    userId: "user-3",
    type: "review",
    message: "yamada-ken が PR #12 をレビューしました",
    createdAt: createRelativeDate(90),
  },
  {
    id: "act-5",
    projectId: "gakusai-web-2026",
    userId: "demo-user",
    type: "task_complete",
    message: "tanaka-taro が「Gitの基本操作」を完了しました",
    createdAt: createRelativeDate(180),
  },
  {
    id: "act-6",
    projectId: "gakusai-web-2026",
    userId: "user-4",
    type: "join",
    message: "sato-yuki がプロジェクトに参加しました",
    createdAt: createRelativeDate(360),
  },
  {
    id: "act-7",
    projectId: "gakusai-web-2026",
    userId: "user-2",
    type: "task_complete",
    message: "suzuki-hana が「環境構築」を完了しました",
    createdAt: createRelativeDate(720),
  },
  {
    id: "act-8",
    projectId: "gakusai-web-2026",
    userId: "user-3",
    type: "push",
    message: "yamada-ken が feature/contact-form にプッシュしました",
    createdAt: createRelativeDate(1080),
  },
  {
    id: "act-9",
    projectId: "gakusai-web-2026",
    userId: "demo-user",
    type: "task_complete",
    message: "tanaka-taro が「環境構築」を完了しました",
    createdAt: createRelativeDate(2880),
  },
  {
    id: "act-10",
    projectId: "gakusai-web-2026",
    userId: "admin-user",
    type: "join",
    message: "admin がプロジェクト「学祭Webサイト2026」を作成しました",
    createdAt: createRelativeDate(4320),
  },
];

export const DEMO_STATS = {
  projects: 1,
  completedTasks: 2,
  teamMembers: 5,
} as const;
