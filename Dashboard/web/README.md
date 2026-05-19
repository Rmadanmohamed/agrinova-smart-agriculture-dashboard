# AgriNova Web Dashboard

AgriNova is now a real component-based web dashboard with a Node/Express API and a React frontend. The prior image-overlay version has been replaced. The generated PNG mockups are not rendered in the app; they are only visual references for the dark futuristic style.

## Project Structure

```text
web/
├── frontend/
│   ├── package.json
│   ├── src/
│   └── ...
├── backend/
│   ├── package.json
│   ├── src/
│   └── ...
├── reference-images/
├── README.md
└── VALIDATION_REPORT.md
```

## Design References

The 10 uploaded premium dashboard images are copied into:

```text
web/reference-images
```

They are used as visual references only. The frontend does not render them as backgrounds or `<img>` UI elements.

The page-to-reference mapping and design notes live in:

```text
web/frontend/src/design/referenceMap.ts
```

## Backend

The backend reads CSV files directly from:

```text
D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard\data
```

Run it with:

```bash
cd web/backend
npm install
npm run dev
```

Default API URL:

```text
http://127.0.0.1:4000
```

You can override the CSV folder with:

```bash
AGRINOVA_DATA_DIR="D:\path\to\data" npm run dev
```

## Frontend

Run it with:

```bash
cd web/frontend
npm install
npm run dev
```

Default frontend URL:

```text
http://127.0.0.1:5173
```

If the backend URL changes, set:

```bash
VITE_API_URL="http://127.0.0.1:4000/api" npm run dev
```

## Build

Backend:

```bash
cd web/backend
npm run build
```

Frontend:

```bash
cd web/frontend
npm run build
```

## API Documentation

All responses are JSON.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/farms` | Farm master data |
| GET | `/api/sensors` | Sensor inventory and communication status |
| GET | `/api/alerts` | Alert records and recommended actions |
| GET | `/api/soil-readings` | Soil moisture, pH, humidity, and irrigation readings |
| GET | `/api/weather-readings` | Farm weather readings |
| GET | `/api/crop-health` | Crop scan records and treatment recommendations |
| GET | `/api/price-predictions` | Approved fruit and vegetable price data only |
| GET | `/api/blockchain` | Traceability and ledger records |
| GET | `/api/ai-recommendations` | AgriNova AI Assistant recommendation records |
| GET | `/api/energy` | Sustainability and energy usage records |
| GET | `/api/robot-missions` | Robot mission records |
| GET | `/api/drone-missions` | Drone mission records |
| GET | `/api/summary` | Calculated dashboard KPIs |
| GET | `/api/health` | Backend health and CSV folder confirmation |

## Pages

The frontend includes 10 real React pages:

1. Overview
2. Smart Farm Monitoring
3. Crop Health & Vision Intelligence
4. Robotics & Drone Operations
5. IoT Sensor Network
6. Price Prediction
7. Blockchain Security
8. AI Assistant
9. Sustainability & Energy
10. Alerts & Reports

## Price Data Rule

The price endpoint and frontend use only:

Tomatoes, Bell Pepper, Onion, Cucumber, Potato, Orange, Mandarin, Apple, Banana, Mango, Grapes, Strawberry, Lemon, Pomegranate.

## Deployment

Deploy the backend as a Node service and the frontend as a static Vite app. For Netlify or Vercel frontend hosting, use:

```text
Root: web/frontend
Build command: npm run build
Output directory: dist
```

Set `VITE_API_URL` to the deployed backend API base URL ending in `/api`.
