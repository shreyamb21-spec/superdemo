/* Runs the three pipeline stages against the gateway for each persona and
   writes /data/personas/<id>.output.json. Run: npm run precompute */
import fs from "node:fs";
import path from "node:path";

// Load .env.local (tsx does not load it automatically)
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

import { callStage } from "../lib/gateway";
import { STAGE1_SYSTEM, STAGE2_SYSTEM, STAGE3_SYSTEM } from "../lib/prompts";
import { personas } from "../data/personas";
import type { Stage1Output, Stage2Output, Stage3Output } from "../lib/types";

async function run() {
  for (const persona of personas) {
    console.log(`\n=== ${persona.name} ===`);

    console.time("stage1");
    const stage1 = await callStage<Stage1Output>(STAGE1_SYSTEM, persona.material);
    console.timeEnd("stage1");
    console.log(`  ${stage1.workflows.length} workflows: ${stage1.workflows.map((w) => w.id).join(", ")}`);

    console.time("stage2");
    const stage2 = await callStage<Stage2Output>(STAGE2_SYSTEM, JSON.stringify(stage1));
    console.timeEnd("stage2");
    const top = [...stage2.scored].sort((a, b) => b.scores.overall - a.scores.overall)[0];
    console.log(`  top: ${top.id} (${top.scores.overall})`);

    console.time("stage3");
    const stage3 = await callStage<Stage3Output>(
      STAGE3_SYSTEM,
      JSON.stringify({ stage1, stage2 })
    );
    console.timeEnd("stage3");
    console.log(`  kit: ${stage3.use_case_id}, ${stage3.knowledge_files.length} knowledge files, ${stage3.metrics.length} metrics`);

    const outPath = path.join(process.cwd(), "data", "personas", `${persona.id}.output.json`);
    fs.writeFileSync(outPath, JSON.stringify({ stage1, stage2, stage3 }, null, 2));
    console.log(`  wrote ${outPath}`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
