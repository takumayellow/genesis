export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

function extractRepoName(repoUrl: string): string {
  const cleaned = repoUrl.replace(/\.git$/, "").replace(/\/$/, "");
  const lastSegment = cleaned.split("/").pop();
  return lastSegment ?? "repo";
}

function sanitizeBranchSegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateBranchCommand(
  issueNumber: number,
  username: string
): string {
  const safeName = sanitizeBranchSegment(username);
  return `git checkout -b feature/issue-${issueNumber}-${safeName}`;
}

export function generateCloneCommand(repoUrl: string): string {
  const repoName = extractRepoName(repoUrl);
  return `git clone ${repoUrl} && cd ${repoName}`;
}

export function generatePushCommand(branchName: string): string {
  return `git add -A && git commit -m "feat: implement issue changes" && git push origin ${branchName}`;
}

export function generateInstallCommand(pm: PackageManager): string {
  const commands: Readonly<Record<PackageManager, string>> = {
    npm: "npm install",
    yarn: "yarn install",
    pnpm: "pnpm install",
    bun: "bun install",
  };
  return commands[pm];
}

export function generateDevCommand(pm: PackageManager): string {
  const commands: Readonly<Record<PackageManager, string>> = {
    npm: "npm run dev",
    yarn: "yarn dev",
    pnpm: "pnpm dev",
    bun: "bun dev",
  };
  return commands[pm];
}
