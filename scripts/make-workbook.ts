/* Fabricates a realistic messy ops workbook for the upload demo.
   Output: docs/demo_assets/field_ops_master_tracker.xlsx
   Fictional company: Caldwell Mechanical (commercial HVAC services). */
import * as XLSX from "xlsx";
import fs from "node:fs";
import path from "node:path";

const wb = XLSX.utils.book_new();

function addSheet(name: string, rows: (string | number)[][]) {
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), name);
}

addSheet("READ ME", [
  ["FIELD OPS MASTER TRACKER — Caldwell Mechanical (commercial HVAC, 60 technicians, 3 branches)"],
  [""],
  ["This workbook is maintained by Denise (dispatch supervisor). DO NOT edit tabs without telling her."],
  ["Dispatch board updated by phone/text from techs. Job data re-typed from ServiceNow exports every morning (~45 min)."],
  ["Invoicing tab reconciled against QuickBooks at month end by Tom in accounting. Last month: 11 hrs, 14 mismatches."],
  ["SLA tab: contract response times. We missed 9 SLAs in May; two clients threatened penalties. Nobody sees a breach until the weekly review."],
  ["Parts tab kept by warehouse (Luis). Techs call him to check stock because they can't see this file."],
  ["Denise has asked THREE times for 'a real system'. Regional manager (Karen Voss) approved budget in April."],
  ["Systems in use: ServiceNow (tickets), QuickBooks (invoicing), Azure AD logins, parts data in this file only."],
]);

addSheet("Dispatch WK28", [
  ["Job #", "Client", "Site", "Tech", "Priority", "Promised", "Status", "Notes"],
  ["J-4482", "Meridian Plaza", "Tower A chillers", "M. Okafor", "P1", "07/14 08:00", "DONE", "arrived 07:40 per text"],
  ["J-4483", "Northgate Mall", "RTU-7", "S. Reyes", "P2", "07/14 12:00", "DONE", ""],
  ["J-4485", "Harbor Logistics", "freezer bay 3", "D. Kim", "P1", "07/14 09:30", "LATE", "stuck at Meridian, client called twice"],
  ["J-4486", "Westfield Clinic", "OR air handler", "M. Okafor", "P1", "07/15 07:00", "OPEN", "needs cert tech - CHECK"],
  ["J-4488", "Northgate Mall", "food court exhaust", "T. Burke", "P3", "07/16", "OPEN", ""],
  ["J-4490", "Caldwell HQ", "shop compressor", "unassigned", "P3", "07/18", "OPEN", "internal"],
  ["J-4491", "Harbor Logistics", "dock office split", "S. Reyes", "P2", "07/16 14:00", "OPEN", "parts? ask Luis"],
]);

addSheet("Dispatch WK27", [
  ["Job #", "Client", "Site", "Tech", "Priority", "Promised", "Status", "Notes"],
  ["J-4461", "Meridian Plaza", "Tower B AHU", "D. Kim", "P2", "07/07 10:00", "DONE", ""],
  ["J-4463", "Westfield Clinic", "chiller loop", "M. Okafor", "P1", "07/07 08:00", "DONE", "SLA MISS - 2.5 hrs late"],
  ["J-4465", "Northgate Mall", "RTU-3", "T. Burke", "P2", "07/08", "DONE", ""],
  ["J-4470", "Harbor Logistics", "freezer bay 1", "S. Reyes", "P1", "07/09 06:00", "DONE", "overtime, not billed?"],
  ["J-4472", "Grandview Hotel", "kitchen makeup air", "D. Kim", "P2", "07/10", "DONE", "new client"],
]);

addSheet("SLA Tracker", [
  ["Client", "Contract", "P1 response", "P2 response", "May breaches", "June breaches", "Penalty clause"],
  ["Meridian Plaza", "Platinum", "2 hrs", "8 hrs", 2, 1, "yes - 2% monthly fee"],
  ["Westfield Clinic", "Platinum", "1 hr", "4 hrs", 3, 2, "yes - per incident $500"],
  ["Harbor Logistics", "Gold", "4 hrs", "12 hrs", 2, 1, "yes - 2% monthly fee"],
  ["Northgate Mall", "Gold", "4 hrs", "24 hrs", 1, 0, "no"],
  ["Grandview Hotel", "Silver", "8 hrs", "48 hrs", 1, 0, "no"],
  [""],
  ["breaches counted manually by Denise from dispatch tabs every Friday", "", "", "", "", "", ""],
]);

addSheet("Invoicing Recon", [
  ["Month", "Jobs closed", "Invoiced (QB)", "Mismatches", "Hours to reconcile", "Notes"],
  ["March", 212, 198, 9, 8, "5 jobs never invoiced - found in June"],
  ["April", 231, 220, 12, 10, "OT rates wrong on 4"],
  ["May", 224, 209, 14, 11, "Tom out 1 wk, backlog"],
  ["June", 240, 228, 14, 11, "2 duplicate invoices sent to Meridian - awkward"],
]);

addSheet("Parts Stock", [
  ["Part", "Bin", "Qty", "Min", "On order", "Last counted"],
  ["Compressor 5T Copeland", "A-12", 3, 2, 0, "07/01"],
  ["RTU belt kit std", "B-03", 18, 10, 0, "07/01"],
  ["TXV valve 410A", "B-07", 1, 4, 6, "06/24 - techs keep calling Luis about this one"],
  ["Condenser fan motor 1/2HP", "C-01", 5, 3, 0, "07/01"],
  ["Filter drier 083S", "C-09", 22, 15, 0, "05/30"],
]);

addSheet("Tech Roster", [
  ["Tech", "Branch", "Certs", "OT hrs June", "Notes"],
  ["M. Okafor", "Central", "OR/cleanroom cert", 22, "only cert tech - bottleneck for clinic work"],
  ["S. Reyes", "Central", "refrigeration", 18, ""],
  ["D. Kim", "North", "refrigeration", 25, "OT dispute open with payroll"],
  ["T. Burke", "North", "", 6, "apprentice"],
]);

const outDir = path.join(process.cwd(), "docs", "demo_assets");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "field_ops_master_tracker.xlsx");
XLSX.writeFile(wb, outPath);
console.log("wrote", outPath);
