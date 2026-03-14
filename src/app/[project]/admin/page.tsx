"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

const DEMO_MEMBERS = [
  {
    id: "1",
    name: "田中太郎",
    avatar: "",
    tasksCompleted: 3,
    totalTasks: 5,
    lastActive: "2時間前",
    inactive: false,
  },
  {
    id: "2",
    name: "佐藤花子",
    avatar: "",
    tasksCompleted: 5,
    totalTasks: 5,
    lastActive: "30分前",
    inactive: false,
  },
  {
    id: "3",
    name: "鈴木一郎",
    avatar: "",
    tasksCompleted: 1,
    totalTasks: 5,
    lastActive: "5日前",
    inactive: true,
  },
  {
    id: "4",
    name: "高橋美咲",
    avatar: "",
    tasksCompleted: 2,
    totalTasks: 5,
    lastActive: "1日前",
    inactive: false,
  },
];

export default function AdminDashboard() {
  const params = useParams();
  const projectId = params.project as string;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        breadcrumbs={[
          { label: projectId, href: `/${projectId}` },
          { label: "管理" },
        ]}
      />
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-bold text-black">メンバー進捗管理</h1>
            <div className="flex items-center gap-2">
              <Link
                href={`/${projectId}/admin/onboarding`}
                className="rounded border border-blue-500 px-4 py-2 text-sm font-bold text-blue-500 hover:bg-blue-50 transition-colors"
              >
                オンボ資料を編集
              </Link>
              <Link
                href={`/${projectId}/admin/new`}
                className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 transition-colors"
              >
                タスクを生成
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {DEMO_MEMBERS.map((member) => {
              const progress = Math.round(
                (member.tasksCompleted / member.totalTasks) * 100
              );
              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between rounded border bg-white p-4 ${
                    member.inactive
                      ? "border-orange-200"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                      {member.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-black">
                          {member.name}
                        </span>
                        {member.inactive && (
                          <span className="flex items-center gap-1 rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                            <AlertTriangle className="size-3" />
                            SOS
                          </span>
                        )}
                        {progress === 100 && (
                          <CheckCircle className="size-4 text-green-500" />
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        最終アクティビティ: {member.lastActive}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {member.tasksCompleted}/{member.totalTasks}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
