"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, MessageCircle, Send, X } from "lucide-react";

const DEMO_ONBOARDING = `# 環境構築ガイド

このガイドに沿って、開発環境をセットアップしましょう。

## 1. Node.js のインストール

まず、Node.js をインストールします。

\`\`\`bash
# macOS (Homebrew)
brew install node

# バージョン確認
node --version
npm --version
\`\`\`

## 2. リポジトリのクローン

\`\`\`bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
\`\`\`

## 3. 依存関係のインストール

\`\`\`bash
npm install
\`\`\`

## 4. 開発サーバーの起動

\`\`\`bash
npm run dev
\`\`\`

ブラウザで http://localhost:3000 を開いて動作確認してください。

## よくあるエラー

### \`EACCES: permission denied\`
npmのグローバルディレクトリの権限問題です：
\`\`\`bash
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
\`\`\`

### \`Module not found\`
依存関係が正しくインストールされていない可能性があります：
\`\`\`bash
rm -rf node_modules
npm install
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
        { role: "assistant", content: "エラーが発生しました。もう一度お試しください。" },
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        breadcrumbs={[
          { label: projectId, href: `/${projectId}` },
          { label: "環境構築" },
        ]}
      />
      <main className="flex-1 px-8 py-8">
        <div className="prose prose-sm mx-auto max-w-3xl">
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
            }}
          >
            {DEMO_ONBOARDING}
          </ReactMarkdown>
        </div>
      </main>
      <AIChatWidget />
    </div>
  );
}
