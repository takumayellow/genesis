import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `あなたはプログラミング初心者をサポートするAIメンターです。
丁寧で分かりやすい日本語で回答してください。

${context ? `## コンテキスト\n${context}\n` : ""}

## ユーザーの質問
${message}

## 回答ルール
- 初心者にもわかる言葉で説明する
- エラーの場合は具体的な解決コマンドを提示する
- 長くなりすぎず、要点を絞って回答する
- コードブロックを使って見やすく回答する`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
