# 04 Page-By-Page Visual Placement Guide

Canvas: **16:9 widescreen**. Use the mockups in `manual_build/mockups/` as the visual reference.

Power BI coordinates in this package use a 1920 x 1080 design grid. If your Desktop canvas uses the standard 16:9 layout, preserve relative placement and spacing.

## Global Shell

- Sidebar: x=0, y=0, w=260, h=1080.
- Header: x=280, y=24, w=1610, h=86.
- Use `assets/logo/agrinova_logo.svg` at the top of the sidebar.
- Use icons from `assets/icons/` for navigation and section headers.
- Use `assets/backgrounds/executive_glow.svg` as the common background.
- Use `assets/backgrounds/blockchain_network.svg` on the Blockchain page.

## Navigation Map

| Order | Button | Target Page | Icon |
|---:|---|---|---|
| 1 | Overview | AgriNova Overview | `assets/icons/overview.svg` |
| 2 | Smart Farm Monitoring | Smart Farm Monitoring | `assets/icons/farm_monitoring.svg` |
| 3 | Crop Health | Crop Health & Vision Intelligence | `assets/icons/crop_health.svg` |
| 4 | Robotics & Drone | Robotics & Drone Operations | `assets/icons/robot.svg` |
| 5 | IoT Sensor Network | IoT Sensor Network | `assets/icons/iot.svg` |
| 6 | Price Prediction | Price Prediction | `assets/icons/price.svg` |
| 7 | Blockchain Security | Blockchain Security | `assets/icons/blockchain.svg` |
| 8 | AI Assistant | AI Assistant | `assets/icons/assistant.svg` |
| 9 | Sustainability & Energy | Sustainability & Energy | `assets/icons/energy.svg` |
| 10 | Alerts & Reports | Alerts & Reports | `assets/icons/alerts.svg` |

## Main Pages

### AgriNova Overview

| Visual | Type | X | Y | W | H | Fields / Measures | Tooltip | Drill-through |
|---|---|---:|---:|---:|---:|---|---|---|
| Sidebar Navigation | Grouped shapes, SVG icons, page buttons | 0 | 0 | 260 | 1080 | Navigation buttons and active page indicator |  |  |
| Header System Bar | Grouped shapes and cards | 280 | 24 | 1610 | 86 | Page title, current date label, Live System Signals, KPI Status Label |  |  |
| Executive KPI Strip | Card row | 280 | 130 | 1320 | 118 | Total Monitored Farms; Active IoT Sensors; Active Robots; Active Drones; System Health Index |  | DT_FarmProfile |
| System Health Gauge | Gauge | 1620 | 130 | 270 | 260 | System Health Index | TT_CropHealth |  |
| Farm Map | Map | 280 | 270 | 520 | 330 | Farms[Latitude]; Farms[Longitude]; Farms[Status] |  | DT_FarmProfile |
| Crop Health Area | Area chart | 830 | 270 | 500 | 330 | Date[Date]; Crop Health Score | TT_CropHealth | DT_CropAnalytics |
| Live Telemetry Panel | Matrix/cards | 1360 | 420 | 530 | 180 | HeartbeatState; LastSignalTime; PacketRate | TT_IoTUptime |  |
| Alerts Summary | Matrix | 280 | 630 | 620 | 310 | Alerts[AlertType]; Alerts[PriorityLevel]; Open Alerts; Critical Alerts | TT_AlertSeverity | DT_AlertDetail |
| Recommendation Feed | Table | 930 | 630 | 960 | 310 | AIRecommendations[InteractionType]; AIRecommendations[RecommendationText] |  | DT_CropAnalytics |

### Smart Farm Monitoring

| Visual | Type | X | Y | W | H | Fields / Measures | Tooltip | Drill-through |
|---|---|---:|---:|---:|---:|---|---|---|
| Sidebar Navigation | Grouped shapes, SVG icons, page buttons | 0 | 0 | 260 | 1080 | Navigation buttons and active page indicator |  |  |
| Header System Bar | Grouped shapes and cards | 280 | 24 | 1610 | 86 | Page title, current date label, Live System Signals, KPI Status Label |  |  |
| Farm Crop Zone Slicers | Slicers | 280 | 130 | 410 | 130 | Farms[FarmName]; Crops[CropName]; Sensors[Zone]; Date[Date] |  |  |
| Soil KPI Grid | Card grid | 720 | 130 | 1170 | 170 | Average Soil Moisture; Average Soil Temperature; Average Humidity; Average pH; Average Nitrogen; Average Phosphorus; Average Potassium; Average Light Intensity; Average CO2; Average Leaf Wetness | TT_WaterEfficiency | DT_SensorDetail |
| Moisture pH Trends | Line and area chart | 280 | 330 | 760 | 330 | Date[Date]; Average Soil Moisture; Average pH | TT_WaterEfficiency | DT_CropAnalytics |
| Zone Heatmap | Matrix with conditional formatting | 1070 | 330 | 820 | 330 | Sensors[Zone]; Sensors[SensorType]; SoilReadings metrics |  | DT_SensorDetail |
| Latest Sensor Readings | Matrix | 280 | 690 | 1610 | 250 | Sensors[SensorID]; Sensors[Status]; SoilReadings latest values; LastSignalTime | TT_IoTUptime | DT_SensorDetail |

