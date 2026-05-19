export type CsvRow = Record<string, string>;

export interface DashboardData {
  farms: CsvRow[];
  sensors: CsvRow[];
  alerts: CsvRow[];
  soilReadings: CsvRow[];
  weatherReadings: CsvRow[];
  cropHealth: CsvRow[];
  pricePredictions: CsvRow[];
  blockchain: CsvRow[];
  aiRecommendations: CsvRow[];
  energy: CsvRow[];
  robotMissions: CsvRow[];
  droneMissions: CsvRow[];
  crops: CsvRow[];
  reports: CsvRow[];
  dates: CsvRow[];
}

export interface Summary {
  totalFarms: number;
  onlineFarms: number;
  activeSensors: number;
  totalSensors: number;
  activeAlerts: number;
  criticalAlerts: number;
  averageCropHealth: number;
  averageSoilMoisture: number;
  averageCommunicationHealth: number;
  systemHealthIndex: number;
  predictedMarketChange: number;
  blockchainVerificationRate: number;
  renewableEnergyPercentage: number;
  activeRobots: number;
  activeDrones: number;
  generatedReports: number;
  approvedPriceCrops: string[];
}
