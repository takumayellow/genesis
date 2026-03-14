import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-blue-500">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 font-[family-name:var(--font-sans)]">
          ページが見つかりませんでした
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          <Home className="h-4 w-4" />
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
