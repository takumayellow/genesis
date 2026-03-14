import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(request: NextRequest) {
  try {
    const { issueTitle, issueBody, repoUrl } = await request.json();

    if (!issueTitle) {
      return NextResponse.json(
        { error: "issueTitle is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `あなたはプログラミング初心者向けのタスク分解エキスパートです。
以下のGitHub Issueを、完全初心者が5分以内で終わる極小ステップに分解してください。

## Issue情報
タイトル: ${issueTitle}
内容: ${issueBody ?? "なし"}
リポジトリ: ${repoUrl ?? "なし"}

## 出力形式
以下のJSON配列を返してください。他のテキストは含めないでください。
[
  {
    "title": "ステップのタイトル（日本語）",
    "description": "具体的な説明（初心者にもわかるように）",
    "estimatedMinutes": 5,
    "referenceUrl": "関連する公式ドキュメントのURL（あれば）",
    "command": "ターミナルで実行するコマンド（あれば）"
  }
]

## ルール
- 各ステップは5分以内で完了できる粒度にすること
- 最初のステップは必ず「対象ファイルを開く」や「ブランチを作成する」など具体的な行動
- コマンドはコピペで実行できる形式にすること
- 参考URLは公式ドキュメントのみ（MDNやReact公式など）
- 6〜10ステップ程度に分解すること`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const steps = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ steps });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
