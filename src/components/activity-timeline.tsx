"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  GitPullRequest,
  GitCommit,
  Eye,
  UserPlus,
} from "lucide-react";
import { subscribeToActivities } from "@/lib/activity";
import type { Activity } from "@/lib/types";

interface ActivityTimelineProps {
  readonly projectId: string;
}

const ACTIVITY_ICONS: Record<Activity["type"], typeof CheckCircle> = {
  step_complete: CheckCircle,
  task_complete: GitPullRequest,
  push: GitCommit,
  review: Eye,
  join: UserPlus,
} as const;

const ACTIVITY_COLORS: Record<Activity["type"], string> = {
  step_complete: "text-green-500 bg-green-50",
  task_complete: "text-blue-500 bg-blue-50",
  push: "text-purple-500 bg-purple-50",
  review: "text-orange-500 bg-orange-50",
  join: "text-pink-500 bg-pink-50",
} as const;

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "たった今";
  if (diffMinutes < 60) return `${diffMinutes}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString("ja-JP");
}

export function ActivityTimeline({ projectId }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<readonly Activity[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToActivities(projectId, setActivities);
    return () => unsubscribe();
  }, [projectId]);

  if (activities.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        まだアクティビティがありません
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {activities.map((activity) => {
          const Icon = ACTIVITY_ICONS[activity.type];
          const colorClass = ACTIVITY_COLORS[activity.type];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex items-start gap-3"
            >
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-black leading-relaxed">
                  {activity.message}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {formatRelativeTime(activity.createdAt)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
