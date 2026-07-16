export function Header({ demoMode }: { demoMode: boolean }) {
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div>
          <div className="font-mono text-sm font-semibold tracking-[0.14em]">
            DAY ZERO
          </div>
          <div className="text-xs text-secondary">
            The first three weeks of an AI deployment, run before day one.
          </div>
        </div>
        {demoMode && (
          <span className="shrink-0 rounded-full border border-hairline bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-secondary">
            demo data
          </span>
        )}
      </div>
    </header>
  );
}
