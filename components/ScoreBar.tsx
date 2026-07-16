export function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-wider text-secondary sm:w-36">
        {label}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-hairline">
        <div
          className="animate-bar h-full rounded-full bg-cobalt"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      <span className="w-7 shrink-0 text-right font-mono text-[11px] text-ink">
        {value}
      </span>
    </div>
  );
}
