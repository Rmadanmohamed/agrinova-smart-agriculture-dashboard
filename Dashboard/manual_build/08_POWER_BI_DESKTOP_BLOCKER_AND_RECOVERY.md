# AgriNova Power BI Desktop Blocker And Recovery Path

## What is complete
- The original `AgriNova_Final.pbix` was restored after a safe backup.
- The PBIR report project was upgraded with query-bound overlay visuals for all 10 main pages.
- The report project includes transparent/semi-transparent visuals, native cross-filter settings, enhanced tooltip settings, drill-through targets, and transparent sidebar navigation hotspots.
- Premium page background PNGs are registered in the report project resources.
- JSON validation passed across the report definition.

## Blocked Desktop step
Power BI Desktop still opens `AgriNova.pbip` as `Untitled` when launched through Windows/Invoke-Item from automation. A direct legacy PBIX layout injection was also rejected by Desktop load validation, so the PBIX was restored to avoid leaving a damaged file.

## Manual Power BI route with zero guessing
1. Open Power BI Desktop manually.
2. Use File > Open > Browse this device.
3. Select `D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard\powerbi\AgriNova\AgriNova.pbip`.
4. If Power BI shows a PBIR/project warning, choose to open/upgrade the project.
5. Refresh the semantic model.
6. Review the 10 main report pages. If any visual is auto-fixed by Desktop, use `manual_build\07_INTERACTIVE_VISUAL_OVERLAY_MATRIX.csv` as the exact placement and field map.
7. Save As `AgriNova_Final.pbix` from Power BI Desktop.
8. Export to PDF using current values and 16:9 page size.

## If PBIP still opens as Untitled manually
Use the existing `AgriNova_Final.pbix`, keep the premium backgrounds, and recreate visuals from `manual_build\07_INTERACTIVE_VISUAL_OVERLAY_MATRIX.csv`. Each row gives the exact page, visual type, x/y/width/height, fields, tooltip page, and drill-through target.
