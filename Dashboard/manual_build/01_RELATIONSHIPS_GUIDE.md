# 01 Relationships Guide

Create relationships in **Model view > Manage relationships > New**.

Use dimension-to-fact, single-direction filtering.

| Dimension Table | Column | Fact Table | Column | Filter |
|---|---|---|---|---|
| `Farms` | `FarmID` | `Crops` | `FarmID` | Single direction |
| `Farms` | `FarmID` | `Sensors` | `FarmID` | Single direction |
| `Farms` | `FarmID` | `SoilReadings` | `FarmID` | Single direction |
| `Farms` | `FarmID` | `WeatherReadings` | `FarmID` | Single direction |
| `Farms` | `FarmID` | `RobotMissions` | `FarmID` | Single direction |
| `Farms` | `FarmID` | `DroneMissions` | `FarmID` | Single direction |
| `Farms` | `FarmID` | `CropHealthScans` | `FarmID` | Single direction |
| `Farms` | `FarmID` | `BlockchainTransactions` | `FarmID` | Single direction |
| `Farms` | `FarmID` | `AIRecommendations` | `FarmID` | Single direction |
| `Farms` | `FarmID` | `Alerts` | `FarmID` | Single direction |
| `Farms` | `FarmID` | `EnergyUsage` | `FarmID` | Single direction |
| `Crops` | `CropID` | `SoilReadings` | `CropID` | Single direction |
| `Crops` | `CropID` | `CropHealthScans` | `CropID` | Single direction |
| `Crops` | `CropID` | `AIRecommendations` | `CropID` | Single direction |
| `Sensors` | `SensorID` | `SoilReadings` | `SensorID` | Single direction |
| `Date` | `Date` | `SoilReadings` | `Date` | Single direction |
| `Date` | `Date` | `WeatherReadings` | `Date` | Single direction |
| `Date` | `Date` | `EnergyUsage` | `Date` | Single direction |
| `Date` | `Date` | `PricePredictions` | `Date` | Single direction |
| `Date` | `Date` | `CropHealthScans` | `ScanDate` | Single direction |
| `Date` | `Date` | `RobotMissions` | `MissionDate` | Single direction |
| `Date` | `Date` | `DroneMissions` | `MissionDate` | Single direction |
| `Date` | `Date` | `BlockchainTransactions` | `TransactionDate` | Single direction |
| `Date` | `Date` | `AIRecommendations` | `RecommendationDate` | Single direction |
| `Date` | `Date` | `Alerts` | `AlertDate` | Single direction |
| `Date` | `Date` | `Reports` | `GeneratedDate` | Single direction |

## Relationship Pattern

- `Farms` filters operational fact tables.
- `Crops` filters crop readings, crop scans, and AI recommendations.
- `Sensors` filters soil readings.
- `Date` filters all dated fact tables.

## Relationship Checklist

- Do not create bidirectional filters unless Power BI warns that a visual requires it.
- Keep ID columns as Text.
- Confirm `Date[Date]` is marked as the official date table.
