"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
        copied
          ? "border-shipped text-shipped"
          : "border-hairline text-secondary hover:border-cobalt hover:text-cobalt"
      }`}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
