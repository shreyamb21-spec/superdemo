/* iPad responsiveness pass: portrait + landscape, touch enabled. */
import { chromium, devices } from "playwright";

const VIEWPORTS = [
  { name: "ipad-portrait-810", width: 810, height: 1080 },
  { name: "ipad-landscape-1080", width: 1080, height: 810 },
  { name: "ipad-mini-768", width: 768, height: 1024 },
];

async function main() {
  const browser = await chromium.launch();
  for (const v of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: v.width, height: v.height },
      hasTouch: true,
      userAgent: devices["iPad (gen 7)"].userAgent,
    });
    const p = await ctx.newPage();
    await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await p.screenshot({ path: `scripts/.shots/ipad-${v.name}-start.png`, fullPage: true });

    await p.getByRole("button", { name: /Meridian/ }).tap();
    await p.getByRole("tab", { name: "Backlog" }).waitFor({ timeout: 15000 });
    await p.screenshot({ path: `scripts/.shots/ipad-${v.name}-backlog.png` });

    await p.getByRole("tab", { name: "Deployment Kit" }).tap();
    await p.waitForTimeout(300);
    await p.screenshot({ path: `scripts/.shots/ipad-${v.name}-kit.png`, fullPage: true });

    const overflow = await p.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    console.log(`${v.name}: overflow=${overflow}px, tap interactions OK`);
    await ctx.close();
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
