import { chromium } from "playwright";

async function main() {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto("http://localhost:3000/");
  await p.getByRole("button", { name: /Meridian/ }).click();
  await p.getByRole("tab", { name: "Deployment Kit" }).waitFor({ timeout: 15000 });
  await p.getByRole("tab", { name: "Deployment Kit" }).click();
  await p.waitForTimeout(300);
  await p.screenshot({ path: "scripts/.shots/09-kit-chips.png", clip: { x: 0, y: 250, width: 390, height: 560 } });

  await p.getByRole("button", { name: "Show full prompt" }).click();
  console.log("prompt expander:", await p.getByRole("button", { name: "Collapse" }).first().isVisible());

  console.log("kfile expanders:", await p.getByRole("button", { name: "Show full file" }).count());

  // verdict strip jump
  await p.getByRole("button", { name: /90-day arc/i }).click();
  console.log("verdict jump to rollout:", await p.getByText("Days 1-14: First win").isVisible());

  // rollout champion-moves expander
  await p.getByRole("button", { name: /Champion moves/i }).first().click();
  await p.waitForTimeout(200);
  console.log("champion moves opens:", await p.getByText("Hide champion moves").first().isVisible());

  await b.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
