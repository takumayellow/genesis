import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { issueUrl } = await request.json();

    if (!issueUrl) {
      return NextResponse.json(
        { error: "issueUrl is required" },
        { status: 400 }
      );
    }

    const match = issueUrl.match(
      /github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/
    );
    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub Issue URL" },
        { status: 400 }
      );
    }

    const [, owner, repo, issueNumber] = match;
    const token = process.env.GITHUB_TOKEN;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${response.status}` },
        { status: response.status }
      );
    }

    const issue = await response.json();

    return NextResponse.json({
      title: issue.title,
      body: issue.body,
      labels: issue.labels.map((l: { name: string }) => l.name),
      state: issue.state,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
