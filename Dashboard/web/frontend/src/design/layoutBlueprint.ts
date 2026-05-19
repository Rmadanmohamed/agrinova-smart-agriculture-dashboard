export interface BlueprintPanel {
  name: string;
  colSpan: number;
  role: string;
}

export interface PageBlueprint {
  route: string;
  referenceImage: string;
  pageNumber: string;
  kpiCount: number;
  panels: BlueprintPanel[];
}

export const pageBlueprints: PageBlueprint[] = [
  {
    route: '/',
    referenceImage: '01_AgriNova_Overview.png',
    pageNumber: '01',
    kpiCount: 6,
    panels: [
      { name: 'Farm Distribution Map', colSpan: 4, role: 'map' },
      { name: 'Crop Health Score', colSpan: 3, role: 'line-chart' },
      { name: 'Top Performing Zones', colSpan: 2, role: 'rank-list' },
      { name: 'System Health Gauge', colSpan: 3, role: 'gauge' },
      { name: 'Alerts Summary', colSpan: 3, role: 'summary-cards' },
      { name: 'AI Recommendation Feed', colSpan: 3, role: 'feed' },
      { name: 'Key Insights', colSpan: 3, role: 'feed' },
      { name: 'Weather Overview', colSpan: 3, role: 'weather-card' },
      { name: 'Executive KPI Trend', colSpan: 9, role: 'multi-line-chart' },
      { name: 'Quick Actions', colSpan: 3, role: 'actions' },
    ],
  },
  {
    route: '/price-prediction',
    referenceImage: '06_Price_Prediction.png',
    pageNumber: '06',
    kpiCount: 6,
    panels: [
      { name: 'Price Trajectory', colSpan: 5, role: 'area-chart' },
      { name: 'Impact Factors', colSpan: 3, role: 'progress-bars' },
      { name: 'Top Opportunities', colSpan: 4, role: 'table' },
      { name: 'Commodity Price Forecast Overview', colSpan: 7, role: 'table' },
      { name: 'Price Heatmap', colSpan: 5, role: 'heatmap' },
      { name: 'Market News & Insights', colSpan: 9, role: 'feed' },
      { name: 'AI Confidence Score', colSpan: 3, role: 'gauge' },
    ],
  },
];
