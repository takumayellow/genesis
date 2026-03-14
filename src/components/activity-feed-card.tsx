"use client";

import { Activity as ActivityIcon } from "lucide-react";
import { ActivityTimeline } from "@/components/activity-timeline";

interface ActivityFeedCardProps {
  readonly projectId: string;
}

export function ActivityFeedCard({ projectId }: ActivityFeedCardProps) {
  return (
    <div className="rounded border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <ActivityIcon className="size-5 text-blue-500" />
        <h2 className="text-lg font-bold text-black">
          チームアクティビティ
        </h2>
      </div>
      {projectId ? (
        <ActivityTimeline projectId={projectId} />
      ) : (
        <p className="text-sm text-gray-400">
          まだアクティビティがありません
        </p>
      )}
    </div>
  );
}
