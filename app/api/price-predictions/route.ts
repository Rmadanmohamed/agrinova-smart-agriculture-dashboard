import { NextResponse } from "next/server"
import { readCSV } from "@/lib/csv"

export async function GET() {
  try {
    const data = readCSV("PricePredictions.csv")
    const allowed = ["Tomato","Tomatoes","Potato","Potatoes","Onion","Onions","Bell Pepper","Cucumber","Orange","Apple","Banana","Mango","Grapes","Strawberry","Lemon","Pomegranate"]
    const filtered = data.filter((r: Record<string,string>) =>
      allowed.some(a => r.CropName?.toLowerCase().includes(a.toLowerCase()))
    )
    return NextResponse.json(filtered)
  } catch (e) {
    console.error("CSV endpoint failed", e)
    return NextResponse.json({ error: "Data unavailable" }, { status: 500 })
  }
}
