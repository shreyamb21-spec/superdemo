/* Upload flow QA: attach the fabricated workbook, run the live pipeline.
   Usage: npx tsx scripts/qa-upload.ts [baseUrl] */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";

async function main() {
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(BASE, { waitUntil: "networkidle" });

  await p.setInputFiles(
    'input[type="file"]',
    "docs/demo_assets/field_ops_master_tracker.xlsx"
  );
  await p.waitForTimeout(1500);
  await p.screenshot({ path: "scripts/.shots/10-upload-attached-390.png" });
  const card = await p.getByText("field_ops_master_tracker.xlsx").isVisible();
  console.log("file card visible:", card);

  const t0 = Date.now();
  await p.getByRole("button", { name: "Run Day Zero" }).click();
  await p
    .getByText("Mining workflows")
    .waitFor({ timeout: 10000 });
  console.log("pipeline view entered");

  await p
    .getByRole("tab", { name: "Backlog" })
    .waitFor({ timeout: 240000 });
  console.log("live run completed in", Math.round((Date.now() - t0) / 1000), "s");
  await p.screenshot({ path: "scripts/.shots/11-upload-results-390.png", fullPage: true });

  const heading = await p
    .locator('[class*="font-semibold"]', { hasText: /field_ops_master_tracker/ })
    .first()
    .isVisible()
    .catch(() => false);
  console.log("source name shows filename:", heading);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
