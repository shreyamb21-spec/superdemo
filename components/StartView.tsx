"use client";

import { useState } from "react";
import { personas } from "@/data/personas";
import type { Persona } from "@/lib/types";

export function StartView({
  onSelectPersona,
  onRunMaterial,
}: {
  onSelectPersona: (persona: Persona) => void;
  onRunMaterial: (material: string) => void;
}) {
  const [material, setMaterial] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleRun() {
    if (material.trim().length < 100) {
      setError("Give me at least a paragraph of real material to mine.");
      return;
    }
    setError(null);
    onRunMaterial(material.trim());
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        The first three weeks of a deployment, run before day one.
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-secondary">
        Paste the raw material of an enterprise customer. Get back what a
        deployment strategist ships in weeks one through three: a scored
        use-case backlog, a 90-day rollout, and a build-ready deployment kit.
      </p>

      <div className="eyebrow mt-12">Two composite customers</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {personas.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectPersona(p)}
            className="group flex flex-col items-start rounded-lg border border-hairline bg-white p-4 text-left transition-colors hover:border-cobalt"
          >
            <div className="flex w-full items-baseline justify-between gap-2">
              <span className="font-semibold">{p.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-cobalt opacity-0 transition-opacity group-hover:opacity-100">
                Run &rarr;
              </span>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-secondary">
              {p.cardCopy}
            </p>
            <span className="mt-3 rounded-full border border-hairline px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-secondary">
              Composite persona from public case studies
            </span>
          </button>
        ))}
      </div>

      <div className="eyebrow mt-10">Or bring your own</div>
      <div className="mt-3 rounded-lg border border-hairline bg-white p-4">
        <textarea
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          rows={6}
          placeholder="Paste a discovery call transcript, process notes, or a description of the spreadsheet that runs a team..."
          className="w-full resize-y rounded border border-hairline bg-paper p-3 text-[13px] leading-relaxed outline-none placeholder:text-secondary/60 focus:border-cobalt"
        />
        {error && <p className="mt-2 text-[13px] text-red-700">{error}</p>}
        <button
          type="button"
          onClick={handleRun}
          className="mt-3 rounded bg-cobalt px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Run Day Zero
        </button>
      </div>
    </div>
  );
}
