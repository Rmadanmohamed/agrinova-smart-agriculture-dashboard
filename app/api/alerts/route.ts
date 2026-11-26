import { NextResponse } from "next/server"
import { readCSV } from "@/lib/csv"

export async function GET() {
  try {
    return NextResponse.json(readCSV("Alerts.csv"))
  } catch (error) {
    console.error("CSV endpoint failed", error)
    return NextResponse.json({ error: "Data unavailable" }, { status: 500 })
  }
}
