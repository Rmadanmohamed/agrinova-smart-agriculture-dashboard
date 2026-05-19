# Power BI Browser Execution Runbook

## What Was Attempted

- Opened the signed-in Microsoft 365 browser session.
- Tried `https://app.powerbi.com/home`.
- Tried `https://app.fabric.microsoft.com/home`.
- Tried Microsoft 365 app launcher and app search.
- Searched Microsoft 365 for `Power BI`.
- Checked local machine paths for Power BI Desktop.

## Blocked Step

Power BI Service and Fabric both returned:

> The service is unavailable.

Power BI also did not appear in the signed-in Microsoft 365 app list/search, and Power BI Desktop is not installed on this machine.

This blocks browser-based report creation, CSV import, data modeling, visual assembly, and PDF export inside Power BI from the current environment.

## What Was Built Instead

A local Power BI Project scaffold was created at:

`powerbi/AgriNova/AgriNova.pbip`

It contains:

- `AgriNova.SemanticModel/model.bim` with CSV import queries, relationships, and DAX measures.
- `AgriNova.SemanticModel/definition.pbism`.
- `AgriNova.Report/definition.pbir` linked to the semantic model.
- All generated data, theme, SVG assets, page blueprints, tooltip maps, and drill-through maps remain in the parent workspace.

## Manual Click-by-Click Alternative

Use this on a machine/account where Power BI Desktop or Power BI Service is available.

### Option A: Power BI Desktop

1. Install or open Microsoft Power BI Desktop.
2. Open:
   `D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard\powerbi\AgriNova\AgriNova.pbip`
3. If prompted to apply/load data, choose **Apply changes** or **Refresh**.
4. Confirm the model contains:
   - Farms
   - Crops
   - Sensors
   - SoilReadings
   - WeatherReadings
   - RobotMissions
   - DroneMissions
   - CropHealthScans
   - PricePredictions
   - BlockchainTransactions
   - AIRecommendations
   - Alerts
   - EnergyUsage
   - Reports
   - Date
   - AgriNova_Measures
5. Go to **View > Browse for themes**.
6. Import:
   `D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard\theme\agrinova_theme.json`
7. Build the pages using:
   - `docs/report_layout.md`
   - `docs/page_blueprint.csv`
   - `docs/tooltip_map.csv`
   - `docs/drillthrough_map.csv`
   - `docs/navigation_map.csv`
8. Insert SVG assets from:
   `assets/`
9. Create all tooltip pages and drill-through pages listed in the docs.
10. Create Executive Mode bookmarks.
11. Export using **File > Export > Export to PDF**.

### Option B: Power BI Service

1. Open `https://app.powerbi.com/`.
2. Sign in with an account that has Power BI enabled.
3. Open or create a workspace.
4. Choose **New > Semantic model** or **Upload** depending on tenant UI.
5. Upload/import the CSV files from:
   `data/`
6. Create relationships according to:
   `docs/data_model.md`
7. Add the measures from:
   `dax/agrinova_measures.dax`
8. Create a new report named **AgriNova**.
9. Apply the custom theme:
   `theme/agrinova_theme.json`
10. Build pages, navigation, tooltips, drill-through pages, and Executive Mode using the implementation docs.

## Privacy Rules To Preserve

- Do not show internal model identities.
- Do not show internal model performance or development metrics.
- Use only generic public labels such as:
  - AI Engine
  - Smart Agriculture Intelligence
  - Vision Intelligence Module
  - AgriNova AI Assistant
