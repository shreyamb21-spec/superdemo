"use client";

import { useState } from "react";
import type { PipelineResult } from "@/lib/types";
import { chipContextFrom, extractChips } from "@/lib/extract";
import { ChipRow } from "./bits";

export function RolloutTab({ result }: { result: PipelineResult }) {
  const [openPhase, setOpenPhase] = useState<number | null>(null);
  const ctx = chipContextFrom(result.stage1);

  const nameOf = (item: string) => {
    const exact = result.stage1.workflows.find((w) => w.id === item);
    if (exact) return exact.name;
    // tolerate annotated ids like "om-generation (pilot scope)"
    const prefix = result.stage1.workflows.find((w) => item.startsWith(w.id));
    if (prefix) {
      const note = item.slice(prefix.id.length).trim();
      return note ? `${prefix.name} ${note}` : prefix.name;
    }
    return item;
  };

  return (
    <ol className="space-y-0">
      {result.stage2.rollout.map((phase, i) => {
        const isLast = i === result.stage2.rollout.length - 1;
        const open = openPhase === i;
        const chips = extractChips(
          `${phase.champion_moves} ${phase.proof_metric}`,
          ctx,
          4
        );
        return (
          <li key={phase.phase} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cobalt bg-white font-mono text-[11px] font-semibold text-cobalt">
                {i + 1}
              </span>
              {!isLast && <span className="w-px flex-1 bg-hairline" />}
            </div>
            <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-6"}`}>
              <div className="text-[15px] font-semibold">{phase.phase}</div>
              <div className="mt-2 overflow-hidden rounded-lg border border-hairline bg-white">
                <button
                  type="button"
                  onClick={() => setOpenPhase(open ? null : i)}
                  className="w-full p-4 text-left"
                  aria-expanded={open}
                >
                  <div className="eyebrow !text-[10px]">Ships</div>
                  <ul className="mt-1 space-y-1">
                    {phase.items.map((id) => (
                      <li key={id} className="text-[13px] font-medium">
                        {nameOf(id)}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3">
                    <ChipRow chips={chips} />
                  </div>
                  <div className="mt-3 border-t border-hairline pt-3">
                    <div className="eyebrow !text-[10px]">Proof metric</div>
                    <p
                      className={`mt-1 text-[13px] leading-relaxed ${
                        open ? "" : "line-clamp-2"
                      }`}
                    >
                      {phase.proof_metric}
                    </p>
                  </div>
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-cobalt">
                    {open ? "Hide champion moves" : "Champion moves"}
                  </div>
                </button>
                {open && (
                  <div className="border-t border-hairline bg-paper px-4 py-3">
                    <div className="eyebrow !text-[10px]">Champion moves</div>
                    <p className="mt-1 text-[13px] leading-relaxed">
                      {phase.champion_moves}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
