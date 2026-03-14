"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { Header } from "@/components/header";
import { debounce } from "@/lib/debounce";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type SaveStatus = "idle" | "saving" | "saved" | "error";

const DEFAULT_CONTENT = `# オンボーディング資料

ここにオンボーディング資料を書いてください。
`;

function CodeBlock({ children }: { readonly children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API may not be available
    }
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

function MarkdownPreview({ content }: { readonly content: string }) {
  return (
    <div className="prose prose-sm max-w-none">
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
        {content}
      </ReactMarkdown>
    </div>
  );
}

function SaveStatusIndicator({ status }: { readonly status: SaveStatus }) {
  switch (status) {
    case "saving":
      return <span className="text-xs text-yellow-600">保存中...</span>;
    case "saved":
      return <span className="text-xs text-green-600">保存済み</span>;
    case "error":
      return <span className="text-xs text-red-600">保存エラー</span>;
    default:
      return null;
  }
}

export default function AdminOnboardingEditor() {
  const params = useParams();
  const projectId = params.project as string;
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const debouncedSaveRef = useRef<{ call: (markdown: string) => void; cancel: () => void } | null>(null);

  const saveToFirestore = useCallback(
    async (markdown: string) => {
      setSaveStatus("saving");
      try {
        const db = getFirebaseDb();
        const docRef = doc(db, "projects", projectId, "content", "onboarding");
        await setDoc(docRef, {
          markdown,
          updatedAt: new Date().toISOString(),
        });
        setSaveStatus("saved");
      } catch (error) {
        console.error("Failed to save onboarding content:", error);
        setSaveStatus("error");
      }
    },
    [projectId]
  );

  useEffect(() => {
    const debouncedFn = debounce((markdown: string) => {
      saveToFirestore(markdown);
    }, 2000);
    debouncedSaveRef.current = debouncedFn;
    return () => {
      debouncedFn.cancel();
    };
  }, [saveToFirestore]);

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        const db = getFirebaseDb();
        const docRef = doc(db, "projects", projectId, "content", "onboarding");
        const snapshot = await getDoc(docRef);
        if (!cancelled && snapshot.exists()) {
          const data = snapshot.data();
          setContent(data.markdown ?? DEFAULT_CONTENT);
        }
      } catch (error) {
        console.error("Failed to load onboarding content:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadContent();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const handleContentChange = (value: string | undefined) => {
    const newContent = value ?? "";
    setContent(newContent);
    setSaveStatus("idle");
    debouncedSaveRef.current?.call(newContent);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header
          breadcrumbs={[
            { label: projectId, href: `/${projectId}` },
            { label: "管理", href: `/${projectId}/admin` },
            { label: "オンボ資料編集" },
          ]}
        />
        <main className="flex flex-1 items-center justify-center">
          <span className="text-sm text-gray-400">読み込み中...</span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        breadcrumbs={[
          { label: projectId, href: `/${projectId}` },
          { label: "管理", href: `/${projectId}/admin` },
          { label: "オンボ資料編集" },
        ]}
      />
      <main className="flex flex-1 flex-col overflow-hidden px-4 py-4 lg:px-8">
        {/* Toolbar */}
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-black">オンボーディング資料エディタ</h1>
          <SaveStatusIndicator status={saveStatus} />
        </div>

        {/* Mobile tab switcher */}
        <div className="mb-3 flex gap-1 lg:hidden">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "editor"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            エディタ
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "preview"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            プレビュー
          </button>
        </div>

        {/* Two-column layout (desktop) / Tab content (mobile) */}
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
          {/* Editor */}
          <div
            className={`flex min-h-0 flex-col ${
              activeTab !== "editor" ? "hidden lg:flex" : "flex"
            }`}
            data-color-mode="light"
          >
            <div className="mb-1 text-xs font-medium text-gray-400">Markdown</div>
            <div className="min-h-0 flex-1 overflow-hidden rounded border border-gray-200">
              <MDEditor
                value={content}
                onChange={handleContentChange}
                height="100%"
                preview="edit"
                visibleDragbar={false}
              />
            </div>
          </div>

          {/* Preview */}
          <div
            className={`flex min-h-0 flex-col ${
              activeTab !== "preview" ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="mb-1 text-xs font-medium text-gray-400">プレビュー</div>
            <div className="min-h-0 flex-1 overflow-auto rounded border border-gray-200 bg-white p-6">
              <MarkdownPreview content={content} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
