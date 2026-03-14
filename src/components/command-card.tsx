"use client";

import { useState } from "react";
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react";

interface CommandCardProps {
  readonly command: string;
  readonly label?: string;
  readonly explanation?: string;
}

function CopyButton({ text }: { readonly text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex shrink-0 items-center gap-1.5 rounded-md bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-colors"
    >
      {copied ? (
        <>
          <Check className="size-3.5" />
          コピー済 &#x2713;
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          コピー
        </>
      )}
    </button>
  );
}

export function CommandCard({ command, label, explanation }: CommandCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-sm font-medium text-gray-600">{label}</p>
      )}

      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-4 py-3">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-sm text-black">
          {command}
        </code>
        <CopyButton text={command} />
      </div>

      {explanation && (
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setShowExplanation((prev) => !prev)}
            className="flex items-center gap-1 self-start text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showExplanation ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
            なぜこのコマンド？
          </button>

          {showExplanation && (
            <div className="rounded-md bg-blue-50 px-4 py-3 text-xs leading-5 text-gray-700">
              {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
