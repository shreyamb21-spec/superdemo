"use client";

import { useRef, useState } from "react";
import { personas } from "@/data/personas";
import type { Persona } from "@/lib/types";
import { parseSpreadsheet, type ParsedSpreadsheet } from "@/lib/spreadsheet";

export function StartView({
  onSelectPersona,
  onRunMaterial,
}: {
  onSelectPersona: (persona: Persona) => void;
  onRunMaterial: (material: string, sourceName: string) => void;
}) {
  const [material, setMaterial] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sheet, setSheet] = useState<ParsedSpreadsheet | null>(null);
  const [parsing, setParsing] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setParsing(true);
    try {
      const parsed = await parseSpreadsheet(file);
      if (parsed.totalRows === 0) {
        setError("That spreadsheet looks empty — no rows found in any sheet.");
        setSheet(null);
      } else {
        setSheet(parsed);
      }
    } catch {
      setError(
        "Couldn't read that file. Make sure it's a valid .xlsx, .xls, or .csv."
      );
      setSheet(null);
    } finally {
      setParsing(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function handleRun() {
    const typed = material.trim();
    const combined = sheet ? `${typed}\n\n${sheet.text}`.trim() : typed;
    if (combined.length < 100) {
      setError("Give me at least a paragraph of real material to mine.");
      return;
    }
    setError(null);
    onRunMaterial(combined, sheet ? sheet.filename : "Your material");
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

        {sheet && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded border border-hairline bg-paper px-3 py-2">
            <div className="min-w-0">
              <div className="truncate font-mono text-[12px] font-medium">
                {sheet.filename}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-secondary">
                {sheet.sheetCount} sheets &middot; {sheet.totalRows} rows
                &middot; will be mined with your notes
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSheet(null)}
              className="shrink-0 rounded border border-hairline px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-secondary hover:border-cobalt hover:text-cobalt"
            >
              Remove
            </button>
          </div>
        )}

        {error && <p className="mt-2 text-[13px] text-red-700">{error}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRun}
            className="rounded bg-cobalt px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Run Day Zero
          </button>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={parsing}
            className="rounded border border-hairline px-4 py-2 text-sm font-medium text-secondary transition-colors hover:border-cobalt hover:text-cobalt disabled:opacity-50"
          >
            {parsing
              ? "Reading spreadsheet..."
              : sheet
                ? "Replace spreadsheet"
                : "Attach spreadsheet"}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>
    </div>
  );
}
