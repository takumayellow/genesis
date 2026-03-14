"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const docRef = await addDoc(collection(db, "projects"), {
        name: name.trim(),
        repoUrl: repoUrl.trim(),
        ownerId: user.uid,
        memberIds: [user.uid],
        createdAt: new Date(),
      });

      router.push(`/${docRef.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "プロジェクト作成に失敗しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header breadcrumbs={[{ label: "プロジェクト作成" }]} />
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-6 text-xl font-bold text-black">
            新規プロジェクト作成
          </h1>

          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-black">
                プロジェクト名
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 学祭Webサイト2026"
                required
                className="rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-black">
                GitHubリポジトリURL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/org/repo"
                className="rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="mt-2 rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "作成中..." : "プロジェクトを作成"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
