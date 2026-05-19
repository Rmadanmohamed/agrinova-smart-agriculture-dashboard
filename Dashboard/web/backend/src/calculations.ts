import type { CsvRow, DashboardData, Summary } from './types';

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

export function toNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function average(values: number[]) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return 0;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

export function latestPriceByCrop(rows: CsvRow[]) {
  const byCrop = new Map<string, CsvRow>();

  rows.forEach((row) => {
    const crop = row.CropName;
    const current = byCrop.get(crop);
    if (!current || row.Date > current.Date) {
      byCrop.set(crop, row);
    }
  });

  return [...byCrop.values()];
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
  const verifiedCount = data.blockchain.filter((row) => row.ValidationState === 'Verified').length;
  const blockchainVerificationRate = data.blockchain.length ? (verifiedCount / data.blockchain.length) * 100 : 0;
  const renewableEnergyPercentage = average(data.energy.map((row) => toNumber(row.RenewableEnergyUsagePct)));
  const activeRobots = data.robotMissions.filter((row) => row.MissionState === 'Active').length;
  const activeDrones = data.droneMissions.filter((row) => row.MissionState === 'Active').length;
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
    blockchainVerificationRate,
    renewableEnergyPercentage,
    activeRobots,
    activeDrones,
    generatedReports: data.reports.length,
    approvedPriceCrops,
  };
}
