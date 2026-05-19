import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { approvedPriceCrops, calculateSummary } from './calculations';
import type { CsvRow, DashboardData } from './types';

const dataDir = process.env.AGRINOVA_DATA_DIR ?? path.resolve(__dirname, '../../..', 'data');

const files = {
  farms: 'Farms.csv',
  sensors: 'Sensors.csv',
  alerts: 'Alerts.csv',
  soilReadings: 'SoilReadings.csv',
  weatherReadings: 'WeatherReadings.csv',
  cropHealth: 'CropHealthScans.csv',
  pricePredictions: 'PricePredictions.csv',
  blockchain: 'BlockchainTransactions.csv',
  aiRecommendations: 'AIRecommendations.csv',
  energy: 'EnergyUsage.csv',
  robotMissions: 'RobotMissions.csv',
  droneMissions: 'DroneMissions.csv',
  crops: 'Crops.csv',
  reports: 'Reports.csv',
  dates: 'Date.csv',
} satisfies Record<keyof DashboardData, string>;

let cache: DashboardData | null = null;
let loadPromise: Promise<DashboardData> | null = null;

async function readCsv(fileName: string): Promise<CsvRow[]> {
  const csv = await fs.readFile(path.join(dataDir, fileName), 'utf8');
  return parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];
}

export async function loadAllData() {
  if (cache) return cache;
  if (loadPromise) return loadPromise;

  loadPromise = Promise.all(Object.entries(files).map(async ([key, fileName]) => [key, await readCsv(fileName)] as const)).then(
    (entries) => {
      const loaded = Object.fromEntries(entries) as unknown as DashboardData;
      loaded.pricePredictions = loaded.pricePredictions.filter((row) => approvedPriceCrops.includes(row.CropName));
      cache = loaded;
      return loaded;
    },
  );

  return loadPromise;
}

export async function getDataset(key: keyof DashboardData) {
  const data = await loadAllData();
  return data[key];
}

export async function getSummary() {
  return calculateSummary(await loadAllData());
}

export function getDataDirectory() {
  return dataDir;
}
