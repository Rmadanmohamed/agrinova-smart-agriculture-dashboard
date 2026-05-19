# 00 Master Power BI Import Guide

This is the reliable manual-build path for **AgriNova - AI Smart Agriculture Platform**. Use it when `.pbip` / `.pbir` launch opens a blank Untitled report.

## Source Folder

`D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard`

## Build Order

1. Open Power BI Desktop and create a blank report named **AgriNova**.
2. Import every CSV from `data/`.
3. Set data types and mark the Date table.
4. Create relationships using `manual_build/copy_paste/relationships.csv`.
5. Import the custom theme from `manual_build/copy_paste/03_THEME_AGRINOVA.json`.
6. Create a `AgriNova_Measures` table and paste DAX from `manual_build/copy_paste/02_DAX_COPY_PASTE.dax`.
7. Insert SVG assets from `assets/`.
8. Build pages using `manual_build/04_PAGE_VISUAL_PLACEMENT_GUIDE.md` and mockups in `manual_build/mockups/`.
9. Create tooltips and drill-through pages using the maps in `manual_build/copy_paste/`.
10. Build navigation and Executive Mode bookmarks.
11. Export to PDF.

## CSV Files

| File | Rows |
|---|---:|
| `AIRecommendations.csv` | `72` |
| `Alerts.csv` | `85` |
| `BlockchainTransactions.csv` | `48` |
| `CropHealthScans.csv` | `252` |
| `Crops.csv` | `24` |
| `Date.csv` | `181` |
| `DroneMissions.csv` | `6` |
| `EnergyUsage.csv` | `270` |
| `Farms.csv` | `6` |
| `PricePredictions.csv` | `1694` |
| `Reports.csv` | `6` |
| `RobotMissions.csv` | `12` |
| `Sensors.csv` | `192` |
| `SoilReadings.csv` | `4320` |
| `WeatherReadings.csv` | `270` |

## Import Steps

1. Select **Home > Get data > Text/CSV**.
2. Choose one CSV from `D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard\data`.
3. Select **Load**.
4. Repeat until all CSVs are loaded.

## Required Data Types

- Any column named `Date`, ending with `Date`, or containing dates: **Date**.
- `LastSignalTime`: **Date/Time**.
- Latitude and longitude: **Decimal number**.
- Score, percent, price, NPK, packet, communication, battery, coverage, energy, and carbon fields: **Decimal number**.
- ID columns, labels, status fields, recommendations, and hash previews: **Text**.

## Date Table

1. Go to **Table tools**.
2. Select `Date`.
3. Choose **Mark as date table**.
4. Select `Date[Date]`.

## Public Privacy Rules

Do not expose internal AI identities, internal model performance, or development metrics. Use only public labels:

- AI Engine
- Smart Agriculture Intelligence
- Intelligent Prediction System
- Vision Intelligence Module
- AgriNova AI Assistant

## Price Module Crop Rule

The price module must contain only:

Tomatoes, Bell Pepper, Onion, Cucumber, Potato, Orange, Mandarin, Apple, Banana, Mango, Grapes, Strawberry, Lemon, Pomegranate
