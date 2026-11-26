import fs from "node:fs"
import path from "node:path"
import { parse } from "csv-parse/sync"

export type CsvRow = Record<string, string>
function isCsvRow(value: unknown): value is CsvRow {
  return typeof value === "object" && value !== null && !Array.isArray(value) && Object.values(value).every(field => typeof field === "string")
}
export function readCSV(filename: string): CsvRow[] {
  if (!/^[A-Za-z][A-Za-z0-9_]*\.csv$/.test(filename)) throw new Error("Invalid data filename")
  const raw: unknown = parse(fs.readFileSync(path.join(process.cwd(), "data", filename), "utf8"), { columns: true, skip_empty_lines: true, trim: true, bom: true })
  if (!Array.isArray(raw) || !raw.every(isCsvRow)) throw new Error("Invalid CSV record schema")
  return raw
}
