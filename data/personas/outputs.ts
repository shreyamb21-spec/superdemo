import meridianOutput from "./meridian.output.json";
import hartwellOutput from "./hartwell.output.json";
import type { PipelineResult } from "@/lib/types";

export const personaOutputs: Record<string, PipelineResult> = {
  meridian: meridianOutput as PipelineResult,
  hartwell: hartwellOutput as PipelineResult,
};
