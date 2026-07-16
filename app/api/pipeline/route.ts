import { NextRequest, NextResponse } from "next/server";
import { callStage } from "@/lib/gateway";
import { STAGE1_SYSTEM, STAGE2_SYSTEM, STAGE3_SYSTEM } from "@/lib/prompts";
import type { Stage1Output, Stage2Output, Stage3Output } from "@/lib/types";

export const maxDuration = 120;

const MAX_MATERIAL_CHARS = 20_000;
const RATE_LIMIT = 30; // stage calls per IP per 10 minutes
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: {
    stage?: number;
    material?: string;
    stage1?: Stage1Output;
    stage2?: Stage2Output;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    switch (body.stage) {
      case 1: {
        const material = (body.material ?? "").trim();
        if (material.length < 100) {
          return NextResponse.json(
            { error: "Give me at least a paragraph of real material to mine." },
            { status: 400 }
          );
        }
        if (material.length > MAX_MATERIAL_CHARS) {
          return NextResponse.json(
            { error: `Material too long (max ${MAX_MATERIAL_CHARS} characters).` },
            { status: 400 }
          );
        }
        const result = await callStage<Stage1Output>(STAGE1_SYSTEM, material);
        return NextResponse.json(result);
      }
      case 2: {
        if (!body.stage1) {
          return NextResponse.json({ error: "Missing stage1 input" }, { status: 400 });
        }
        const result = await callStage<Stage2Output>(
          STAGE2_SYSTEM,
          JSON.stringify(body.stage1)
        );
        return NextResponse.json(result);
      }
      case 3: {
        if (!body.stage1 || !body.stage2) {
          return NextResponse.json(
            { error: "Missing stage1/stage2 input" },
            { status: 400 }
          );
        }
        const result = await callStage<Stage3Output>(
          STAGE3_SYSTEM,
          JSON.stringify({ stage1: body.stage1, stage2: body.stage2 })
        );
        return NextResponse.json(result);
      }
      default:
        return NextResponse.json({ error: "stage must be 1, 2, or 3" }, { status: 400 });
    }
  } catch (err) {
    console.error("[pipeline]", err);
    return NextResponse.json(
      { error: "Pipeline stage failed. Please retry." },
      { status: 502 }
    );
  }
}
