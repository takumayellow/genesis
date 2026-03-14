"use client";

import { useState } from "react";
import { Terminal, ChevronDown, ChevronUp } from "lucide-react";

interface GuideSection {
  readonly title: string;
  readonly content: string;
}

const GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    title: "ターミナルとは？",
    content:
      "ターミナル（端末）は、テキストでコンピュータに命令を送るアプリです。ファイル操作やプログラムの実行など、開発に欠かせないツールです。",
  },
  {
    title: "ターミナルの開き方",
    content:
      "【macOS】Spotlight（⌘ + Space）で「Terminal」と検索するか、アプリケーション → ユーティリティ → ターミナル.app を開きます。\n\n【Windows】スタートメニューで「PowerShell」と検索して開きます。または Windows Terminal アプリをインストールすると便利です。\n\n【VS Code】Ctrl + `（バッククォート）で統合ターミナルが開きます。",
  },
  {
    title: "ディレクトリの移動",
    content:
      "cd フォルダ名 → 指定フォルダに移動\ncd .. → 一つ上のフォルダに戻る\ncd ~ → ホームディレクトリに戻る\n\n【macOS / Linux】ls → 今いるフォルダの中身を表示\n【Windows】dir → 今いるフォルダの中身を表示",
  },
  {
    title: "コピー＆ペーストのショートカット",
    content:
      "【macOS ターミナル】\n  コピー: ⌘ + C\n  ペースト: ⌘ + V\n\n【Windows PowerShell】\n  コピー: Ctrl + C（テキスト選択時）\n  ペースト: Ctrl + V または 右クリック\n\n【VS Code 統合ターミナル】\n  コピー: Ctrl + Shift + C（macOS: ⌘ + C）\n  ペースト: Ctrl + Shift + V（macOS: ⌘ + V）",
  },
];

function GuideSectionItem({ section }: { readonly section: GuideSection }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h5 className="text-sm font-bold text-gray-700">{section.title}</h5>
      <p className="whitespace-pre-line text-xs leading-5 text-gray-600">
        {section.content}
      </p>
    </div>
  );
}

export function TerminalGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-gray-50"
      >
        <Terminal className="size-4 text-gray-500" />
        <span className="flex-1 text-sm font-medium text-gray-700">
          ターミナルの使い方
        </span>
        {open ? (
          <ChevronUp className="size-4 text-gray-400" />
        ) : (
          <ChevronDown className="size-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="flex flex-col gap-5 border-t border-gray-200 px-4 py-4">
          {GUIDE_SECTIONS.map((section) => (
            <GuideSectionItem key={section.title} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}
