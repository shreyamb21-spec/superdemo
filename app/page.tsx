"use client";

import { useCallback, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StartView } from "@/components/StartView";
import { PipelineView, type StageStatus } from "@/components/PipelineView";
import { ResultsView } from "@/components/ResultsView";
import { personaOutputs } from "@/data/personas/outputs";
import type {
  Persona,
  PipelineResult,
  Stage1Output,
  Stage2Output,
  Stage3Output,
} from "@/lib/types";

type View = "start" | "pipeline" | "results";

async function callStageApi<T>(body: object): Promise<T> {
  const res = await fetch("/api/pipeline", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `Stage failed (${res.status})`);
  return json as T;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [view, setView] = useState<View>("start");
  const [demoMode, setDemoMode] = useState(false);
  const [sourceName, setSourceName] = useState("");
  const [statuses, setStatuses] = useState<StageStatus[]>([
    "pending",
    "pending",
    "pending",
  ]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const runId = useRef(0);
  const lastLive = useRef<{ material: string; name: string } | null>(null);

  const reset = useCallback(() => {
    runId.current++;
    setView("start");
    setDemoMode(false);
    setResult(null);
    setError(null);
    setStatuses(["pending", "pending", "pending"]);
  }, []);

  const runDemo = useCallback(async (persona: Persona) => {
    const id = ++runId.current;
    const output = personaOutputs[persona.id];
    lastLive.current = null;
    setDemoMode(true);
    setSourceName(persona.name);
    setError(null);
    setStatuses(["pending", "pending", "pending"]);
    setView("pipeline");
    const cadence = [900, 1000, 800];
    for (let i = 0; i < 3; i++) {
      setStatuses((s) => s.map((v, j) => (j === i ? "running" : v)));
      await sleep(cadence[i]);
      if (runId.current !== id) return;
      setStatuses((s) => s.map((v, j) => (j === i ? "done" : v)));
    }
    await sleep(350);
    if (runId.current !== id) return;
    setResult(output);
    setView("results");
  }, []);

  const runLive = useCallback(async (material: string, name: string) => {
    const id = ++runId.current;
    setDemoMode(false);
    setSourceName(name);
    setError(null);
    setView("pipeline");
    setStatuses(["running", "pending", "pending"]);
    try {
      const stage1 = await callStageApi<Stage1Output>({ stage: 1, material });
      if (runId.current !== id) return;
      setStatuses(["done", "running", "pending"]);
      const stage2 = await callStageApi<Stage2Output>({ stage: 2, stage1 });
      if (runId.current !== id) return;
      setStatuses(["done", "done", "running"]);
      const stage3 = await callStageApi<Stage3Output>({
        stage: 3,
        stage1,
        stage2,
      });
      if (runId.current !== id) return;
      setStatuses(["done", "done", "done"]);
      await sleep(350);
      if (runId.current !== id) return;
      setResult({ stage1, stage2, stage3 });
      setView("results");
    } catch (e) {
      if (runId.current !== id) return;
      setStatuses((s) => s.map((v) => (v === "running" ? "error" : v)));
      setError(e instanceof Error ? e.message : "Pipeline stage failed.");
    }
  }, []);

  return (
    <>
      <Header demoMode={demoMode && view !== "start"} />
      <main className="flex-1">
        {view === "start" && (
          <StartView
            onSelectPersona={(p) => runDemo(p)}
            onRunMaterial={(material, name) => {
              lastLive.current = { material, name };
              runLive(material, name);
            }}
          />
        )}
        {view === "pipeline" && (
          <PipelineView
            statuses={statuses}
            sourceName={sourceName}
            error={error}
            onRetry={() => {
              if (lastLive.current) {
                runLive(lastLive.current.material, lastLive.current.name);
              } else {
                reset();
              }
            }}
          />
        )}
        {view === "results" && result && (
          <ResultsView result={result} sourceName={sourceName} onReset={reset} />
        )}
      </main>
      <Footer />
    </>
  );
}
