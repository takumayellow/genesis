import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export interface AnalyzedTask {
  issueUrl: string;
  目的: string;
  説明: string;
  必要な知識: string;
  ロードマップ: string;
  ステップ: {
    やること: string;
    公式教材のリンク: string;
    ヘルプ: string;
    答え: string;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const { issueUrl, issueTitle, issueBody } = await request.json();

    if (!issueTitle) {
      return NextResponse.json(
        { error: "issueTitle is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `以下のGitHub Issueをタスクに分解してください。
Issue Title: ${issueTitle}
Issue Body: ${issueBody ?? "なし"}

以下のJSON形式のみで返してください。他のテキストやマークダウンのコードブロックは含めないでください:
{
  "目的": "このIssueで達成すること",
  "説明": "Issueの詳細説明（初心者にもわかりやすく）",
  "必要な知識": "取り組むために必要な技術・知識（箇条書き可）",
  "ロードマップ": "完了までの全体像（全体の流れを簡潔に）",
  "ステップ": [
    {
      "やること": "具体的な作業内容",
      "公式教材のリンク": "関連する公式ドキュメントURL（なければ空文字）",
      "ヘルプ": "詰まったときのヒント",
      "答え": "解答例・実装例（コードがあればコードも含める）"
    }
  ]
}

## ルール
- ステップは5〜10個程度にすること
- 各ステップは初心者でも理解できる粒度にすること
- 公式教材のリンクは実在するURLのみ記載すること`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const analyzed = JSON.parse(jsonMatch[0]);
    const response: AnalyzedTask = {
      issueUrl: issueUrl ?? "",
      目的: analyzed["目的"] ?? "",
      説明: analyzed["説明"] ?? "",
      必要な知識: analyzed["必要な知識"] ?? "",
      ロードマップ: analyzed["ロードマップ"] ?? "",
      ステップ: Array.isArray(analyzed["ステップ"])
        ? analyzed["ステップ"].map(
            (s: {
              やること?: string;
              公式教材のリンク?: string;
              ヘルプ?: string;
              答え?: string;
            }) => ({
              やること: s["やること"] ?? "",
              公式教材のリンク: s["公式教材のリンク"] ?? "",
              ヘルプ: s["ヘルプ"] ?? "",
              答え: s["答え"] ?? "",
            })
          )
        : [],
    };

    return NextResponse.json(response);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
