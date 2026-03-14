"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { AlertTriangle, CheckCircle, Users, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";

interface DemoMember {
  readonly id: string;
  readonly name: string;
  readonly tasksCompleted: number;
  readonly totalTasks: number;
  readonly lastActive: string;
  readonly inactive: boolean;
  readonly currentTask: string;
}

const DEMO_MEMBERS: readonly DemoMember[] = [
  {
    id: "1",
    name: "田中太郎",
    tasksCompleted: 4,
    totalTasks: 5,
    lastActive: "10分前",
    inactive: false,
    currentTask: "ヘッダーコンポーネント実装",
  },
  {
    id: "2",
    name: "佐藤花子",
    tasksCompleted: 5,
    totalTasks: 5,
    lastActive: "30分前",
    inactive: false,
    currentTask: "完了",
  },
  {
    id: "3",
    name: "鈴木一郎",
    tasksCompleted: 1,
    totalTasks: 5,
    lastActive: "5日前",
    inactive: true,
    currentTask: "Git & GitHub 環境構築",
  },
  {
    id: "4",
    name: "高橋美咲",
    tasksCompleted: 3,
    totalTasks: 5,
    lastActive: "1時間前",
    inactive: false,
    currentTask: "APIルート作成",
  },
  {
    id: "5",
    name: "伊藤健太",
    tasksCompleted: 2,
    totalTasks: 5,
    lastActive: "3時間前",
    inactive: false,
    currentTask: "フォームバリデーション",
  },
  {
    id: "6",
    name: "渡辺さくら",
    tasksCompleted: 5,
    totalTasks: 5,
    lastActive: "15分前",
    inactive: false,
    currentTask: "完了",
  },
  {
    id: "7",
    name: "山本大輝",
    tasksCompleted: 0,
    totalTasks: 5,
    lastActive: "7日前",
    inactive: true,
    currentTask: "環境構築",
  },
  {
    id: "8",
    name: "中村あおい",
    tasksCompleted: 3,
    totalTasks: 5,
    lastActive: "2時間前",
    inactive: false,
    currentTask: "レスポンシブ対応",
  },
];

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  readonly label: string;
  readonly value: string;
  readonly icon: typeof Users;
  readonly accent: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded border border-gray-200 bg-white p-4">
      <div className={`flex size-10 items-center justify-center rounded ${accent}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold text-black">{value}</p>
      </div>
    </div>
  );
}

function ProgressDistribution({
  members,
}: {
  readonly members: readonly DemoMember[];
}) {
  const buckets = [
    { label: "0%", min: 0, max: 0 },
    { label: "1-25%", min: 1, max: 25 },
    { label: "26-50%", min: 26, max: 50 },
    { label: "51-75%", min: 51, max: 75 },
    { label: "76-99%", min: 76, max: 99 },
    { label: "100%", min: 100, max: 100 },
  ];

  const counts = buckets.map((bucket) => {
    const count = members.filter((m) => {
      const pct = Math.round((m.tasksCompleted / m.totalTasks) * 100);
      return pct >= bucket.min && pct <= bucket.max;
    }).length;
    return { ...bucket, count };
  });

  const maxCount = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="rounded border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-bold text-black">進捗分布</h3>
      <div className="flex items-end gap-2">
        {counts.map((bucket) => (
          <div key={bucket.label} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-500">
              {bucket.count}
            </span>
            <div
              className="w-full rounded-t bg-blue-400 transition-all"
              style={{
                height: `${Math.max((bucket.count / maxCount) * 80, 4)}px`,
              }}
            />
            <span className="text-[10px] text-gray-400">{bucket.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const params = useParams();
  const projectId = params.project as string;

  const totalMembers = DEMO_MEMBERS.length;
  const avgProgress = Math.round(
    DEMO_MEMBERS.reduce(
      (sum, m) => sum + (m.tasksCompleted / m.totalTasks) * 100,
      0
    ) / totalMembers
  );
  const sosCount = DEMO_MEMBERS.filter((m) => m.inactive).length;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        breadcrumbs={[
          { label: projectId, href: `/${projectId}` },
          { label: "管理" },
        ]}
      />
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-4xl">
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

          <div className="mb-6 grid grid-cols-3 gap-4">
            <StatCard
              label="メンバー数"
              value={`${totalMembers}人`}
              icon={Users}
              accent="bg-blue-50 text-blue-500"
            />
            <StatCard
              label="平均進捗"
              value={`${avgProgress}%`}
              icon={TrendingUp}
              accent="bg-green-50 text-green-500"
            />
            <StatCard
              label="SOS (要フォロー)"
              value={`${sosCount}人`}
              icon={AlertCircle}
              accent={sosCount > 0 ? "bg-orange-50 text-orange-500" : "bg-gray-50 text-gray-400"}
            />
          </div>

          <div className="mb-6">
            <ProgressDistribution members={DEMO_MEMBERS} />
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
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          最終: {member.lastActive}
                        </span>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-gray-400">
                          {member.currentTask}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          progress === 100
                            ? "bg-green-500"
                            : progress >= 50
                              ? "bg-blue-500"
                              : "bg-orange-400"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-medium text-gray-600">
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