### Crop Health & Vision Intelligence

| Visual | Type | X | Y | W | H | Fields / Measures | Tooltip | Drill-through |
|---|---|---:|---:|---:|---:|---|---|---|
| Sidebar Navigation | Grouped shapes, SVG icons, page buttons | 0 | 0 | 260 | 1080 | Navigation buttons and active page indicator |  |  |
| Header System Bar | Grouped shapes and cards | 280 | 24 | 1610 | 86 | Page title, current date label, Live System Signals, KPI Status Label |  |  |
| Health KPI Row | Card row | 280 | 130 | 1610 | 140 | Crop Health Score; DetectedDisease count; PestRiskLevel; PlantStressIndicator | TT_CropHealth | DT_CropAnalytics |
| Disease Distribution | Stacked bar chart | 280 | 300 | 520 | 290 | Crops[CropName]; CropHealthScans[DetectedDisease] | TT_CropHealth |  |
| Scan History | Table | 830 | 300 | 1060 | 290 | ScanID; ScanDate; CropHealthScore; DetectedDisease; PestRiskLevel | TT_CropHealth | DT_CropScan |
| Diagnosis Action Panel | Multi-row cards | 280 | 620 | 1610 | 320 | ImageDiagnosisResult; RecommendedTreatment; PreventiveAction | TT_CropHealth | DT_CropScan |

### Robotics & Drone Operations

| Visual | Type | X | Y | W | H | Fields / Measures | Tooltip | Drill-through |
|---|---|---:|---:|---:|---:|---|---|---|
| Sidebar Navigation | Grouped shapes, SVG icons, page buttons | 0 | 0 | 260 | 1080 | Navigation buttons and active page indicator |  |  |
| Header System Bar | Grouped shapes and cards | 280 | 24 | 1610 | 86 | Page title, current date label, Live System Signals, KPI Status Label |  |  |
| Robot Operations Panel | Cards, gauges, bars | 280 | 130 | 790 | 810 | Robot Battery; Robot Route Progress; Robot Field Coverage; ObstacleAlerts; LastMissionSummary | TT_RobotStatus | DT_RobotMission |
| Drone Operations Panel | Cards, map placeholder, bars | 1100 | 130 | 790 | 810 | Drone Battery; Drone Flight Coverage; Aerial Crop Health; Thermal Stress Zones; NDVIIndex | TT_DroneCoverage | DT_DroneMission |

### IoT Sensor Network

| Visual | Type | X | Y | W | H | Fields / Measures | Tooltip | Drill-through |
|---|---|---:|---:|---:|---:|---|---|---|
| Sidebar Navigation | Grouped shapes, SVG icons, page buttons | 0 | 0 | 260 | 1080 | Navigation buttons and active page indicator |  |  |
| Header System Bar | Grouped shapes and cards | 280 | 24 | 1610 | 86 | Page title, current date label, Live System Signals, KPI Status Label |  |  |
| Network KPI Row | Card row | 280 | 130 | 1610 | 130 | Sensor Uptime; Data Packets Received; Live System Signals; EdgeGateway count | TT_IoTUptime | DT_SensorDetail |
| Gateway Tree | Decomposition tree | 280 | 290 | 640 | 360 | Farms[FarmName]; Sensors[EdgeGateway]; Sensors[SensorType]; Sensors[CommunicationHealth] | TT_IoTUptime | DT_SensorDetail |
| Communication Heatmap | Matrix heatmap | 950 | 290 | 940 | 360 | Farms[FarmName]; Sensors[SensorType]; Sensor Uptime | TT_IoTUptime |  |
| Packet Rate Trend | Line chart | 280 | 680 | 1610 | 260 | LastSignalTime; Data Packets Received | TT_IoTUptime |  |

### Price Prediction

