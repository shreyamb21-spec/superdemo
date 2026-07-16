/* Scratch tester: run stages via the local API route.
   Usage: npx tsx scripts/test-stage.ts <1|2|3|all> */
import { meridian } from "../data/personas/meridian";
import fs from "node:fs";

const API = "http://localhost:3000/api/pipeline";

async function call(body: object) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

async function main() {
  console.time("stage1");
  const stage1 = await call({ stage: 1, material: meridian.material });
  console.timeEnd("stage1");
  fs.writeFileSync("scripts/.out.stage1.json", JSON.stringify(stage1, null, 2));
  console.log(`stage1: ${stage1.workflows?.length} workflows:`, stage1.workflows?.map((w: { id: string }) => w.id));

  if (process.argv[2] === "1") return;

  console.time("stage2");
  const stage2 = await call({ stage: 2, stage1 });
  console.timeEnd("stage2");
  fs.writeFileSync("scripts/.out.stage2.json", JSON.stringify(stage2, null, 2));
  console.log(`stage2: ${stage2.scored?.length} scored, ${stage2.rollout?.length} phases`);

  if (process.argv[2] === "2") return;

  console.time("stage3");
  const stage3 = await call({ stage: 3, stage1, stage2 });
  console.timeEnd("stage3");
  fs.writeFileSync("scripts/.out.stage3.json", JSON.stringify(stage3, null, 2));
  console.log(`stage3: kit for ${stage3.use_case_id}, ${stage3.knowledge_files?.length} knowledge files`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
