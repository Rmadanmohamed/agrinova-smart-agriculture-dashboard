# AgriNova Power BI Desktop Manual Fallback

Use this when Power BI Desktop opens blank Untitled windows, ignores `.pbip` or `.pbir` launch arguments, or the GUI automation cannot complete the file picker.

## 1. Close Duplicate Blank Windows

Keep one blank Power BI Desktop window open. Close any extra **Untitled - Power BI Desktop** windows before continuing.

## 2. Enable Project Preview Features

Microsoft currently documents both Power BI Projects and PBIR as preview features in Power BI Desktop.

1. In Power BI Desktop, open **File**.
2. Select **Options and settings**.
3. Select **Options**.
4. Open **Preview features**.
5. Enable **Power BI Project (.pbip) save option**.
6. Enable **Store reports using enhanced metadata format (PBIR)**.
7. Select **OK**.
8. Fully close Power BI Desktop.
9. Reopen Power BI Desktop.
10. Try opening:
    `D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard\powerbi\AgriNova\AgriNova.pbip`

If the project opens successfully, refresh the model and continue from `docs/report_layout.md`.

## 3. Manual Import Path

If the project still opens as a blank report, build from the generated source files.

### Import CSV Tables

1. In Power BI Desktop, go to **Home > Get data > Text/CSV**.
2. Import each file in:
   `D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard\data`
3. Load these tables:
   - `Farms`
   - `Crops`
   - `Sensors`
   - `SoilReadings`
   - `WeatherReadings`
   - `RobotMissions`
   - `DroneMissions`
   - `CropHealthScans`
   - `PricePredictions`
   - `BlockchainTransactions`
   - `AIRecommendations`
   - `Alerts`
   - `EnergyUsage`
   - `Reports`
   - `Date`

### Set Data Types

- Date fields: Date.
- `LastSignalTime`: Date/Time.
- Latitude and longitude: Decimal number.
- Percent, score, price, NPK, packet, and energy fields: Decimal number.
- ID fields and status fields: Text.

Mark `Date[Date]` as the date table.

## 4. Create Relationships

Use **Model view > Manage relationships > New**.

The exact relationship list is in:

`D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard\docs\relationship_map.csv`

Use single-direction filtering from dimension tables into fact tables.

Primary pattern:

- `Farms[FarmID]` filters farm-level fact tables.
- `Crops[CropID]` filters crop readings, scans, and assistant recommendations.
- `Sensors[SensorID]` filters soil readings.
- `Date[Date]` filters all dated fact tables.

## 5. Import Theme

1. Go to **View > Browse for themes**.
2. Select:
   `D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard\theme\agrinova_theme.json`
3. Set every page background to dark navy if Desktop does not apply it automatically.

## 6. Add DAX Measures

1. Create a blank table named `AgriNova_Measures`.
2. Paste measures from:
   `D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard\dax\agrinova_measures.dax`
3. Format percent-style measures and price measures in the ribbon.

## 7. Add Assets

Use **Insert > Image** for:

- Logo:
  `assets/logo/agrinova_logo.svg`
- Page icons:
  `assets/icons/*.svg`
- General background:
  `assets/backgrounds/executive_glow.svg`
- Blockchain page background:
  `assets/backgrounds/blockchain_network.svg`

## 8. Build Pages

Create these pages in order:

1. AgriNova Overview
2. Smart Farm Monitoring
3. Crop Health & Vision Intelligence
4. Robotics & Drone Operations
5. IoT Sensor Network
6. Price Prediction
7. Blockchain Security
8. AI Assistant
9. Sustainability & Energy
10. Alerts & Reports

Use these implementation files:

- `docs/report_layout.md`: page-by-page design.
- `docs/page_blueprint.csv`: visual coordinates and visual types.
- `docs/navigation_map.csv`: sidebar navigation.
- `docs/tooltip_map.csv`: custom tooltip pages.
- `docs/drillthrough_map.csv`: drill-through pages.

## 9. Add Navigation

1. Create the sidebar once on the Overview page.
2. Add logo, icons, and page navigation buttons.
3. Copy the sidebar to all main pages.
4. On each page, show that page's active neon indicator.
5. Use button actions set to **Page navigation**.

## 10. Add Tooltips And Drill-through

Create tooltip pages at 320 x 240 px using `docs/tooltip_map.csv`.

Create hidden drill-through pages using `docs/drillthrough_map.csv`.

Each drill-through page should include:

- Back button.
- Header KPI row.
- Detail matrix.
- Trend or evidence panel.

## 11. Add Executive Mode

1. Build normal dense report pages first.
2. Duplicate the Overview page into an Executive presentation layout, or use bookmarks to hide dense detail panes.
3. Add large KPI cards, system status, and high-level story panels.
4. Create bookmarks:
   - `Executive Mode On`
   - `Executive Mode Off`
5. Add a header button to toggle between the two.

## 12. Export-Ready PDF Layout

- Use 16:9 page size.
- Keep text inside safe margins.
- Use Fit to Page before export.
- Export from **File > Export > Export to PDF**.

## Privacy Rules

Keep the report public-facing. Do not expose internal AI identity, internal model performance, or development metrics. Use only generic labels such as:

- AI Engine
- Smart Agriculture Intelligence
- Vision Intelligence Module
- AgriNova AI Assistant
