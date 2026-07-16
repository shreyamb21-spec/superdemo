# Day Zero

The first three weeks of an AI deployment, run before day one.

Paste the raw discovery material of an enterprise customer (call transcripts, process notes, spreadsheet descriptions) and a three-stage agent pipeline returns what a deployment strategist ships in weeks one through three: a scored use-case backlog, a 90-day rollout sequence, and a build-ready deployment kit for the top use case.

An unofficial concept by Shreyam Borah, built from Superblocks' public case studies and product demo. Not affiliated with Superblocks.

## Stack

- Next.js (App Router) + Tailwind, single-page app with client-side view states
- One serverless route (`POST /api/pipeline`) calling `anthropic/claude-sonnet-5` via the Merge gateway
- No database — precomputed persona outputs live as static JSON in `/data/personas`; live runs are ephemeral client state

## Setup

Create `.env.local` (never committed — `.env*` is git-ignored):

```
MERGE_API_KEY=<your key>
MERGE_BASE_URL=https://api-gateway.merge.dev/v1/responses
MERGE_MODEL=anthropic/claude-sonnet-5
```

Then:

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` / `npm run build` / `npm start`
- `npm run precompute` — runs the three pipeline stages against the gateway for each persona and rewrites `/data/personas/*.output.json` (the data demo mode serves). Rerun after any prompt change.
- `npx tsx scripts/test-stage.ts all` — exercises the live API route stage-by-stage with the Meridian material (dev server must be running).
- `npx tsx scripts/shots.ts` / `npx tsx scripts/qa-prod.ts` — Playwright QA walkthroughs (390px screenshots; prod smoke test on port 3001).

## How it works

1. **Mining workflows** — extracts candidate workflows, pain, systems, and champions from the material
2. **Scoring and sequencing** — scores each on impact, data readiness, governance simplicity, champion strength (weighted 35/25/20/20) and sequences a 90-day rollout for momentum
3. **Building the deployment kit** — Clark-style build prompt, integrations-to-SSO-group mapping, RBAC notes, knowledge files, success metrics

Selecting a persona serves precomputed pipeline output instantly (marked with a "demo data" chip); pasting your own material runs the pipeline live (~2–3 minutes).
