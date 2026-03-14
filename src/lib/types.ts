export interface User {
  readonly uid: string;
  readonly githubUsername: string;
  readonly avatarUrl: string;
  readonly role: "member" | "admin";
  readonly createdAt: Date;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly repoUrl: string;
  readonly ownerId: string;
  readonly memberIds: readonly string[];
  readonly createdAt: Date;
}

export interface TaskStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly estimatedMinutes: number;
  readonly referenceUrl?: string;
  readonly command?: string;
  readonly completed: boolean;
}

export interface Task {
  readonly id: string;
  readonly projectId: string;
  readonly title: string;
  readonly description: string;
  readonly steps: readonly TaskStep[];
  readonly assigneeId: string;
  readonly status: "draft" | "published" | "completed";
  readonly createdAt: Date;
}

export interface Activity {
  readonly id: string;
  readonly projectId: string;
  readonly userId: string;
  readonly type: "step_complete" | "task_complete" | "push" | "review";
  readonly message: string;
  readonly createdAt: Date;
}
