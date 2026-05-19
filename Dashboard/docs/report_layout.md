# AgriNova Report Layout Specification

## Global Canvas

- Page size: 16:9, 1920 x 1080 design grid.
- Background: use `assets/backgrounds/executive_glow.svg` on all pages at 100% fit, then layer translucent navy shapes for visual sections.
- Sidebar: 260 px wide, fixed left, dark glass fill `#05111F` with 1 px stroke `#1C4664`.
- Header: 1660 px wide, 92 px high, title left, date/status right, live-system signal badges.
- Card style: radius 8, fill `#081727` at 8-16% transparency, stroke `#1C4664`, soft cyan/green glow using duplicated transparent shapes behind key cards.
- Type: Segoe UI Semibold for titles, Segoe UI for body labels.
- Accent rules: green means optimal/actionable, cyan means live intelligence, amber means watch, red means critical.

## Navigation

Create one sidebar group and copy it to every page:

1. AgriNova logo from `assets/logo/agrinova_logo.svg`.
2. Icon + label buttons for Overview, Farm Monitoring, Crop Health, Robots & Drones, IoT Network, Price Prediction, Blockchain, AI Assistant, Sustainability, Alerts & Reports.
3. Use page navigation actions on each button.
4. Active page indicator: add a 5 px neon-green vertical pill beside the current page item, plus a translucent green button background.
5. Executive Mode button: top-right header button using bookmarks. Bookmark state hides dense slicers and shows presentation summary panels.

Power BI does not support true sidebar animation, so mimic it with selected/hover button states, active indicators, and bookmark transitions.

## Tooltip Pages

Create these report tooltip pages at 320 x 240 px:

- `TT_CropHealth`: crop health score, latest disease, pest risk, treatment.
- `TT_WaterEfficiency`: moisture, irrigation status, water saving, next action.
- `TT_Energy`: battery, renewable usage, solar status, robot/drone charging.
- `TT_IoTUptime`: uptime, packet rate, gateway status, last signal.
- `TT_RobotStatus`: battery, mission state, route progress, obstacles.
- `TT_DroneCoverage`: coverage, NDVI index, thermal zones, image capture status.
- `TT_BlockchainIntegrity`: validation state, hash preview, previous hash preview, traceability stage.
- `TT_MarketRisk`: market risk, volatility, USD/EGP impact, inflation impact.
- `TT_Profitability`: current price, 60-day prediction, profitability signal, recommendation.
- `TT_AlertSeverity`: alert type, priority, status, recommended action.

Use the same dark card treatment with one large KPI, two micro indicators, and one recommendation line.

## Drill-through Pages

Create hidden drill-through pages:

- `DT_FarmProfile`: drill field `Farms[FarmID]`; show farm details, map, crop mix, sensor status, energy profile.
- `DT_CropAnalytics`: drill field `Crops[CropID]`; show crop health, soil readings, scans, market trend if crop is in price module.
- `DT_SensorDetail`: drill field `Sensors[SensorID]`; show readings trend, packet rate, communication health, alerts.
- `DT_RobotMission`: drill field `RobotMissions[RobotMissionID]`; show route progress, scan progress, battery, mission summary.
- `DT_DroneMission`: drill field `DroneMissions[DroneMissionID]`; show coverage, NDVI placeholder, thermal stress zones, capture state.
- `DT_CropScan`: drill field `CropHealthScans[ScanID]`; show image diagnosis result, treatment, preventive action.
- `DT_PriceCommodity`: drill field `PricePredictions[CropName]`; show current price, 60-day price, impacts, recommendation.
- `DT_BlockchainTransaction`: drill field `BlockchainTransactions[TransactionID]`; show block, hashes, validation timeline.
- `DT_AlertDetail`: drill field `Alerts[AlertID]`; show priority, recommendation, resolution status, related farm.

All drill-through pages include a back button in the upper-left content area.

## Page 1 - AgriNova Overview

Purpose: investor-ready system command center.

Layout:

- Top hero strip: `AgriNova` and `AI Smart Agriculture Platform`.
- KPI row: Total Monitored Farms, Active IoT Sensors, Active Robots, Active Drones, System Health Index.
- Core status band: Crop Health Score gauge, Water Efficiency gauge, Energy Status gauge, Blockchain Integrity gauge, AI Assistant Availability card.
- Middle-left: map visual by farm latitude/longitude with status color.
- Middle-center: area chart for crop health over time.
- Middle-right: live-system simulation panel with heartbeat state, last signal, and packet rate.
- Bottom-left: alerts matrix by priority and module.
- Bottom-center: resource optimization insights cards.
- Bottom-right: executive recommendation feed from `AIRecommendations`.

Executive Mode:

- Hide slicers and detailed matrices.
- Show one large system health score, four mission-status cards, and a three-step story: Monitor, Decide, Verify.

