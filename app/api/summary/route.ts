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
    const alerts = readCSV("Alerts.csv")
    const blockchain = readCSV("BlockchainTransactions.csv")
    const aiRecs = readCSV("AIRecommendations.csv")
    const energy = readCSV("EnergyUsage.csv")
    const cropHealth = readCSV("CropHealthScans.csv")
    const weather = readCSV("WeatherReadings.csv")
    const sensors = readCSV("Sensors.csv")
    const farms = readCSV("Farms.csv")
    const robots = readCSV("RobotMissions.csv")
    const drones = readCSV("DroneMissions.csv")

    const criticalAlerts = alerts.filter((a: Record<string,string>) => a.PriorityLevel === "Critical").length
    const highAlerts = alerts.filter((a: Record<string,string>) => a.PriorityLevel === "High").length
    const openAlerts = alerts.filter((a: Record<string,string>) => a.ResolutionStatus === "Open").length
    const totalAlerts = alerts.length

    const avgHealth = cropHealth.length
      ? (cropHealth.reduce((s: number, r: Record<string,string>) => s + parseFloat(r.CropHealthScore || "0"), 0) / cropHealth.length).toFixed(1)
      : "0"

    const avgTemp = weather.length
      ? (weather.reduce((s: number, r: Record<string,string>) => s + parseFloat(r.TemperatureC || r.Temperature || "0"), 0) / weather.length).toFixed(1)
      : "0"

    return NextResponse.json({
      totalFarms: farms.length,
      activeSensors: sensors.filter((s: Record<string,string>) => s.Status === "Online").length,
      totalSensors: sensors.length,
      activeRobots: robots.filter((r: Record<string,string>) => r.Status === "Online").length,
      activeDrones: drones.filter((d: Record<string,string>) => d.Status === "Online").length,
      systemHealthIndex: avgHealth,
      alerts: { total: totalAlerts, critical: criticalAlerts, highPriority: highAlerts, open: openAlerts },
      avgTemperature: avgTemp,
      totalEnergy: energy.reduce((s: number, r: Record<string,string>) => s + parseFloat(r.EnergyConsumptionKwh || "0"), 0).toFixed(1),
      renewableAvg: energy.length
        ? (energy.reduce((s: number, r: Record<string,string>) => s + parseFloat(r.RenewableEnergyUsagePct || "0"), 0) / energy.length).toFixed(1)
        : "0",
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
