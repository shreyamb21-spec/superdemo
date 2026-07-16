/* Prod smoke test: demo flow timing + copy button on port 3001. */
import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await ctx.newPage();

  const t0 = Date.now();
  await page.goto("http://localhost:3001/", { waitUntil: "domcontentloaded" });
  console.log("first load:", Date.now() - t0, "ms");

  const t1 = Date.now();
  await page.getByRole("button", { name: /Meridian Voyages/ }).click();
  await page.getByRole("tab", { name: "Backlog" }).waitFor({ timeout: 15000 });
  console.log("demo run (click -> results):", Date.now() - t1, "ms");

  await page.getByRole("tab", { name: "Deployment Kit" }).click();
  await page.getByRole("button", { name: "Copy" }).first().click();
  await page.waitForTimeout(200);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  console.log("copy button ->", clip.slice(0, 60).replace(/\n/g, " "), "...");
  console.log("copied length:", clip.length);

  // empty-paste error
  await page.goto("http://localhost:3001/");
  await page.getByRole("button", { name: "Run Day Zero" }).click();
  const err = await page
    .getByText("Give me at least a paragraph of real material to mine.")
    .isVisible();
  console.log("empty paste error shown:", err);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