## Page 2 - Smart Farm Monitoring

- Slicers: Farm, Crop, Zone, Date.
- KPI cards: Soil Moisture, Soil Temperature, Humidity, pH, N, P, K, Light, CO2, Leaf Wetness.
- Gauge row: irrigation status, fertilization status, soil fertility.
- Heatmap: zone by reading type, conditional formatted by status.
- Line/area charts: moisture and pH over time.
- Matrix: latest readings by sensor with status, last signal, packet rate.

## Page 3 - Crop Health & Vision Intelligence

- Title uses `Vision Intelligence Module`.
- KPI cards: Crop Health Score, Detected Diseases, Pest Risk, Plant Stress Indicators.
- Main visual: crop scan history table with conditional status and treatment.
- Chart: disease distribution by crop and farm.
- Image diagnosis summary card: use `ImageDiagnosisResult`, `RecommendedTreatment`, `PreventiveAction`.
- Tooltip: attach `TT_CropHealth` to score and scan visuals.
- Drill-through: enable crop analytics and crop scan detail.

## Page 4 - Robotics & Drone Operations

- Split page into ground robotics and UAV operations.
- Robot side: status cards, battery gauge, route progress bar, soil scanning progress, field coverage, obstacle alerts, mission summary.
- Drone side: flight status, NDVI placeholder panel, aerial crop health, thermal stress zones, flight coverage, image capture status, high-risk zones.
- Use robot and drone SVG icons as section anchors.
- Live indicators: heartbeat dots and last signal chips.

## Page 5 - IoT Sensor Network

- KPI cards: Sensor Uptime, Data Packets Received, Edge Gateway Status, MQTT Data Flow Status.
- Network visual: use decomposition tree or matrix with Farm > Gateway > Sensor Type.
- Line chart: packet rate over latest signals.
- Heatmap: communication health by farm and sensor type.
- Alert strip: sensor alerts and interrupted heartbeat states.

## Page 6 - Price Prediction

- Approved crop slicer only: Tomatoes, Bell Pepper, Onion, Cucumber, Potato, Orange, Mandarin, Apple, Banana, Mango, Grapes, Strawberry, Lemon, Pomegranate.
- KPI cards: Current Market Price, Predicted Price After 60 Days, Expected Trend, Volatility Level, Profitability Indicator, Market Risk.
- Area chart: current and predicted price trajectory.
- Impact bars: Supply/Demand, USD/EGP, Inflation, Seasonal Effect.
- Matrix: crop, current price, 60-day prediction, trend, risk, recommendation.
- Tooltip pages: market risk and profitability.
- Drill-through: price commodity detail.

## Page 7 - Blockchain Security

- Background: use `assets/backgrounds/blockchain_network.svg`.
- Header metrics: network status, verified farm records, secure transactions, smart contract status, data integrity.
- Main visual: horizontal block-history layout using cards with BlockIndex, RecordType, HashPreview, PreviousHashPreview.
- Add connector lines between block cards to mimic chain flow.
- Timeline: transaction validation steps by date.
- Audit panel: immutable audit trail and supply-chain traceability.
- Use cyan/green security indicators and dense technical labels.

## Page 8 - AI Assistant

- Main panel: AgriNova AI Assistant chat-style surface.
- Farmer question input area: static rounded rectangle with placeholder text.
- Suggested question chips: crop advice, disease explanation, irrigation guidance, fertilizer guidance, market guidance.
- Recommendation feed: interaction type, question, recommendation, availability.
- Image-based diagnosis summary card from latest crop scan.
- Use labels: Conversational AI, Vision AI, Multimodal AI Assistant, Smart Farming Assistant.

## Page 9 - Sustainability & Energy

- KPI cards: Solar Power Status, Battery Level, Renewable Energy Usage, Carbon Reduction, Off-grid Status.
- Area chart: energy consumption and renewable usage over time.
- Gauge row: battery, renewable share, off-grid stability.
- Charging matrix: robot and drone charging status by farm.
- Carbon panel: estimated reduction by farm.

## Page 10 - Alerts & Reports

- Left: alert command center with critical soil, disease, irrigation, weather, market, blockchain, and energy alerts.
- Center: priority matrix by alert type and resolution status.
- Right: recommended actions feed.
- Bottom: report catalog with export-ready report names, generated date, owner, decision-support summary.
- Add buttons for report categories: farm performance, crop health, water usage, market forecast, blockchain audit, AI recommendation.

## Export-Ready PDF Rules

- Use 16:9 page size and keep all essential text inside a 70 px safe margin.
- Use Executive Mode for defense export and the dense default mode for internal review export.
- Export from Power BI Desktop using current values and no hidden filter changes.
- Check every page at Fit to Page before export.
- Use dark background PDF; do not use transparent page background.
