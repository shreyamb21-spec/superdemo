import type { Persona } from "@/lib/types";

export const meridian: Persona = {
  id: "meridian",
  name: "Meridian Voyages",
  cardCopy:
    "Cruise operator, 3,000+ shore and ship staff. IT-approved platform just purchased. Nothing built yet.",
  material: `DISCOVERY CALL EXCERPT — Meridian Voyages, Director of Guest Operations (Dana), IT Platform Lead (Marcus), 42 min

Dana: The honest answer is every department runs on spreadsheets and email. Guest recovery is the worst. When something goes wrong on a sailing, a missed excursion, a cabin issue, the case gets logged in a shared Excel tracker, then it is email ping-pong between the ship team, shoreside guest relations, and finance for the compensation approval. A guest waits four to six days for an answer that should take one.
Marcus: And I cannot see any of it. The tracker has guest PII in a file that gets forwarded around. That is my nightmare.
Dana: Crew scheduling amendments are the other daily fire. Shift swaps on ship get texted to a coordinator who updates a workbook, and payroll reconciles it manually at month end. Payroll says roughly two full days per month per ship just reconciling.
Marcus: There is also the port agent portal idea that never got built. Port agents email PDFs of berth confirmations and provisioning manifests, and our ops team retypes them into the planning sheet.
Dana: If you want the thing people would throw a party over, it is the excursion capacity tracker. Revenue wants real-time sell-through by sailing, ops caps capacity by tender availability, and today it is a 19-tab workbook one analyst named Priya owns. When Priya is on leave the whole thing freezes. She has literally asked us to replace it with something.
Marcus: From my side, whatever gets built first has to prove the governance story. Finance data and guest PII stay locked down, and I want to see who accessed what. If the first app leaks, the whole program is dead on arrival.
Dana: Priority-wise, guest recovery touches revenue and reviews. But the excursion tracker has Priya begging for it, and it is mostly internal ops data, nothing sensitive.

PROCESS INVENTORY (from Marcus's follow-up email): guest recovery case tracking (Excel + Outlook, ~120 cases/wk across fleet); crew shift-swap reconciliation (per-ship workbooks + texts, payroll month-end); port agent document intake (PDF email retyping, ~40 docs/wk); excursion capacity and sell-through (Priya's 19-tab workbook, feeds a weekly revenue deck); onboard incident escalation log (SharePoint list, rarely updated). Systems in the building: Snowflake (bookings, revenue), Postgres (crew and scheduling), Salesforce (guest profiles), Okta SSO.`,
};
