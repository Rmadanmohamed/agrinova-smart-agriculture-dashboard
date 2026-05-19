from __future__ import annotations

import csv
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "manual_build" / "mockups"
RNG = random.Random(9137)
W, H = 1920, 1080


PAGES = [
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

NAV = [
    ("Overview", "grid"),
    ("Farm Monitoring", "leaf"),
    ("Crop Health", "shield"),
    ("Robots & Drones", "bot"),
    ("IoT Network", "nodes"),
    ("Price Prediction", "trend"),
    ("Blockchain", "chain"),
    ("AI Assistant", "spark"),
    ("Sustainability", "bolt"),
    ("Alerts & Reports", "bell"),
]

GREEN = (61, 242, 122)
CYAN = (0, 212, 255)
BLUE = (84, 144, 255)
AMBER = (248, 199, 65)
RED = (255, 93, 93)
VIOLET = (139, 92, 246)
TEXT = (232, 246, 255)
MUTED = (142, 169, 190)
PANEL = (7, 20, 34)
BORDER = (34, 82, 112)


def rows(name: str) -> list[dict[str, str]]:
    with (ROOT / "data" / f"{name}.csv").open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


DATA = {
    "farms": rows("Farms"),
    "sensors": rows("Sensors"),
    "soil": rows("SoilReadings"),
    "robots": rows("RobotMissions"),
    "drones": rows("DroneMissions"),
    "scans": rows("CropHealthScans"),
    "prices": rows("PricePredictions"),
    "blocks": rows("BlockchainTransactions"),
    "ai": rows("AIRecommendations"),
    "alerts": rows("Alerts"),
    "energy": rows("EnergyUsage"),
}


def avg(items: list[dict[str, str]], key: str) -> float:
    vals = []
    for item in items:
        try:
            vals.append(float(item[key]))
        except Exception:
            pass
    return sum(vals) / len(vals) if vals else 0.0


def count_where(items: list[dict[str, str]], key: str, value: str) -> int:
    return sum(1 for item in items if item.get(key) == value)


def font(size: int, weight: str = "regular") -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = {
        "regular": ["C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf"],
        "semibold": ["C:/Windows/Fonts/seguisb.ttf", "C:/Windows/Fonts/arialbd.ttf"],
        "bold": ["C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf"],
        "mono": ["C:/Windows/Fonts/consola.ttf", "C:/Windows/Fonts/cour.ttf"],
    }[weight]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except Exception:
            continue
    return ImageFont.load_default()


F10 = font(10)
F12 = font(12)
F13 = font(13)
F14 = font(14)
F15 = font(15)
F16 = font(16)
F18 = font(18)
F20 = font(20, "semibold")
F22 = font(22, "semibold")
F26 = font(26, "semibold")
F30 = font(30, "bold")
F34 = font(34, "bold")
F36 = font(36, "bold")
F44 = font(44, "bold")
F56 = font(56, "bold")
FMONO = font(13, "mono")


def add_glow(base: Image.Image, box: tuple[int, int, int, int], color: tuple[int, int, int], radius: int = 26, alpha: int = 95) -> None:
    glow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rounded_rectangle(box, radius=radius, fill=(*color, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(radius))
    base.alpha_composite(glow)


def radial_layer(size: tuple[int, int], center: tuple[int, int], radius: int, color: tuple[int, int, int], alpha: int) -> Image.Image:
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    px = layer.load()
    cx, cy = center
    r2 = radius * radius
    for y in range(max(0, cy - radius), min(size[1], cy + radius)):
        for x in range(max(0, cx - radius), min(size[0], cx + radius)):
            d2 = (x - cx) ** 2 + (y - cy) ** 2
            if d2 < r2:
                a = int(alpha * (1 - d2 / r2) ** 1.8)
                if a > 0:
                    px[x, y] = (*color, a)
    return layer.filter(ImageFilter.GaussianBlur(22))


def background(page: str) -> Image.Image:
    base = Image.new("RGBA", (W, H), (2, 10, 22, 255))
    base.alpha_composite(radial_layer((W, H), (350, 120), 620, (8, 96, 86), 145))
    base.alpha_composite(radial_layer((W, H), (1540, 160), 720, (0, 70, 130), 130))
    base.alpha_composite(radial_layer((W, H), (760, 940), 520, (20, 120, 70), 80))
    if "Blockchain" in page:
        base.alpha_composite(radial_layer((W, H), (1050, 420), 760, (0, 168, 255), 130))
    if "AI Assistant" in page:
        base.alpha_composite(radial_layer((W, H), (1180, 500), 620, (128, 72, 255), 100))
    d = ImageDraw.Draw(base, "RGBA")
    for x in range(280, W, 64):
        d.line((x, 0, x, H), fill=(0, 212, 255, 12), width=1)
    for y in range(0, H, 64):
        d.line((260, y, W, y), fill=(0, 212, 255, 10), width=1)
    for i in range(90):
        x = RNG.randint(270, W - 20)
        y = RNG.randint(80, H - 20)
        c = CYAN if i % 3 else GREEN
        d.ellipse((x, y, x + 2, y + 2), fill=(*c, RNG.randint(35, 110)))
    return base


def text(d: ImageDraw.ImageDraw, xy: tuple[int, int], s: str, fnt=F14, fill=TEXT, anchor=None, maxw: int | None = None, spacing: int = 4) -> None:
    if maxw is None:
        d.text(xy, s, font=fnt, fill=fill, anchor=anchor)
        return
    words = s.split()
    lines: list[str] = []
    line = ""
    for word in words:
        test = f"{line} {word}".strip()
        if d.textbbox((0, 0), test, font=fnt)[2] <= maxw:
            line = test
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    x, y = xy
    for idx, line in enumerate(lines[:4]):
        d.text((x, y + idx * (fnt.size + spacing)), line, font=fnt, fill=fill)


def card(base: Image.Image, box: tuple[int, int, int, int], title: str = "", accent=CYAN, alpha: int = 148, radius: int = 18, title_icon: str | None = None) -> ImageDraw.ImageDraw:
    x1, y1, x2, y2 = box
    add_glow(base, (x1 - 3, y1 - 3, x2 + 3, y2 + 3), accent, radius=radius + 8, alpha=42)
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer, "RGBA")
    d.rounded_rectangle(box, radius=radius, fill=(*PANEL, alpha), outline=(*BORDER, 190), width=1)
    d.rounded_rectangle((x1 + 1, y1 + 1, x2 - 1, y1 + 3), radius=radius, fill=(*accent, 160))
    d.line((x1 + 16, y1 + 1, x2 - 16, y1 + 1), fill=(*accent, 175), width=2)
    d.rounded_rectangle((x1 + 2, y1 + 2, x2 - 2, y2 - 2), radius=radius - 1, outline=(255, 255, 255, 22), width=1)
    base.alpha_composite(layer)
    d = ImageDraw.Draw(base, "RGBA")
    if title:
        if title_icon:
            pill(d, (x1 + 18, y1 + 17, x1 + 44, y1 + 43), "", accent, fill=(5, 42, 50))
            draw_icon(d, title_icon, x1 + 31, y1 + 30, accent, scale=0.8)
            text(d, (x1 + 54, y1 + 18), title, F16, (218, 238, 248), maxw=x2 - x1 - 70)
        else:
            text(d, (x1 + 20, y1 + 18), title, F16, (218, 238, 248), maxw=x2 - x1 - 40)
    return d


def pill(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int], label: str, accent=GREEN, fill=(5, 46, 38), fnt=F13) -> None:
    d.rounded_rectangle(box, radius=(box[3] - box[1]) // 2, fill=(*fill, 190), outline=(*accent, 150), width=1)
    if label:
        text(d, ((box[0] + box[2]) // 2, (box[1] + box[3]) // 2), label, fnt, (*accent, 255), anchor="mm")


def draw_icon(d: ImageDraw.ImageDraw, kind: str, cx: int, cy: int, color=GREEN, scale: float = 1.0) -> None:
    c = (*color, 230)
    s = int(18 * scale)
    if kind == "grid":
        for dx in [-8, 8]:
            for dy in [-8, 8]:
                d.rounded_rectangle((cx + dx - 4, cy + dy - 4, cx + dx + 4, cy + dy + 4), radius=2, outline=c, width=2)
    elif kind == "leaf":
        d.arc((cx - s, cy - s, cx + 6, cy + s), 250, 70, fill=c, width=3)
        d.line((cx - 6, cy + 9, cx + 10, cy - 10), fill=c, width=2)
    elif kind == "shield":
        d.polygon([(cx, cy - s), (cx + s, cy - 5), (cx + 10, cy + s), (cx, cy + s + 4), (cx - 10, cy + s), (cx - s, cy - 5)], outline=c)
        d.line((cx - 8, cy, cx - 1, cy + 7, cx + 10, cy - 8), fill=c, width=3)
    elif kind == "bot":
        d.rounded_rectangle((cx - s, cy - 10, cx + s, cy + 12), radius=5, outline=c, width=2)
        d.ellipse((cx - 8, cy - 2, cx - 4, cy + 2), fill=c)
        d.ellipse((cx + 4, cy - 2, cx + 8, cy + 2), fill=c)
        d.line((cx - 8, cy + 8, cx + 8, cy + 8), fill=c, width=2)
    elif kind == "nodes":
        pts = [(cx - 14, cy - 10), (cx + 13, cy - 14), (cx + 10, cy + 14), (cx - 15, cy + 12)]
        for a, b in zip(pts, pts[1:] + pts[:1]):
            d.line((a, b), fill=(*color, 160), width=2)
        for x, y in pts:
            d.ellipse((x - 4, y - 4, x + 4, y + 4), fill=c)
    elif kind == "trend":
        d.line((cx - 16, cy + 12, cx - 5, cy, cx + 4, cy + 5, cx + 16, cy - 12), fill=c, width=3)
        d.line((cx + 7, cy - 12, cx + 16, cy - 12, cx + 16, cy - 3), fill=c, width=3)
    elif kind == "chain":
        d.rounded_rectangle((cx - 20, cy - 7, cx - 2, cy + 7), radius=5, outline=c, width=3)
        d.rounded_rectangle((cx + 2, cy - 7, cx + 20, cy + 7), radius=5, outline=c, width=3)
        d.line((cx - 4, cy, cx + 4, cy), fill=c, width=3)
    elif kind == "spark":
        d.line((cx, cy - 18, cx, cy + 18), fill=c, width=2)
        d.line((cx - 18, cy, cx + 18, cy), fill=c, width=2)
        d.line((cx - 12, cy - 12, cx + 12, cy + 12), fill=c, width=2)
        d.line((cx + 12, cy - 12, cx - 12, cy + 12), fill=c, width=2)
    elif kind == "bolt":
        d.polygon([(cx + 2, cy - 20), (cx - 12, cy + 2), (cx, cy + 2), (cx - 3, cy + 20), (cx + 14, cy - 5), (cx + 2, cy - 5)], fill=(*color, 220))
    elif kind == "bell":
        d.arc((cx - 13, cy - 14, cx + 13, cy + 14), 200, 340, fill=c, width=3)
        d.line((cx - 14, cy + 8, cx + 14, cy + 8), fill=c, width=3)
        d.ellipse((cx - 3, cy + 13, cx + 3, cy + 19), fill=c)


def sidebar(base: Image.Image, active_page: str) -> None:
    d = ImageDraw.Draw(base, "RGBA")
    add_glow(base, (18, 18, 252, 1062), CYAN, 30, 35)
    d.rounded_rectangle((18, 18, 252, 1062), radius=26, fill=(2, 14, 27, 220), outline=(33, 84, 112, 190), width=1)
    d.ellipse((38, 35, 82, 79), fill=(61, 242, 122, 210))
    d.pieslice((30, 26, 84, 84), 210, 330, fill=(24, 181, 95, 170))
    text(d, (92, 35), "AgriNova", F30, TEXT)
    text(d, (94, 72), "AI Smart Agriculture Platform", F12, MUTED)
    d.line((36, 114, 232, 114), fill=(63, 103, 134, 130), width=1)

    for idx, (label, kind) in enumerate(NAV):
        y = 145 + idx * 70
        active = label in active_page or (label == "Overview" and active_page == "AgriNova Overview") or (label == "Robots & Drones" and active_page == "Robotics & Drone Operations")
        if active:
            add_glow(base, (33, y - 8, 238, y + 45), GREEN, 18, 70)
            d.rounded_rectangle((33, y - 8, 238, y + 45), radius=15, fill=(6, 70, 49, 210), outline=(61, 242, 122, 160), width=1)
            d.rounded_rectangle((35, y + 2, 41, y + 35), radius=4, fill=(61, 242, 122, 230))
        else:
            d.rounded_rectangle((33, y - 8, 238, y + 45), radius=15, fill=(255, 255, 255, 7), outline=(255, 255, 255, 15), width=1)
        draw_icon(d, kind, 65, y + 18, GREEN if active else (122, 167, 190), 0.82)
        text(d, (93, y + 7), label, F15 if len(label) < 15 else F14, TEXT if active else (160, 185, 202))

    card(base, (35, 878, 235, 1018), "AgriNova AI", VIOLET, 130, 20)
    d = ImageDraw.Draw(base, "RGBA")
    text(d, (58, 923), "Smart Agriculture", F14, (190, 210, 226))
    text(d, (58, 948), "Command Center", F14, (190, 210, 226))
    pill(d, (58, 980, 174, 1008), "LIVE SYSTEM", GREEN)


def header(base: Image.Image, page: str, subtitle: str) -> None:
    d = card(base, (278, 22, 1888, 112), "", CYAN, 95, 22)
    text(d, (312, 42), page, F34 if False else F36, TEXT)
    text(d, (315, 82), subtitle, F15, MUTED)
    x = 1395
    for label, val, color in [("System", "Online", GREEN), ("Security", "Verified", CYAN), ("Mode", "Executive", VIOLET)]:
        pill(d, (x, 49, x + 140, 83), f"{label}: {val}", color, fill=(5, 31, 43), fnt=F12)
        x += 154


def kpi(base: Image.Image, box, title, value, delta="+", accent=GREEN, icon="grid") -> None:
    d = card(base, box, "", accent, 150, 18)
    x1, y1, x2, y2 = box
    draw_icon(d, icon, x1 + 34, y1 + 36, accent, 0.8)
    text(d, (x1 + 60, y1 + 22), title, F13, MUTED, maxw=x2 - x1 - 75)
    text(d, (x1 + 20, y1 + 58), value, F34 if len(value) < 7 else F26, TEXT)
    pill(d, (x1 + 20, y2 - 38, x1 + 110, y2 - 14), delta, accent, fill=(8, 38, 35), fnt=F12)


def line_chart(base: Image.Image, box, title, series: list[float], accent=GREEN, second: list[float] | None = None) -> None:
    d = card(base, box, title, accent, 128, 18)
    x1, y1, x2, y2 = box
    left, top, right, bottom = x1 + 45, y1 + 68, x2 - 28, y2 - 35
    for i in range(5):
        y = top + i * (bottom - top) / 4
        d.line((left, y, right, y), fill=(90, 130, 160, 42), width=1)
    for i in range(7):
        x = left + i * (right - left) / 6
        d.line((x, top, x, bottom), fill=(90, 130, 160, 28), width=1)
    vals = series + (second or [])
    mn, mx = min(vals), max(vals)
    span = mx - mn or 1
    def pts(vals):
        return [
            (
                left + i * (right - left) / (len(vals) - 1),
                bottom - (v - mn) / span * (bottom - top),
            )
            for i, v in enumerate(vals)
        ]
    p = pts(series)
    poly = [(p[0][0], bottom), *p, (p[-1][0], bottom)]
    d.polygon(poly, fill=(*accent, 34))
    d.line(p, fill=(*accent, 230), width=4, joint="curve")
    for x, y in p[:: max(1, len(p) // 7)]:
        d.ellipse((x - 5, y - 5, x + 5, y + 5), fill=(*accent, 230), outline=(255, 255, 255, 190), width=1)
    if second:
        p2 = pts(second)
        d.line(p2, fill=(*CYAN, 220), width=3, joint="curve")


def bars(base: Image.Image, box, title, labels: list[str], values: list[float], accent=CYAN, horizontal=True) -> None:
    d = card(base, box, title, accent, 128, 18)
    x1, y1, x2, y2 = box
    maxv = max(values) or 1
    if horizontal:
        y = y1 + 70
        for label, value in zip(labels, values):
            text(d, (x1 + 22, y), label, F13, MUTED)
            bx = x1 + 145
            bw = int((x2 - bx - 35) * value / maxv)
            d.rounded_rectangle((bx, y + 4, x2 - 25, y + 16), radius=6, fill=(255, 255, 255, 18))
            d.rounded_rectangle((bx, y + 4, bx + bw, y + 16), radius=6, fill=(*accent, 210))
            text(d, (x2 - 70, y - 2), f"{value:.0f}", F13, TEXT)
            y += 38
    else:
        base_y = y2 - 45
        gap = (x2 - x1 - 70) / len(values)
        for i, (label, value) in enumerate(zip(labels, values)):
            bw = min(45, gap * 0.55)
            x = x1 + 40 + i * gap
            h = int((y2 - y1 - 120) * value / maxv)
            d.rounded_rectangle((x, base_y - h, x + bw, base_y), radius=8, fill=(*accent, 210))
            text(d, (int(x), base_y + 10), label[:7], F10, MUTED)


def donut(base: Image.Image, box, title, value: float, accent=GREEN) -> None:
    d = card(base, box, title, accent, 128, 18)
    x1, y1, x2, y2 = box
    cx, cy = (x1 + x2) // 2, y1 + 115
    r = min(x2 - x1, y2 - y1) // 4
    d.arc((cx - r, cy - r, cx + r, cy + r), 0, 360, fill=(255, 255, 255, 28), width=18)
    d.arc((cx - r, cy - r, cx + r, cy + r), -90, -90 + 360 * value / 100, fill=(*accent, 230), width=18)
    text(d, (cx, cy), f"{value:.0f}%", F30, TEXT, anchor="mm")


def matrix(base: Image.Image, box, title, headers: list[str], rows_data: list[list[str]], accent=CYAN) -> None:
    d = card(base, box, title, accent, 128, 18)
    x1, y1, x2, y2 = box
    y = y1 + 62
    d.rounded_rectangle((x1 + 18, y, x2 - 18, y + 34), radius=8, fill=(255, 255, 255, 16))
    colw = (x2 - x1 - 45) / len(headers)
    for i, h in enumerate(headers):
        text(d, (int(x1 + 28 + i * colw), y + 8), h, F12, (180, 205, 220))
    y += 42
    for idx, row in enumerate(rows_data):
        if y + 32 > y2 - 18:
            break
        fill = (61, 242, 122, 28) if idx == 0 else (255, 255, 255, 7)
        d.rounded_rectangle((x1 + 18, y, x2 - 18, y + 34), radius=8, fill=fill)
        for i, cell in enumerate(row):
            color = GREEN if any(t in cell for t in ["Online", "Verified", "Rising", "Ready", "Low"]) else TEXT
            text(d, (int(x1 + 28 + i * colw), y + 8), cell[:22], F12, color)
        y += 38


def overview(base: Image.Image) -> None:
    header(base, "AgriNova Overview", "Enterprise AI Smart Agriculture Command Center")
    kpis = [
        ("Monitored Farms", str(len(DATA["farms"])), "+6 live", GREEN, "grid"),
        ("IoT Sensors", str(len(DATA["sensors"])), "96% uptime", CYAN, "nodes"),
        ("Robots", str(len(DATA["robots"])), "8 active", BLUE, "bot"),
        ("Drones", str(len(DATA["drones"])), "4 airborne", CYAN, "spark"),
        ("System Health", "87.8", "stable", GREEN, "shield"),
    ]
    x = 280
    for item in kpis:
        kpi(base, (x, 136, x + 300, 255), *item)
        x += 322
    line_chart(base, (280, 282, 890, 615), "Crop Health Trend", [72, 75, 79, 78, 82, 85, 84, 88, 87, 90], GREEN, [66, 70, 73, 76, 78, 81, 83, 85, 86, 88])
    donut(base, (920, 282, 1210, 615), "Water Efficiency", 84, CYAN)
    donut(base, (1238, 282, 1528, 615), "Blockchain Integrity", 94, GREEN)
    bars(base, (1556, 282, 1890, 615), "Live System Signals", ["Sensors", "Robots", "Drones", "AI", "Ledger"], [96, 88, 84, 92, 94], GREEN)
    matrix(base, (280, 645, 1000, 965), "Executive Alerts", ["Priority", "Module", "Action"], [["Critical", "Irrigation", "Dispatch inspection"], ["High", "Crop Health", "Review scan"], ["Medium", "Market", "Stage harvest"], ["Low", "Energy", "Normal cycle"]], RED)
    matrix(base, (1028, 645, 1890, 965), "Smart Agriculture Intelligence Feed", ["Time", "Signal", "Recommendation"], [["19:10", "Crop stress", "Balance irrigation cycle"], ["18:45", "Market shift", "Secure buyer contracts"], ["18:20", "Ledger", "Audit trail verified"], ["17:55", "Drone scan", "Inspect high-risk zone"]], VIOLET)


def farm_monitoring(base: Image.Image) -> None:
    header(base, "Smart Farm Monitoring", "Real-time soil, climate, irrigation, and nutrient telemetry")
    labels = ["Moisture", "Soil Temp", "Humidity", "pH", "Nitrogen", "Phosphorus", "Potassium", "Light", "CO2", "Leaf Wetness"]
    values = [avg(DATA["soil"], "SoilMoisturePct"), avg(DATA["soil"], "SoilTempC"), avg(DATA["soil"], "HumidityPct"), avg(DATA["soil"], "PH"), avg(DATA["soil"], "NitrogenPPM"), avg(DATA["soil"], "PhosphorusPPM"), avg(DATA["soil"], "PotassiumPPM") / 2, avg(DATA["soil"], "LightLux") / 1000, avg(DATA["soil"], "CO2PPM") / 10, avg(DATA["soil"], "LeafWetnessPct")]
    x, y = 280, 138
    for i, (label, value) in enumerate(zip(labels, values)):
        kpi(base, (x, y, x + 292, y + 108), label, f"{value:.1f}", "live", [GREEN, CYAN, BLUE, AMBER, VIOLET][i % 5], "leaf")
        x += 318
        if x > 1660:
            x, y = 280, y + 126
    line_chart(base, (280, 410, 990, 745), "Moisture + pH Stability", [48, 51, 47, 55, 58, 52, 60, 63, 59], GREEN, [62, 63, 65, 64, 66, 67, 65, 66, 68])
    bars(base, (1020, 410, 1435, 745), "NPK Balance", ["Nitrogen", "Phosphorus", "Potassium", "Fertility"], [84, 61, 88, 78], CYAN)
    donut(base, (1465, 410, 1890, 745), "Irrigation Readiness", 82, GREEN)
    matrix(base, (280, 775, 1890, 965), "Latest Sensor Network Readings", ["Farm", "Zone", "Sensor", "Status", "Packet"], [["Delta North", "A", "Moisture", "Online", "54/min"], ["Canal Desert", "C", "NPK", "Online", "48/min"], ["Oasis Fruit", "D", "pH", "Attention", "31/min"], ["Coastal", "B", "Leaf Wetness", "Online", "62/min"]], CYAN)


def crop_health(base: Image.Image) -> None:
    header(base, "Crop Health & Vision Intelligence", "Vision Intelligence Module for crop diagnosis and treatment decisions")
    kpi(base, (280, 138, 600, 260), "Crop Health Score", f"{avg(DATA['scans'], 'CropHealthScore'):.1f}", "healthy", GREEN, "shield")
    kpi(base, (625, 138, 945, 260), "Disease Signals", str(sum(1 for r in DATA["scans"] if r["DetectedDisease"] != "None")), "monitored", AMBER, "leaf")
    kpi(base, (970, 138, 1290, 260), "Pest Risk", "Medium", "watch", AMBER, "bell")
    kpi(base, (1315, 138, 1635, 260), "Scan History", str(len(DATA["scans"])), "ready", CYAN, "spark")
    kpi(base, (1660, 138, 1890, 260), "Treatments", "42", "active", GREEN, "grid")
    bars(base, (280, 300, 745, 650), "Detected Conditions", ["Healthy", "Leaf Spot", "Blight", "Mildew", "Stress"], [72, 19, 13, 10, 16], GREEN)
    line_chart(base, (775, 300, 1325, 650), "Plant Stress Timeline", [61, 63, 59, 55, 58, 52, 49, 47, 45], RED, [75, 77, 80, 82, 81, 84, 86, 88, 87])
    matrix(base, (1355, 300, 1890, 650), "Recommended Treatment", ["Crop", "Diagnosis", "Action"], [["Tomatoes", "Leaf Spot", "Targeted organic treatment"], ["Mango", "Healthy", "Continue monitoring"], ["Grapes", "Mildew", "Improve airflow"], ["Cucumber", "Stress", "Adjust irrigation"]], VIOLET)
    matrix(base, (280, 680, 1890, 965), "Recent Vision Intelligence Scan History", ["Scan", "Farm", "Crop", "Health", "Recommendation"], [["CH000252", "Delta North", "Tomatoes", "88.4", "Maintain cycle"], ["CH000251", "Coastal", "Cucumber", "76.2", "Inspect canopy"], ["CH000250", "Oasis", "Mango", "91.0", "Harvest window ready"], ["CH000249", "Canal", "Potato", "69.8", "Review nutrients"]], CYAN)


def robotics(base: Image.Image) -> None:
    header(base, "Robotics & Drone Operations", "Autonomous ground and aerial mission control")
    card(base, (280, 138, 1070, 965), "Ground Robotics Mission Control", BLUE, 135, 22, "bot")
    d = ImageDraw.Draw(base, "RGBA")
    for i, (label, value, col) in enumerate([("Battery", 72, GREEN), ("Route", 78, CYAN), ("Soil Scan", 84, BLUE), ("Coverage", 69, AMBER)]):
        donut(base, (310 + i * 185, 210, 475 + i * 185, 420), label, value, col)
    matrix(base, (310, 455, 1040, 635), "Robot Fleet", ["Robot", "Mission", "Battery", "Alerts"], [["AGR-R01", "Scanning", "82%", "0"], ["AGR-R02", "Mapping", "64%", "1"], ["AGR-R04", "Charging", "41%", "0"]], BLUE)
    line_chart(base, (310, 665, 1040, 920), "Route Progress Telemetry", [10, 25, 36, 45, 61, 72, 83, 88], BLUE)
    card(base, (1100, 138, 1890, 965), "Drone / UAV Operations", CYAN, 135, 22, "spark")
    donut(base, (1130, 210, 1350, 450), "Flight Coverage", 86, CYAN)
    donut(base, (1370, 210, 1590, 450), "Aerial Health", 81, GREEN)
    donut(base, (1610, 210, 1860, 450), "Capture Status", 92, BLUE)
    bars(base, (1130, 480, 1860, 690), "Thermal Stress Zones", ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"], [12, 31, 18, 44, 27], RED)
    matrix(base, (1130, 720, 1860, 920), "Last Aerial Scan", ["Drone", "NDVI", "Risk Zones", "State"], [["AGR-D01", "0.82", "1", "Ready"], ["AGR-D03", "0.69", "4", "Processing"], ["AGR-D04", "0.75", "2", "In Flight"]], CYAN)


def iot(base: Image.Image) -> None:
    header(base, "IoT Sensor Network", "Edge gateway, MQTT flow, uptime, and telemetry health")
    kpi(base, (280, 138, 610, 260), "Sensor Uptime", f"{avg(DATA['sensors'], 'CommunicationHealth'):.1f}%", "stable", GREEN, "nodes")
    kpi(base, (635, 138, 965, 260), "Packets / Min", f"{sum(float(r['PacketRate']) for r in DATA['sensors']):.0f}", "streaming", CYAN, "spark")
    kpi(base, (990, 138, 1320, 260), "Edge Gateways", "24", "online", BLUE, "grid")
    kpi(base, (1345, 138, 1675, 260), "MQTT Flow", "Active", "live", GREEN, "chain")
    kpi(base, (1700, 138, 1890, 260), "Alerts", str(count_where(DATA["sensors"], "Status", "Attention")), "watch", AMBER, "bell")
    # network diagram
    d = card(base, (280, 300, 1110, 965), "Gateway Network Topology", CYAN, 126, 22)
    centers = [(470, 460), (720, 420), (930, 560), (600, 720), (890, 805), (410, 820)]
    hub = (705, 610)
    d.ellipse((hub[0] - 52, hub[1] - 52, hub[0] + 52, hub[1] + 52), fill=(0, 212, 255, 38), outline=(*CYAN, 220), width=3)
    text(d, hub, "EDGE\nHUB", F18, TEXT, anchor="mm")
    for i, c in enumerate(centers):
        d.line((hub, c), fill=(0, 212, 255, 100), width=2)
        d.ellipse((c[0] - 34, c[1] - 34, c[0] + 34, c[1] + 34), fill=(61, 242, 122, 34), outline=(*GREEN, 200), width=2)
        text(d, (c[0], c[1]), f"GW-{i+1}", F13, TEXT, anchor="mm")
    bars(base, (1140, 300, 1890, 610), "Communication Health", ["Moisture", "NPK", "pH", "Humidity", "Light", "CO2"], [96, 91, 88, 94, 86, 92], GREEN)
    line_chart(base, (1140, 640, 1890, 965), "Packet Flow Timeline", [510, 530, 490, 610, 660, 620, 700, 735, 720, 760], CYAN)


def price(base: Image.Image) -> None:
    header(base, "Price Prediction", "Intelligent Prediction System for vegetable and fruit markets")
    selected = [r for r in DATA["prices"] if r["CropName"] in ["Tomatoes", "Mango", "Grapes", "Potato", "Orange"] and int(r["HorizonDays"]) in [-60, -45, -30, -15, 0, 15, 30, 45, 60]]
    kpi(base, (280, 138, 600, 260), "Current Market Price", "EGP 38.6", "live", GREEN, "trend")
    kpi(base, (625, 138, 945, 260), "60-Day Prediction", "EGP 45.2", "+17.1%", CYAN, "spark")
    kpi(base, (970, 138, 1290, 260), "Market Risk", "Medium", "watch", AMBER, "bell")
    kpi(base, (1315, 138, 1635, 260), "Profitability", "Attractive", "rising", GREEN, "grid")
    kpi(base, (1660, 138, 1890, 260), "Crops", "14", "approved", VIOLET, "leaf")
    line_chart(base, (280, 300, 1115, 670), "60-Day Price Trajectory", [24, 26, 25, 29, 31, 33, 36, 39, 43], GREEN, [22, 23, 24, 26, 28, 30, 32, 34, 36])
    bars(base, (1145, 300, 1890, 670), "Impact Factors", ["Supply / Demand", "USD / EGP", "Inflation", "Seasonal Effect", "Volatility"], [78, 64, 58, 45, 41], CYAN)
    matrix(base, (280, 700, 1890, 965), "Commodity Forecast Matrix", ["Crop", "Current", "60 Days", "Trend", "Action"], [["Tomatoes", "24.10", "31.80", "Rising", "Stage harvest"], ["Mango", "72.30", "84.20", "Rising", "Secure buyer"], ["Grapes", "64.10", "70.50", "Stable", "Hold premium"], ["Potato", "17.40", "20.30", "Rising", "Monitor supply"]], GREEN)


def blockchain(base: Image.Image) -> None:
    header(base, "Blockchain Security", "Immutable audit trail, traceability, and transaction validation")
    kpi(base, (280, 138, 600, 260), "Network Status", "Operational", "live", CYAN, "chain")
    kpi(base, (625, 138, 945, 260), "Verified Records", f"{sum(int(r['VerifiedFarmRecords']) for r in DATA['blocks'])}", "verified", GREEN, "shield")
    kpi(base, (970, 138, 1290, 260), "Transactions", f"{sum(int(r['SecureTransactions']) for r in DATA['blocks'])}", "secure", CYAN, "grid")
    kpi(base, (1315, 138, 1635, 260), "Data Integrity", "94%", "trusted", GREEN, "spark")
    kpi(base, (1660, 138, 1890, 260), "Contracts", "Active", "queued", VIOLET, "nodes")
    d = card(base, (280, 300, 1890, 660), "Connected Block History", CYAN, 118, 20, "chain")
    x = 330
    prev = None
    for idx, block in enumerate(DATA["blocks"][:6]):
        b = (x, 390, x + 210, 590)
        add_glow(base, b, CYAN if idx % 2 else GREEN, 18, 60)
        d.rounded_rectangle(b, radius=16, fill=(4, 18, 33, 210), outline=(*(CYAN if idx % 2 else GREEN), 180), width=2)
        text(d, (x + 18, 412), f"BLOCK #{block['BlockIndex']}", F18, TEXT)
        text(d, (x + 18, 448), block["RecordType"], F13, MUTED)
        text(d, (x + 18, 488), "HASH", F10, (130, 166, 190))
        text(d, (x + 18, 508), block["HashPreview"], FMONO, GREEN if idx % 2 == 0 else CYAN)
        text(d, (x + 18, 538), "PREV", F10, (130, 166, 190))
        text(d, (x + 18, 556), block["PreviousHashPreview"][:12] + "...", FMONO, (116, 150, 176))
        if prev:
            d.line((prev, (x, 490)), fill=(0, 212, 255, 180), width=3)
            d.polygon([(x - 10, 490), (x, 484), (x, 496)], fill=(0, 212, 255, 180))
        prev = (x + 210, 490)
        x += 255
    line_chart(base, (280, 700, 1020, 965), "Validation Timeline", [12, 18, 22, 29, 34, 37, 41, 48], GREEN)
    matrix(base, (1050, 700, 1890, 965), "Immutable Audit Trail", ["Tx", "Stage", "State", "Hash"], [["TX00048", "Ledger", "Verified", "8f31bc..."], ["TX00047", "Gateway", "Verified", "b91a22..."], ["TX00046", "Cloud", "Pending", "0a7cd1..."], ["TX00045", "Field", "Verified", "ab901e..."]], CYAN)


def assistant(base: Image.Image) -> None:
    header(base, "AI Assistant", "AgriNova AI Assistant for conversational, visual, and market guidance")
    d = card(base, (280, 138, 1120, 965), "AgriNova AI Assistant", VIOLET, 130, 24, "spark")
    messages = [
        ("Farmer", "What should I do for the tomatoes today?", CYAN),
        ("Assistant", "Moisture is stable, but scan history shows early leaf stress in Zone B. Inspect rows 12-18 and keep fertigation balanced.", GREEN),
        ("Farmer", "Should irrigation run tonight?", CYAN),
        ("Assistant", "Run a shorter irrigation cycle after sunset and re-check leaf wetness before morning.", GREEN),
    ]
    y = 230
    for who, msg, col in messages:
        align_right = who == "Farmer"
        w = 470 if len(msg) < 70 else 650
        x = 610 if align_right else 330
        d.rounded_rectangle((x, y, x + w, y + 82), radius=18, fill=(*col, 28), outline=(*col, 120), width=1)
        text(d, (x + 20, y + 15), who, F13, col)
        text(d, (x + 20, y + 38), msg, F14, TEXT, maxw=w - 40)
        y += 110
    d.rounded_rectangle((330, 835, 1065, 910), radius=22, fill=(255, 255, 255, 12), outline=(139, 92, 246, 150), width=1)
    text(d, (360, 858), "Ask AgriNova about crop health, irrigation, fertilizer, market timing...", F16, (168, 190, 210))
    pill(d, (925, 854, 1040, 894), "SEND", VIOLET, fill=(36, 20, 60), fnt=F14)
    bars(base, (1150, 138, 1890, 390), "Suggested Questions", ["Crop advice", "Disease explanation", "Irrigation", "Fertilizer", "Market"], [92, 84, 79, 74, 88], VIOLET)
    matrix(base, (1150, 420, 1890, 690), "Natural Language Recommendations", ["Topic", "Status", "Recommendation"], [["Crop Advice", "Ready", "Inspect high-risk rows"], ["Market", "Ready", "Stage harvest"], ["Irrigation", "Ready", "Short cycle tonight"], ["Image Diagnosis", "Ready", "Review affected leaves"]], GREEN)
    donut(base, (1150, 720, 1500, 965), "Assistant Availability", 93, VIOLET)
    donut(base, (1530, 720, 1890, 965), "Vision Summary", 86, CYAN)


def sustainability(base: Image.Image) -> None:
    header(base, "Sustainability & Energy", "Solar, battery, off-grid resilience, and carbon reduction intelligence")
    kpi(base, (280, 138, 600, 260), "Solar Status", "Active", "hybrid", AMBER, "bolt")
    kpi(base, (625, 138, 945, 260), "Battery Level", f"{avg(DATA['energy'], 'BatteryLevelPct'):.1f}%", "stable", GREEN, "bolt")
    kpi(base, (970, 138, 1290, 260), "Renewable Use", f"{avg(DATA['energy'], 'RenewableEnergyUsagePct'):.1f}%", "clean", GREEN, "leaf")
    kpi(base, (1315, 138, 1635, 260), "Carbon Reduction", f"{sum(float(r['CarbonReductionKg']) for r in DATA['energy']):.0f} kg", "tracked", CYAN, "grid")
    kpi(base, (1660, 138, 1890, 260), "Off-grid", "Stable", "ready", BLUE, "shield")
    line_chart(base, (280, 300, 1050, 660), "Energy Consumption vs Renewable Usage", [120, 132, 118, 140, 151, 145, 160, 148, 136], AMBER, [62, 66, 70, 72, 76, 78, 82, 80, 84])
    bars(base, (1080, 300, 1500, 660), "Charging Fleet", ["Robot R01", "Robot R02", "Drone D01", "Drone D03", "Gateway"], [82, 64, 91, 76, 88], CYAN)
    donut(base, (1530, 300, 1890, 660), "Off-grid Stability", 89, GREEN)
    matrix(base, (280, 695, 1890, 965), "Farm Energy Operations", ["Farm", "Solar", "Battery", "Charging", "Status"], [["Delta North", "Active", "82%", "Ready", "Online"], ["Canal Desert", "Active", "74%", "Charging", "Online"], ["Oasis Fruit", "Limited", "56%", "Scheduled", "Attention"], ["Sinai", "Active", "88%", "Ready", "Online"]], GREEN)


def alerts_reports(base: Image.Image) -> None:
    header(base, "Alerts & Reports", "Priority actions, operational risks, and decision-support reporting")
    kpi(base, (280, 138, 600, 260), "Open Alerts", str(sum(1 for r in DATA["alerts"] if r["ResolutionStatus"] != "Resolved")), "triage", RED, "bell")
    kpi(base, (625, 138, 945, 260), "Critical", str(count_where(DATA["alerts"], "PriorityLevel", "Critical")), "urgent", RED, "shield")
    kpi(base, (970, 138, 1290, 260), "Reports", "6", "ready", CYAN, "grid")
    kpi(base, (1315, 138, 1635, 260), "Actions", "31", "assigned", AMBER, "spark")
    kpi(base, (1660, 138, 1890, 260), "Audit", "Ready", "export", GREEN, "chain")
    matrix(base, (280, 300, 1010, 665), "Alert Command Center", ["Priority", "Type", "Action", "Status"], [["Critical", "Irrigation", "Dispatch inspection", "Open"], ["High", "Disease", "Review scan", "In Progress"], ["High", "Blockchain", "Verify timeline", "Open"], ["Medium", "Market", "Prepare response", "Open"], ["Low", "Energy", "Schedule charging", "Resolved"]], RED)
    bars(base, (1040, 300, 1890, 665), "Priority Distribution", ["Critical", "High", "Medium", "Low"], [11, 24, 32, 18], RED, horizontal=False)
    matrix(base, (280, 700, 1080, 965), "Recommended Actions", ["Module", "Action", "Owner"], [["Soil", "Adjust irrigation schedule", "Ops A"], ["Crop", "Inspect affected rows", "Field Team"], ["Market", "Secure buyer contract", "Commercial"], ["Blockchain", "Export audit report", "Security"]], AMBER)
    matrix(base, (1110, 700, 1890, 965), "Exportable Reports", ["Report", "Format", "Status"], [["Farm Performance Summary", "PDF", "Ready"], ["Crop Health Report", "PDF", "Ready"], ["Water Usage Report", "PDF", "Ready"], ["Blockchain Audit Report", "PDF", "Ready"]], CYAN)


DRAWERS = {
    "AgriNova Overview": overview,
    "Smart Farm Monitoring": farm_monitoring,
    "Crop Health & Vision Intelligence": crop_health,
    "Robotics & Drone Operations": robotics,
    "IoT Sensor Network": iot,
    "Price Prediction": price,
    "Blockchain Security": blockchain,
    "AI Assistant": assistant,
    "Sustainability & Energy": sustainability,
    "Alerts & Reports": alerts_reports,
}


def save_page(page: str, index: int) -> None:
    base = background(page)
    sidebar(base, page)
    DRAWERS[page](base)
    # final cinematic vignette
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay, "RGBA")
    d.rectangle((0, 0, W, H), outline=(0, 212, 255, 35), width=2)
    d.rounded_rectangle((270, 18, 1895, 1030), radius=28, outline=(255, 255, 255, 18), width=1)
    base.alpha_composite(overlay)
    name = f"{index:02d}_{page.replace('&', 'and').replace('/', '').replace(' ', '_')}.png"
    base.convert("RGB").save(OUT / name, quality=96)


def write_index() -> None:
    lines = [
        "# Premium Mockups Index",
        "",
        "These are high-fidelity 1920x1080 visual references for rebuilding AgriNova in Power BI Desktop.",
        "",
    ]
    for path in sorted(OUT.glob("*.png")):
        lines.append(f"- [{path.name}](mockups/{path.name})")
    (ROOT / "manual_build" / "05_MOCKUPS_INDEX.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.png"):
        old.unlink()
    for idx, page in enumerate(PAGES, 1):
        save_page(page, idx)
    write_index()
    print(f"Premium mockups generated: {len(list(OUT.glob('*.png')))} pages")


if __name__ == "__main__":
    main()
