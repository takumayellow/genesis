"use client";

import { CommandCard } from "@/components/command-card";
import {
  generateBranchCommand,
  generateCloneCommand,
  generateInstallCommand,
  generateDevCommand,
  generatePushCommand,
} from "@/lib/commands";
import type { PackageManager } from "@/lib/commands";

interface CommandPaletteProps {
  readonly username: string;
  readonly repoUrl: string;
  readonly issueNumber: number;
  readonly branchName?: string;
  readonly packageManager?: PackageManager;
}

interface CommandPhase {
  readonly heading: string;
  readonly cards: readonly {
    readonly label: string;
    readonly command: string;
    readonly explanation: string;
  }[];
}

function buildPhases(props: CommandPaletteProps): readonly CommandPhase[] {
  const {
    username,
    repoUrl,
    issueNumber,
    packageManager = "npm",
  } = props;

  const branch =
    props.branchName ?? `feature/issue-${issueNumber}-${username}`;

  return [
    {
      heading: "準備",
      cards: [
        {
          label: "リポジトリをクローン",
          command: generateCloneCommand(repoUrl),
          explanation:
            "リポジトリをローカルにコピーし、そのディレクトリに移動します。初回だけ必要な操作です。",
        },
        {
          label: "依存パッケージをインストール",
          command: generateInstallCommand(packageManager),
          explanation:
            "プロジェクトが使っているライブラリを一括でダウンロードします。package.json に記載された依存関係がすべてインストールされます。",
        },
      ],
    },
    {
      heading: "実装",
      cards: [
        {
          label: "作業ブランチを作成",
          command: generateBranchCommand(issueNumber, username),
          explanation:
            "メインブランチを汚さずに作業するための専用ブランチを作ります。ブランチ名に Issue 番号と名前を入れることで、誰がどの Issue を担当しているか分かりやすくなります。",
        },
        {
          label: "開発サーバーを起動",
          command: generateDevCommand(packageManager),
          explanation:
            "ローカルで開発サーバーを起動し、ブラウザでプレビューしながら開発できます。ファイルを保存すると自動で反映されます。",
        },
      ],
    },
    {
      heading: "提出",
      cards: [
        {
          label: "変更をプッシュ",
          command: generatePushCommand(branch),
          explanation:
            "変更をステージングし、コミットメッセージを付けて記録し、リモートリポジトリにアップロードします。この後 GitHub でプルリクエストを作成してレビューを依頼しましょう。",
        },
      ],
    },
  ];
}

function PhaseSection({ phase }: { readonly phase: CommandPhase }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {phase.heading}
      </h4>
      <div className="flex flex-col gap-4">
        {phase.cards.map((card) => (
          <CommandCard
            key={card.command}
            label={card.label}
            command={card.command}
            explanation={card.explanation}
          />
        ))}
      </div>
    </div>
  );
}

export function CommandPalette(props: CommandPaletteProps) {
  const phases = buildPhases(props);

  return (
    <div className="flex flex-col gap-6">
      {phases.map((phase) => (
        <PhaseSection key={phase.heading} phase={phase} />
      ))}
    </div>
  );
}
