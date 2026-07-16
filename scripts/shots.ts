/* Screenshot walkthrough at 390px (and desktop) for QA.
   Usage: npx tsx scripts/shots.ts <outDir> */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const OUT = process.argv[2] ?? "scripts/.shots";
fs.mkdirSync(OUT, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const shot = (name: string, full = false) =>
    page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: full });

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await shot("01-start-390", true);

  // demo run: Meridian
  await page.getByRole("button", { name: /Meridian Voyages/ }).click();
  await page.waitForTimeout(1400);
  await shot("02-pipeline-390");
  await page.getByRole("tab", { name: "Backlog" }).waitFor({ timeout: 10000 });
  await shot("03-results-backlog-390");

  // expand top backlog card
  await page.getByRole("button", { name: /Why this score/i }).first().click();
  await page.waitForTimeout(300);
  await shot("04-backlog-expanded-390", true);

  await page.getByRole("tab", { name: "90-Day Rollout" }).click();
  await page.waitForTimeout(300);
  await shot("05-rollout-390", true);

  await page.getByRole("tab", { name: "Deployment Kit" }).click();
  await page.waitForTimeout(300);
  await shot("06-kit-390", true);

  // horizontal overflow check on every full view
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  console.log("kit horizontal overflow px:", overflow);

  // desktop pass
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await desktop.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await desktop.screenshot({ path: path.join(OUT, "07-start-desktop.png"), fullPage: true });
  await desktop.getByRole("button", { name: /Hartwell/ }).click();
  await desktop.getByRole("tab", { name: "Backlog" }).waitFor({ timeout: 10000 });
  await desktop.getByRole("tab", { name: "Deployment Kit" }).click();
  await desktop.waitForTimeout(300);
  await desktop.screenshot({ path: path.join(OUT, "08-kit-desktop.png"), fullPage: true });

  await browser.close();
  console.log("done ->", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
