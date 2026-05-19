import cors from 'cors';
import express from 'express';
import { getDataDirectory, getDataset, getSummary, loadAllData } from './dataService';
import type { DashboardData } from './types';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

const routes: Array<{ path: string; key: keyof DashboardData }> = [
  { path: '/api/farms', key: 'farms' },
  { path: '/api/sensors', key: 'sensors' },
  { path: '/api/alerts', key: 'alerts' },
  { path: '/api/soil-readings', key: 'soilReadings' },
  { path: '/api/weather-readings', key: 'weatherReadings' },
  { path: '/api/crop-health', key: 'cropHealth' },
  { path: '/api/price-predictions', key: 'pricePredictions' },
  { path: '/api/blockchain', key: 'blockchain' },
  { path: '/api/ai-recommendations', key: 'aiRecommendations' },
  { path: '/api/energy', key: 'energy' },
  { path: '/api/robot-missions', key: 'robotMissions' },
  { path: '/api/drone-missions', key: 'droneMissions' },
];

app.get('/api/health', async (_req, res, next) => {
  try {
    const summary = await getSummary();
    res.json({
      status: 'ok',
      dataDirectory: getDataDirectory(),
      totalFarms: summary.totalFarms,
      totalSensors: summary.totalSensors,
    });
  } catch (error) {
    next(error);
  }
});

routes.forEach((route) => {
  app.get(route.path, async (_req, res, next) => {
    try {
      res.json(await getDataset(route.key));
    } catch (error) {
      next(error);
    }
  });
});

app.get('/api/summary', async (_req, res, next) => {
  try {
    res.json(await getSummary());
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Unexpected server error';
  res.status(500).json({ error: message });
});

loadAllData()
  .then(() => {
    app.listen(port, () => {
      console.log(`AgriNova API listening on http://127.0.0.1:${port}`);
      console.log(`CSV data directory: ${getDataDirectory()}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start AgriNova API');
    console.error(error);
    process.exit(1);
  });
