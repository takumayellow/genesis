"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-red-500">Error</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 font-[family-name:var(--font-sans)]">
          エラーが発生しました
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          予期しないエラーが発生しました。時間をおいて再度お試しください。
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            <RefreshCw className="h-4 w-4" />
            もう一度試す
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Home className="h-4 w-4" />
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
