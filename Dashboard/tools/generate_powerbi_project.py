from __future__ import annotations

import csv
import shutil
import json
import re
import uuid
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "powerbi" / "AgriNova"
SEMANTIC = PROJECT / "AgriNova.SemanticModel"
REPORT = PROJECT / "AgriNova.Report"
DEFINITION = REPORT / "definition"


def ensure_dirs() -> None:
    for path in [
        SEMANTIC,
        REPORT,
        REPORT / "StaticResources" / "RegisteredResources",
        DEFINITION / "pages",
        PROJECT / "assets",
    ]:
        path.mkdir(parents=True, exist_ok=True)


def read_csv_sample(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = []
        for index, row in enumerate(reader):
            if index < 80:
                rows.append(row)
            else:
                break
        return list(reader.fieldnames or []), rows


def is_int(value: str) -> bool:
    try:
        int(value)
        return True
    except Exception:
        return False


def is_float(value: str) -> bool:
    try:
        float(value)
        return True
    except Exception:
        return False


def column_type(column: str, rows: list[dict[str, str]]) -> tuple[str, str]:
    if column == "Time":
        return "string", "type text"
    if column.lower().endswith("date") or column == "Date":
        return "dateTime", "type date"
    if column == "LastSignalTime":
        return "dateTime", "type datetime"
    values = [row.get(column, "") for row in rows if row.get(column, "") != ""]
    if values and all(is_int(v) for v in values):
        return "int64", "Int64.Type"
    if values and all(is_float(v) for v in values):
        return "double", "type number"
    return "string", "type text"


def m_string(value: str) -> str:
    return value.replace('"', '""')


def make_partition_expression(table_name: str, csv_path: Path, columns: list[str], pq_types: dict[str, str]) -> list[str]:
    type_pairs = ", ".join(f'{{"{m_string(col)}", {pq_types[col]}}}' for col in columns)
    file_path = str(csv_path.resolve())
    return [
        "let",
        f'    Source = Csv.Document(File.Contents("{m_string(file_path)}"), [Delimiter=",", Columns={len(columns)}, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),',
        '    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),',
        f'    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers", {{{type_pairs}}}, "en-US")',
        "in",
        '    #"Changed Type"',
    ]


def parse_measures() -> list[dict[str, str]]:
    text = (ROOT / "dax" / "agrinova_measures.dax").read_text(encoding="utf-8")
    measures = []
    current_name = None
    current_lines: list[str] = []
    for raw_line in text.splitlines():
        line = raw_line.rstrip()
        if not line or line.lstrip().startswith("--"):
            continue
        match = re.match(r"^([A-Za-z][A-Za-z0-9 %]+?)\s*=\s*(.*)$", line)
        if match and not line.lstrip().startswith(("VAR ", "RETURN ", "SWITCH ", "CALCULATE ", "DIVIDE ")):
            if current_name:
                measures.append({"name": current_name, "expression": "\n".join(current_lines).strip()})
            current_name = match.group(1).strip()
            current_lines = [match.group(2).strip()] if match.group(2).strip() else []
        elif current_name:
            current_lines.append(line)
    if current_name:
        measures.append({"name": current_name, "expression": "\n".join(current_lines).strip()})
    return measures


def format_string_for_measure(name: str) -> str:
    if name.endswith("%") or "Change %" in name:
        return "0.0%;-0.0%;0.0%"
    if any(token in name for token in ["Price", "Energy Consumption", "Carbon"]):
        return "#,##0.00"
    if any(token in name for token in ["Score", "Efficiency", "Integrity", "Availability", "Uptime", "Coverage", "Battery", "Usage", "Status"]):
        return "0.0"
    return "#,##0"


def build_model() -> dict:
    data_dir = ROOT / "data"
    table_files = [
        "Farms",
        "Crops",
        "Sensors",
        "SoilReadings",
        "WeatherReadings",
        "RobotMissions",
        "DroneMissions",
        "CropHealthScans",
        "PricePredictions",
        "BlockchainTransactions",
        "AIRecommendations",
        "Alerts",
        "EnergyUsage",
        "Reports",
        "Date",
    ]

    tables = []
    table_columns: dict[str, set[str]] = {}
    for table_name in table_files:
        csv_path = data_dir / f"{table_name}.csv"
        columns, sample = read_csv_sample(csv_path)
        table_columns[table_name] = set(columns)
        pq_types: dict[str, str] = {}
        model_columns = []
        for column in columns:
            dtype, pq_type = column_type(column, sample)
            pq_types[column] = pq_type
            model_column = {
                "name": column,
                "dataType": dtype,
                "sourceColumn": column,
                "summarizeBy": "none" if dtype == "string" else "sum",
            }
            if column.endswith("ID") or column in {"FarmID", "CropID", "SensorID", "TransactionID", "AlertID"}:
                model_column["summarizeBy"] = "none"
            if dtype == "dateTime":
                model_column["formatString"] = "Short Date"
            elif dtype == "double":
                model_column["formatString"] = "0.00"
            elif dtype == "int64":
                model_column["formatString"] = "0"
            model_columns.append(model_column)

        tables.append(
            {
                "name": table_name,
                "lineageTag": str(uuid.uuid5(uuid.NAMESPACE_URL, f"agrinova/{table_name}")),
                "columns": model_columns,
                "partitions": [
                    {
                        "name": f"{table_name}-{uuid.uuid5(uuid.NAMESPACE_URL, f'agrinova/partition/{table_name}')}",
                        "mode": "import",
                        "source": {
                            "type": "m",
                            "expression": make_partition_expression(table_name, csv_path, columns, pq_types),
                        },
                    }
                ],
            }
        )

    measures = parse_measures()
    tables.append(
        {
            "name": "Measures",
            "lineageTag": str(uuid.uuid5(uuid.NAMESPACE_URL, "agrinova/Measures")),
            "columns": [
                {
                    "name": "MeasureAnchor",
                    "dataType": "string",
                    "sourceColumn": "MeasureAnchor",
                    "summarizeBy": "none",
                    "isHidden": True,
                }
            ],
            "measures": [
                {
                    "name": item["name"],
                    "expression": item["expression"],
                    "formatString": format_string_for_measure(item["name"]),
                    "lineageTag": str(uuid.uuid5(uuid.NAMESPACE_URL, f"agrinova/measure/{item['name']}")),
                }
                for item in measures
            ],
            "partitions": [
                {
                    "name": "Measures",
                    "mode": "import",
                    "source": {
                        "type": "m",
                        "expression": [
                            "let",
                            '    Source = #table(type table [MeasureAnchor = text], {{"AgriNova"}})',
                            "in",
                            "    Source",
                        ],
                    },
                }
            ],
        }
    )

    relationships_spec = [
        ("Farms", "FarmID", "Crops", "FarmID"),
        ("Farms", "FarmID", "Sensors", "FarmID"),
        ("Farms", "FarmID", "SoilReadings", "FarmID"),
        ("Farms", "FarmID", "WeatherReadings", "FarmID"),
        ("Farms", "FarmID", "RobotMissions", "FarmID"),
        ("Farms", "FarmID", "DroneMissions", "FarmID"),
        ("Farms", "FarmID", "CropHealthScans", "FarmID"),
        ("Farms", "FarmID", "BlockchainTransactions", "FarmID"),
        ("Farms", "FarmID", "AIRecommendations", "FarmID"),
        ("Farms", "FarmID", "Alerts", "FarmID"),
        ("Farms", "FarmID", "EnergyUsage", "FarmID"),
        ("Crops", "CropID", "SoilReadings", "CropID"),
        ("Crops", "CropID", "CropHealthScans", "CropID"),
        ("Crops", "CropID", "AIRecommendations", "CropID"),
        ("Sensors", "SensorID", "SoilReadings", "SensorID"),
        ("Date", "Date", "SoilReadings", "Date"),
        ("Date", "Date", "WeatherReadings", "Date"),
        ("Date", "Date", "EnergyUsage", "Date"),
        ("Date", "Date", "PricePredictions", "Date"),
        ("Date", "Date", "CropHealthScans", "ScanDate"),
        ("Date", "Date", "RobotMissions", "MissionDate"),
        ("Date", "Date", "DroneMissions", "MissionDate"),
        ("Date", "Date", "BlockchainTransactions", "TransactionDate"),
        ("Date", "Date", "AIRecommendations", "RecommendationDate"),
        ("Date", "Date", "Alerts", "AlertDate"),
        ("Date", "Date", "Reports", "GeneratedDate"),
    ]

    relationships = []
    for from_table, from_column, to_table, to_column in relationships_spec:
        if from_column in table_columns.get(from_table, set()) and to_column in table_columns.get(to_table, set()):
            relationships.append(
                {
                    "name": f"{from_table}_{from_column}_to_{to_table}_{to_column}",
                    "fromTable": to_table,
                    "fromColumn": to_column,
                    "toTable": from_table,
                    "toColumn": from_column,
                    "crossFilteringBehavior": "oneDirection",
                    "securityFilteringBehavior": "oneDirection",
                }
            )

    return {
        "compatibilityLevel": 1702,
        "model": {
            "culture": "en-US",
            "sourceQueryCulture": "en-US",
            "dataAccessOptions": {
                "legacyRedirects": True,
                "returnErrorValuesAsNull": True,
            },
            "defaultPowerBIDataSourceVersion": "powerBI_V3",
            "discourageImplicitMeasures": True,
            "annotations": [
                {"name": "__PBI_TimeIntelligenceEnabled", "value": "0"},
                {"name": "AgriNovaBuild", "value": "Enterprise smart agriculture Power BI project scaffold"},
            ],
            "tables": tables,
            "relationships": relationships,
            "roles": [],
            "cultures": [],
            "expressions": [],
            "perspectives": [],
        },
    }


def write_project_files() -> None:
    (PROJECT / "AgriNova.pbip").write_text(
        json.dumps(
            {
                "$schema": "https://developer.microsoft.com/json-schemas/fabric/pbip/pbipProperties/1.0.0/schema.json",
                "version": "1.0",
                "artifacts": [{"report": {"path": "AgriNova.Report"}}],
                "settings": {"enableAutoRecovery": True},
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    (PROJECT / ".gitignore").write_text("**/.pbi/localSettings.json\n**/.pbi/cache.abf\n", encoding="utf-8")
    (REPORT / "definition.pbir").write_text(
        json.dumps(
            {
                "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definitionProperties/2.0.0/schema.json",
                "version": "4.0",
                "datasetReference": {"byPath": {"path": "../AgriNova.SemanticModel"}},
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    write_report_definition()
    (SEMANTIC / "definition.pbism").write_text(
        json.dumps(
            {
                "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/semanticModel/definitionProperties/1.0.0/schema.json",
                "version": "5.0",
                "settings": {"qnaEnabled": False},
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    (SEMANTIC / "model.bim").write_text(json.dumps(build_model(), indent=2), encoding="utf-8")

    (REPORT / "README.md").write_text(
        """# AgriNova Report Folder

`definition.pbir` points to `../AgriNova.SemanticModel`. Open `AgriNova.pbip` or this `definition.pbir` in Power BI Desktop to load the model.

The visual build is specified in `../../docs/report_layout.md` and `../../docs/page_blueprint.csv`. The current environment cannot launch Power BI Desktop or Power BI Service, so visual placement must be completed after opening the project in Desktop.
""",
        encoding="utf-8",
    )

    (PROJECT / "README.md").write_text(
        """# AgriNova Power BI Project

This folder is a Power BI Project scaffold for **AgriNova**.

- Open `AgriNova.pbip` in Power BI Desktop.
- The semantic model loads the generated CSV files from the workspace `data/` folder.
- `AgriNova.SemanticModel/model.bim` contains tables, relationships, and DAX measures.
- `AgriNova.Report/definition.pbir` links the report to the semantic model.
- Use `../docs/report_layout.md`, `../docs/page_blueprint.csv`, `../docs/tooltip_map.csv`, and `../docs/drillthrough_map.csv` to complete the visual report pages.

Power BI Service and Power BI Desktop were unavailable in this environment, so this is the deepest directly executable Power BI artifact that can be generated locally.
""",
        encoding="utf-8",
    )


def slug(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9_]+", "_", value).strip("_")
    return cleaned[:44] or "Page"


def visual_type(raw_type: str) -> str:
    text = raw_type.lower()
    if "slicer" in text:
        return "slicer"
    if "matrix" in text or "heatmap" in text:
        return "pivotTable"
    if "table" in text or "feed" in text:
        return "tableEx"
    if "gauge" in text:
        return "gauge"
    if "map" in text:
        return "map"
    if "line" in text:
        return "lineChart"
    if "area" in text:
        return "areaChart"
    if "bar" in text:
        return "barChart"
    if "column" in text:
        return "columnChart"
    if "decomposition" in text:
        return "decompositionTree"
    if "button" in text or "navigation" in text:
        return "actionButton"
    if "image" in text:
        return "image"
    if "card" in text or "kpi" in text:
        return "card"
    return "textbox"


def color_expr(hex_color: str) -> dict:
    return {"solid": {"color": hex_color}}


def write_report_definition() -> None:
    if DEFINITION.exists():
        shutil.rmtree(DEFINITION)
    (DEFINITION / "pages").mkdir(parents=True, exist_ok=True)
    registered = REPORT / "StaticResources" / "RegisteredResources"
    registered.mkdir(parents=True, exist_ok=True)

    theme_src = ROOT / "theme" / "agrinova_theme.json"
    theme_dst = registered / "agrinova_theme.json"
    shutil.copy2(theme_src, theme_dst)

    for src in (ROOT / "assets").rglob("*.svg"):
        rel_name = "agrinova_" + "_".join(src.relative_to(ROOT / "assets").parts)
        shutil.copy2(src, registered / rel_name)

    report_json = {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/report/3.2.0/schema.json",
        "themeCollection": {
            "baseTheme": {
                "name": "CY24SU12",
                "reportVersionAtImport": {"visual": "2.1.0", "page": "2.1.0", "report": "3.2.0"},
                "type": "SharedResources",
            },
            "customTheme": {
                "name": "AgriNova Premium Dark Future",
                "reportVersionAtImport": {"visual": "2.1.0", "page": "2.1.0", "report": "3.2.0"},
                "type": "RegisteredResources",
            },
        },
        "resourcePackages": [
            {
                "name": "RegisteredResources",
                "type": "RegisteredResources",
                "items": [
                    {"name": "agrinova_theme", "path": "agrinova_theme.json", "type": "CustomTheme"}
                ],
            }
        ],
        "settings": {
            "hideVisualContainerHeader": True,
            "useEnhancedTooltips": True,
            "filterPaneHiddenInEditMode": True,
            "pagesPosition": "Bottom",
        },
        "annotations": [
            {"name": "AgriNova", "value": "AI Smart Agriculture Platform"},
            {"name": "Implementation", "value": "Generated PBIR report scaffold with pages, visual placeholders, tooltip pages, drill-through pages, and semantic model binding."},
        ],
    }
    (DEFINITION / "report.json").write_text(json.dumps(report_json, indent=2), encoding="utf-8")

    version_json = {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/version/1.0.0/schema.json",
        "version": "4.0",
    }
    (DEFINITION / "version.json").write_text(json.dumps(version_json, indent=2), encoding="utf-8")

    blueprint = []
    with (ROOT / "docs" / "page_blueprint.csv").open(encoding="utf-8", newline="") as handle:
        blueprint = list(csv.DictReader(handle))

    display_pages = [
        "AgriNova Overview",
        "Smart Farm Monitoring",
        "Crop Health & Vision Intelligence",
        "Robotics & Drone Operations",
        "IoT Sensor Network",
        "Price Prediction",
        "Blockchain Security",
        "AI Assistant",
        "Sustainability & Energy",
        "Alerts & Reports",
    ]
    tooltip_pages = []
    with (ROOT / "docs" / "tooltip_map.csv").open(encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            tooltip_pages.append(row["TooltipPage"])
    drill_pages = []
    with (ROOT / "docs" / "drillthrough_map.csv").open(encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            drill_pages.append(row["DrillThroughPage"])

    all_pages = display_pages + tooltip_pages + drill_pages
    page_names = {page: f"Page_{slug(page)}" for page in all_pages}

    pages_json = {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/pagesMetadata/1.0.0/schema.json",
        "pageOrder": [page_names[p] for p in all_pages],
        "activePageName": page_names["AgriNova Overview"],
    }
    (DEFINITION / "pages" / "pages.json").write_text(json.dumps(pages_json, indent=2), encoding="utf-8")

    def write_page(page_display: str, page_type: str | None = None) -> None:
        page_name = page_names[page_display]
        page_dir = DEFINITION / "pages" / page_name
        visuals_dir = page_dir / "visuals"
        visuals_dir.mkdir(parents=True, exist_ok=True)
        is_tooltip = page_type == "Tooltip"
        page = {
            "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/2.1.0/schema.json",
            "name": page_name,
            "displayName": page_display,
            "displayOption": "FitToPage",
            "height": 240 if is_tooltip else 1080,
            "width": 320 if is_tooltip else 1920,
            "objects": {
                "background": [
                    {
                        "properties": {
                            "color": color_expr("#020B18"),
                            "transparency": 0,
                        }
                    }
                ],
                "outspace": [
                    {
                        "properties": {
                            "color": color_expr("#020B18"),
                            "transparency": 0,
                        }
                    }
                ],
            },
            "annotations": [
                {"name": "AgriNovaPageRole", "value": page_type or "ReportPage"},
                {"name": "DesignStyle", "value": "Dark futuristic glassmorphism with neon green and cyan accents."},
            ],
        }
        if page_type:
            page["type"] = page_type
            page["visibility"] = "HiddenInViewMode"
            page["pageBinding"] = {
                "name": f"Binding_{slug(page_display)}",
                "type": page_type,
                "acceptsFilterContext": "Default",
            }
        (page_dir / "page.json").write_text(json.dumps(page, indent=2), encoding="utf-8")

    def write_visual(page_display: str, visual_display: str, raw_type: str, x: int, y: int, w: int, h: int, z: int, fields: str, tooltip: str = "", drill: str = "") -> None:
        page_dir = DEFINITION / "pages" / page_names[page_display]
        visual_name = f"Visual_{slug(visual_display)}_{z:02d}"
        visual_dir = page_dir / "visuals" / visual_name
        visual_dir.mkdir(parents=True, exist_ok=True)
        vtype = visual_type(raw_type)
        title_text = visual_display[:120]
        visual = {
            "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.1.0/schema.json",
            "name": visual_name,
            "position": {
                "x": x,
                "y": y,
                "z": z,
                "height": h,
                "width": w,
                "tabOrder": z,
            },
            "visual": {
                "visualType": vtype,
                "visualContainerObjects": {
                    "title": [
                        {
                            "properties": {
                                "show": True,
                                "text": title_text,
                                "fontColor": color_expr("#E7F6FF"),
                                "fontSize": 12,
                                "fontFamily": "Segoe UI Semibold",
                            }
                        }
                    ],
                    "background": [
                        {
                            "properties": {
                                "show": True,
                                "color": color_expr("#081727"),
                                "transparency": 10,
                            }
                        }
                    ],
                    "border": [
                        {
                            "properties": {
                                "show": True,
                                "color": color_expr("#1C4664"),
                                "radius": 8,
                            }
                        }
                    ],
                    "dropShadow": [
                        {
                            "properties": {
                                "show": True,
                                "color": color_expr("#003B4D"),
                                "transparency": 55,
                                "shadowBlur": 12,
                            }
                        }
                    ],
                },
            },
            "annotations": [
                {"name": "AgriNovaVisualIntent", "value": raw_type},
                {"name": "FieldsOrMeasures", "value": fields[:900]},
                {"name": "TooltipPage", "value": tooltip},
                {"name": "DrillThroughTarget", "value": drill},
            ],
        }
        (visual_dir / "visual.json").write_text(json.dumps(visual, indent=2), encoding="utf-8")

    for page_display in display_pages:
        write_page(page_display)
        rows = [row for row in blueprint if row["Page"] == page_display]
        for index, row in enumerate(rows, start=1):
            write_visual(
                page_display,
                row["VisualName"],
                row["VisualType"],
                int(float(row["X"])),
                int(float(row["Y"])),
                int(float(row["Width"])),
                int(float(row["Height"])),
                index,
                row["FieldsOrMeasures"],
                row.get("TooltipPage", ""),
                row.get("DrillThroughTarget", ""),
            )

    for tooltip in tooltip_pages:
        write_page(tooltip, "Tooltip")
        write_visual(tooltip, "Tooltip KPI Card", "Card", 16, 14, 288, 82, 1, "Primary KPI and live status")
        write_visual(tooltip, "Tooltip Context", "Table", 16, 106, 288, 118, 2, "Context details and recommendation")

    for drill in drill_pages:
        write_page(drill, "Drillthrough")
        write_visual(drill, "Back Navigation", "Button", 280, 24, 160, 48, 1, "Back button")
        write_visual(drill, "Drillthrough Header", "Card row", 460, 24, 1430, 86, 2, "Selected entity and key KPIs")
        write_visual(drill, "Detail Matrix", "Matrix", 280, 140, 780, 800, 3, "Entity detail rows and related metrics")
        write_visual(drill, "Trend And Evidence Panel", "Line chart", 1090, 140, 800, 800, 4, "Historical trend and audit evidence")

    report_extensions = {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/reportExtensions/1.0.0/schema.json",
        "entities": [],
    }
    (DEFINITION / "reportExtensions.json").write_text(json.dumps(report_extensions, indent=2), encoding="utf-8")


def main() -> None:
    ensure_dirs()
    write_project_files()
    print(f"Power BI project scaffold written to {PROJECT}")


if __name__ == "__main__":
    main()
