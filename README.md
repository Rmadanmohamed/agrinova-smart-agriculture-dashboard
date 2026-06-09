# AgriNova Smart Agriculture Dashboard

## Overview
A full smart-agriculture dashboard workspace combining a Next.js dashboard, API routes, Power BI assets, and Power BI-ready CSV data.

Live demo: https://agri-nova-ai-dashboard.vercel.app

Main portfolio: https://ramadan-ai-portfolio.vercel.app

## Problem Statement
Agriculture operations need a single dashboard for farm monitoring, crop health, IoT sensors, drone missions, price prediction, alerts, reports, and sustainability signals.

## Features
- Next.js dashboard pages and API routes
- Power BI enterprise build kit
- Agriculture demo datasets
- IoT, drone, crop, energy, price, and alert modules

## Tech Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts
- Power BI
- CSV datasets

## Dataset
- AgriNova demo CSV tables in data/ and Dashboard/data/

## Models / Algorithms
- Dashboard calculations and simulated AI recommendation logic

## Results
This is an application/dashboard project; no ML benchmark metric was detected.

## Project Structure
- .gitignore
- app/
  - ai-assistant/
  - alerts-reports/
  - api/
  - blockchain/
  - crop-health/
  - farm-monitoring/
  - globals.css
  - iot-network/
  - layout.tsx
  - page.tsx
  - price-prediction/
  - robotics-drones/
  - sustainability/
- components/
  - dashboard/
  - theme-provider.tsx
  - ui/
- components.json
- Dashboard/
  - assets/
  - dax/
  - docs/
  - manual_build/
  - powerbi/
  - README.md
  - theme/
  - tools/
  - web/
- data/
  - AIRecommendations.csv
  - Alerts.csv
  - BlockchainTransactions.csv
  - CropHealthScans.csv
  - Crops.csv
  - Date.csv
  - DroneMissions.csv
  - EnergyUsage.csv
  - Farms.csv
  - PricePredictions.csv
  - Reports.csv
  - RobotMissions.csv
  - Sensors.csv
  - SoilReadings.csv
  - WeatherReadings.csv
- docs/
  - powerbi_validation_screenshot_focused_after_schema_fix.png
- hooks/
  - use-mobile.ts
  - use-toast.ts
- lib/
  - utils.ts
- next-env.d.ts
- next.config.mjs
- package-lock.json
- package.json
- pnpm-lock.yaml
- pnpm-workspace.yaml
- postcss.config.mjs
- powerbi-semantic-model/
  - definition/
- public/
  - apple-icon.png
  - icon-dark-32x32.png
  - icon-light-32x32.png
  - icon.svg
  - placeholder-logo.png
  - placeholder-logo.svg
  - placeholder-user.jpg
  - placeholder.jpg
  - placeholder.svg
- styles/
  - globals.css
- tsconfig.json

## How to Run
- `npm install`
- `npm run dev`

## Screenshots / Demo
Live demo: https://agri-nova-ai-dashboard.vercel.app

If the demo is unavailable, run the dashboard locally with the commands above and check the Vercel deployment configuration.

## Deployment
Recommended platform: Vercel.

Reason: this is a Next.js dashboard with API routes and static CSV-backed demo data.

Before deployment:

- Run `npm install`
- Run `npm run build`
- Confirm the public demo loads
- Confirm dashboard pages and API routes return data

## Future Improvements
- Connect live farm data APIs
- Add authentication and role-based access
- Deploy dashboard and publish Power BI documentation

## Author
Ramadan Mohamed Hassan

- GitHub: https://github.com/Rmadanmohamed
- LinkedIn: https://www.linkedin.com/in/ramadan-mohamed-657686365
- Portfolio: https://ramadan-ai-portfolio.vercel.app
