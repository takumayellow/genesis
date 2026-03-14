import type { User, Project, Task, Activity } from "@/lib/types";
import {
  DEMO_USER,
  DEMO_PROJECT,
  DEMO_TASKS,
  DEMO_ACTIVITIES,
  DEMO_STATS,
} from "@/lib/demo-data";

export function isDemoMode(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !apiKey || apiKey === "demo-key";
}

export function getDemoUser(): User {
  return DEMO_USER;
}

export function getDemoProject(): Project {
  return DEMO_PROJECT;
}

export function getDemoTasks(): readonly Task[] {
  return DEMO_TASKS;
}

export function getDemoTask(taskId: string): Task | undefined {
  return DEMO_TASKS.find((task) => task.id === taskId);
}

export function getDemoActivities(): readonly Activity[] {
  return DEMO_ACTIVITIES;
}

export function getDemoStats(): {
  readonly projects: number;
  readonly completedTasks: number;
  readonly teamMembers: number;
} {
  return DEMO_STATS;
}
