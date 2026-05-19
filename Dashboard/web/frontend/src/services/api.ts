import type { CsvRow, DashboardData, Summary } from './types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:4000/api';

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const [
    farms,
    sensors,
    alerts,
    soilReadings,
    weatherReadings,
    cropHealth,
    pricePredictions,
    blockchain,
    aiRecommendations,
    energy,
    robotMissions,
    droneMissions,
    summaryFromApi,
  ] = await Promise.all([
    getJson<CsvRow[]>('/farms'),
    getJson<CsvRow[]>('/sensors'),
    getJson<CsvRow[]>('/alerts'),
    getJson<CsvRow[]>('/soil-readings'),
    getJson<CsvRow[]>('/weather-readings'),
    getJson<CsvRow[]>('/crop-health'),
    getJson<CsvRow[]>('/price-predictions'),
    getJson<CsvRow[]>('/blockchain'),
    getJson<CsvRow[]>('/ai-recommendations'),
    getJson<CsvRow[]>('/energy'),
    getJson<CsvRow[]>('/robot-missions'),
    getJson<CsvRow[]>('/drone-missions'),
    getJson<Summary>('/summary'),
  ]);

  return {
    farms,
    sensors,
    alerts,
    soilReadings,
    weatherReadings,
    cropHealth,
    pricePredictions,
    blockchain,
    aiRecommendations,
    energy,
    robotMissions,
    droneMissions,
    summaryFromApi,
  };
}
