# DAY ZERO — Build Spec for Claude Code

A deployment strategist's first three weeks, run before day one. Built the night before meeting Brad Menezes (CEO, Superblocks). Ship tonight, demo tomorrow at 7 PM on a phone or laptop.

**What it does in one line:** paste the messy raw material of an enterprise customer (a discovery call, a process inventory, the terrifying spreadsheet) and an agent pipeline returns what a Superblocks Deployment Strategist would produce in weeks 1 to 3: a scored use-case backlog, a 90-day rollout sequence, and a complete Superblocks-native deployment kit for the top use case.

**Why it lands:** Superblocks' own demo shows how one builder ships one app safely. Day Zero is the layer before that: which fifteen apps should this customer ship, in what order, and how do you pre-stage the knowledge, integrations, and permissions so builders never stall. That is the job Brad is hiring for.

---

## 1. Stack and constraints

- Next.js 14+ (App Router), Tailwind, shadcn/ui, deployed to Vercel.
- One serverless API route calling the Anthropic Messages API. Model: `claude-sonnet-4-6`. Key from `process.env.ANTHROPIC_API_KEY`. Never expose the key client-side.
- No database. Precomputed persona outputs live as static JSON in `/data`. Live runs are ephemeral (kept in client state only).
- MUST be flawless on mobile (390px). The demo may happen on a phone handed across a table. Test every view at 390px before calling anything done.
- Fast first paint. Precomputed demo must feel instant.
- Single-page app with client-side view states. No auth.

## 2. Honesty and IP guardrails (non-negotiable)

- Do NOT use the Superblocks logo, wordmark, or brand assets anywhere.
- Footer on every view: "An unofficial concept by Shreyam Borah, built from Superblocks' public case studies and product demo. Not affiliated with Superblocks. shreyamborah.com"
- Both demo personas are fictional composites and must be labeled: a small chip on persona cards reading "Composite persona from public case studies".
- Precomputed outputs must be REAL pipeline outputs (see §8), never hand-written results pretending to be model output.

## 3. Information architecture

Three views, one page:

**View A: Start.** Headline, one-line thesis, two persona cards, and a "Paste your own discovery material" panel (textarea + run button). Selecting a persona or pasting text moves to View B.

**View B: Pipeline running.** Three stages shown as a vertical progress list with live status:
1. Mining workflows — reading discovery material, extracting candidate workflows and pain
2. Scoring and sequencing — rating each candidate on impact, data readiness, governance complexity, champion strength; building the 90-day arc
3. Building the deployment kit — Clark build prompt, integrations, roles, knowledge files, metrics

In live mode each stage completes when its API call returns. In demo mode, stages animate on a 700 to 1000ms cadence and then load precomputed JSON. Identical visuals either way. Demo mode shows a small "demo data" chip in the header, because honesty is the brand here.

**View C: Results.** Three tabs (segmented control on desktop, sticky tab bar on mobile):

**Tab 1 — Use-Case Backlog.** Ranked cards. Each card: use-case name, owning department, one-line pain statement, overall score (0 to 100), and four sub-score bars (Impact, Data readiness, Governance complexity inverted so simpler = higher, Champion strength). Every card expands to show "Why this score", 2 to 3 sentences per dimension. The visible rubric is deliberate: it is the eval-loops story in UI form.

**Tab 2 — 90-Day Rollout.** A vertical timeline in three phases: Days 1 to 14 "First win" (one app, one visible hero), Days 15 to 45 "Proof and pull" (2 to 3 apps, internal story loud), Days 46 to 90 "Department expansion" (the Virgin-Voyages shape: multiple departments self-serving). Each phase lists which backlog items ship, the champion to arm, and the metric that proves the phase worked.

