"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { Folder, Users, Activity } from "lucide-react";
import Link from "next/link";
import { ActivityFeedCard } from "@/components/activity-feed-card";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-400">読み込み中...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-black">
              おかえりなさい、{user.githubUsername}さん
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              あなたのプロジェクトと進捗状況
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 rounded border border-gray-200 bg-white p-4">
              <div className="flex size-10 items-center justify-center rounded bg-blue-50">
                <Folder className="size-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">0</p>
                <p className="text-xs text-gray-400">参加プロジェクト</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded border border-gray-200 bg-white p-4">
              <div className="flex size-10 items-center justify-center rounded bg-green-50">
                <Activity className="size-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">0</p>
                <p className="text-xs text-gray-400">完了タスク</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded border border-gray-200 bg-white p-4">
              <div className="flex size-10 items-center justify-center rounded bg-purple-50">
                <Users className="size-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">0</p>
                <p className="text-xs text-gray-400">チームメンバー</p>
              </div>
            </div>
          </div>

          <div className="rounded border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-400 mb-4">
              まだプロジェクトがありません
            </p>
            <Link
              href="/admin/new"
              className="inline-block rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 transition-colors"
            >
              プロジェクトを作成
            </Link>
          </div>

          <div className="mt-8">
            <ActivityFeedCard projectId="" />
          </div>
        </div>
      </main>
    </div>
  );
}
