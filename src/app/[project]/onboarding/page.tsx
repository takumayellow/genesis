"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, MessageCircle, Send, X } from "lucide-react";

const SECTIONS = [
  { id: "vscode", label: "VS Code セットアップ" },
  { id: "git", label: "Git の設定" },
  { id: "ssh", label: "SSH キーの設定" },
  { id: "nodejs", label: "Node.js のインストール" },
  { id: "repo", label: "プロジェクトのセットアップ" },
  { id: "devserver", label: "開発サーバーの起動" },
  { id: "troubleshooting", label: "トラブルシューティング" },
];

const DEMO_ONBOARDING = `# 環境構築ガイド

このガイドに沿って、開発環境をセットアップしましょう。すべてのセクションを完了すると、プロジェクトの開発を始められます。

---

## <span id="vscode"></span>1. VS Code セットアップ

開発にはVisual Studio Codeを使用します。まだインストールしていない場合は[公式サイト](https://code.visualstudio.com/)からダウンロードしてください。

### 必須の拡張機能

以下の拡張機能をインストールしてください：

\`\`\`bash
# コマンドパレット（Ctrl+Shift+P）から「Extensions: Install Extension」で検索するか、
# ターミナルから以下を実行：
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension GitHub.copilot
\`\`\`

### 推奨設定

プロジェクトの \`.vscode/settings.json\` に以下の設定があることを確認してください：

\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
\`\`\`

> **ヒント**: VS Codeの設定同期（Settings Sync）をオンにしておくと、別のPCでも同じ環境を再現できます。

---

## <span id="git"></span>2. Git の設定

### Git のインストール

\`\`\`bash
# macOS (Homebrew)
brew install git

# Ubuntu / WSL
sudo apt update && sudo apt install git

# バージョン確認（2.30以上を推奨）
git --version
\`\`\`

### ユーザー情報の設定

\`\`\`bash
git config --global user.name "あなたの名前"
git config --global user.email "your-email@example.com"
\`\`\`

### 推奨 Git 設定

\`\`\`bash
# デフォルトブランチ名を main に設定
git config --global init.defaultBranch main

# pull 時に rebase を使用
git config --global pull.rebase true

# エディタを VS Code に設定
git config --global core.editor "code --wait"

# 日本語ファイル名の文字化けを防止
git config --global core.quotepath false
\`\`\`

---

## <span id="ssh"></span>3. SSH キーの設定

GitHub にSSHで接続するための設定を行います。

### SSH キーの生成

\`\`\`bash
# Ed25519 キーを生成（推奨）
ssh-keygen -t ed25519 -C "your-email@example.com"

# パスフレーズを聞かれたら、セキュリティのため設定することを推奨します
\`\`\`

### SSH キーを GitHub に登録

\`\`\`bash
# 公開鍵をクリップボードにコピー
# macOS
pbcopy < ~/.ssh/id_ed25519.pub

# Windows (Git Bash)
clip < ~/.ssh/id_ed25519.pub

# Linux
cat ~/.ssh/id_ed25519.pub
# 出力をコピーしてください
\`\`\`

GitHub の [Settings > SSH and GPG keys](https://github.com/settings/keys) にアクセスし、「New SSH key」をクリックして貼り付けます。

### 接続テスト

\`\`\`bash
ssh -T git@github.com
# "Hi username! You've successfully authenticated..." と表示されればOK
\`\`\`

---

## <span id="nodejs"></span>4. Node.js のインストール

Node.js のバージョン管理には **Volta** を推奨します。

\`\`\`bash
# Volta のインストール
# macOS / Linux
curl https://get.volta.sh | bash

# シェルを再起動するか、以下を実行
source ~/.bashrc

# Node.js のインストール（LTS版）
volta install node@20

# バージョン確認
node --version   # v20.x.x
npm --version    # 10.x.x
\`\`\`

> **なぜ Volta？**: プロジェクトごとに異なるNode.jsバージョンを自動で切り替えてくれます。\`package.json\` に指定されたバージョンが自動的に使われるため、チーム全員が同じバージョンで開発できます。

---

## <span id="repo"></span>5. プロジェクトのセットアップ

### リポジトリのクローン

\`\`\`bash
# SSH でクローン（推奨）
git clone git@github.com:your-org/your-repo.git
cd your-repo

# HTTPS の場合
git clone https://github.com/your-org/your-repo.git
cd your-repo
\`\`\`

### 依存関係のインストール

\`\`\`bash
npm install
\`\`\`

### 環境変数の設定

\`\`\`bash
# .env.local ファイルを作成
cp .env.example .env.local

# エディタで開いて必要な値を設定
code .env.local
\`\`\`

\`.env.local\` に以下の値を設定してください（SlackまたはNotionで共有されます）：

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://localhost:5432/devclub
NEXTAUTH_SECRET=your-secret-here
\`\`\`

---

## <span id="devserver"></span>6. 開発サーバーの起動

\`\`\`bash
npm run dev
\`\`\`

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて動作確認してください。

### 確認すべきこと

- ページが正常に表示される
- コンソールにエラーが出ていない（DevTools の Console タブを確認）
- ホットリロードが動作する（コードを変更して保存すると自動反映される）

---

## <span id="troubleshooting"></span>7. トラブルシューティング

### \`EACCES: permission denied\`

npmのグローバルディレクトリの権限問題です：

\`\`\`bash
# macOS / Linux
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# または Volta を使っている場合は権限問題は発生しません
\`\`\`

### \`Module not found: Can't resolve '...'\`

依存関係が正しくインストールされていない可能性があります：

\`\`\`bash
rm -rf node_modules
rm package-lock.json
npm install
\`\`\`

### \`Port 3000 is already in use\`

別のプロセスがポート3000を使用しています：

\`\`\`bash
# macOS / Linux: ポート3000を使用しているプロセスを確認
lsof -i :3000

# プロセスを終了
kill -9 <PID>

# または別のポートで起動
npm run dev -- -p 3001
\`\`\`

### \`error TS2307: Cannot find module '@/...'\`

TypeScript のパスエイリアスが正しく設定されていない可能性があります：

\`\`\`bash
# tsconfig.json の paths 設定を確認
cat tsconfig.json | grep -A 5 "paths"

# VS Code を再起動（Cmd+Shift+P > Developer: Reload Window）
\`\`\`

### \`ECONNREFUSED\` / データベース接続エラー

ローカルのデータベースが起動していない可能性があります：

\`\`\`bash
# PostgreSQL の状態を確認
# macOS (Homebrew)
brew services list | grep postgresql

# 起動
brew services start postgresql@16

# Docker を使っている場合
docker compose up -d db
\`\`\`

### \`git push\` が Permission denied で失敗する

SSH キーが正しく設定されていない可能性があります：

\`\`\`bash
# SSH エージェントにキーが追加されているか確認
ssh-add -l

# キーが表示されない場合、追加する
ssh-add ~/.ssh/id_ed25519

# GitHub への接続をテスト
ssh -T git@github.com
\`\`\`

### ESLint / Prettier のエラーが大量に出る

\`\`\`bash
# 自動修正を試す
npx eslint --fix .
npx prettier --write .

# VS Code の ESLint 拡張機能を再起動
# Cmd+Shift+P > ESLint: Restart ESLint Server
\`\`\`
`;

