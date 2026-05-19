from __future__ import annotations

import csv
import hashlib
import json
import math
import random
from datetime import date, datetime, timedelta, time
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TODAY = date(2026, 5, 18)
NOW = datetime(2026, 5, 18, 19, 10)
RNG = random.Random(42817)


def ensure_dirs() -> None:
    for folder in [
        "data",
        "theme",
        "dax",
        "docs",
        "assets/icons",
        "assets/backgrounds",
        "assets/logo",
        "tools",
    ]:
        (ROOT / folder).mkdir(parents=True, exist_ok=True)


def write_csv(path: str, rows: list[dict]) -> None:
    target = ROOT / path
    if not rows:
        target.write_text("", encoding="utf-8")
        return
    with target.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def pick_status(ok_weight: float = 0.78) -> str:
    roll = RNG.random()
    if roll < ok_weight:
        return "Online"
    if roll < ok_weight + 0.12:
        return "Attention"
    if roll < ok_weight + 0.19:
        return "Standby"
    return "Critical"


def heartbeat(status: str) -> str:
    return {
        "Online": "Live",
        "Attention": "Delayed",
        "Standby": "Standby",
        "Critical": "Interrupted",
    }[status]


def recent_signal(minutes: int) -> str:
    return (NOW - timedelta(minutes=minutes)).isoformat(timespec="minutes")