**Tab 3 — Deployment Kit** (for the #1 use case; this tab is the wow):
- **Clark build prompt**: a copy-ready prompt block written the way their demo prompts Clark (reference data sources with @, describe views, request the plan before build).
- **Integrations and access**: table mapping each required integration → which SSO group gets it → access level (end user / developer), mirroring the platform's groups-and-integrations model.
- **RBAC notes**: which built-in or custom roles are involved and why.
- **Knowledge files**: 2 to 3 org-level and integration-level knowledge items rendered as actual .md file cards (filename header, monospace body, copy button). These mirror the MD knowledge files in Superblocks' own demo. This is the detail that proves close product study.
- **Success metrics**: 4 to 6 metrics with targets (time saved, builders activated, apps in production, adoption cadence).

## 4. The pipeline (API design)

One route: `POST /api/pipeline` with body `{ stage: 1|2|3, material?: string, stage1?: json, stage2?: json }`. Client calls stages sequentially so progress is real. Each stage is one Anthropic call, `max_tokens: 4000`, temperature 0.4. Every system prompt ends with: "Respond with ONLY valid JSON matching the schema. No markdown fences, no preamble." Parse defensively: strip fences if present, try/catch with one retry on parse failure.

### Stage 1 system prompt (Workflow Miner)

You are a forward-deployed strategist for an enterprise internal-tools platform (AI generates governed internal apps from natural language, connected to the customer's real data sources with SSO, RBAC, and audit built in). You are reading raw discovery material from a customer: call transcripts, process notes, spreadsheet descriptions. Extract every candidate workflow that could become an internal application. For each: name it, identify the owning department, the specific manual pain today, the people involved, the systems and data sources touched, and any named person who feels the pain acutely (a potential champion). Extract only what is grounded in the material; do not invent workflows that are not evidenced. Schema:
```json
{ "customer_context": "2-3 sentence summary of the org and situation",
  "workflows": [ { "id": "kebab-case", "name": "", "department": "", "pain": "", "people": [""], "systems": [""], "champion": { "name": "", "role": "", "evidence": "" } | null, "evidence_quote": "short quote or paraphrase from the material" } ] }
```

### Stage 2 system prompt (Deployment Scorer)

You are the same strategist. Score each candidate workflow for deployment priority on four dimensions, each 0 to 100 with a 2 to 3 sentence rationale grounded in the discovery material: impact (hours saved, error reduction, revenue or risk relevance), data_readiness (are the systems named, structured, connectable), governance_simplicity (higher = fewer approval layers, less sensitive data, faster to ship safely), champion_strength (is there a named motivated owner). Overall = weighted 35/25/20/20. Then sequence a 90-day rollout in three phases: days 1-14 one first win chosen for speed and visibility, days 15-45 two to three apps that build pull, days 46-90 expansion across departments. Sequencing logic must favor momentum over size: the first win must be shippable in days and have a visible hero. Input: the Stage 1 JSON. Schema:
```json
{ "scored": [ { "id": "", "scores": { "impact": 0, "data_readiness": 0, "governance_simplicity": 0, "champion_strength": 0, "overall": 0 }, "rationales": { "impact": "", "data_readiness": "", "governance_simplicity": "", "champion_strength": "" } } ],
  "rollout": [ { "phase": "Days 1-14: First win", "items": [""], "champion_moves": "", "proof_metric": "" }, { "phase": "Days 15-45: Proof and pull", "items": [""], "champion_moves": "", "proof_metric": "" }, { "phase": "Days 46-90: Department expansion", "items": [""], "champion_moves": "", "proof_metric": "" } ] }
```

### Stage 3 system prompt (Kit Builder)

You are the same strategist preparing the top-ranked use case for a builder to execute on an enterprise AI app platform whose builder agent is prompted in natural language, references connected data sources, plans before building, and inherits org knowledge files. Produce the complete deployment kit. The clark_prompt must read like a real builder prompt: reference each data source naturally, describe the views and interactions concretely, note the human-in-the-loop points, and end by asking for a plan before building. Knowledge files must be genuinely useful MD content (schema guidance, workflow patterns, design standards), 10 to 20 lines each, written as if they will be pasted into the platform's knowledge system at org or integration level. Input: Stage 1 + Stage 2 JSON. Schema:
```json
{ "use_case_id": "",
  "clark_prompt": "",
  "integrations": [ { "integration": "", "shared_to_group": "", "access_level": "End user|Developer", "why": "" } ],
  "rbac_notes": [ { "role": "", "who": "", "why": "" } ],
  "knowledge_files": [ { "filename": "snake_case.md", "level": "Org|Integration|App", "body": "" } ],
  "metrics": [ { "metric": "", "target": "", "how_measured": "" } ] }
```

## 5. Personas (full input material; store verbatim in /data/personas/*.ts as the `material` string)

### Persona 1: Meridian Voyages (cruise line; composite of the Virgin Voyages public case study)

Card copy: "Cruise operator, 3,000+ shore and ship staff. IT-approved platform just purchased. Nothing built yet."

Material:

> DISCOVERY CALL EXCERPT — Meridian Voyages, Director of Guest Operations (Dana), IT Platform Lead (Marcus), 42 min
>
> Dana: The honest answer is every department runs on spreadsheets and email. Guest recovery is the worst. When something goes wrong on a sailing, a missed excursion, a cabin issue, the case gets logged in a shared Excel tracker, then it is email ping-pong between the ship team, shoreside guest relations, and finance for the compensation approval. A guest waits four to six days for an answer that should take one.
> Marcus: And I cannot see any of it. The tracker has guest PII in a file that gets forwarded around. That is my nightmare.
> Dana: Crew scheduling amendments are the other daily fire. Shift swaps on ship get texted to a coordinator who updates a workbook, and payroll reconciles it manually at month end. Payroll says roughly two full days per month per ship just reconciling.
> Marcus: There is also the port agent portal idea that never got built. Port agents email PDFs of berth confirmations and provisioning manifests, and our ops team retypes them into the planning sheet.
> Dana: If you want the thing people would throw a party over, it is the excursion capacity tracker. Revenue wants real-time sell-through by sailing, ops caps capacity by tender availability, and today it is a 19-tab workbook one analyst named Priya owns. When Priya is on leave the whole thing freezes. She has literally asked us to replace it with something.
> Marcus: From my side, whatever gets built first has to prove the governance story. Finance data and guest PII stay locked down, and I want to see who accessed what. If the first app leaks, the whole program is dead on arrival.
> Dana: Priority-wise, guest recovery touches revenue and reviews. But the excursion tracker has Priya begging for it, and it is mostly internal ops data, nothing sensitive.
>
> PROCESS INVENTORY (from Marcus's follow-up email): guest recovery case tracking (Excel + Outlook, ~120 cases/wk across fleet); crew shift-swap reconciliation (per-ship workbooks + texts, payroll month-end); port agent document intake (PDF email retyping, ~40 docs/wk); excursion capacity and sell-through (Priya's 19-tab workbook, feeds a weekly revenue deck); onboard incident escalation log (SharePoint list, rarely updated). Systems in the building: Snowflake (bookings, revenue), Postgres (crew and scheduling), Salesforce (guest profiles), Okta SSO.

### Persona 2: Hartwell & Co. (commercial real estate brokerage; composite of the Matthews public case study)

Card copy: "Commercial real estate brokerage, 400 agents. Marketing team of six drowning in document production."

Material:

> DISCOVERY CALL EXCERPT — Hartwell & Co., VP Marketing (Elena), Research Director (Sam), 35 min
>
> Elena: Offering memorandums are the bottleneck. Every listing needs one: property photos, rent rolls, comps, demographic data, financial summaries, all assembled into a branded 30-plus page document. My team of six produces them by hand in InDesign. Average turnaround is five business days, and brokers scream about every one of them. We did 340 last year.
> Sam: The data is not the problem. Rent rolls and financials come from our Postgres property database, comps from our research warehouse, demographics from a vendor API we already pay for. The problem is a human copy-pasting all of it into a template.
> Elena: The other daily grind is listing status requests. Brokers email or call marketing to ask where their collateral is in the queue. Someone on my team answers roughly 30 of those a day instead of doing actual work.
> Sam: Research has our own version of that: comp requests. Brokers ask for comparable sales for a pitch, we run the query, format a PDF, send it back. Two analysts spend maybe half their week on it. It is the same eight queries with different addresses.
> Elena: There is also proposal tracking for pitches, currently a color-coded spreadsheet that only our senior coordinator, Marcus, understands. And honestly, if a broker could self-serve a first-draft OM and my team just did the polish, that changes the economics of the whole department.
> Sam: One constraint: rent roll data is confidential per listing agreement. Whoever sees a draft OM has to be on that listing's team. That has burned us before with the shared-drive approach.
>
> PROCESS INVENTORY (Elena's follow-up): offering memorandum production (InDesign, 5-day turnaround, 340/yr); collateral status requests (~30/day by email and phone); comp report generation (2 analysts, ~half their week); pitch/proposal tracker (one spreadsheet, one owner); listing photo asset requests (shared drive chaos). Systems: Postgres (property and listings db), research data warehouse, demographics vendor REST API, Microsoft Entra SSO.

## 6. Design direction

Ops-console, light, disciplined. This should look like an internal tool a strategist actually uses, not a marketing page.

- Palette: paper `#FAFAF8` background, ink `#141518` text, `#5B667A` secondary, hairline borders `#E4E4DF`, one accent: cobalt `#2440C9` (links, active tab, score bars, stage-complete states), plus `#0E8A5F` reserved for "shipped/complete" moments only.
- Type: Inter for UI and body. IBM Plex Mono for the eyebrow labels, scores, filenames, and the Clark prompt/knowledge file bodies. No display serif.
- Signature element: the knowledge files rendered as real file cards, mono filename tab on top, subtle paper texture, copy button. Spend the polish budget there and on the score bars.
- Density over decoration: tight vertical rhythm, hairline dividers, uppercase mono eyebrows (e.g. `STAGE 02 / SCORING`). No gradients, no glassmorphism, no emoji.
- Motion: stage checkmarks and score bars animate once on reveal (300ms ease-out). Nothing else moves. Respect prefers-reduced-motion.
- Header: "DAY ZERO" in mono, subtitle "The first three weeks of an AI deployment, run before day one." Right side: demo-data chip when applicable.

## 7. Copy (use verbatim)

- Hero H1: "The first three weeks of a deployment, run before day one."
- Hero sub: "Paste the raw material of an enterprise customer. Get back what a deployment strategist ships in weeks one through three: a scored use-case backlog, a 90-day rollout, and a build-ready deployment kit."
- Persona section label: "TWO COMPOSITE CUSTOMERS"
- Paste panel label: "OR BRING YOUR OWN" with placeholder "Paste a discovery call transcript, process notes, or a description of the spreadsheet that runs a team..."
- Run button: "Run Day Zero"
- Empty paste error: "Give me at least a paragraph of real material to mine."
- Tab names: "Backlog" / "90-Day Rollout" / "Deployment Kit"
- Footer: exact string from §2.

## 8. Precompute workflow (do this, do not skip)

Add script `npm run precompute`: node script that runs the three stages against the Anthropic API for each persona and writes `/data/personas/meridian.output.json` and `/data/personas/hartwell.output.json`. Run it once after prompts stabilize. If any output is weak (empty rationales, generic knowledge files, hallucinated systems not present in the material), tighten prompts and rerun. The committed JSON is what demo mode serves. This means demo data is genuine pipeline output, which is the point.

## 9. Build order for tonight

1. Scaffold, layout shell, design tokens, View A with personas and paste panel.
2. API route with the three stage prompts. Test stage-by-stage with Meridian material in a scratch page or curl.
3. View B progress states wired to real sequential calls.
4. View C, tabs in order of demo importance: Deployment Kit first, then Backlog, then Rollout.
5. Precompute script, generate both persona outputs, review quality, tighten prompts, regenerate.
6. Demo mode wiring (instant load + staged animation + chip).
7. Mobile pass at 390px on every view. Then deploy to Vercel, set env var, test the deployed URL on an actual phone.
8. QA checklist: demo mode runs start-to-finish offline-fast; live mode with a fresh paste completes under ~60s; copy buttons work; no Superblocks branding anywhere; footer present; phone test done.

## 10. The in-room demo script (2 minutes pulled, 8 if he leans in)

Trigger only if warm, ideally at "any questions for me" or when deployment work comes up naturally. The tease is one sentence: "I built the tool I'd want in my first week here. It's live. Want two minutes of it?"

Beat 1 (20s): View A on the phone. "Your demo shows a builder shipping one app safely. This is the layer before that: deciding what a customer should build and in what order. Two composite customers from your public case studies, or paste anything."
Beat 2 (30s): Tap Meridian. Stages tick. "It mines the discovery material for workflows, scores each on impact, data readiness, governance simplicity, and champion strength, then sequences 90 days for momentum."
Beat 3 (40s): Backlog tab. Open the top card's "why this score." "Every score has a visible rationale. Same discipline as the eval loops I built at CompetitorPulse: if you can't explain the score, you can't trust the agent."
Beat 4 (30s): Deployment Kit tab. Scroll to knowledge files. "And it ends build-ready in your platform's own objects: the Clark prompt, which integrations go to which SSO group, and the knowledge files, because your demo made clear knowledge is how Clark scales standards."
Close: "The first win it picked for Meridian is the excursion tracker, not the biggest problem, the fastest visible one with a named champion. That sequencing instinct is the job, the tool just makes it legible."
If he leans in: run live mode by asking HIM for a workflow ("give me any team's process at any company") and paste-dictate it. Only offer this if the room is playful; it is the highest-risk highest-reward beat.
Fallbacks: wifi dead → demo mode is precomputed and loads instantly; if the deployed site is down → screenshots album on phone as last resort (take them after QA).

## 11. What NOT to build tonight

No auth, no saving runs, no PDF export, no multi-model toggle, no settings page, no dark mode, no analytics. Every minute goes to the Kit tab polish, prompt quality, and the phone experience.
