"use client";

export type StageStatus = "pending" | "running" | "done" | "error";

export const STAGE_META = [
  {
    label: "Mining workflows",
    detail: "Reading discovery material, extracting candidate workflows and pain",
  },
  {
    label: "Scoring and sequencing",
    detail:
      "Rating each candidate on impact, data readiness, governance complexity, champion strength; building the 90-day arc",
  },
  {
    label: "Building the deployment kit",
    detail: "Clark build prompt, integrations, roles, knowledge files, metrics",
  },
] as const;

function StatusIcon({ status }: { status: StageStatus }) {
  if (status === "done") {
    return (
      <span className="animate-check flex h-5 w-5 items-center justify-center rounded-full bg-cobalt">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M1.5 5.5L4 8L8.5 2.5"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className="flex h-5 w-5 items-center justify-center">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-hairline border-t-cobalt" />
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-700 font-mono text-[11px] font-semibold text-white">
        !
      </span>
    );
  }
  return (
    <span className="flex h-5 w-5 items-center justify-center">
      <span className="h-3 w-3 rounded-full border border-hairline bg-white" />
    </span>
  );
}

export function PipelineView({
  statuses,
  sourceName,
  error,
  onRetry,
}: {
  statuses: StageStatus[];
  sourceName: string;
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="eyebrow">Running Day Zero / {sourceName}</div>
      <ol className="mt-6 space-y-0">
        {STAGE_META.map((stage, i) => {
          const status = statuses[i];
          const isLast = i === STAGE_META.length - 1;
          return (
            <li key={stage.label} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <StatusIcon status={status} />
                {!isLast && (
                  <span
                    className={`w-px flex-1 ${
                      status === "done" ? "bg-cobalt" : "bg-hairline"
                    }`}
                  />
                )}
              </div>
              <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                <div className="eyebrow !text-[10px]">
                  Stage {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className={`mt-0.5 text-[15px] font-medium ${
                    status === "pending" ? "text-secondary" : "text-ink"
                  }`}
                >
                  {stage.label}
                </div>
                <p className="mt-1 max-w-md text-[13px] leading-relaxed text-secondary">
                  {stage.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      {error && (
        <div className="mt-8 rounded-lg border border-red-200 bg-white p-4">
          <p className="text-[13px] text-red-700">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded bg-cobalt px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Retry stage
          </button>
        </div>
      )}
    </div>
  );
}
