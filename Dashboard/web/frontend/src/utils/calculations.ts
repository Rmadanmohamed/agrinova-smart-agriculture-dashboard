import type { CsvRow, DashboardData, Summary } from '../services/types';
import { average, toNumber } from './formatters';

export const approvedPriceCrops = [
  'Tomatoes',
  'Bell Pepper',
  'Onion',
  'Cucumber',
  'Potato',
  'Orange',
  'Mandarin',
  'Apple',
  'Banana',
  'Mango',
  'Grapes',
  'Strawberry',
  'Lemon',
  'Pomegranate',
];

export function latestPriceByCrop(rows: CsvRow[]) {
  const byCrop = new Map<string, CsvRow>();

  rows.forEach((row) => {
    const current = byCrop.get(row.CropName);
    if (!current || row.Date > current.Date) byCrop.set(row.CropName, row);
  });

  return [...byCrop.values()].sort((a, b) => a.CropName.localeCompare(b.CropName));
}

export function countBy(rows: CsvRow[], key: string) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const label = row[key] || 'Other';
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});
}

export function topCounts(rows: CsvRow[], key: string, limit = 6) {
  return Object.entries(countBy(rows, key))
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function latestRows(rows: CsvRow[], key: string, limit = 8) {
  return [...rows].sort((a, b) => String(b[key]).localeCompare(String(a[key]))).slice(0, limit);
}

export function calculateSummary(data: DashboardData): Summary {
  const onlineFarms = data.farms.filter((row) => row.Status === 'Online').length;
  const activeSensors = data.sensors.filter((row) => row.Status === 'Online').length;
  const activeAlerts = data.alerts.filter((row) => row.ResolutionStatus !== 'Resolved').length;
  const criticalAlerts = data.alerts.filter((row) => row.PriorityLevel === 'Critical').length;
  const averageCropHealth = average(data.cropHealth.map((row) => toNumber(row.CropHealthScore)));
  const averageSoilMoisture = average(data.soilReadings.map((row) => toNumber(row.SoilMoisturePct)));
  const averageCommunicationHealth = average(data.sensors.map((row) => toNumber(row.CommunicationHealth)));
  const onlineFarmRate = data.farms.length ? (onlineFarms / data.farms.length) * 100 : 0;
  const verified = data.blockchain.filter((row) => row.ValidationState === 'Verified').length;
  const predictedMarketChange = average(
    latestPriceByCrop(data.pricePredictions).map((row) => {
      const current = toNumber(row.CurrentMarketPriceEGP);
      const predicted = toNumber(row.PredictedPrice60DaysEGP);
      return current ? ((predicted - current) / current) * 100 : 0;
    }),
  );

  return {
    totalFarms: data.farms.length,
    onlineFarms,
    activeSensors,
    totalSensors: data.sensors.length,
    activeAlerts,
    criticalAlerts,
    averageCropHealth,
    averageSoilMoisture,
    averageCommunicationHealth,
    systemHealthIndex: average([averageCropHealth, averageCommunicationHealth, onlineFarmRate]),
    predictedMarketChange,
    blockchainVerificationRate: data.blockchain.length ? (verified / data.blockchain.length) * 100 : 0,
    renewableEnergyPercentage: average(data.energy.map((row) => toNumber(row.RenewableEnergyUsagePct))),
    activeRobots: data.robotMissions.filter((row) => row.MissionState === 'Active').length,
    activeDrones: data.droneMissions.filter((row) => row.MissionState === 'Active').length,
    generatedReports: data.summaryFromApi.generatedReports,
    approvedPriceCrops: data.summaryFromApi.approvedPriceCrops.length ? data.summaryFromApi.approvedPriceCrops : approvedPriceCrops,
  };
}
