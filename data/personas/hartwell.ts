import type { Persona } from "@/lib/types";

export const hartwell: Persona = {
  id: "hartwell",
  name: "Hartwell & Co.",
  cardCopy:
    "Commercial real estate brokerage, 400 agents. Marketing team of six drowning in document production.",
  material: `DISCOVERY CALL EXCERPT — Hartwell & Co., VP Marketing (Elena), Research Director (Sam), 35 min

Elena: Offering memorandums are the bottleneck. Every listing needs one: property photos, rent rolls, comps, demographic data, financial summaries, all assembled into a branded 30-plus page document. My team of six produces them by hand in InDesign. Average turnaround is five business days, and brokers scream about every one of them. We did 340 last year.
Sam: The data is not the problem. Rent rolls and financials come from our Postgres property database, comps from our research warehouse, demographics from a vendor API we already pay for. The problem is a human copy-pasting all of it into a template.
Elena: The other daily grind is listing status requests. Brokers email or call marketing to ask where their collateral is in the queue. Someone on my team answers roughly 30 of those a day instead of doing actual work.
Sam: Research has our own version of that: comp requests. Brokers ask for comparable sales for a pitch, we run the query, format a PDF, send it back. Two analysts spend maybe half their week on it. It is the same eight queries with different addresses.
Elena: There is also proposal tracking for pitches, currently a color-coded spreadsheet that only our senior coordinator, Marcus, understands. And honestly, if a broker could self-serve a first-draft OM and my team just did the polish, that changes the economics of the whole department.
Sam: One constraint: rent roll data is confidential per listing agreement. Whoever sees a draft OM has to be on that listing's team. That has burned us before with the shared-drive approach.

PROCESS INVENTORY (Elena's follow-up): offering memorandum production (InDesign, 5-day turnaround, 340/yr); collateral status requests (~30/day by email and phone); comp report generation (2 analysts, ~half their week); pitch/proposal tracker (one spreadsheet, one owner); listing photo asset requests (shared drive chaos). Systems: Postgres (property and listings db), research data warehouse, demographics vendor REST API, Microsoft Entra SSO.`,
};
