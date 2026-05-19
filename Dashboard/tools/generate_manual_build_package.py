from __future__ import annotations

import csv
import json
import math
import shutil
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "manual_build"
MOCKUPS = OUT / "mockups"


MAIN_PAGES = [
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

APPROVED_PRICE_CROPS = [
    "Tomatoes",
    "Bell Pepper",
    "Onion",
    "Cucumber",
    "Potato",
    "Orange",
    "Mandarin",
    "Apple",
    "Banana",
    "Mango",
    "Grapes",
    "Strawberry",
    "Lemon",
    "Pomegranate",
]


def ensure_dirs() -> None:
    OUT.mkdir(exist_ok=True)
    MOCKUPS.mkdir(exist_ok=True)
    (OUT / "copy_paste").mkdir(exist_ok=True)


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def write(path: Path, text: str) -> None:
    path.write_text(text.strip() + "\n", encoding="utf-8")


def copy_core_files() -> None:
    shutil.copy2(ROOT / "dax" / "agrinova_measures.dax", OUT / "copy_paste" / "02_DAX_COPY_PASTE.dax")
    shutil.copy2(ROOT / "theme" / "agrinova_theme.json", OUT / "copy_paste" / "03_THEME_AGRINOVA.json")
    shutil.copy2(ROOT / "docs" / "relationship_map.csv", OUT / "copy_paste" / "relationships.csv")
    shutil.copy2(ROOT / "docs" / "page_blueprint.csv", OUT / "copy_paste" / "page_blueprint.csv")
    shutil.copy2(ROOT / "docs" / "tooltip_map.csv", OUT / "copy_paste" / "tooltip_map.csv")
    shutil.copy2(ROOT / "docs" / "drillthrough_map.csv", OUT / "copy_paste" / "drillthrough_map.csv")
    shutil.copy2(ROOT / "docs" / "navigation_map.csv", OUT / "copy_paste" / "navigation_map.csv")


def data_counts_table() -> str:
    rows = []
    for csv_file in sorted((ROOT / "data").glob("*.csv")):
        with csv_file.open(encoding="utf-8") as handle:
            count = sum(1 for _ in handle) - 1
        rows.append(f"| `{csv_file.name}` | `{count}` |")
    return "\n".join(["| File | Rows |", "|---|---:|", *rows])


def write_master_import_guide() -> None:
    guide = f"""
# 00 Master Power BI Import Guide

This is the reliable manual-build path for **AgriNova - AI Smart Agriculture Platform**. Use it when `.pbip` / `.pbir` launch opens a blank Untitled report.

## Source Folder

`{ROOT}`

## Build Order

1. Open Power BI Desktop and create a blank report named **AgriNova**.
2. Import every CSV from `data/`.
3. Set data types and mark the Date table.
4. Create relationships using `manual_build/copy_paste/relationships.csv`.
5. Import the custom theme from `manual_build/copy_paste/03_THEME_AGRINOVA.json`.
6. Create a `Measures` table and paste DAX from `manual_build/copy_paste/02_DAX_COPY_PASTE.dax`.
7. Insert SVG assets from `assets/`.
8. Build pages using `manual_build/04_PAGE_VISUAL_PLACEMENT_GUIDE.md` and mockups in `manual_build/mockups/`.
9. Create tooltips and drill-through pages using the maps in `manual_build/copy_paste/`.
10. Build navigation and Executive Mode bookmarks.
11. Export to PDF.

## CSV Files

{data_counts_table()}

## Import Steps

1. Select **Home > Get data > Text/CSV**.
2. Choose one CSV from `{ROOT / "data"}`.
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

{", ".join(APPROVED_PRICE_CROPS)}
"""
    write(OUT / "00_MASTER_POWER_BI_IMPORT_GUIDE.md", guide)


def write_relationships_guide() -> None:
    rows = read_csv(ROOT / "docs" / "relationship_map.csv")
    table = ["| Dimension Table | Column | Fact Table | Column | Filter |", "|---|---|---|---|---|"]
    for row in rows:
        table.append(
            f"| `{row['FromTable']}` | `{row['FromColumn']}` | `{row['ToTable']}` | `{row['ToColumn']}` | Single direction |"
        )
    guide = f"""
# 01 Relationships Guide

Create relationships in **Model view > Manage relationships > New**.

Use dimension-to-fact, single-direction filtering.

{chr(10).join(table)}

## Relationship Pattern

- `Farms` filters operational fact tables.
- `Crops` filters crop readings, crop scans, and AI recommendations.
- `Sensors` filters soil readings.
- `Date` filters all dated fact tables.

## Relationship Checklist

- Do not create bidirectional filters unless Power BI warns that a visual requires it.
- Keep ID columns as Text.
- Confirm `Date[Date]` is marked as the official date table.
"""
    write(OUT / "01_RELATIONSHIPS_GUIDE.md", guide)


def write_visual_guide() -> None:
    blueprints = read_csv(ROOT / "docs" / "page_blueprint.csv")
    nav = read_csv(ROOT / "docs" / "navigation_map.csv")
    tooltips = read_csv(ROOT / "docs" / "tooltip_map.csv")
    drills = read_csv(ROOT / "docs" / "drillthrough_map.csv")

    chunks = [
        "# 04 Page-By-Page Visual Placement Guide",
        "",
        "Canvas: **16:9 widescreen**. Use the mockups in `manual_build/mockups/` as the visual reference.",
        "",
        "Power BI coordinates in this package use a 1920 x 1080 design grid. If your Desktop canvas uses the standard 16:9 layout, preserve relative placement and spacing.",
        "",
        "## Global Shell",
        "",
        "- Sidebar: x=0, y=0, w=260, h=1080.",
        "- Header: x=280, y=24, w=1610, h=86.",
        "- Use `assets/logo/agrinova_logo.svg` at the top of the sidebar.",
        "- Use icons from `assets/icons/` for navigation and section headers.",
        "- Use `assets/backgrounds/executive_glow.svg` as the common background.",
        "- Use `assets/backgrounds/blockchain_network.svg` on the Blockchain page.",
        "",
        "## Navigation Map",
        "",
        "| Order | Button | Target Page | Icon |",
        "|---:|---|---|---|",
    ]
    for row in nav:
        chunks.append(f"| {row['Order']} | {row['ButtonLabel']} | {row['TargetPage']} | `{row['IconFile']}` |")

    chunks.extend(["", "## Main Pages", ""])
    for page in MAIN_PAGES:
        chunks.extend([f"### {page}", "", "| Visual | Type | X | Y | W | H | Fields / Measures | Tooltip | Drill-through |", "|---|---|---:|---:|---:|---:|---|---|---|"])
        for row in [r for r in blueprints if r["Page"] == page]:
            chunks.append(
                f"| {row['VisualName']} | {row['VisualType']} | {row['X']} | {row['Y']} | {row['Width']} | {row['Height']} | {row['FieldsOrMeasures']} | {row['TooltipPage']} | {row['DrillThroughTarget']} |"
            )
        chunks.append("")

    chunks.extend(["## Tooltip Pages", "", "| Tooltip Page | Size | Primary Measure | Attach To |", "|---|---|---|---|"])
    for row in tooltips:
        chunks.append(f"| `{row['TooltipPage']}` | {row['Size']} | {row['PrimaryMeasure']} | {row['AttachTo']} |")

    chunks.extend(["", "## Drill-Through Pages", "", "| Drill Page | Drill Field | Main Content |", "|---|---|---|"])
    for row in drills:
        chunks.append(f"| `{row['DrillThroughPage']}` | `{row['DrillField']}` | {row['MainContent']} |")

    chunks.extend(
        [
            "",
            "## Executive Mode",
            "",
            "Create two bookmarks:",
            "",
            "- `Executive Mode On`: hide dense tables/slicers, show large KPI cards and narrative status panels.",
            "- `Executive Mode Off`: show full operational dashboard controls.",
            "",
            "Add a header button named `Executive Mode` and wire it to the bookmark.",
            "",
            "## Export Rules",
            "",
            "- Use Fit to Page.",
            "- Keep text inside safe margins.",
            "- Use dark background on every page.",
            "- Export after checking all main pages, tooltip pages, and drill-through pages.",
        ]
    )
    write(OUT / "04_PAGE_VISUAL_PLACEMENT_GUIDE.md", "\n".join(chunks))


def write_theme_guide() -> None:
    guide = f"""
# 03 Theme And Asset Guide

## Theme File

Use:

`{OUT / "copy_paste" / "03_THEME_AGRINOVA.json"}`

Power BI path:

1. **View > Browse for themes**
2. Select the JSON file above.

## Asset Folders

- Logo: `{ROOT / "assets" / "logo"}`
- Icons: `{ROOT / "assets" / "icons"}`
- Backgrounds: `{ROOT / "assets" / "backgrounds"}`

## Visual Style Rules

- Dark navy canvas.
- Glass-style cards with subtle transparency.
- Neon green for positive/action states.
- Cyan for live intelligence, blockchain, and IoT signals.
- Amber for watch states.
- Red for critical alerts.
- Card radius: 8 px.
- Avoid default white Power BI backgrounds.
"""
    write(OUT / "03_THEME_AND_ASSET_GUIDE.md", guide)


def write_dax_guide() -> None:
    guide = f"""
# 02 DAX Copy-Paste Guide

Use:

`{OUT / "copy_paste" / "02_DAX_COPY_PASTE.dax"}`

## Steps

1. In Power BI Desktop, choose **Home > Enter data**.
2. Create a one-column table named `Measures` with one row: `AgriNova`.
3. Hide the placeholder column if desired.
4. Go to **Modeling > New measure**.
5. Paste each measure from the DAX file.

## Formatting

- Price measures: Currency or decimal number.
- Percent-style measures: Percentage or decimal percent, depending on visual.
- Scores and health indexes: Decimal number with one decimal place.
"""
    write(OUT / "02_DAX_COPY_PASTE_GUIDE.md", guide)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except Exception:
            pass
    return ImageFont.load_default()


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill: tuple[int, int, int], outline: tuple[int, int, int], radius: int = 14, width: int = 2) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_gradient_bg(img: Image.Image, blockchain: bool = False) -> None:
    px = img.load()
    width, height = img.size
    for y in range(height):
        for x in range(width):
            base = (2, 11, 24)
            gx = int(18 * math.exp(-((x - 300) ** 2 + (y - 120) ** 2) / 240000))
            cy = int(24 * math.exp(-((x - 1500) ** 2 + (y - 220) ** 2) / 300000))
            green = int(28 * math.exp(-((x - 520) ** 2 + (y - 950) ** 2) / 260000))
            if blockchain:
                cy += int(24 * math.exp(-((x - 900) ** 2 + (y - 420) ** 2) / 320000))
            px[x, y] = (min(30, base[0] + gx), min(45, base[1] + green), min(72, base[2] + cy))


