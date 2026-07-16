"use client";

import { useState } from "react";

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-hairline bg-paper px-2 py-0.5 font-mono text-[10px] tracking-wide text-ink">
      {children}
    </span>
  );
}

export function ChipRow({ chips }: { chips: string[] }) {
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <Chip key={c}>{c}</Chip>
      ))}
    </div>
  );
}

/** Prose collapsed to a few lines with a mono toggle. */
export function ClampedText({
  text,
  lines = 2,
  className = "",
}: {
  text: string;
  lines?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const clampClass = lines === 2 ? "line-clamp-2" : "line-clamp-3";
  return (
    <div className={className}>
      <p
        className={`text-[13px] leading-relaxed ${open ? "" : clampClass}`}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-1 font-mono text-[10px] uppercase tracking-wider text-cobalt"
      >
        {open ? "Less" : "More"}
      </button>
    </div>
  );
}

/** Mono block truncated to N rendered lines with a fade; expands to full content. */
export function ClampedMono({
  text,
  previewLines = 6,
  expandLabel = "Show full content",
  className = "",
}: {
  text: string;
  previewLines?: number;
  expandLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  // rough estimate of rendered lines: hard newlines + wrapping at ~70 chars
  const estimatedLines = text
    .split("\n")
    .reduce((n, l) => n + Math.max(1, Math.ceil(l.length / 70)), 0);
  const needsClamp = estimatedLines > previewLines + 3;

  return (
    <div>
      <div className="relative">
        <pre
          className={`whitespace-pre-wrap font-mono text-[12px] leading-relaxed ${className}`}
          style={
            needsClamp && !open
              ? {
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: previewLines,
                  overflow: "hidden",
                }
              : undefined
          }
        >
          {text}
        </pre>
        {needsClamp && !open && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      {needsClamp && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="mt-2 font-mono text-[10px] uppercase tracking-wider text-cobalt"
        >
          {open ? "Collapse" : expandLabel}
        </button>
      )}
    </div>
  );
}
