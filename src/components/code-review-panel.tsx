"use client";

import { useState } from "react";

interface ReviewIssue {
  readonly file: string | null;
  readonly line: string | number | null;
  readonly title: string;
  readonly description: string;
  readonly code?: string;
}

interface ReviewGood {
  readonly file: string | null;
  readonly title: string;
  readonly description: string;
}

interface ReviewResult {
  readonly summary: string;
  readonly critical: readonly ReviewIssue[];
  readonly suggestions: readonly ReviewIssue[];
  readonly good: readonly ReviewGood[];
}

type InputMode = "url" | "diff";

export function CodeReviewPanel() {
  const [inputMode, setInputMode] = useState<InputMode>("url");
  const [prUrl, setPrUrl] = useState("");
  const [diffText, setDiffText] = useState("");
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    !loading &&
    ((inputMode === "url" && prUrl.trim().length > 0) ||
      (inputMode === "diff" && diffText.trim().length > 0));

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const body =
        inputMode === "url"
          ? { prUrl: prUrl.trim() }
          : { diff: diffText.trim() };

      const response = await fetch("/api/gemini/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "レビューに失敗しました");
        return;
      }

      setReview(data.review);
    } catch {
      setError("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-black">
          AI コードレビュー
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          GitHub PR URLまたはdiffテキストを入力して、AIにコードレビューを依頼できます
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setInputMode("url")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === "url"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          PR URL
        </button>
        <button
          type="button"
          onClick={() => setInputMode("diff")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === "diff"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Diff テキスト
        </button>
      </div>

      {inputMode === "url" ? (
        <div>
          <label
            htmlFor="pr-url"
            className="mb-1.5 block text-sm font-medium text-black"
          >
            GitHub Pull Request URL
          </label>
          <input
            id="pr-url"
            type="url"
            placeholder="https://github.com/owner/repo/pull/123"
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-black placeholder-gray-300 outline-none transition-colors focus:border-blue-500"
          />
        </div>
      ) : (
        <div>
          <label
            htmlFor="diff-text"
            className="mb-1.5 block text-sm font-medium text-black"
          >
            Diff テキスト
          </label>
          <textarea
            id="diff-text"
            rows={12}
            placeholder={"diff --git a/file.ts b/file.ts\n--- a/file.ts\n+++ b/file.ts\n@@ -1,3 +1,4 @@\n+import { something } from 'lib'\n ..."}
            value={diffText}
            onChange={(e) => setDiffText(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-mono text-sm text-black placeholder-gray-300 outline-none transition-colors focus:border-blue-500"
          />
        </div>
      )}

      <button
        type="button"
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <LoadingSpinner />
            レビュー中...
          </>
        ) : (
          "レビュー依頼"
        )}
      </button>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {review && <ReviewResults review={review} />}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function ReviewResults({ review }: { readonly review: ReviewResult }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-sm font-medium text-black">概要</p>
        <p className="mt-1 text-sm text-gray-600">{review.summary}</p>
      </div>

      <ReviewSection
        title="Critical Issues"
        emoji={"\uD83D\uDD34"}
        items={review.critical}
        variant="critical"
      />

      <ReviewSection
        title="Suggestions"
        emoji={"\uD83D\uDFE1"}
        items={review.suggestions}
        variant="suggestion"
      />

      <GoodSection items={review.good} />
    </div>
  );
}

function ReviewSection({
  title,
  emoji,
  items,
  variant,
}: {
  readonly title: string;
  readonly emoji: string;
  readonly items: readonly ReviewIssue[];
  readonly variant: "critical" | "suggestion";
}) {
  if (items.length === 0) return null;

  const borderColor =
    variant === "critical" ? "border-red-200" : "border-yellow-200";
  const bgColor =
    variant === "critical" ? "bg-red-50" : "bg-yellow-50";

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-black">
        {emoji} {title} ({items.length})
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={`rounded-lg border ${borderColor} ${bgColor} px-4 py-3`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-black">{item.title}</p>
              {(item.file || item.line) && (
                <span className="shrink-0 rounded bg-white/80 px-2 py-0.5 font-mono text-xs text-gray-500">
                  {item.file ?? ""}
                  {item.line != null ? `:${item.line}` : ""}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
            {item.code && (
              <pre className="mt-2 overflow-x-auto rounded border border-gray-200 bg-white p-3 font-mono text-xs text-gray-700">
                {item.code}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GoodSection({
  items,
}: {
  readonly items: readonly ReviewGood[];
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-black">
        {"\uD83D\uDFE2"} Good Practices ({items.length})
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-3"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-black">{item.title}</p>
              {item.file && (
                <span className="shrink-0 rounded bg-white/80 px-2 py-0.5 font-mono text-xs text-gray-500">
                  {item.file}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
