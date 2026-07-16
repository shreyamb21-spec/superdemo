"use client";

import { useState } from "react";
import type { PipelineResult } from "@/lib/types";
import { ScoreBar } from "./ScoreBar";

const DIMENSIONS = [
  { key: "impact", label: "Impact" },
  { key: "data_readiness", label: "Data readiness" },
  { key: "governance_simplicity", label: "Governance" },
  { key: "champion_strength", label: "Champion" },
] as const;

export function BacklogTab({ result }: { result: PipelineResult }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const ranked = [...result.stage2.scored]
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .map((s) => ({
      scored: s,
      workflow: result.stage1.workflows.find((w) => w.id === s.id),
    }))
    .filter((r) => r.workflow);

  return (
    <div className="space-y-3">
      <p className="text-[12px] text-secondary">
        Governance scored as simplicity: fewer approval layers and less
        sensitive data score higher.
      </p>
      {ranked.map(({ scored, workflow }, rank) => {
        const open = openId === scored.id;
        return (
          <div
            key={scored.id}
            className="overflow-hidden rounded-lg border border-hairline bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : scored.id)}
              className="w-full p-4 text-left"
              aria-expanded={open}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="eyebrow !text-[10px]">
                    #{rank + 1} / {workflow!.department}
                  </div>
                  <div className="mt-0.5 text-[15px] font-semibold leading-snug">
                    {workflow!.name}
                  </div>
                  <p
                    className={`mt-1 text-[13px] leading-relaxed text-secondary ${
                      open ? "" : "line-clamp-2"
                    }`}
                  >
                    {workflow!.pain}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-2xl font-semibold text-cobalt">
                    {scored.scores.overall}
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-secondary">
                    / 100
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {DIMENSIONS.map((d) => (
                  <ScoreBar
                    key={d.key}
                    label={d.label}
                    value={scored.scores[d.key]}
                  />
                ))}
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-cobalt">
                {open ? "Hide" : "Why this score"}
              </div>
            </button>
            {open && (
              <div className="border-t border-hairline bg-paper px-4 py-3">
                <dl className="space-y-2.5">
                  {DIMENSIONS.map((d) => (
                    <div key={d.key}>
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-secondary">
                        {d.label} · {scored.scores[d.key]}
                      </dt>
                      <dd className="mt-0.5 text-[13px] leading-relaxed">
                        {scored.rationales[d.key]}
                      </dd>
                    </div>
                  ))}
                  {workflow!.champion && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-secondary">
                        Champion
                      </dt>
                      <dd className="mt-0.5 text-[13px] leading-relaxed">
                        {workflow!.champion.name} ({workflow!.champion.role}) —{" "}
                        {workflow!.champion.evidence}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
