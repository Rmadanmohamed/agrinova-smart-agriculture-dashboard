import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"

function readCSV(filename: string) {
  const filePath = path.join(process.cwd(), "data", filename)
  const content = fs.readFileSync(filePath, "utf-8")
  return parse(content, { columns: true, skip_empty_lines: true, trim: true })
}

export async function GET() {
  try {
    const data = readCSV("Reports.csv")
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