| Visual | Type | X | Y | W | H | Fields / Measures | Tooltip | Drill-through |
|---|---|---:|---:|---:|---:|---|---|---|
| Sidebar Navigation | Grouped shapes, SVG icons, page buttons | 0 | 0 | 260 | 1080 | Navigation buttons and active page indicator |  |  |
| Header System Bar | Grouped shapes and cards | 280 | 24 | 1610 | 86 | Page title, current date label, Live System Signals, KPI Status Label |  |  |
| Commodity Slicer | Slicer | 280 | 130 | 300 | 160 | PricePredictions[CropName] |  |  |
| Market KPI Row | Card row | 610 | 130 | 1280 | 160 | Current Market Price; Predicted Price After 60 Days; Expected Price Change %; Market Risk Score; Profitability Signal | TT_MarketRisk | DT_PriceCommodity |
| Price Trajectory | Area chart | 280 | 330 | 930 | 360 | Date[Date]; Current Market Price; Predicted Price After 60 Days | TT_Profitability | DT_PriceCommodity |
| Impact Factors | Bar chart | 1240 | 330 | 650 | 360 | SupplyDemandImpact; USDEGPImpact; InflationImpact; SeasonalEffect | TT_MarketRisk |  |
| Commodity Matrix | Matrix | 280 | 720 | 1610 | 220 | CropName; CurrentMarketPriceEGP; PredictedPrice60DaysEGP; ExpectedTrend; VolatilityLevel; SmartRecommendation | TT_Profitability | DT_PriceCommodity |

### Blockchain Security

| Visual | Type | X | Y | W | H | Fields / Measures | Tooltip | Drill-through |
|---|---|---:|---:|---:|---:|---|---|---|
| Sidebar Navigation | Grouped shapes, SVG icons, page buttons | 0 | 0 | 260 | 1080 | Navigation buttons and active page indicator |  |  |
| Header System Bar | Grouped shapes and cards | 280 | 24 | 1610 | 86 | Page title, current date label, Live System Signals, KPI Status Label |  |  |
| Blockchain KPI Row | Card row | 280 | 130 | 1610 | 130 | Blockchain Integrity; Verified Farm Records; Secure Transactions; SmartContractStatus | TT_BlockchainIntegrity | DT_BlockchainTransaction |
| Connected Block History | Card strip with connector shapes | 280 | 300 | 1610 | 330 | BlockIndex; RecordType; HashPreview; PreviousHashPreview; ValidationState | TT_BlockchainIntegrity | DT_BlockchainTransaction |
| Validation Timeline | Line and table | 280 | 670 | 770 | 270 | TransactionDate; TimelineStep; ValidationState | TT_BlockchainIntegrity |  |
| Traceability Audit Panel | Matrix | 1080 | 670 | 810 | 270 | TraceabilityStage; DataIntegrityStatus; TransactionID | TT_BlockchainIntegrity | DT_BlockchainTransaction |

### AI Assistant

| Visual | Type | X | Y | W | H | Fields / Measures | Tooltip | Drill-through |
|---|---|---:|---:|---:|---:|---|---|---|
| Sidebar Navigation | Grouped shapes, SVG icons, page buttons | 0 | 0 | 260 | 1080 | Navigation buttons and active page indicator |  |  |
| Header System Bar | Grouped shapes and cards | 280 | 24 | 1610 | 86 | Page title, current date label, Live System Signals, KPI Status Label |  |  |
| Assistant Chat Surface | Static chat composition | 280 | 130 | 880 | 810 | FarmerQuestion; RecommendationText; AssistantAvailability |  | DT_CropAnalytics |
| Suggested Questions | Button/chip group | 1190 | 130 | 700 | 170 | InteractionType |  |  |
| Guidance Cards | Multi-row cards | 1190 | 330 | 700 | 300 | Crop Advice; Disease Explanation; Irrigation Guidance; Fertilizer Guidance; Market Guidance |  |  |
| Image Diagnosis Summary | Card/table | 1190 | 660 | 700 | 280 | ImageDiagnosisResult; RecommendedTreatment; PreventiveAction | TT_CropHealth | DT_CropScan |

### Sustainability & Energy