function CodeBlock({
  children,
}: {
  readonly children: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded border border-gray-200 bg-gray-100 px-4 py-3">
        <code className="font-mono text-sm text-black">{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 flex items-center gap-1 rounded bg-white px-2 py-1 text-xs text-gray-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
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
    </div>
  );
}

function ProgressIndicator({ activeIndex }: { readonly activeIndex: number }) {
  return (
    <nav className="sticky top-0 hidden w-56 shrink-0 lg:block">
      <div className="flex flex-col gap-1 border-l border-gray-200 pl-4">
        {SECTIONS.map((section, i) => {
          const isPast = i < activeIndex;
          const isCurrent = i === activeIndex;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`flex items-center gap-2 rounded-r px-2 py-1.5 text-xs transition-colors ${
                isCurrent
                  ? "-ml-[17px] border-l-2 border-blue-500 pl-[23px] font-bold text-blue-600 bg-blue-50"
                  : isPast
                    ? "text-gray-500"
                    : "text-gray-400"
              }`}
            >
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  isPast
                    ? "bg-green-100 text-green-600"
                    : isCurrent
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {isPast ? <Check className="size-3" /> : i + 1}
              </span>
              <span className="truncate">{section.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: "環境構築・オンボーディング中のユーザーからの質問です。",
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? data.error },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "エラーが発生しました。もう一度お試しください。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 flex size-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
      >
        <MessageCircle className="size-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 flex h-[480px] w-[360px] flex-col rounded-lg border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <span className="text-sm font-bold text-black">AIメンター</span>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400">
            エラーや質問をここで聞いてみましょう
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 ${msg.role === "user" ? "text-right" : ""}`}
          >
            <div
              className={`inline-block max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mb-3">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-400">
              考え中...
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="質問を入力..."
            className="flex-1 rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const params = useParams();
  const projectId = params.project as string;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const sectionElements = SECTIONS.map((s) => document.getElementById(s.id));
    let current = 0;
    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const el = sectionElements[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          current = i;
          break;
        }
      }
    }
    setActiveIndex(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        breadcrumbs={[
          { label: projectId, href: `/${projectId}` },
          { label: "環境構築" },
        ]}
      />
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto flex max-w-5xl gap-8">
          <div className="prose prose-sm min-w-0 max-w-3xl flex-1">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ children, className }) => {
                  const isBlock = className?.includes("language-");
                  if (isBlock) {
                    return <CodeBlock>{String(children)}</CodeBlock>;
                  }
                  return (
                    <code className="rounded bg-gray-100 px-1 font-mono text-sm">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <>{children}</>,
                span: ({ id, children }) => {
                  if (id) {
                    return <span id={id}>{children}</span>;
                  }
                  return <span>{children}</span>;
                },
              }}
            >
              {DEMO_ONBOARDING}
            </ReactMarkdown>
          </div>
          <ProgressIndicator activeIndex={activeIndex} />
        </div>
      </main>
      <AIChatWidget />
    </div>
  );
}