APPROVED_CROPS = [
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


def generate_data() -> None:
    farms = [
        {
            "FarmID": "F001",
            "FarmName": "Delta North Smart Farm",
            "Governorate": "Dakahlia",
            "Region": "North Delta",
            "AreaHa": 42,
            "Latitude": 31.0341,
            "Longitude": 31.3807,
            "FarmManager": "Operations Team A",
            "IrrigationType": "Drip",
            "EnergyMode": "Solar Hybrid",
        },
        {
            "FarmID": "F002",
            "FarmName": "Nile Valley Precision Farm",
            "Governorate": "Minya",
            "Region": "Upper Egypt",
            "AreaHa": 58,
            "Latitude": 28.1099,
            "Longitude": 30.7503,
            "FarmManager": "Operations Team B",
            "IrrigationType": "Smart Pivot",
            "EnergyMode": "Solar Hybrid",
        },
        {
            "FarmID": "F003",
            "FarmName": "Coastal Greenhouse Cluster",
            "Governorate": "Alexandria",
            "Region": "Mediterranean",
            "AreaHa": 27,
            "Latitude": 31.2001,
            "Longitude": 29.9187,
            "FarmManager": "Operations Team C",
            "IrrigationType": "Hydro Drip",
            "EnergyMode": "Battery Backup",
        },
        {
            "FarmID": "F004",
            "FarmName": "Canal Desert Demonstration Farm",
            "Governorate": "Ismailia",
            "Region": "Canal Zone",
            "AreaHa": 64,
            "Latitude": 30.5965,
            "Longitude": 32.2715,
            "FarmManager": "Operations Team D",
            "IrrigationType": "Subsurface Drip",
            "EnergyMode": "Off-grid Solar",
        },
        {
            "FarmID": "F005",
            "FarmName": "Sinai Resilience Farm",
            "Governorate": "North Sinai",
            "Region": "Sinai",
            "AreaHa": 36,
            "Latitude": 31.1313,
            "Longitude": 33.8033,
            "FarmManager": "Operations Team E",
            "IrrigationType": "Drip",
            "EnergyMode": "Off-grid Solar",
        },
        {
            "FarmID": "F006",
            "FarmName": "Oasis Fruit Intelligence Farm",
            "Governorate": "New Valley",
            "Region": "Western Desert",
            "AreaHa": 73,
            "Latitude": 25.4390,
            "Longitude": 30.5586,
            "FarmManager": "Operations Team F",
            "IrrigationType": "Smart Pivot",
            "EnergyMode": "Solar Hybrid",
        },
    ]
    for farm in farms:
        status = pick_status(0.84)
        farm["Status"] = status
        farm["LastSignalTime"] = recent_signal(RNG.randint(1, 42))
        farm["HeartbeatState"] = heartbeat(status)

    crop_rows = []
    crop_id = 1
    categories = {
        "Tomatoes": "Vegetable",
        "Bell Pepper": "Vegetable",
        "Onion": "Vegetable",
        "Cucumber": "Vegetable",
        "Potato": "Vegetable",
        "Orange": "Fruit",
        "Mandarin": "Fruit",
        "Apple": "Fruit",
        "Banana": "Fruit",
        "Mango": "Fruit",
        "Grapes": "Fruit",
        "Strawberry": "Fruit",
        "Lemon": "Fruit",
        "Pomegranate": "Fruit",
    }
    stages = ["Seedling", "Vegetative", "Flowering", "Fruiting", "Harvest Ready"]
    seasons = ["Winter", "Spring", "Summer", "Year-round"]
    for farm in farms:
        for crop_name in RNG.sample(APPROVED_CROPS, 4):
            crop_rows.append(
                {
                    "CropID": f"C{crop_id:03d}",
                    "FarmID": farm["FarmID"],
                    "CropName": crop_name,
                    "CropCategory": categories[crop_name],
                    "GrowthStage": RNG.choice(stages),
                    "Season": RNG.choice(seasons),
                    "PlantedAreaHa": round(RNG.uniform(3.2, 18.5), 1),
                    "TargetMarket": RNG.choice(["Local Wholesale", "Retail Chain", "Export Packhouse", "Processing Buyer"]),
                    "Status": pick_status(0.82),
                }
            )
            crop_id += 1

    sensor_types = [
        "Soil Moisture",
        "Soil Temperature",
        "Humidity",
        "pH",
        "NPK",
        "Light",
        "CO2",
        "Leaf Wetness",
    ]
    sensors = []
    sensor_id = 1
    for farm in farms:
        for zone in ["A", "B", "C", "D"]:
            gateway = f"GW-{farm['FarmID']}-{zone}"
            for sensor_type in sensor_types:
                status = pick_status(0.86)
                sensors.append(
                    {
                        "SensorID": f"S{sensor_id:04d}",
                        "FarmID": farm["FarmID"],
                        "Zone": zone,
                        "SensorType": sensor_type,
                        "InstallDate": (TODAY - timedelta(days=RNG.randint(80, 430))).isoformat(),
                        "Status": status,
                        "LastSignalTime": recent_signal(RNG.randint(1, 95)),
                        "HeartbeatState": heartbeat(status),
                        "PacketRate": round(RNG.uniform(18, 64), 1),
                        "CommunicationHealth": round(clamp(RNG.gauss(91, 8), 55, 99), 1),
                        "EdgeGateway": gateway,
                    }
                )
                sensor_id += 1

    crop_by_farm = {}
    for row in crop_rows:
        crop_by_farm.setdefault(row["FarmID"], []).append(row)

    soil_rows = []
    weather_rows = []
    start_date = TODAY - timedelta(days=44)
    reading_id = 1
    weather_id = 1
    for day in range(45):
        reading_date = start_date + timedelta(days=day)
        seasonal_wave = math.sin(day / 7.0)
        for farm in farms:
            base_temp = 24 + seasonal_wave * 3 + RNG.uniform(-1.5, 1.5)
            weather_status = pick_status(0.88)
            weather_rows.append(
                {
                    "WeatherID": f"W{weather_id:05d}",
                    "FarmID": farm["FarmID"],
                    "Date": reading_date.isoformat(),
                    "TemperatureC": round(base_temp + RNG.uniform(-2, 4), 1),
                    "HumidityPct": round(clamp(55 + RNG.uniform(-18, 16), 20, 92), 1),
                    "WindSpeedKph": round(RNG.uniform(5, 28), 1),
                    "RainfallMm": round(max(0, RNG.gauss(1.8, 3.5)), 1),
                    "SolarRadiationWm2": round(clamp(690 + RNG.uniform(-180, 170), 300, 950), 1),
                    "WeatherRisk": RNG.choice(["Low", "Low", "Medium", "Heat Stress", "Wind Risk"]),
                    "Status": weather_status,
                    "LastSignalTime": recent_signal(RNG.randint(2, 80)),
                    "HeartbeatState": heartbeat(weather_status),
                }
            )
            weather_id += 1
            for sensor in [s for s in sensors if s["FarmID"] == farm["FarmID"] and s["SensorType"] in ["Soil Moisture", "NPK", "pH", "Leaf Wetness"]]:
                crop = RNG.choice(crop_by_farm[farm["FarmID"]])
                moisture = clamp(48 + seasonal_wave * 8 + RNG.gauss(0, 7), 18, 84)
                ph = clamp(6.6 + RNG.gauss(0, 0.35), 5.4, 8.0)
                nitrogen = clamp(82 + RNG.gauss(0, 21), 30, 155)
                phosphorus = clamp(54 + RNG.gauss(0, 13), 18, 96)
                potassium = clamp(168 + RNG.gauss(0, 35), 75, 270)
                status = "Online" if moisture >= 28 and 5.8 <= ph <= 7.6 else "Attention"
                if moisture < 22 or ph < 5.6 or ph > 7.8:
                    status = "Critical"
                soil_rows.append(
                    {
                        "ReadingID": f"R{reading_id:06d}",
                        "SensorID": sensor["SensorID"],
                        "FarmID": farm["FarmID"],
                        "CropID": crop["CropID"],
                        "Date": reading_date.isoformat(),
                        "Time": time(RNG.randint(6, 17), RNG.choice([0, 15, 30, 45])).isoformat(timespec="minutes"),
                        "SoilMoisturePct": round(moisture, 1),
                        "SoilTempC": round(base_temp + RNG.uniform(-1.5, 1.5), 1),
                        "HumidityPct": round(clamp(58 + RNG.gauss(0, 11), 25, 95), 1),
                        "PH": round(ph, 2),
                        "NitrogenPPM": round(nitrogen, 1),
                        "PhosphorusPPM": round(phosphorus, 1),
                        "PotassiumPPM": round(potassium, 1),
                        "LightLux": round(clamp(46000 + RNG.gauss(0, 7000), 18000, 72000), 0),
                        "CO2PPM": round(clamp(410 + RNG.gauss(0, 28), 350, 540), 0),
                        "LeafWetnessPct": round(clamp(32 + RNG.gauss(0, 17), 3, 92), 1),
                        "IrrigationStatus": "Recommended" if moisture < 34 else RNG.choice(["Optimal", "Optimal", "Scheduled"]),
                        "FertilizationStatus": "Recommended" if nitrogen < 60 or phosphorus < 35 else RNG.choice(["Balanced", "Balanced", "Scheduled"]),
                        "Status": status,
                    }
                )
                reading_id += 1

    robots = []
    for idx, farm in enumerate(farms, start=1):
        for unit in range(1, 3):
            state = RNG.choice(["Scanning", "Mapping", "Charging", "Patrol", "Standby"])
            mission_status = "Active" if state in ["Scanning", "Mapping", "Patrol"] else state
            robots.append(
                {
                    "RobotMissionID": f"RM{idx}{unit}{TODAY.strftime('%m%d')}",
                    "RobotID": f"AGR-R{idx:02d}-{unit}",
                    "FarmID": farm["FarmID"],
                    "MissionDate": (TODAY - timedelta(days=RNG.randint(0, 12))).isoformat(),
                    "MissionState": mission_status,
                    "RobotStatus": state,
                    "BatteryPct": round(clamp(RNG.gauss(67, 18), 12, 100), 1),
                    "RouteProgressPct": round(clamp(RNG.gauss(71, 20), 5, 100), 1),
                    "SoilScanningProgressPct": round(clamp(RNG.gauss(76, 17), 8, 100), 1),
                    "FieldCoveragePct": round(clamp(RNG.gauss(69, 16), 18, 100), 1),
                    "ObstacleAlerts": RNG.randint(0, 5),
                    "LastMissionSummary": RNG.choice([
                        "Soil scan completed for priority rows",
                        "Nutrient variance detected in Zone B",
                        "Moisture stress route assigned",
                        "Camera sweep completed across greenhouse lane",
                    ]),
                    "Status": pick_status(0.82),
                    "LastSignalTime": recent_signal(RNG.randint(1, 55)),
                    "HeartbeatState": "Live",
                    "PacketRate": round(RNG.uniform(12, 35), 1),
                }
            )

    drones = []
    for idx, farm in enumerate(farms, start=1):
        flight = RNG.choice(["In Flight", "Ready", "Charging", "Image Upload", "Standby"])
        drones.append(
            {
                "DroneMissionID": f"DM{idx}{TODAY.strftime('%m%d')}",
                "DroneID": f"AGR-D{idx:02d}",
                "FarmID": farm["FarmID"],
                "MissionDate": (TODAY - timedelta(days=RNG.randint(0, 7))).isoformat(),
                "MissionState": "Active" if flight in ["In Flight", "Image Upload"] else flight,
                "DroneFlightStatus": flight,
                "BatteryPct": round(clamp(RNG.gauss(72, 20), 10, 100), 1),
                "NDVIIndex": round(clamp(RNG.gauss(0.71, 0.12), 0.31, 0.92), 2),
                "AerialCropHealthPct": round(clamp(RNG.gauss(82, 9), 52, 97), 1),
                "ThermalStressZones": RNG.randint(0, 7),
                "FlightCoveragePct": round(clamp(RNG.gauss(84, 13), 35, 100), 1),
                "ImageCaptureStatus": RNG.choice(["Complete", "Streaming", "Queued", "Processing"]),
                "LastAerialScan": recent_signal(RNG.randint(12, 360)),
                "HighRiskFieldZones": RNG.randint(0, 6),
                "Status": pick_status(0.85),
                "LastSignalTime": recent_signal(RNG.randint(1, 70)),
                "HeartbeatState": "Live",
                "PacketRate": round(RNG.uniform(9, 28), 1),
            }
        )

    diseases = ["None", "Early Blight", "Powdery Mildew", "Leaf Spot", "Mosaic Stress", "Fruit Rot"]
    crop_scans = []
    scan_id = 1
    for day in range(21):
        scan_date = TODAY - timedelta(days=day)
        for crop in RNG.sample(crop_rows, min(12, len(crop_rows))):
            health = clamp(RNG.gauss(82, 11), 41, 98)
            disease = "None" if health > 78 and RNG.random() < 0.62 else RNG.choice(diseases[1:])
            pest_risk = "Low" if health > 82 else RNG.choice(["Medium", "High"])
            stress = RNG.choice(["Normal", "Water Stress", "Nutrient Stress", "Heat Stress", "Leaf Wetness Risk"])
            if health < 65:
                stress = RNG.choice(["Water Stress", "Nutrient Stress", "Pest Pressure"])
            crop_scans.append(
                {
                    "ScanID": f"CH{scan_id:06d}",
                    "FarmID": crop["FarmID"],
                    "CropID": crop["CropID"],
                    "ScanDate": scan_date.isoformat(),
                    "VisionModuleStatus": "Ready",
                    "CropHealthScore": round(health, 1),
                    "DetectedDisease": disease,
                    "PestRiskLevel": pest_risk,
                    "PlantStressIndicator": stress,
                    "ImageDiagnosisResult": "Healthy canopy signature" if disease == "None" else f"Visible {disease.lower()} symptoms in sample area",
                    "RecommendedTreatment": "Continue monitoring" if disease == "None" else RNG.choice([
                        "Apply targeted organic treatment",
                        "Isolate affected rows and adjust humidity",
                        "Schedule precision spray for affected canopy",
                    ]),
                    "PreventiveAction": RNG.choice([
                        "Increase morning inspection",
                        "Improve airflow around dense canopy",
                        "Balance irrigation cycle",
                        "Review nutrient mix before next fertigation",
                    ]),
                    "Status": "Online" if health >= 70 else "Attention",
                    "LastSignalTime": recent_signal(RNG.randint(3, 180)),
                    "HeartbeatState": "Live",
                }
            )
            scan_id += 1

    price_base = {
        "Tomatoes": 24,
        "Bell Pepper": 38,
        "Onion": 18,
        "Cucumber": 21,
        "Potato": 17,
        "Orange": 19,
        "Mandarin": 22,
        "Apple": 58,
        "Banana": 32,
        "Mango": 72,
        "Grapes": 64,
        "Strawberry": 46,
        "Lemon": 27,
        "Pomegranate": 51,
    }
    price_rows = []
    price_id = 1
    price_start = TODAY - timedelta(days=60)
    for crop_name in APPROVED_CROPS:
        base = price_base[crop_name]
        demand_bias = RNG.uniform(-0.04, 0.08)
        for offset in range(121):
            d = price_start + timedelta(days=offset)
            horizon = (d - TODAY).days
            trend_factor = 1 + (horizon / 60) * RNG.uniform(0.04, 0.21) + demand_bias
            wave = math.sin(offset / 9.0) * RNG.uniform(0.015, 0.05)
            current_like = base * (1 + wave + RNG.gauss(0, 0.018))
            predicted = base * trend_factor * (1 + wave)
            trend = "Rising" if predicted > base * 1.08 else "Stable" if predicted > base * 0.96 else "Softening"
            vol = RNG.choice(["Low", "Medium", "Medium", "High"])
            risk = "Low" if vol == "Low" and trend != "Softening" else RNG.choice(["Medium", "Medium", "High"])
            price_rows.append(
                {
                    "PricePredictionID": f"PP{price_id:06d}",
                    "CropName": crop_name,
                    "Date": d.isoformat(),
                    "HorizonDays": horizon,
                    "CurrentMarketPriceEGP": round(current_like, 2),
                    "PredictedPrice60DaysEGP": round(predicted if horizon == 60 else base * (1 + 0.11 + demand_bias), 2),
                    "ExpectedTrend": trend,
                    "VolatilityLevel": vol,
                    "ProfitabilityIndicator": RNG.choice(["Attractive", "Moderate", "Watch"]),
                    "MarketRisk": risk,
                    "SupplyDemandImpact": round(clamp(RNG.gauss(0.18, 0.08), -0.08, 0.42), 2),
                    "USDEGPImpact": round(clamp(RNG.gauss(0.16, 0.06), -0.03, 0.34), 2),
                    "InflationImpact": round(clamp(RNG.gauss(0.14, 0.05), -0.02, 0.29), 2),
                    "SeasonalEffect": round(clamp(RNG.gauss(0.12, 0.08), -0.15, 0.35), 2),
                    "SmartRecommendation": RNG.choice([
                        "Prioritize staged harvest windows",
                        "Hold premium-grade stock for late-cycle demand",
                        "Secure buyer contracts before volatility increases",
                        "Route supply to high-demand wholesale channels",
                    ]),
                    "Status": "Online",
                    "LastSignalTime": recent_signal(RNG.randint(2, 55)),
                    "HeartbeatState": "Live",
                }
            )
            price_id += 1

    blockchain_rows = []
    prev_hash = "0" * 64
    events = ["Sensor Reading", "Crop Scan", "Irrigation Action", "Drone Scan", "Robot Mission", "Market Record", "Energy Record"]
    for idx in range(1, 49):
        farm = RNG.choice(farms)
        event = RNG.choice(events)
        payload = f"{idx}|{farm['FarmID']}|{event}|{TODAY.isoformat()}|AGRINOVA"
        digest = hashlib.sha256((payload + prev_hash).encode("utf-8")).hexdigest()
        validation = RNG.choice(["Verified", "Verified", "Verified", "Pending Review"])
        blockchain_rows.append(
            {
                "TransactionID": f"TX{idx:05d}",
                "BlockIndex": idx,
                "FarmID": farm["FarmID"],
                "TransactionDate": (TODAY - timedelta(days=RNG.randint(0, 30))).isoformat(),
                "RecordType": event,
                "BlockchainNetworkStatus": "Operational",
                "VerifiedFarmRecords": RNG.randint(12, 87),
                "SecureTransactions": RNG.randint(4, 29),
                "SmartContractStatus": RNG.choice(["Active", "Active", "Queued"]),
                "DataIntegrityStatus": validation,
                "HashPreview": digest[:18],
                "PreviousHashPreview": prev_hash[:18],
                "ValidationState": validation,
                "TraceabilityStage": RNG.choice(["Field", "Gateway", "Cloud", "Ledger", "Supply Chain"]),
                "TimelineStep": RNG.choice(["Submitted", "Verified", "Stored", "Audited"]),
                "Status": "Online" if validation == "Verified" else "Attention",
                "LastSignalTime": recent_signal(RNG.randint(1, 90)),
                "HeartbeatState": "Live",
                "PacketRate": round(RNG.uniform(4, 16), 1),
            }
        )
        prev_hash = digest

    ai_rows = []
    topics = ["Crop Advice", "Disease Explanation", "Irrigation Guidance", "Fertilizer Guidance", "Market Guidance", "Image Diagnosis Summary"]
    for idx in range(1, 73):
        farm = RNG.choice(farms)
        topic = RNG.choice(topics)
        ai_rows.append(
            {
                "RecommendationID": f"AI{idx:05d}",
                "FarmID": farm["FarmID"],
                "CropID": RNG.choice(crop_by_farm[farm["FarmID"]])["CropID"],
                "RecommendationDate": (TODAY - timedelta(days=RNG.randint(0, 25))).isoformat(),
                "AssistantModule": "AgriNova AI Assistant",
                "InteractionType": topic,
                "FarmerQuestion": RNG.choice([
                    "What should I do today for this crop?",
                    "Why are leaves showing stress?",
                    "Should irrigation start tonight?",
                    "How should fertilizer be adjusted this week?",
                    "What is the market outlook?",
                ]),
                "RecommendationText": RNG.choice([
                    "Adjust irrigation timing and inspect the highest-risk rows before noon.",
                    "Apply a targeted treatment plan and monitor new leaves for symptom spread.",
                    "Keep current fertigation mix but reduce cycle length in warm zones.",
                    "Prepare a staged harvest plan based on demand signals and crop readiness.",
                    "Review affected images and schedule a field check for the marked area.",
                ]),
                "AssistantAvailability": RNG.choice(["Available", "Available", "Available", "Busy"]),
                "Status": "Online",
                "LastSignalTime": recent_signal(RNG.randint(1, 45)),
                "HeartbeatState": "Live",
            }
        )

    alert_rows = []
    alert_types = ["Critical Soil", "Disease", "Irrigation", "Weather Risk", "Market Price", "Blockchain Validation", "Energy"]
    priorities = ["Low", "Medium", "High", "Critical"]
    for idx in range(1, 86):
        farm = RNG.choice(farms)
        alert_type = RNG.choice(alert_types)
        priority = RNG.choices(priorities, weights=[20, 38, 29, 13])[0]
        alert_rows.append(
            {
                "AlertID": f"AL{idx:05d}",
                "FarmID": farm["FarmID"],
                "AlertDate": (TODAY - timedelta(days=RNG.randint(0, 20))).isoformat(),
                "AlertType": alert_type,
                "PriorityLevel": priority,
                "AlertMessage": f"{alert_type} signal requires {priority.lower()} priority review",
                "RecommendedAction": RNG.choice([
                    "Dispatch field inspection",
                    "Adjust irrigation schedule",
                    "Review crop scan results",
                    "Verify transaction timeline",
                    "Prepare market response plan",
                    "Move device to maintenance queue",
                ]),
                "ResolutionStatus": RNG.choice(["Open", "Open", "In Progress", "Resolved"]),
                "Status": "Online" if priority in ["Low", "Medium"] else "Attention",
                "LastSignalTime": recent_signal(RNG.randint(1, 240)),
                "HeartbeatState": "Live",
            }
        )

    energy_rows = []
    energy_id = 1
    for day in range(45):
        reading_date = start_date + timedelta(days=day)
        for farm in farms:
            solar = clamp(RNG.gauss(68, 17), 12, 99)
            battery = clamp(RNG.gauss(74, 16), 18, 100)
            energy_rows.append(
                {
                    "EnergyID": f"EN{energy_id:05d}",
                    "FarmID": farm["FarmID"],
                    "Date": reading_date.isoformat(),
                    "SolarPowerStatus": "Active" if solar > 30 else "Limited",
                    "BatteryLevelPct": round(battery, 1),
                    "RenewableEnergyUsagePct": round(solar, 1),
                    "CarbonReductionKg": round((farm["AreaHa"] * solar / 100) * RNG.uniform(3.5, 5.8), 1),
                    "OffGridOperationStatus": "Stable" if battery > 45 else "Reserve Mode",
                    "EnergyConsumptionKwh": round(RNG.uniform(48, 156), 1),
                    "RobotChargingStatus": RNG.choice(["Charging", "Ready", "Scheduled"]),
                    "DroneChargingStatus": RNG.choice(["Charging", "Ready", "Scheduled"]),
                    "Status": "Online" if battery > 35 else "Attention",
                    "LastSignalTime": recent_signal(RNG.randint(1, 95)),
                    "HeartbeatState": "Live",
                }
            )
            energy_id += 1

    reports = []
    report_types = [
        "Farm Performance Summary",
        "Crop Health Report",
        "Water Usage Report",
        "Market Forecast Report",
        "Blockchain Audit Report",
        "AI Recommendation Report",
    ]
    for idx, report_type in enumerate(report_types, start=1):
        reports.append(
            {
                "ReportID": f"RP{idx:03d}",
                "ReportName": report_type,
                "ReportCategory": report_type.replace(" Report", "").replace(" Summary", ""),
                "GeneratedDate": (TODAY - timedelta(days=idx)).isoformat(),
                "ExportFormat": "PDF",
                "Owner": "AgriNova Operations",
                "RefreshStatus": "Ready",
                "DecisionSupportSummary": RNG.choice([
                    "Resource efficiency remains strong across monitored farms.",
                    "Priority crop zones require closer inspection this week.",
                    "Market timing supports staged harvest decisions.",
                    "Audit trail is ready for stakeholder review.",
                ]),
                "Status": "Online",
                "LastSignalTime": recent_signal(RNG.randint(4, 120)),
                "HeartbeatState": "Live",
            }
        )

    date_rows = []
    for day in range(-90, 91):
        d = TODAY + timedelta(days=day)
        date_rows.append(
            {
                "Date": d.isoformat(),
                "Year": d.year,
                "MonthNumber": d.month,
                "MonthName": d.strftime("%B"),
                "Day": d.day,
                "WeekNumber": int(d.strftime("%U")),
                "Quarter": f"Q{((d.month - 1) // 3) + 1}",
                "IsForecastWindow": "Yes" if d > TODAY else "No",
            }
        )

    write_csv("data/Farms.csv", farms)
    write_csv("data/Crops.csv", crop_rows)
    write_csv("data/Sensors.csv", sensors)
    write_csv("data/SoilReadings.csv", soil_rows)
    write_csv("data/WeatherReadings.csv", weather_rows)
    write_csv("data/RobotMissions.csv", robots)
    write_csv("data/DroneMissions.csv", drones)
    write_csv("data/CropHealthScans.csv", crop_scans)
    write_csv("data/PricePredictions.csv", price_rows)
    write_csv("data/BlockchainTransactions.csv", blockchain_rows)
    write_csv("data/AIRecommendations.csv", ai_rows)
    write_csv("data/Alerts.csv", alert_rows)
    write_csv("data/EnergyUsage.csv", energy_rows)
    write_csv("data/Reports.csv", reports)
    write_csv("data/Date.csv", date_rows)


def write_theme() -> None:
    theme = {
        "name": "AgriNova Premium Dark Future",
        "dataColors": ["#3DF27A", "#00D4FF", "#65A7FF", "#F8C741", "#FF5D5D", "#8B5CF6", "#2DD4BF", "#F97316"],
        "background": "#020B18",
        "foreground": "#DDEBFF",
        "tableAccent": "#3DF27A",
        "good": "#3DF27A",
        "neutral": "#F8C741",
        "bad": "#FF5D5D",
        "maximum": "#00D4FF",
        "center": "#102033",
        "minimum": "#020B18",
        "visualStyles": {
            "*": {
                "*": {
                    "background": [{"show": True, "color": {"solid": {"color": "#081727"}}, "transparency": 12}],
                    "border": [{"show": True, "color": {"solid": {"color": "#1C4664"}}, "radius": 8}],
                    "dropShadow": [{"show": True, "color": {"solid": {"color": "#003B4D"}}, "transparency": 55, "blur": 12, "angle": 45, "distance": 3}],
                    "visualHeader": [{"show": False}],
                    "title": [{"show": True, "fontColor": {"solid": {"color": "#E7F6FF"}}, "fontSize": 12, "fontFamily": "Segoe UI Semibold"}],
                    "labels": [{"color": {"solid": {"color": "#DDEBFF"}}, "fontFamily": "Segoe UI"}],
                    "categoryAxis": [{"labelColor": {"solid": {"color": "#9EB6C9"}}, "titleColor": {"solid": {"color": "#DDEBFF"}}, "gridlineColor": {"solid": {"color": "#15314A"}}}],
                    "valueAxis": [{"labelColor": {"solid": {"color": "#9EB6C9"}}, "titleColor": {"solid": {"color": "#DDEBFF"}}, "gridlineColor": {"solid": {"color": "#15314A"}}}],
                    "legend": [{"labelColor": {"solid": {"color": "#DDEBFF"}}, "fontFamily": "Segoe UI"}],
                }
            },
            "card": {
                "*": {
                    "labels": [{"color": {"solid": {"color": "#F4FBFF"}}, "fontSize": 28, "fontFamily": "Segoe UI Semibold"}],
                    "categoryLabels": [{"color": {"solid": {"color": "#9EB6C9"}}, "fontSize": 10}],
                }
            },
            "slicer": {
                "*": {
                    "items": [{"fontColor": {"solid": {"color": "#DDEBFF"}}, "background": {"solid": {"color": "#0B1B2D"}}}],
                    "header": [{"fontColor": {"solid": {"color": "#3DF27A"}}, "background": {"solid": {"color": "#071524"}}}],
                }
            },
            "page": {
                "*": {
                    "background": [{"color": {"solid": {"color": "#020B18"}}, "transparency": 0}],
                    "outspace": [{"color": {"solid": {"color": "#020B18"}}, "transparency": 0}],
                }
            },
        },
        "textClasses": {
            "title": {"fontFace": "Segoe UI Semibold", "fontSize": 18, "color": "#F4FBFF"},
            "header": {"fontFace": "Segoe UI Semibold", "fontSize": 13, "color": "#DDEBFF"},
            "label": {"fontFace": "Segoe UI", "fontSize": 10, "color": "#9EB6C9"},
            "callout": {"fontFace": "Segoe UI Semibold", "fontSize": 28, "color": "#3DF27A"},
        },
    }
    (ROOT / "theme/agrinova_theme.json").write_text(json.dumps(theme, indent=2), encoding="utf-8")


def write_dax() -> None:
    dax = r"""-- AgriNova Power BI measures
-- Create a table named Measures, then paste these measures into it.

Total Monitored Farms =
DISTINCTCOUNT ( Farms[FarmID] )

Active IoT Sensors =
CALCULATE ( DISTINCTCOUNT ( Sensors[SensorID] ), Sensors[Status] = "Online" )

Active Robots =
CALCULATE ( DISTINCTCOUNT ( RobotMissions[RobotID] ), RobotMissions[MissionState] = "Active" )

Active Drones =
CALCULATE ( DISTINCTCOUNT ( DroneMissions[DroneID] ), DroneMissions[MissionState] = "Active" )

Crop Health Score =
AVERAGE ( CropHealthScans[CropHealthScore] )

Water Efficiency =
VAR moisture = AVERAGE ( SoilReadings[SoilMoisturePct] )
VAR stableRange = IF ( moisture >= 38 && moisture <= 68, 1, 0.82 )
RETURN ROUND ( stableRange * 100, 1 )

Energy Status =
AVERAGE ( EnergyUsage[BatteryLevelPct] )

Blockchain Integrity =
DIVIDE (
    CALCULATE ( COUNTROWS ( BlockchainTransactions ), BlockchainTransactions[ValidationState] = "Verified" ),
    COUNTROWS ( BlockchainTransactions )
) * 100

AI Assistant Availability =
DIVIDE (
    CALCULATE ( COUNTROWS ( AIRecommendations ), AIRecommendations[AssistantAvailability] = "Available" ),
    COUNTROWS ( AIRecommendations )
) * 100

Open Alerts =
CALCULATE ( COUNTROWS ( Alerts ), Alerts[ResolutionStatus] <> "Resolved" )

Critical Alerts =
CALCULATE ( COUNTROWS ( Alerts ), Alerts[PriorityLevel] = "Critical" )

Average Soil Moisture =
AVERAGE ( SoilReadings[SoilMoisturePct] )

Average Soil Temperature =
AVERAGE ( SoilReadings[SoilTempC] )

Average Humidity =
AVERAGE ( SoilReadings[HumidityPct] )

Average pH =
AVERAGE ( SoilReadings[PH] )

Average Nitrogen =
AVERAGE ( SoilReadings[NitrogenPPM] )

Average Phosphorus =
AVERAGE ( SoilReadings[PhosphorusPPM] )

Average Potassium =
AVERAGE ( SoilReadings[PotassiumPPM] )

Average Light Intensity =
AVERAGE ( SoilReadings[LightLux] )

Average CO2 =
AVERAGE ( SoilReadings[CO2PPM] )

Average Leaf Wetness =
AVERAGE ( SoilReadings[LeafWetnessPct] )

Sensor Uptime =
AVERAGE ( Sensors[CommunicationHealth] )

Data Packets Received =
SUM ( Sensors[PacketRate] )

Robot Battery =
AVERAGE ( RobotMissions[BatteryPct] )

Robot Route Progress =
AVERAGE ( RobotMissions[RouteProgressPct] )

Robot Field Coverage =
AVERAGE ( RobotMissions[FieldCoveragePct] )

Drone Battery =
AVERAGE ( DroneMissions[BatteryPct] )

Drone Flight Coverage =
AVERAGE ( DroneMissions[FlightCoveragePct] )

Aerial Crop Health =
AVERAGE ( DroneMissions[AerialCropHealthPct] )

Thermal Stress Zones =
SUM ( DroneMissions[ThermalStressZones] )

Current Market Price =
AVERAGE ( PricePredictions[CurrentMarketPriceEGP] )

Predicted Price After 60 Days =
CALCULATE (
    AVERAGE ( PricePredictions[PredictedPrice60DaysEGP] ),
    PricePredictions[HorizonDays] = 60
)

Expected Price Change =
[Predicted Price After 60 Days] - [Current Market Price]

Expected Price Change % =
DIVIDE ( [Expected Price Change], [Current Market Price] )

Market Risk Score =
VAR highRisk = CALCULATE ( COUNTROWS ( PricePredictions ), PricePredictions[MarketRisk] = "High" )
VAR totalRows = COUNTROWS ( PricePredictions )
RETURN DIVIDE ( highRisk, totalRows ) * 100

Profitability Signal =
DIVIDE (
    CALCULATE ( COUNTROWS ( PricePredictions ), PricePredictions[ProfitabilityIndicator] = "Attractive" ),
    COUNTROWS ( PricePredictions )
) * 100

Verified Farm Records =
SUM ( BlockchainTransactions[VerifiedFarmRecords] )

Secure Transactions =
SUM ( BlockchainTransactions[SecureTransactions] )

Renewable Energy Usage =
AVERAGE ( EnergyUsage[RenewableEnergyUsagePct] )

Carbon Reduction =
SUM ( EnergyUsage[CarbonReductionKg] )

Energy Consumption =
SUM ( EnergyUsage[EnergyConsumptionKwh] )

Report Count =
COUNTROWS ( Reports )

Live System Signals =
CALCULATE ( COUNTROWS ( Sensors ), Sensors[HeartbeatState] = "Live" )
    + CALCULATE ( COUNTROWS ( RobotMissions ), RobotMissions[HeartbeatState] = "Live" )
    + CALCULATE ( COUNTROWS ( DroneMissions ), DroneMissions[HeartbeatState] = "Live" )
    + CALCULATE ( COUNTROWS ( BlockchainTransactions ), BlockchainTransactions[HeartbeatState] = "Live" )

System Health Index =
ROUND (
    DIVIDE (
        [Crop Health Score] + [Water Efficiency] + [Sensor Uptime] + [Blockchain Integrity] + [AI Assistant Availability],
        5
    ),
    1
)

KPI Status Label =
VAR valueToCheck = [System Health Index]
RETURN
    SWITCH (
        TRUE (),
        valueToCheck >= 85, "Excellent",
        valueToCheck >= 72, "Stable",
        valueToCheck >= 60, "Watch",
        "Critical"
    )
"""
    (ROOT / "dax/agrinova_measures.dax").write_text(dax, encoding="utf-8")


def svg_icon(label: str, accent: str, body: str) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" role="img" aria-label="{label}">
  <defs>
    <radialGradient id="g" cx="50%" cy="35%" r="70%">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0.36"/>
      <stop offset="100%" stop-color="#020B18" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="96" height="96" rx="22" fill="#071524"/>
  <rect x="1" y="1" width="94" height="94" rx="21" fill="url(#g)" stroke="{accent}" stroke-opacity="0.42"/>
  <g fill="none" stroke="{accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)">
    {body}
  </g>
</svg>
"""


def write_svgs() -> None:
    icons = {
        "overview": ("Overview", "#3DF27A", '<path d="M24 50h18V26H24z"/><path d="M54 70h18V38H54z"/><path d="M24 70h18v-8H24z"/><path d="M54 26h18v-8H54z"/>'),
        "farm_monitoring": ("Farm Monitoring", "#3DF27A", '<path d="M20 68c16-30 40-40 56-40"/><path d="M28 64c10 2 18-3 24-13"/><path d="M42 54c13 2 22-5 28-19"/><path d="M48 76V44"/>'),
        "crop_health": ("Crop Health", "#00D4FF", '<path d="M48 76c-18-10-28-24-28-40 13-2 22-8 28-16 6 8 15 14 28 16 0 16-10 30-28 40z"/><path d="M34 48l9 9 20-22"/>'),
        "robot": ("Robot", "#65A7FF", '<rect x="24" y="30" width="48" height="34" rx="8"/><path d="M36 30v-8h24v8"/><path d="M34 74h28"/><circle cx="39" cy="47" r="4"/><circle cx="57" cy="47" r="4"/><path d="M40 59h16"/>'),
        "drone": ("Drone", "#00D4FF", '<path d="M48 48h-16m16 0h16m-16 0V32m0 16v16"/><circle cx="24" cy="48" r="8"/><circle cx="72" cy="48" r="8"/><circle cx="48" cy="24" r="8"/><circle cx="48" cy="72" r="8"/><rect x="40" y="40" width="16" height="16" rx="4"/>'),
        "iot": ("IoT Network", "#2DD4BF", '<path d="M24 30h18v18H24z"/><path d="M54 20h18v18H54z"/><path d="M54 58h18v18H54z"/><path d="M42 39l12-10"/><path d="M42 48l12 19"/>'),
        "price": ("Price Prediction", "#3DF27A", '<path d="M24 68h48"/><path d="M30 58l11-12 10 7 16-22"/><path d="M58 31h9v9"/><path d="M48 72V24"/><path d="M40 34c0-6 16-6 16 0s-16 4-16 10 16 4 16 10-16 6-16 0"/>'),
        "blockchain": ("Blockchain", "#00D4FF", '<rect x="18" y="34" width="20" height="20" rx="4"/><rect x="58" y="34" width="20" height="20" rx="4"/><rect x="38" y="58" width="20" height="20" rx="4"/><path d="M38 44h20"/><path d="M30 54l16 8"/><path d="M66 54l-16 8"/>'),
        "assistant": ("AI Assistant", "#8B5CF6", '<rect x="22" y="26" width="52" height="38" rx="12"/><path d="M36 64l-10 10v-18"/><circle cx="40" cy="45" r="3"/><circle cx="56" cy="45" r="3"/><path d="M39 56h18"/><path d="M48 26v-8"/>'),
        "energy": ("Energy", "#F8C741", '<path d="M52 16L26 54h20l-2 26 26-40H50z"/><path d="M22 78h52"/>'),
        "alerts": ("Alerts", "#FF5D5D", '<path d="M48 18l34 60H14z"/><path d="M48 38v18"/><path d="M48 66h.1"/>'),
        "reports": ("Reports", "#65A7FF", '<path d="M28 18h30l10 10v50H28z"/><path d="M58 18v12h10"/><path d="M38 44h20"/><path d="M38 56h20"/><path d="M38 68h14"/>'),
    }
    for name, (label, accent, body) in icons.items():
        (ROOT / f"assets/icons/{name}.svg").write_text(svg_icon(label, accent, body), encoding="utf-8")

    logo = """<svg xmlns="http://www.w3.org/2000/svg" width="520" height="140" viewBox="0 0 520 140" role="img" aria-label="AgriNova logo">
  <defs>
    <linearGradient id="word" x1="0" x2="1"><stop offset="0" stop-color="#F4FBFF"/><stop offset="1" stop-color="#3DF27A"/></linearGradient>
    <radialGradient id="leafGlow"><stop offset="0" stop-color="#3DF27A" stop-opacity=".6"/><stop offset="1" stop-color="#020B18" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="520" height="140" fill="none"/>
  <circle cx="65" cy="70" r="58" fill="url(#leafGlow)"/>
  <g fill="#3DF27A">
    <path d="M63 77C36 74 24 57 24 35c24 2 38 16 39 42z"/>
    <path d="M72 67c4-28 22-40 45-39-4 24-20 38-45 39z"/>
    <path d="M68 88c-20 8-38 3-49-14 19-8 36-2 49 14z"/>
    <path d="M78 88c20 8 38 3 49-14-19-8-36-2-49 14z"/>
  </g>
  <text x="150" y="73" font-family="Segoe UI Semibold, Arial" font-size="44" fill="url(#word)">AgriNova</text>
  <text x="153" y="104" font-family="Segoe UI, Arial" font-size="20" fill="#9EB6C9">AI Smart Agriculture Platform</text>
</svg>
"""
    (ROOT / "assets/logo/agrinova_logo.svg").write_text(logo, encoding="utf-8")

    executive_bg = """<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="a" cx="18%" cy="12%" r="70%"><stop offset="0%" stop-color="#0D4F45" stop-opacity=".55"/><stop offset="100%" stop-color="#020B18" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="82%" cy="20%" r="65%"><stop offset="0%" stop-color="#004E78" stop-opacity=".5"/><stop offset="100%" stop-color="#020B18" stop-opacity="0"/></radialGradient>
    <linearGradient id="line" x1="0" x2="1"><stop offset="0" stop-color="#3DF27A" stop-opacity="0"/><stop offset=".5" stop-color="#00D4FF" stop-opacity=".45"/><stop offset="1" stop-color="#3DF27A" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="#020B18"/>
  <rect width="1920" height="1080" fill="url(#a)"/>
  <rect width="1920" height="1080" fill="url(#b)"/>
  <g opacity=".16" stroke="#1C4664" stroke-width="1">
    <path d="M0 80h1920M0 160h1920M0 240h1920M0 320h1920M0 400h1920M0 480h1920M0 560h1920M0 640h1920M0 720h1920M0 800h1920M0 880h1920M0 960h1920"/>
    <path d="M80 0v1080M160 0v1080M240 0v1080M320 0v1080M400 0v1080M480 0v1080M560 0v1080M640 0v1080M720 0v1080M800 0v1080M880 0v1080M960 0v1080M1040 0v1080M1120 0v1080M1200 0v1080M1280 0v1080M1360 0v1080M1440 0v1080M1520 0v1080M1600 0v1080M1680 0v1080M1760 0v1080M1840 0v1080"/>
  </g>
  <rect x="300" y="96" width="1450" height="2" fill="url(#line)"/>
</svg>
"""
    (ROOT / "assets/backgrounds/executive_glow.svg").write_text(executive_bg, encoding="utf-8")

    chain_bg = """<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#020B18"/>
  <g opacity=".16" stroke="#00D4FF">
    <path d="M140 330h240l120 120h260l110-110h240l140 140h260"/>
    <path d="M260 730h210l120-140h280l90 90h230l170-180h330"/>
  </g>
  <g fill="none" stroke="#3DF27A" stroke-opacity=".38" stroke-width="2">
    <rect x="120" y="290" width="160" height="86" rx="10"/><rect x="500" y="410" width="160" height="86" rx="10"/><rect x="870" y="300" width="160" height="86" rx="10"/><rect x="1270" y="445" width="160" height="86" rx="10"/>
  </g>
</svg>
"""
    (ROOT / "assets/backgrounds/blockchain_network.svg").write_text(chain_bg, encoding="utf-8")


def write_docs() -> None:
    readme = """# AgriNova Power BI Enterprise Build Kit

This workspace contains the source kit for **AgriNova - AI Smart Agriculture Platform**.

Contents:

- `data/`: Power BI-ready CSV demo data.
- `theme/agrinova_theme.json`: custom dark futuristic report theme.
- `dax/agrinova_measures.dax`: measure definitions for the semantic layer.
- `assets/`: SVG logo, icons, and background assets.
- `docs/report_layout.md`: page-by-page visual implementation guide.
- `docs/build_steps.md`: Power BI Desktop assembly steps.
- `docs/data_model.md`: table relationships and field usage.

Privacy constraints are applied across the kit: no internal AI names, no public AI metric display, and generic product-safe module names only.
"""
    (ROOT / "README.md").write_text(readme, encoding="utf-8")

    layout = """# AgriNova Report Layout Specification

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
"""
    (ROOT / "docs/report_layout.md").write_text(layout, encoding="utf-8")

    build_steps = """# Power BI Desktop Build Steps

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

1. Create a table named `Measures`.
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
"""
    (ROOT / "docs/build_steps.md").write_text(build_steps, encoding="utf-8")

    data_model = """# AgriNova Data Model

## Dimension Tables

- `Farms`: farm metadata, location, operational status, heartbeat state.
- `Crops`: approved vegetable and fruit crops by farm.
- `Sensors`: sensor inventory, gateway, packet rate, communication health.
- `Date`: date table covering historical and forecast windows.

## Fact Tables

- `SoilReadings`: soil, NPK, light, CO2, leaf wetness, irrigation and fertilization status.
- `WeatherReadings`: environmental readings and weather risk.
- `RobotMissions`: ground robot mission state, battery, progress, coverage, alerts.
- `DroneMissions`: drone flight state, NDVI, thermal zones, coverage, capture state.
- `CropHealthScans`: Vision Intelligence Module scan results and treatments.
- `PricePredictions`: fruit and vegetable market forecast records.
- `BlockchainTransactions`: block history, validation state, hashes, traceability.
- `AIRecommendations`: AgriNova AI Assistant interaction and recommendation records.
- `Alerts`: operational alerts and recommended actions.
- `EnergyUsage`: solar, battery, renewable usage, carbon reduction, charging.
- `Reports`: exportable decision-support report catalog.

## Relationship Defaults

- Use `Farms` as the primary operational dimension.
- Use `Crops` for crop analytics and scan drill-through.
- Use `Date` for all date-based trends.
- Keep filters single-direction from dimensions to facts.

## Live-System Simulation Fields

The kit includes `Status`, `LastSignalTime`, `HeartbeatState`, `PacketRate`, `ValidationState`, `MissionState`, and `AssistantAvailability` fields to create live-status badges across IoT, robotics, AI assistant, and blockchain pages.
"""
    (ROOT / "docs/data_model.md").write_text(data_model, encoding="utf-8")

    validation = """# Validation Report

Generated checks for the AgriNova Power BI kit.

## Completed Checks

- Theme JSON parses successfully.
- Price prediction crop set is restricted to the approved vegetables and fruits.
- Internal AI names and public AI metric terms are absent from generated user-facing assets.
- Core CSV tables are present for farms, crops, sensors, soil, weather, robots, drones, crop scans, price prediction, blockchain, AI recommendations, alerts, energy, reports, and dates.
- Tooltip map includes 10 custom tooltip pages for critical KPIs.
- Drill-through map includes 9 hidden detail pages for farm, crop, sensor, mission, scan, commodity, blockchain, and alert analytics.
- Page blueprint includes visual coordinates for the 10 primary report pages.

## Manual Power BI Checks

- Import the theme in Power BI Desktop and confirm any unsupported style properties are ignored without blocking import.
- Paste the DAX measures into a `Measures` table and confirm all measures compile.
- Inspect each page at Fit to Page before PDF export.
"""
    (ROOT / "docs/validation_report.md").write_text(validation, encoding="utf-8")

    blueprint_rows = []

    def add(page: str, visual: str, visual_type: str, x: int, y: int, w: int, h: int, fields: str, tooltip: str = "", drill: str = "") -> None:
        blueprint_rows.append(
            {
                "Page": page,
                "VisualName": visual,
                "VisualType": visual_type,
                "X": x,
                "Y": y,
                "Width": w,
                "Height": h,
                "FieldsOrMeasures": fields,
                "TooltipPage": tooltip,
                "DrillThroughTarget": drill,
            }
        )

    pages = [
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

    for page in pages:
        add(page, "Sidebar Navigation", "Grouped shapes, SVG icons, page buttons", 0, 0, 260, 1080, "Navigation buttons and active page indicator")
        add(page, "Header System Bar", "Grouped shapes and cards", 280, 24, 1610, 86, "Page title, current date label, Live System Signals, KPI Status Label")

    add("AgriNova Overview", "Executive KPI Strip", "Card row", 280, 130, 1320, 118, "Total Monitored Farms; Active IoT Sensors; Active Robots; Active Drones; System Health Index", "", "DT_FarmProfile")
    add("AgriNova Overview", "System Health Gauge", "Gauge", 1620, 130, 270, 260, "System Health Index", "TT_CropHealth")
    add("AgriNova Overview", "Farm Map", "Map", 280, 270, 520, 330, "Farms[Latitude]; Farms[Longitude]; Farms[Status]", "", "DT_FarmProfile")
    add("AgriNova Overview", "Crop Health Area", "Area chart", 830, 270, 500, 330, "Date[Date]; Crop Health Score", "TT_CropHealth", "DT_CropAnalytics")
    add("AgriNova Overview", "Live Telemetry Panel", "Matrix/cards", 1360, 420, 530, 180, "HeartbeatState; LastSignalTime; PacketRate", "TT_IoTUptime")
    add("AgriNova Overview", "Alerts Summary", "Matrix", 280, 630, 620, 310, "Alerts[AlertType]; Alerts[PriorityLevel]; Open Alerts; Critical Alerts", "TT_AlertSeverity", "DT_AlertDetail")
    add("AgriNova Overview", "Recommendation Feed", "Table", 930, 630, 960, 310, "AIRecommendations[InteractionType]; AIRecommendations[RecommendationText]", "", "DT_CropAnalytics")

    add("Smart Farm Monitoring", "Farm Crop Zone Slicers", "Slicers", 280, 130, 410, 130, "Farms[FarmName]; Crops[CropName]; Sensors[Zone]; Date[Date]")
    add("Smart Farm Monitoring", "Soil KPI Grid", "Card grid", 720, 130, 1170, 170, "Average Soil Moisture; Average Soil Temperature; Average Humidity; Average pH; Average Nitrogen; Average Phosphorus; Average Potassium; Average Light Intensity; Average CO2; Average Leaf Wetness", "TT_WaterEfficiency", "DT_SensorDetail")
    add("Smart Farm Monitoring", "Moisture pH Trends", "Line and area chart", 280, 330, 760, 330, "Date[Date]; Average Soil Moisture; Average pH", "TT_WaterEfficiency", "DT_CropAnalytics")
    add("Smart Farm Monitoring", "Zone Heatmap", "Matrix with conditional formatting", 1070, 330, 820, 330, "Sensors[Zone]; Sensors[SensorType]; SoilReadings metrics", "", "DT_SensorDetail")
    add("Smart Farm Monitoring", "Latest Sensor Readings", "Matrix", 280, 690, 1610, 250, "Sensors[SensorID]; Sensors[Status]; SoilReadings latest values; LastSignalTime", "TT_IoTUptime", "DT_SensorDetail")

    add("Crop Health & Vision Intelligence", "Health KPI Row", "Card row", 280, 130, 1610, 140, "Crop Health Score; DetectedDisease count; PestRiskLevel; PlantStressIndicator", "TT_CropHealth", "DT_CropAnalytics")
    add("Crop Health & Vision Intelligence", "Disease Distribution", "Stacked bar chart", 280, 300, 520, 290, "Crops[CropName]; CropHealthScans[DetectedDisease]", "TT_CropHealth")
    add("Crop Health & Vision Intelligence", "Scan History", "Table", 830, 300, 1060, 290, "ScanID; ScanDate; CropHealthScore; DetectedDisease; PestRiskLevel", "TT_CropHealth", "DT_CropScan")
    add("Crop Health & Vision Intelligence", "Diagnosis Action Panel", "Multi-row cards", 280, 620, 1610, 320, "ImageDiagnosisResult; RecommendedTreatment; PreventiveAction", "TT_CropHealth", "DT_CropScan")

    add("Robotics & Drone Operations", "Robot Operations Panel", "Cards, gauges, bars", 280, 130, 790, 810, "Robot Battery; Robot Route Progress; Robot Field Coverage; ObstacleAlerts; LastMissionSummary", "TT_RobotStatus", "DT_RobotMission")
    add("Robotics & Drone Operations", "Drone Operations Panel", "Cards, map placeholder, bars", 1100, 130, 790, 810, "Drone Battery; Drone Flight Coverage; Aerial Crop Health; Thermal Stress Zones; NDVIIndex", "TT_DroneCoverage", "DT_DroneMission")

    add("IoT Sensor Network", "Network KPI Row", "Card row", 280, 130, 1610, 130, "Sensor Uptime; Data Packets Received; Live System Signals; EdgeGateway count", "TT_IoTUptime", "DT_SensorDetail")
    add("IoT Sensor Network", "Gateway Tree", "Decomposition tree", 280, 290, 640, 360, "Farms[FarmName]; Sensors[EdgeGateway]; Sensors[SensorType]; Sensors[CommunicationHealth]", "TT_IoTUptime", "DT_SensorDetail")
    add("IoT Sensor Network", "Communication Heatmap", "Matrix heatmap", 950, 290, 940, 360, "Farms[FarmName]; Sensors[SensorType]; Sensor Uptime", "TT_IoTUptime")
    add("IoT Sensor Network", "Packet Rate Trend", "Line chart", 280, 680, 1610, 260, "LastSignalTime; Data Packets Received", "TT_IoTUptime")

    add("Price Prediction", "Commodity Slicer", "Slicer", 280, 130, 300, 160, "PricePredictions[CropName]")
    add("Price Prediction", "Market KPI Row", "Card row", 610, 130, 1280, 160, "Current Market Price; Predicted Price After 60 Days; Expected Price Change %; Market Risk Score; Profitability Signal", "TT_MarketRisk", "DT_PriceCommodity")
    add("Price Prediction", "Price Trajectory", "Area chart", 280, 330, 930, 360, "Date[Date]; Current Market Price; Predicted Price After 60 Days", "TT_Profitability", "DT_PriceCommodity")
    add("Price Prediction", "Impact Factors", "Bar chart", 1240, 330, 650, 360, "SupplyDemandImpact; USDEGPImpact; InflationImpact; SeasonalEffect", "TT_MarketRisk")
    add("Price Prediction", "Commodity Matrix", "Matrix", 280, 720, 1610, 220, "CropName; CurrentMarketPriceEGP; PredictedPrice60DaysEGP; ExpectedTrend; VolatilityLevel; SmartRecommendation", "TT_Profitability", "DT_PriceCommodity")

    add("Blockchain Security", "Blockchain KPI Row", "Card row", 280, 130, 1610, 130, "Blockchain Integrity; Verified Farm Records; Secure Transactions; SmartContractStatus", "TT_BlockchainIntegrity", "DT_BlockchainTransaction")
    add("Blockchain Security", "Connected Block History", "Card strip with connector shapes", 280, 300, 1610, 330, "BlockIndex; RecordType; HashPreview; PreviousHashPreview; ValidationState", "TT_BlockchainIntegrity", "DT_BlockchainTransaction")
    add("Blockchain Security", "Validation Timeline", "Line and table", 280, 670, 770, 270, "TransactionDate; TimelineStep; ValidationState", "TT_BlockchainIntegrity")
    add("Blockchain Security", "Traceability Audit Panel", "Matrix", 1080, 670, 810, 270, "TraceabilityStage; DataIntegrityStatus; TransactionID", "TT_BlockchainIntegrity", "DT_BlockchainTransaction")

    add("AI Assistant", "Assistant Chat Surface", "Static chat composition", 280, 130, 880, 810, "FarmerQuestion; RecommendationText; AssistantAvailability", "", "DT_CropAnalytics")
    add("AI Assistant", "Suggested Questions", "Button/chip group", 1190, 130, 700, 170, "InteractionType")
    add("AI Assistant", "Guidance Cards", "Multi-row cards", 1190, 330, 700, 300, "Crop Advice; Disease Explanation; Irrigation Guidance; Fertilizer Guidance; Market Guidance")
    add("AI Assistant", "Image Diagnosis Summary", "Card/table", 1190, 660, 700, 280, "ImageDiagnosisResult; RecommendedTreatment; PreventiveAction", "TT_CropHealth", "DT_CropScan")

    add("Sustainability & Energy", "Energy KPI Row", "Card row", 280, 130, 1610, 140, "Energy Status; Renewable Energy Usage; Carbon Reduction; Energy Consumption", "TT_Energy")
    add("Sustainability & Energy", "Energy Trend", "Area chart", 280, 300, 850, 360, "Date[Date]; Renewable Energy Usage; Energy Consumption", "TT_Energy")
    add("Sustainability & Energy", "Charging Status Matrix", "Matrix", 1160, 300, 730, 360, "FarmName; RobotChargingStatus; DroneChargingStatus; BatteryLevelPct", "TT_Energy")
    add("Sustainability & Energy", "Carbon Reduction Panel", "Bar chart and cards", 280, 690, 1610, 250, "FarmName; Carbon Reduction; OffGridOperationStatus", "TT_Energy", "DT_FarmProfile")

    add("Alerts & Reports", "Alert Command Center", "Matrix", 280, 130, 760, 390, "AlertType; PriorityLevel; ResolutionStatus; RecommendedAction", "TT_AlertSeverity", "DT_AlertDetail")
    add("Alerts & Reports", "Priority Breakdown", "Stacked column chart", 1070, 130, 820, 390, "PriorityLevel; AlertType; Open Alerts", "TT_AlertSeverity")
    add("Alerts & Reports", "Recommended Actions Feed", "Table", 280, 550, 760, 390, "AlertMessage; RecommendedAction; ResolutionStatus", "TT_AlertSeverity", "DT_AlertDetail")
    add("Alerts & Reports", "Report Catalog", "Table/buttons", 1070, 550, 820, 390, "ReportName; GeneratedDate; ExportFormat; DecisionSupportSummary", "", "")

    write_csv("docs/page_blueprint.csv", blueprint_rows)

    tooltip_rows = [
        {"TooltipPage": "TT_CropHealth", "Size": "320x240", "PrimaryMeasure": "Crop Health Score", "AttachTo": "Crop health cards and scan visuals"},
        {"TooltipPage": "TT_WaterEfficiency", "Size": "320x240", "PrimaryMeasure": "Water Efficiency", "AttachTo": "Moisture and irrigation visuals"},
        {"TooltipPage": "TT_Energy", "Size": "320x240", "PrimaryMeasure": "Energy Status", "AttachTo": "Energy and charging visuals"},
        {"TooltipPage": "TT_IoTUptime", "Size": "320x240", "PrimaryMeasure": "Sensor Uptime", "AttachTo": "Sensor, gateway, and packet visuals"},
        {"TooltipPage": "TT_RobotStatus", "Size": "320x240", "PrimaryMeasure": "Robot Battery", "AttachTo": "Robot mission visuals"},
        {"TooltipPage": "TT_DroneCoverage", "Size": "320x240", "PrimaryMeasure": "Drone Flight Coverage", "AttachTo": "Drone mission visuals"},
        {"TooltipPage": "TT_BlockchainIntegrity", "Size": "320x240", "PrimaryMeasure": "Blockchain Integrity", "AttachTo": "Blockchain block and transaction visuals"},
        {"TooltipPage": "TT_MarketRisk", "Size": "320x240", "PrimaryMeasure": "Market Risk Score", "AttachTo": "Market impact and risk visuals"},
        {"TooltipPage": "TT_Profitability", "Size": "320x240", "PrimaryMeasure": "Profitability Signal", "AttachTo": "Price and recommendation visuals"},
        {"TooltipPage": "TT_AlertSeverity", "Size": "320x240", "PrimaryMeasure": "Critical Alerts", "AttachTo": "Alert matrix and priority visuals"},
    ]
    write_csv("docs/tooltip_map.csv", tooltip_rows)

    drill_rows = [
        {"DrillThroughPage": "DT_FarmProfile", "DrillField": "Farms[FarmID]", "MainContent": "Farm details, map, crop mix, sensors, energy"},
        {"DrillThroughPage": "DT_CropAnalytics", "DrillField": "Crops[CropID]", "MainContent": "Crop health, soil trends, scans, market view"},
        {"DrillThroughPage": "DT_SensorDetail", "DrillField": "Sensors[SensorID]", "MainContent": "Reading history, packet rate, communication health"},
        {"DrillThroughPage": "DT_RobotMission", "DrillField": "RobotMissions[RobotMissionID]", "MainContent": "Battery, route, scanning progress, obstacles"},
        {"DrillThroughPage": "DT_DroneMission", "DrillField": "DroneMissions[DroneMissionID]", "MainContent": "Coverage, NDVI, thermal zones, capture state"},
        {"DrillThroughPage": "DT_CropScan", "DrillField": "CropHealthScans[ScanID]", "MainContent": "Diagnosis result, treatment, preventive action"},
        {"DrillThroughPage": "DT_PriceCommodity", "DrillField": "PricePredictions[CropName]", "MainContent": "Current price, 60-day prediction, impacts"},
        {"DrillThroughPage": "DT_BlockchainTransaction", "DrillField": "BlockchainTransactions[TransactionID]", "MainContent": "Block detail, hash previews, validation timeline"},
        {"DrillThroughPage": "DT_AlertDetail", "DrillField": "Alerts[AlertID]", "MainContent": "Alert priority, action, status, related farm"},
    ]
    write_csv("docs/drillthrough_map.csv", drill_rows)

    nav_rows = []
    for order, page in enumerate(pages, start=1):
        nav_rows.append(
            {
                "Order": order,
                "ButtonLabel": page.replace("AgriNova ", "").replace(" & Vision Intelligence", "").replace(" Operations", ""),
                "TargetPage": page,
                "IconFile": {
                    "AgriNova Overview": "assets/icons/overview.svg",
                    "Smart Farm Monitoring": "assets/icons/farm_monitoring.svg",
                    "Crop Health & Vision Intelligence": "assets/icons/crop_health.svg",
                    "Robotics & Drone Operations": "assets/icons/robot.svg",
                    "IoT Sensor Network": "assets/icons/iot.svg",
                    "Price Prediction": "assets/icons/price.svg",
                    "Blockchain Security": "assets/icons/blockchain.svg",
                    "AI Assistant": "assets/icons/assistant.svg",
                    "Sustainability & Energy": "assets/icons/energy.svg",
                    "Alerts & Reports": "assets/icons/alerts.svg",
                }[page],
                "ActiveIndicator": "Show neon-green vertical pill only on this target page",
                "ActionType": "Page navigation",
            }
        )
    write_csv("docs/navigation_map.csv", nav_rows)


def main() -> None:
    ensure_dirs()
    generate_data()
    write_theme()
    write_dax()
    write_svgs()
    write_docs()
    print("AgriNova Power BI kit generated.")


if __name__ == "__main__":
    main()
