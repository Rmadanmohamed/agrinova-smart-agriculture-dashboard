# Power BI Desktop Build Steps

## 1. Import Data

1. Open Power BI Desktop.
2. Select Get Data > Text/CSV.
3. Import every CSV from `data/`.
4. Set data types:
   - Date columns as Date.
   - LastSignalTime columns as Date/Time.
   - Latitude/Longitude as Decimal Number.
   - Percent and score columns as Decimal Number.
5. Mark `Date` as the date table using `Date[Date]`.

## 2. Create Relationships

Create these one-to-many relationships:

- `Farms[FarmID]` to all fact tables with `FarmID`.
- `Crops[CropID]` to `SoilReadings[CropID]`, `CropHealthScans[CropID]`, and `AIRecommendations[CropID]`.
- `Sensors[SensorID]` to `SoilReadings[SensorID]`.
- `Date[Date]` to each fact date column.

Use single-direction filtering from dimensions to facts.

## 3. Apply Theme

1. Go to View > Browse for themes.
2. Import `theme/agrinova_theme.json`.
3. Set page background to `#020B18` if Power BI does not apply it automatically.

## 4. Add Measures

1. Create a table named `AgriNova_Measures`.
2. Copy measures from `dax/agrinova_measures.dax`.
3. Format percentage measures as percentage or decimal percent based on the visual.

## 5. Add Assets

1. Insert `assets/logo/agrinova_logo.svg` in the sidebar.
2. Insert icons from `assets/icons/` next to each navigation item and page section.
3. Insert `assets/backgrounds/executive_glow.svg` as full-page background.
4. Insert `assets/backgrounds/blockchain_network.svg` on the Blockchain Security page.

## 6. Build Pages

Follow `docs/report_layout.md` exactly. Start with the sidebar and header, group them, then duplicate the page shell for all pages. Build dense default pages first, then create Executive Mode bookmarks that hide detail visuals and reveal presentation cards.

## 7. Configure Navigation

1. Use Button > Navigator > Page navigator or individual blank buttons.
2. Assign page navigation actions.
3. For each page, show the matching active indicator in the sidebar.
4. Add a bookmark-backed Executive Mode toggle in the header.

## 8. Configure Tooltips And Drill-through

1. Create the tooltip pages listed in `docs/report_layout.md`.
2. Set Page information > Tooltip = On.
3. Assign the tooltip page to its related visual.
4. Create the hidden drill-through pages and set their drill-through fields.
5. Add a back button to each drill-through page.

## 9. Export

1. Switch to Executive Mode for the defense-ready PDF.
2. Check each page at Fit to Page.
3. Export to PDF from Power BI Desktop.
4. Review the generated PDF for clipped text and sidebar consistency.
