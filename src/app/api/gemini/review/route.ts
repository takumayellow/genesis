import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const SYSTEM_PROMPT = `あなたはプログラミング初心者を優しくサポートするコードレビュアーです。
与えられたdiff（コード差分）をレビューし、以下のJSON形式で回答してください。
JSON以外のテキストは含めないでください。

{
  "summary": "変更内容の概要（日本語・2〜3文）",
  "critical": [
    {
      "file": "ファイルパス（diffから読み取れる場合）",
      "line": "該当行番号またはnull",
      "title": "問題のタイトル",
      "description": "何が問題で、どう直せばいいか（初心者向けに具体的に）",
      "code": "修正例のコード（あれば）"
    }
  ],
  "suggestions": [
    {
      "file": "ファイルパス",
      "line": "該当行番号またはnull",
      "title": "改善提案のタイトル",
      "description": "なぜ改善すべきか、どう改善するか（初心者向け）",
      "code": "改善例のコード（あれば）"
    }
  ],
  "good": [
    {
      "file": "ファイルパス",
      "title": "良い点のタイトル",
      "description": "なぜ良いのかの説明（初心者の学びになるように）"
    }
  ]
}

## レビュールール
- 初心者が理解できる言葉で書く（専門用語は補足をつける）
- criticalはバグやセキュリティ問題など必ず修正すべきもの
- suggestionsは改善すると良いもの（命名、リファクタリング等）
- goodは良い書き方をしている部分（ポジティブフィードバック重要）
- 各カテゴリは0件でもOK（空配列を返す）
- コードブロックは使わず、codeフィールドに文字列として入れる
- 日本語で回答する`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diff, prUrl } = body as { diff?: string; prUrl?: string };

    if (!diff && !prUrl) {
      return NextResponse.json(
        { error: "diff or prUrl is required" },
        { status: 400 }
      );
    }

    let diffText = diff ?? "";

    if (prUrl && !diff) {
      const baseUrl = request.nextUrl.origin;
      const diffResponse = await fetch(`${baseUrl}/api/github/diff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prUrl }),
      });

      if (!diffResponse.ok) {
        const errorData = await diffResponse.json();
        return NextResponse.json(
          { error: errorData.error ?? "Failed to fetch diff from GitHub" },
          { status: diffResponse.status }
        );
      }

      const diffData = await diffResponse.json();
      diffText = diffData.diff;
    }

    if (!diffText || diffText.trim().length === 0) {
      return NextResponse.json(
        { error: "Diff is empty. No changes to review." },
        { status: 400 }
      );
    }

    const truncatedDiff =
      diffText.length > 30000 ? diffText.slice(0, 30000) + "\n...(truncated)" : diffText;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `${SYSTEM_PROMPT}

## レビュー対象のdiff
\`\`\`diff
${truncatedDiff}
\`\`\``;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AIのレスポンスを解析できませんでした。もう一度お試しください。" },
        { status: 500 }
      );
    }

    const review = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ review });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
