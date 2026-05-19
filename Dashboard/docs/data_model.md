# AgriNova Data Model

## Dimension Tables

- `Farms`: farm metadata, location, operational status, heartbeat state.
- `Crops`: approved vegetable and fruit crops by farm.
- `Sensors`: sensor inventory, gateway, packet rate, communication health.
- `Date`: date table covering historical and forecast windows.

## Fact Tables

- `SoilReadings`: soil, NPK, light, CO2, leaf wetness, irrigation and fertilization status.
- `WeatherReadings`: environmental readings and weather risk.
- `RobotMissions`: ground robot mission state, battery, progress, coverage, alerts.
- `DroneMissions`: drone flight state, NDVI, thermal zones, coverage, capture state.
- `CropHealthScans`: Vision Intelligence Module scan results and treatments.
- `PricePredictions`: fruit and vegetable market forecast records.
- `BlockchainTransactions`: block history, validation state, hashes, traceability.
- `AIRecommendations`: AgriNova AI Assistant interaction and recommendation records.
- `Alerts`: operational alerts and recommended actions.
- `EnergyUsage`: solar, battery, renewable usage, carbon reduction, charging.
- `Reports`: exportable decision-support report catalog.

## Relationship Defaults

- Use `Farms` as the primary operational dimension.
- Use `Crops` for crop analytics and scan drill-through.
- Use `Date` for all date-based trends.
- Keep filters single-direction from dimensions to facts.

## Live-System Simulation Fields

The kit includes `Status`, `LastSignalTime`, `HeartbeatState`, `PacketRate`, `ValidationState`, `MissionState`, and `AssistantAvailability` fields to create live-status badges across IoT, robotics, AI assistant, and blockchain pages.
