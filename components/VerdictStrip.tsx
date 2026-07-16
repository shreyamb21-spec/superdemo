import type { PipelineResult } from "@/lib/types";

export function VerdictStrip({
  result,
  onJump,
}: {
  result: PipelineResult;
  onJump: (tab: "Backlog" | "90-Day Rollout" | "Deployment Kit") => void;
}) {
  const top = [...result.stage2.scored].sort(
    (a, b) => b.scores.overall - a.scores.overall
  )[0];
  const topWorkflow = result.stage1.workflows.find((w) => w.id === top.id);
  const shipsTotal = new Set(
    result.stage2.rollout.flatMap((p) => p.items)
  ).size;

  const cells: Array<{
    label: string;
    value: string;
    sub?: string;
    tab: "Backlog" | "90-Day Rollout" | "Deployment Kit";
    accent?: boolean;
  }> = [
    {
      label: "Workflows mined",
      value: String(result.stage1.workflows.length),
      sub: "scored on 4 dimensions",
      tab: "Backlog",
    },
    {
      label: "First win",
      value: topWorkflow?.name ?? top.id,
      sub: topWorkflow?.champion
        ? `champion: ${topWorkflow.champion.name}`
        : undefined,
      tab: "Deployment Kit",
      accent: true,
    },
    {
      label: "Top score",
      value: `${top.scores.overall}`,
      sub: "/ 100",
      tab: "Backlog",
    },
    {
      label: "90-day arc",
      value: `${shipsTotal} apps`,
      sub: "in 3 phases",
      tab: "90-Day Rollout",
    },
  ];

  return (
    <div className="grid grid-cols-2 divide-hairline overflow-hidden rounded-lg border border-hairline bg-white sm:grid-cols-4 sm:divide-x">
      {cells.map((c) => (
        <button
          key={c.label}
          type="button"
          onClick={() => onJump(c.tab)}
          className="border-hairline p-3 text-left transition-colors hover:bg-paper sm:p-4 [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0 [&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-r-0"
        >
          <div className="eyebrow !text-[9px]">{c.label}</div>
          <div
            className={`mt-1 leading-snug ${
              c.accent
                ? "text-[13px] font-semibold text-cobalt"
                : "font-mono text-xl font-semibold"
            }`}
          >
            {c.value}
          </div>
          {c.sub && (
            <div className="mt-0.5 text-[11px] text-secondary">{c.sub}</div>
          )}
        </button>
      ))}
    </div>
  );
}