def draw_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int, fill=(230, 246, 255), bold: bool = False, max_width: int | None = None) -> None:
    f = font(size, bold)
    if max_width:
        words = text.split()
        lines = []
        line = ""
        for word in words:
            test = f"{line} {word}".strip()
            if draw.textbbox((0, 0), test, font=f)[2] <= max_width:
                line = test
            else:
                if line:
                    lines.append(line)
                line = word
        if line:
            lines.append(line)
        for offset, line_text in enumerate(lines[:3]):
            draw.text((xy[0], xy[1] + offset * int(size * 1.25)), line_text, font=f, fill=fill)
    else:
        draw.text(xy, text, font=f, fill=fill)


def draw_sidebar(draw: ImageDraw.ImageDraw, active_page: str) -> None:
    rounded(draw, (18, 22, 250, 1058), (4, 17, 31), (26, 70, 98), radius=18)
    draw_text(draw, (48, 42), "AgriNova", 34, (244, 251, 255), True)
    draw_text(draw, (51, 82), "AI Smart Agriculture Platform", 15, (158, 182, 201))
    labels = ["Overview", "Farm Monitoring", "Crop Health", "Robots & Drones", "IoT Network", "Price Prediction", "Blockchain", "AI Assistant", "Sustainability", "Alerts & Reports"]
    y = 145
    for label in labels:
        is_active = label in active_page or (label == "Overview" and active_page == "AgriNova Overview") or (label == "Robots & Drones" and active_page == "Robotics & Drone Operations")
        if is_active:
            rounded(draw, (34, y - 9, 234, y + 37), (7, 66, 45), (33, 154, 93), radius=10)
            draw.rounded_rectangle((36, y - 4, 42, y + 31), radius=4, fill=(61, 242, 122))
        draw.ellipse((56, y + 1, 72, y + 17), fill=(61, 242, 122) if is_active else (0, 212, 255))
        draw_text(draw, (88, y - 2), label, 18, (232, 248, 255) if is_active else (170, 195, 211), True if is_active else False)
        y += 67
    rounded(draw, (36, 900, 232, 1015), (7, 24, 37), (26, 70, 98), radius=16)
    draw_text(draw, (62, 925), "Executive Mode", 18, (61, 242, 122), True)
    draw_text(draw, (62, 956), "Defense-ready", 16, (158, 182, 201))
    draw_text(draw, (62, 982), "full screen", 16, (158, 182, 201))


