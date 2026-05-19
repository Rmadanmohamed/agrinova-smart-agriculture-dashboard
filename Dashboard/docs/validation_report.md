# Validation Report

Generated checks for the AgriNova Power BI kit.

## Completed Checks

- Theme JSON parses successfully.
- Price prediction crop set is restricted to the approved vegetables and fruits.
- Internal AI names and public AI metric terms are absent from generated user-facing assets.
- Core CSV tables are present for farms, crops, sensors, soil, weather, robots, drones, crop scans, price prediction, blockchain, AI recommendations, alerts, energy, reports, and dates.
- Tooltip map includes 10 custom tooltip pages for critical KPIs.
- Drill-through map includes 9 hidden detail pages for farm, crop, sensor, mission, scan, commodity, blockchain, and alert analytics.
- Page blueprint includes visual coordinates for the 10 primary report pages.

## Manual Power BI Checks

- Import the theme in Power BI Desktop and confirm any unsupported style properties are ignored without blocking import.
- Paste the DAX measures into a `AgriNova_Measures` table and confirm all measures compile.
- Inspect each page at Fit to Page before PDF export.
