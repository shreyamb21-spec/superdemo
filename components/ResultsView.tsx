"use client";

import { useState } from "react";
import type { PipelineResult } from "@/lib/types";
import { BacklogTab } from "./BacklogTab";
import { RolloutTab } from "./RolloutTab";
import { KitTab } from "./KitTab";
import { VerdictStrip } from "./VerdictStrip";
import { ClampedText } from "./bits";

const TABS = ["Backlog", "90-Day Rollout", "Deployment Kit"] as const;
type Tab = (typeof TABS)[number];

export function ResultsView({
  result,
  sourceName,
  onReset,
}: {
  result: PipelineResult;
  sourceName: string;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<Tab>("Backlog");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-12 sm:px-6">
      <div className="flex items-center justify-between gap-3 py-4">
        <div className="min-w-0">
          <div className="eyebrow !text-[10px]">Day Zero output</div>
          <div className="truncate text-[15px] font-semibold">{sourceName}</div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 rounded border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-secondary hover:border-cobalt hover:text-cobalt"
        >
          New run
        </button>
      </div>

      <VerdictStrip result={result} onJump={setTab} />

      <div className="mt-3 rounded-lg border border-hairline bg-white p-4 text-secondary">
        <div className="eyebrow !text-[9px]">Customer context</div>
        <ClampedText
          text={result.stage1.customer_context}
          lines={2}
          className="mt-1"
        />
      </div>

      <div className="sticky top-0 z-10 -mx-4 mt-4 border-b border-hairline bg-paper px-4 sm:mx-0 sm:px-0">
        <div className="flex" role="tablist" aria-label="Results">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 border-b-2 px-2 py-3 text-[13px] font-medium transition-colors sm:flex-none sm:px-4 ${
                tab === t
                  ? "border-cobalt text-cobalt"
                  : "border-transparent text-secondary hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-5">
        {tab === "Backlog" && <BacklogTab result={result} />}
        {tab === "90-Day Rollout" && <RolloutTab result={result} />}
        {tab === "Deployment Kit" && <KitTab result={result} />}
      </div>
    </div>
  );
}