def draw_header(draw: ImageDraw.ImageDraw, page: str) -> None:
    rounded(draw, (280, 22, 1890, 108), (7, 21, 36), (28, 70, 100), radius=18)
    draw_text(draw, (310, 43), page, 30, (244, 251, 255), True)
    draw_text(draw, (313, 78), "AgriNova - AI Smart Agriculture Platform", 16, (158, 182, 201))
    for i, label in enumerate(["LIVE", "SECURE", "AI READY"]):
        x = 1450 + i * 135
        rounded(draw, (x, 47, x + 112, 82), (6, 41, 46), (32, 156, 150), radius=18)
        draw.ellipse((x + 14, 58, x + 26, 70), fill=(61, 242, 122))
        draw_text(draw, (x + 36, 55), label, 14, (221, 248, 255), True)


def draw_card(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], title: str, value: str = "", accent=(61, 242, 122), kind: str = "card") -> None:
    rounded(draw, box, (8, 23, 39), (28, 70, 100), radius=14)
    x1, y1, x2, y2 = box
    draw.line((x1 + 18, y1 + 1, x2 - 18, y1 + 1), fill=accent, width=2)
    draw_text(draw, (x1 + 20, y1 + 18), title, 17, (158, 182, 201), True, max_width=x2 - x1 - 40)
    if value:
        draw_text(draw, (x1 + 20, y1 + 52), value, 30 if kind == "card" else 22, accent, True, max_width=x2 - x1 - 40)