| Visual | Type | X | Y | W | H | Fields / Measures | Tooltip | Drill-through |
|---|---|---:|---:|---:|---:|---|---|---|
| Sidebar Navigation | Grouped shapes, SVG icons, page buttons | 0 | 0 | 260 | 1080 | Navigation buttons and active page indicator |  |  |
| Header System Bar | Grouped shapes and cards | 280 | 24 | 1610 | 86 | Page title, current date label, Live System Signals, KPI Status Label |  |  |
| Energy KPI Row | Card row | 280 | 130 | 1610 | 140 | Energy Status; Renewable Energy Usage; Carbon Reduction; Energy Consumption | TT_Energy |  |
| Energy Trend | Area chart | 280 | 300 | 850 | 360 | Date[Date]; Renewable Energy Usage; Energy Consumption | TT_Energy |  |
| Charging Status Matrix | Matrix | 1160 | 300 | 730 | 360 | FarmName; RobotChargingStatus; DroneChargingStatus; BatteryLevelPct | TT_Energy |  |
| Carbon Reduction Panel | Bar chart and cards | 280 | 690 | 1610 | 250 | FarmName; Carbon Reduction; OffGridOperationStatus | TT_Energy | DT_FarmProfile |

### Alerts & Reports

| Visual | Type | X | Y | W | H | Fields / Measures | Tooltip | Drill-through |
|---|---|---:|---:|---:|---:|---|---|---|
| Sidebar Navigation | Grouped shapes, SVG icons, page buttons | 0 | 0 | 260 | 1080 | Navigation buttons and active page indicator |  |  |
| Header System Bar | Grouped shapes and cards | 280 | 24 | 1610 | 86 | Page title, current date label, Live System Signals, KPI Status Label |  |  |
| Alert Command Center | Matrix | 280 | 130 | 760 | 390 | AlertType; PriorityLevel; ResolutionStatus; RecommendedAction | TT_AlertSeverity | DT_AlertDetail |
| Priority Breakdown | Stacked column chart | 1070 | 130 | 820 | 390 | PriorityLevel; AlertType; Open Alerts | TT_AlertSeverity |  |
| Recommended Actions Feed | Table | 280 | 550 | 760 | 390 | AlertMessage; RecommendedAction; ResolutionStatus | TT_AlertSeverity | DT_AlertDetail |
| Report Catalog | Table/buttons | 1070 | 550 | 820 | 390 | ReportName; GeneratedDate; ExportFormat; DecisionSupportSummary |  |  |

## Tooltip Pages

| Tooltip Page | Size | Primary Measure | Attach To |
|---|---|---|---|
| `TT_CropHealth` | 320x240 | Crop Health Score | Crop health cards and scan visuals |
| `TT_WaterEfficiency` | 320x240 | Water Efficiency | Moisture and irrigation visuals |
| `TT_Energy` | 320x240 | Energy Status | Energy and charging visuals |
| `TT_IoTUptime` | 320x240 | Sensor Uptime | Sensor, gateway, and packet visuals |
| `TT_RobotStatus` | 320x240 | Robot Battery | Robot mission visuals |
| `TT_DroneCoverage` | 320x240 | Drone Flight Coverage | Drone mission visuals |
| `TT_BlockchainIntegrity` | 320x240 | Blockchain Integrity | Blockchain block and transaction visuals |
| `TT_MarketRisk` | 320x240 | Market Risk Score | Market impact and risk visuals |
| `TT_Profitability` | 320x240 | Profitability Signal | Price and recommendation visuals |
| `TT_AlertSeverity` | 320x240 | Critical Alerts | Alert matrix and priority visuals |

## Drill-Through Pages

| Drill Page | Drill Field | Main Content |
|---|---|---|
| `DT_FarmProfile` | `Farms[FarmID]` | Farm details, map, crop mix, sensors, energy |
| `DT_CropAnalytics` | `Crops[CropID]` | Crop health, soil trends, scans, market view |
| `DT_SensorDetail` | `Sensors[SensorID]` | Reading history, packet rate, communication health |
| `DT_RobotMission` | `RobotMissions[RobotMissionID]` | Battery, route, scanning progress, obstacles |
| `DT_DroneMission` | `DroneMissions[DroneMissionID]` | Coverage, NDVI, thermal zones, capture state |
| `DT_CropScan` | `CropHealthScans[ScanID]` | Diagnosis result, treatment, preventive action |
| `DT_PriceCommodity` | `PricePredictions[CropName]` | Current price, 60-day prediction, impacts |
| `DT_BlockchainTransaction` | `BlockchainTransactions[TransactionID]` | Block detail, hash previews, validation timeline |
| `DT_AlertDetail` | `Alerts[AlertID]` | Alert priority, action, status, related farm |

## Executive Mode

Create two bookmarks:

- `Executive Mode On`: hide dense tables/slicers, show large KPI cards and narrative status panels.
- `Executive Mode Off`: show full operational dashboard controls.

Add a header button named `Executive Mode` and wire it to the bookmark.

## Export Rules

- Use Fit to Page.
- Keep text inside safe margins.
- Use dark background on every page.
- Export after checking all main pages, tooltip pages, and drill-through pages.
