import type { PipelineResult } from "@/lib/types";
import { chipContextFrom, extractChips } from "@/lib/extract";
import { CopyButton } from "./CopyButton";
import { ChipRow, ClampedMono, ClampedText } from "./bits";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow mt-8 first:mt-0">{children}</div>;
}

export function KitTab({ result }: { result: PipelineResult }) {
  const kit = result.stage3;
  const ctx = chipContextFrom(result.stage1);
  const useCase = result.stage1.workflows.find(
    (w) => w.id === kit.use_case_id
  );

  const promptChips = extractChips(kit.clark_prompt, ctx, 6);
  if (/human-in-the-loop|sign-?off|approv/i.test(kit.clark_prompt)) {
    promptChips.push("human-in-the-loop");
  }
  if (/plan (before|covering|for)/i.test(kit.clark_prompt)) {
    promptChips.push("plan before build");
  }

  return (
    <div>
      <div className="rounded-lg border border-hairline bg-white px-4 py-3">
        <div className="eyebrow !text-[10px]">Deployment kit for</div>
        <div className="mt-0.5 text-[15px] font-semibold">
          {useCase?.name ?? kit.use_case_id}
        </div>
        {useCase && (
          <p className="mt-1 text-[13px] text-secondary line-clamp-2">
            {useCase.pain}
          </p>
        )}
      </div>

      <SectionLabel>Clark build prompt</SectionLabel>
      <div className="mt-2 rounded-lg border border-hairline bg-white">
        <div className="flex items-center justify-between border-b border-hairline px-4 py-2">
          <span className="font-mono text-[11px] text-secondary">
            build_prompt
          </span>
          <CopyButton text={kit.clark_prompt} />
        </div>
        <div className="border-b border-hairline px-4 py-2.5">
          <ChipRow chips={promptChips} />
        </div>
        <div className="p-4">
          <ClampedMono
            text={kit.clark_prompt}
            previewLines={7}
            expandLabel="Show full prompt"
          />
        </div>
      </div>

      <SectionLabel>Integrations and access</SectionLabel>
      <div className="mt-2 space-y-2">
        {kit.integrations.map((it, i) => (
          <div
            key={`${it.integration}-${i}`}
            className="rounded-lg border border-hairline bg-white p-4"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[13px] font-semibold">
                {it.integration}
              </span>
              <span className="text-secondary" aria-hidden>
                &rarr;
              </span>
              <span className="text-[13px]">{it.shared_to_group}</span>
              <span
                className={`ml-auto rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                  it.access_level.toLowerCase().includes("dev")
                    ? "border-cobalt text-cobalt"
                    : "border-hairline text-secondary"
                }`}
              >
                {it.access_level}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-secondary">
              {it.why}
            </p>
          </div>
        ))}
      </div>

      <SectionLabel>RBAC notes</SectionLabel>
      <div className="mt-2 divide-y divide-hairline rounded-lg border border-hairline bg-white">
        {kit.rbac_notes.map((note, i) => (
          <div key={`${note.role}-${i}`} className="p-4">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-mono text-[13px] font-semibold">
                {note.role}
              </span>
              <span className="text-[12px] text-secondary">{note.who}</span>
            </div>
            <ClampedText
              text={note.why}
              lines={2}
              className="mt-1 text-secondary"
            />
          </div>
        ))}
      </div>

      <SectionLabel>Knowledge files</SectionLabel>
      <div className="mt-2 space-y-3">
        {kit.knowledge_files.map((file) => (
          <div
            key={file.filename}
            className="overflow-hidden rounded-lg border border-hairline bg-white"
          >
            <div className="flex items-center justify-between border-b border-hairline bg-paper px-4 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate font-mono text-[12px] font-medium">
                  {file.filename}
                </span>
                <span className="shrink-0 rounded-full border border-hairline px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-secondary">
                  {file.level}
                </span>
              </div>
              <CopyButton text={file.body} />
            </div>
            <div className="paper-texture p-4">
              <ClampedMono
                text={file.body}
                previewLines={6}
                expandLabel="Show full file"
                className="!text-[11.5px]"
              />
            </div>
          </div>
        ))}
      </div>

      <SectionLabel>Success metrics</SectionLabel>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {kit.metrics.map((m) => (
          <div
            key={m.metric}
            className="rounded-lg border border-hairline bg-white p-4"
          >
            <div className="text-[13px] font-semibold leading-snug">
              {m.metric}
            </div>
            <div className="mt-1 font-mono text-[12px] text-shipped">
              {m.target}
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-secondary line-clamp-2">
              {m.how_measured}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
