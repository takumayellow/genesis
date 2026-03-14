import { NextRequest, NextResponse } from "next/server";

function parsePrUrl(
  url: string
): { owner: string; repo: string; pull: string } | null {
  const match = url.match(
    /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
  );
  if (!match) return null;
  const [, owner, repo, pull] = match;
  return { owner, repo, pull };
}

export async function POST(request: NextRequest) {
  try {
    const { prUrl } = await request.json();

    if (!prUrl || typeof prUrl !== "string") {
      return NextResponse.json(
        { error: "prUrl is required" },
        { status: 400 }
      );
    }

    const parsed = parsePrUrl(prUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid GitHub Pull Request URL. Expected format: https://github.com/owner/repo/pull/123" },
        { status: 400 }
      );
    }

    const { owner, repo, pull } = parsed;
    const token = process.env.GITHUB_TOKEN;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${pull}`,
      {
        headers: {
          Accept: "application/vnd.github.v3.diff",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const diff = await response.text();

    const metaResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${pull}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    const meta = metaResponse.ok ? await metaResponse.json() : null;

    return NextResponse.json({
      diff,
      title: meta?.title ?? "",
      description: meta?.body ?? "",
      filesChanged: meta?.changed_files ?? 0,
      additions: meta?.additions ?? 0,
      deletions: meta?.deletions ?? 0,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
