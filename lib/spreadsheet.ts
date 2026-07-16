/* Client-side spreadsheet serialization for the pipeline.
   Caps keep the combined material under the API's 20k-char limit. */

export interface ParsedSpreadsheet {
  filename: string;
  sheetCount: number;
  totalRows: number;
  text: string;
}

const MAX_ROWS_PER_SHEET = 25;
const MAX_COLS = 12;
const MAX_TOTAL_CHARS = 14_000;

export async function parseSpreadsheet(file: File): Promise<ParsedSpreadsheet> {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });

  const parts: string[] = [];
  let totalRows = 0;

  for (const name of wb.SheetNames) {
    const sheet = wb.Sheets[name];
    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      blankrows: false,
      defval: "",
    });
    totalRows += rows.length;
    if (rows.length === 0) {
      parts.push(`--- Sheet "${name}" (empty) ---`);
      continue;
    }
    const shown = rows.slice(0, MAX_ROWS_PER_SHEET).map((r) =>
      r
        .slice(0, MAX_COLS)
        .map((c) => String(c ?? "").replace(/\s+/g, " ").trim())
        .join(" | ")
    );
    const more =
      rows.length > MAX_ROWS_PER_SHEET
        ? `\n... ${rows.length - MAX_ROWS_PER_SHEET} more rows not shown`
        : "";
    parts.push(
      `--- Sheet "${name}" (${rows.length} rows) ---\n${shown.join("\n")}${more}`
    );
  }

  let body = parts.join("\n\n");
  if (body.length > MAX_TOTAL_CHARS) {
    body =
      body.slice(0, MAX_TOTAL_CHARS) +
      "\n... [spreadsheet truncated for length]";
  }

  return {
    filename: file.name,
    sheetCount: wb.SheetNames.length,
    totalRows,
    text: `SPREADSHEET UPLOAD: ${file.name} (${wb.SheetNames.length} sheets, ${totalRows} rows total)\n\n${body}`,
  };
}