def draw_page_mockup(page: str, rows: list[dict[str, str]]) -> None:
    img = Image.new("RGB", (1920, 1080), "#020B18")
    draw_gradient_bg(img, page == "Blockchain Security")
    draw = ImageDraw.Draw(img, "RGBA")

    # subtle grid
    for x in range(280, 1920, 80):
        draw.line((x, 120, x, 1080), fill=(0, 212, 255, 16), width=1)
    for y in range(140, 1080, 80):
        draw.line((260, y, 1920, y), fill=(0, 212, 255, 14), width=1)

    draw_sidebar(draw, page)
    draw_header(draw, page)

    colors = [(61, 242, 122), (0, 212, 255), (101, 167, 255), (248, 199, 65), (255, 93, 93), (139, 92, 246)]
    for index, row in enumerate(rows):
        x = int(float(row["X"]))
        y = int(float(row["Y"]))
        w = int(float(row["Width"]))
        h = int(float(row["Height"]))
        title = row["VisualName"]
        accent = colors[index % len(colors)]
        if "Sidebar" in title or "Header" in title:
            continue
        draw_card(draw, (x, y, x + w, y + h), title, "", accent)
        draw_text(draw, (x + 20, y + 54), row["VisualType"], 18, accent, True, max_width=w - 40)
        wrapped = row["FieldsOrMeasures"].replace(";", " | ")
        draw_text(draw, (x + 20, y + 88), wrapped, 15, (178, 205, 221), max_width=w - 40)
        if "KPI" in title or "Gauge" in row["VisualType"] or row["VisualType"] == "Card row":
            draw_text(draw, (x + 22, y + h - 58), "88.4", 34, accent, True)
        elif "chart" in row["VisualType"].lower() or "area" in row["VisualType"].lower():
            pts = []
            for i in range(8):
                px = x + 35 + i * max(1, (w - 80) // 7)
                py = y + h - 45 - int((math.sin(i * 0.8) + 1) * (h - 130) / 3)
                pts.append((px, py))
            if len(pts) > 1:
                draw.line(pts, fill=accent, width=4)
                for pt in pts:
                    draw.ellipse((pt[0] - 4, pt[1] - 4, pt[0] + 4, pt[1] + 4), fill=accent)
        elif "Matrix" in row["VisualType"] or "Table" in row["VisualType"]:
            for r in range(4):
                yy = y + 120 + r * 34
                if yy < y + h - 20:
                    draw.line((x + 20, yy, x + w - 20, yy), fill=(28, 70, 100, 180), width=1)

    out_name = f"{MAIN_PAGES.index(page)+1:02d}_{page.replace('&', 'and').replace(' ', '_')}.png"
    img.save(MOCKUPS / out_name)


def write_mockups_index() -> None:
    lines = ["# Mockups Index", "", "Use these PNGs as visual placement references while rebuilding the report in Power BI Desktop.", ""]
    for path in sorted(MOCKUPS.glob("*.png")):
        lines.append(f"- [{path.name}](mockups/{path.name})")
    write(OUT / "05_MOCKUPS_INDEX.md", "\n".join(lines))


def generate_mockups() -> None:
    blueprints = read_csv(ROOT / "docs" / "page_blueprint.csv")
    for page in MAIN_PAGES:
        draw_page_mockup(page, [row for row in blueprints if row["Page"] == page])
    write_mockups_index()


def write_readme() -> None:
    readme = """
# AgriNova Manual Power BI Build Package

This folder is the reliable manual-build package for constructing the AgriNova dashboard in Power BI Desktop without relying on `.pbip` launch behavior.

Start here:

1. `00_MASTER_POWER_BI_IMPORT_GUIDE.md`
2. `01_RELATIONSHIPS_GUIDE.md`
3. `02_DAX_COPY_PASTE_GUIDE.md`
4. `03_THEME_AND_ASSET_GUIDE.md`
5. `04_PAGE_VISUAL_PLACEMENT_GUIDE.md`
6. `05_MOCKUPS_INDEX.md`

Copy-paste files are in `copy_paste/`.
PNG page mockups are in `mockups/`.
"""
    write(OUT / "README.md", readme)


def main() -> None:
    ensure_dirs()
    copy_core_files()
    write_master_import_guide()
    write_relationships_guide()
    write_dax_guide()
    write_theme_guide()
    write_visual_guide()
    generate_mockups()
    write_readme()
    print(f"Manual build package generated at {OUT}")


if __name__ == "__main__":
    main()
