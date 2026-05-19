import csv, json, pathlib, shutil, zipfile, os, time, random, string, hashlib
from copy import deepcopy

ROOT = pathlib.Path(r'D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard')
PBIX = ROOT / 'powerbi' / 'AgriNova' / 'AgriNova_Final.pbix'
BACKUP = ROOT / 'powerbi' / 'AgriNova' / f'AgriNova_Final.backup_before_interactive_patch_{time.strftime("%Y%m%d_%H%M%S")}.pbix'
WORK = ROOT / 'tmp_interactive_pbix_patch'
PATCHED = ROOT / 'powerbi' / 'AgriNova' / 'AgriNova_Final_interactive_patch.pbix'

if not BACKUP.exists():
    shutil.copy2(PBIX, BACKUP)
if WORK.exists():
    shutil.rmtree(WORK)
WORK.mkdir(parents=True)
with zipfile.ZipFile(PBIX, 'r') as z:
    z.extractall(WORK)
layout_path = WORK / 'Report' / 'Layout'
layout = json.loads(layout_path.read_text(encoding='utf-16le'))

# Legacy Power BI expression helpers

def lit(value):
    if isinstance(value, bool): v = 'true' if value else 'false'
    elif isinstance(value, (int, float)): v = f'{value}D' if isinstance(value,float) else f'{value}L'
    else: v = f"'{value}'"
    return {'expr': {'Literal': {'Value': v}}}

def color(hex_color):
    return {'solid': {'color': {'expr': {'Literal': {'Value': f"'{hex_color}'"}}}}}

def col_expr(alias, prop):
    return {'Column': {'Expression': {'SourceRef': {'Source': alias}}, 'Property': prop}}

def col_entity_expr(table, prop):
    return {'Column': {'Expression': {'SourceRef': {'Entity': table}}, 'Property': prop}}

def agg_expr(alias, prop, fn):
    return {'Aggregation': {'Expression': col_expr(alias, prop), 'Function': fn}}

def make_name(prefix):
    seed = hashlib.sha1(prefix.encode('utf-8')).hexdigest()[:20]
    return seed

class Field:
    def __init__(self, table, column, role, agg=None, display=None, active=False, fmt=None):
        self.table=table; self.column=column; self.role=role; self.agg=agg; self.display=display or column; self.active=active; self.fmt=fmt
    def source_alias(self, aliases):
        if self.table not in aliases:
            aliases[self.table] = ''.join([c for c in self.table.lower() if c.isalpha()])[:1] or 't'
            base=aliases[self.table]; n=1
            while list(aliases.values()).count(aliases[self.table])>1:
                aliases[self.table]=base+str(n); n+=1
        return aliases[self.table]
    def expr_and_ref(self, aliases):
        a = self.source_alias(aliases)
        if self.agg is None:
            expr = col_expr(a, self.column)
            ref = f'{self.table}.{self.column}'
            typ = 1
        else:
            expr = agg_expr(a, self.column, self.agg)
            agg_name = {0:'Sum',1:'Average',2:'DistinctCount',5:'CountNonNull'}.get(self.agg,'Agg')
            ref = f'{agg_name}({self.table}.{self.column})'
            typ = 3
        return expr, ref, typ

AVG=1; SUM=0; DC=2; CNT=5

# Visual placement definitions in 1920x1080 coordinates; scaled to PBIX 1280x720.
pages = {
'01_AgriNova_Overview': [
    ('Overview_KPI_Farms','cardVisual',280,130,215,118,[Field('Farms','FarmID','Values',DC,'Total Farms')]),
    ('Overview_KPI_Area','cardVisual',500,130,215,118,[Field('Farms','AreaHa','Values',SUM,'Total Area (ha)')]),
    ('Overview_KPI_Sensors','cardVisual',720,130,215,118,[Field('Sensors','SensorID','Values',DC,'IoT Sensors')]),
    ('Overview_KPI_Robots','cardVisual',940,130,215,118,[Field('RobotMissions','RobotID','Values',DC,'Robots')]),
    ('Overview_KPI_Drones','cardVisual',1160,130,215,118,[Field('DroneMissions','DroneID','Values',DC,'Drones')]),
    ('Overview_KPI_Health','cardVisual',1380,130,220,118,[Field('CropHealthScans','CropHealthScore','Values',AVG,'System Health')]),
    ('Overview_System_Gauge','gauge',1620,130,270,260,[Field('CropHealthScans','CropHealthScore','Value',AVG,'System Health')]),
    ('Overview_Farm_Map','map',280,270,520,330,[Field('Farms','Latitude','Latitude',AVG,'Latitude'),Field('Farms','Longitude','Longitude',AVG,'Longitude'),Field('Farms','FarmID','Size',DC,'Farms'),Field('Farms','Status','Category',None,'Status',True)]),
    ('Overview_Crop_Health_Area','areaChart',830,270,500,330,[Field('CropHealthScans','ScanDate','Category',None,'Scan Date',True),Field('CropHealthScans','CropHealthScore','Y',AVG,'Crop Health')]),
    ('Overview_Live_Telemetry','tableEx',1360,420,530,180,[Field('Sensors','HeartbeatState','Values'),Field('Sensors','LastSignalTime','Values'),Field('Sensors','PacketRate','Values',SUM,'Packet Rate')]),
    ('Overview_Alerts','matrix',280,630,620,310,[Field('Alerts','AlertType','Rows'),Field('Alerts','PriorityLevel','Columns'),Field('Alerts','AlertID','Values',CNT,'Alerts')]),
    ('Overview_AI_Recommendations','tableEx',930,630,960,310,[Field('AIRecommendations','InteractionType','Values'),Field('AIRecommendations','RecommendationText','Values'),Field('AIRecommendations','AssistantAvailability','Values')])
],
'02_Smart_Farm_Monitoring': [
    ('Farm_Slicer_Farm','slicer',280,130,190,130,[Field('Farms','FarmName','Values')]),
    ('Farm_Slicer_Crop','slicer',475,130,190,130,[Field('Crops','CropName','Values')]),
    ('Farm_KPI_Moisture','cardVisual',720,130,185,170,[Field('SoilReadings','SoilMoisturePct','Values',AVG,'Soil Moisture')]),
    ('Farm_KPI_Temp','cardVisual',910,130,185,170,[Field('SoilReadings','SoilTempC','Values',AVG,'Soil Temp')]),
    ('Farm_KPI_Humidity','cardVisual',1100,130,185,170,[Field('SoilReadings','HumidityPct','Values',AVG,'Humidity')]),
    ('Farm_KPI_pH','cardVisual',1290,130,185,170,[Field('SoilReadings','PH','Values',AVG,'pH')]),
    ('Farm_KPI_NPK','cardVisual',1480,130,185,170,[Field('SoilReadings','NitrogenPPM','Values',AVG,'Nitrogen')]),
    ('Farm_KPI_Light','cardVisual',1670,130,220,170,[Field('SoilReadings','LightLux','Values',AVG,'Light')]),
    ('Farm_Moisture_Trends','lineChart',280,330,760,330,[Field('SoilReadings','Date','Category',None,'Date',True),Field('SoilReadings','SoilMoisturePct','Y',AVG,'Soil Moisture'),Field('SoilReadings','PH','Y',AVG,'pH')]),
    ('Farm_Zone_Heatmap','matrix',1070,330,820,330,[Field('Sensors','Zone','Rows'),Field('Sensors','SensorType','Columns'),Field('Sensors','CommunicationHealth','Values',AVG,'Communication')]),
    ('Farm_Latest_Readings','tableEx',280,690,1610,250,[Field('Sensors','SensorID','Values'),Field('Sensors','Status','Values'),Field('Sensors','Zone','Values'),Field('Sensors','LastSignalTime','Values'),Field('Sensors','CommunicationHealth','Values',AVG,'Communication')])
],
'03_Crop_Health_and_Vision_Intelligence': [
    ('Vision_KPI_Health','cardVisual',280,130,250,140,[Field('CropHealthScans','CropHealthScore','Values',AVG,'Health Score')]),
    ('Vision_KPI_Diseases','cardVisual',540,130,250,140,[Field('CropHealthScans','DetectedDisease','Values',DC,'Detected Diseases')]),
    ('Vision_KPI_Scans','cardVisual',800,130,250,140,[Field('CropHealthScans','ScanID','Values',DC,'Images Analyzed')]),
    ('Vision_KPI_Risk','cardVisual',1060,130,250,140,[Field('CropHealthScans','PestRiskLevel','Values',DC,'Risk Levels')]),
    ('Vision_KPI_Stress','cardVisual',1320,130,250,140,[Field('CropHealthScans','PlantStressIndicator','Values',DC,'Stress Signals')]),
    ('Vision_KPI_Treatment','cardVisual',1580,130,310,140,[Field('CropHealthScans','RecommendedTreatment','Values',DC,'Treatments')]),
    ('Vision_Disease_Distribution','stackedBarChart',280,300,520,290,[Field('Crops','CropName','Category',None,'Crop',True),Field('CropHealthScans','ScanID','Y',CNT,'Scans'),Field('CropHealthScans','DetectedDisease','Series',None,'Disease')]),
    ('Vision_Scan_History','tableEx',830,300,1060,290,[Field('CropHealthScans','ScanID','Values'),Field('CropHealthScans','ScanDate','Values'),Field('CropHealthScans','CropHealthScore','Values',AVG,'Health'),Field('CropHealthScans','DetectedDisease','Values'),Field('CropHealthScans','PestRiskLevel','Values')]),
    ('Vision_Diagnosis_Actions','multiRowCard',280,620,1610,320,[Field('CropHealthScans','ImageDiagnosisResult','Values'),Field('CropHealthScans','RecommendedTreatment','Values'),Field('CropHealthScans','PreventiveAction','Values')])
],
'04_Robotics_and_Drone_Operations': [
    ('Robotics_Robot_Cards','multiRowCard',280,130,380,260,[Field('RobotMissions','BatteryPct','Values',AVG,'Robot Battery'),Field('RobotMissions','RouteProgressPct','Values',AVG,'Route Progress'),Field('RobotMissions','FieldCoveragePct','Values',AVG,'Field Coverage')]),
    ('Robotics_Robot_Status','donutChart',680,130,390,260,[Field('RobotMissions','RobotStatus','Category',None,'Robot Status',True),Field('RobotMissions','RobotMissionID','Y',CNT,'Missions')]),
    ('Robotics_Robot_Missions','tableEx',280,420,790,310,[Field('RobotMissions','RobotID','Values'),Field('RobotMissions','MissionState','Values'),Field('RobotMissions','ObstacleAlerts','Values',SUM,'Obstacle Alerts'),Field('RobotMissions','LastMissionSummary','Values')]),
    ('Robotics_Drone_Cards','multiRowCard',1100,130,380,260,[Field('DroneMissions','BatteryPct','Values',AVG,'Drone Battery'),Field('DroneMissions','FlightCoveragePct','Values',AVG,'Flight Coverage'),Field('DroneMissions','AerialCropHealthPct','Values',AVG,'Aerial Health')]),
    ('Robotics_Drone_Status','donutChart',1500,130,390,260,[Field('DroneMissions','DroneFlightStatus','Category',None,'Flight Status',True),Field('DroneMissions','DroneMissionID','Y',CNT,'Flights')]),
    ('Robotics_Drone_Missions','tableEx',1100,420,790,310,[Field('DroneMissions','DroneID','Values'),Field('DroneMissions','MissionState','Values'),Field('DroneMissions','ThermalStressZones','Values',SUM,'Thermal Zones'),Field('DroneMissions','HighRiskFieldZones','Values')]),
    ('Robotics_Performance_Trend','lineChart',280,760,1610,180,[Field('RobotMissions','MissionDate','Category',None,'Mission Date',True),Field('RobotMissions','BatteryPct','Y',AVG,'Robot Battery'),Field('RobotMissions','FieldCoveragePct','Y',AVG,'Robot Coverage')])
],
'05_IoT_Sensor_Network': [
    ('IOT_KPI_Total','cardVisual',280,130,250,130,[Field('Sensors','SensorID','Values',DC,'Total Sensors')]),
    ('IOT_KPI_Online','cardVisual',540,130,250,130,[Field('Sensors','CommunicationHealth','Values',AVG,'Communication')]),
    ('IOT_KPI_Packets','cardVisual',800,130,250,130,[Field('Sensors','PacketRate','Values',SUM,'Data Packets')]),
    ('IOT_KPI_Gateways','cardVisual',1060,130,250,130,[Field('Sensors','EdgeGateway','Values',DC,'Gateways')]),
    ('IOT_KPI_Live','cardVisual',1320,130,250,130,[Field('Sensors','HeartbeatState','Values',DC,'Heartbeat States')]),
    ('IOT_KPI_Types','cardVisual',1580,130,310,130,[Field('Sensors','SensorType','Values',DC,'Sensor Types')]),
    ('IOT_Gateway_Tree','decompositionTreeVisual',280,290,640,360,[Field('Farms','FarmName','Category',None,'Farm',True),Field('Sensors','CommunicationHealth','Values',AVG,'Communication'),Field('Sensors','EdgeGateway','Category',None,'Gateway'),Field('Sensors','SensorType','Category',None,'Type')]),
    ('IOT_Communication_Heatmap','matrix',950,290,940,360,[Field('Farms','FarmName','Rows'),Field('Sensors','SensorType','Columns'),Field('Sensors','CommunicationHealth','Values',AVG,'Communication')]),
    ('IOT_Packet_Rate_Trend','areaChart',280,680,1610,260,[Field('Sensors','LastSignalTime','Category',None,'Last Signal',True),Field('Sensors','PacketRate','Y',SUM,'Packet Rate')])
],
'06_Price_Prediction': [
    ('Price_Commodity_Slicer','slicer',280,130,300,160,[Field('PricePredictions','CropName','Values')]),
    ('Price_KPI_Current','cardVisual',610,130,250,160,[Field('PricePredictions','CurrentMarketPriceEGP','Values',AVG,'Current Price')]),
    ('Price_KPI_Predicted','cardVisual',870,130,250,160,[Field('PricePredictions','PredictedPrice60DaysEGP','Values',AVG,'Predicted 60 Days')]),
    ('Price_KPI_Trend','cardVisual',1130,130,250,160,[Field('PricePredictions','ExpectedTrend','Values',DC,'Trend Signals')]),
    ('Price_KPI_Risk','cardVisual',1390,130,250,160,[Field('PricePredictions','MarketRisk','Values',DC,'Market Risk')]),
    ('Price_KPI_Profit','cardVisual',1650,130,240,160,[Field('PricePredictions','ProfitabilityIndicator','Values',DC,'Profitability')]),
    ('Price_Trajectory','areaChart',280,330,930,360,[Field('PricePredictions','Date','Category',None,'Date',True),Field('PricePredictions','CurrentMarketPriceEGP','Y',AVG,'Current Price'),Field('PricePredictions','PredictedPrice60DaysEGP','Y',AVG,'Predicted Price')]),
    ('Price_Impact_Factors','clusteredBarChart',1240,330,650,360,[Field('PricePredictions','CropName','Category',None,'Commodity',True),Field('PricePredictions','SupplyDemandImpact','Y',AVG,'Supply Demand'),Field('PricePredictions','USDEGPImpact','Y',AVG,'USD/EGP'),Field('PricePredictions','InflationImpact','Y',AVG,'Inflation'),Field('PricePredictions','SeasonalEffect','Y',AVG,'Seasonal')]),
    ('Price_Commodity_Matrix','matrix',280,720,1610,220,[Field('PricePredictions','CropName','Rows'),Field('PricePredictions','CurrentMarketPriceEGP','Values',AVG,'Current'),Field('PricePredictions','PredictedPrice60DaysEGP','Values',AVG,'60-Day'),Field('PricePredictions','ExpectedTrend','Values'),Field('PricePredictions','VolatilityLevel','Values'),Field('PricePredictions','SmartRecommendation','Values')])
],
'07_Blockchain_Security': [
    ('Blockchain_KPI_Integrity','cardVisual',280,130,260,130,[Field('BlockchainTransactions','ValidationState','Values',DC,'Validation States')]),
    ('Blockchain_KPI_Records','cardVisual',550,130,260,130,[Field('BlockchainTransactions','VerifiedFarmRecords','Values',SUM,'Verified Records')]),
    ('Blockchain_KPI_Secure','cardVisual',820,130,260,130,[Field('BlockchainTransactions','SecureTransactions','Values',SUM,'Secure Transactions')]),
    ('Blockchain_KPI_Contracts','cardVisual',1090,130,260,130,[Field('BlockchainTransactions','SmartContractStatus','Values',DC,'Smart Contracts')]),
    ('Blockchain_KPI_Blocks','cardVisual',1360,130,260,130,[Field('BlockchainTransactions','BlockIndex','Values',DC,'Total Blocks')]),
    ('Blockchain_KPI_Network','cardVisual',1630,130,260,130,[Field('BlockchainTransactions','BlockchainNetworkStatus','Values',DC,'Network Health')]),
    ('Blockchain_Block_History','tableEx',280,300,1610,330,[Field('BlockchainTransactions','BlockIndex','Values'),Field('BlockchainTransactions','RecordType','Values'),Field('BlockchainTransactions','HashPreview','Values'),Field('BlockchainTransactions','PreviousHashPreview','Values'),Field('BlockchainTransactions','ValidationState','Values')]),
    ('Blockchain_Validation_Timeline','areaChart',280,670,770,270,[Field('BlockchainTransactions','TransactionDate','Category',None,'Transaction Date',True),Field('BlockchainTransactions','TransactionID','Y',CNT,'Transactions')]),
    ('Blockchain_Audit_Panel','matrix',1080,670,810,270,[Field('BlockchainTransactions','TraceabilityStage','Rows'),Field('BlockchainTransactions','DataIntegrityStatus','Columns'),Field('BlockchainTransactions','TransactionID','Values',CNT,'Transactions')])
],
'08_AI_Assistant': [
    ('AI_Chat_Surface','tableEx',280,130,880,810,[Field('AIRecommendations','FarmerQuestion','Values'),Field('AIRecommendations','RecommendationText','Values'),Field('AIRecommendations','AssistantAvailability','Values')]),
    ('AI_Suggested_Questions','slicer',1190,130,700,170,[Field('AIRecommendations','InteractionType','Values')]),
    ('AI_Guidance_Cards','multiRowCard',1190,330,700,300,[Field('AIRecommendations','InteractionType','Values'),Field('AIRecommendations','RecommendationText','Values')]),
    ('AI_Image_Diagnosis','tableEx',1190,660,700,280,[Field('CropHealthScans','ImageDiagnosisResult','Values'),Field('CropHealthScans','RecommendedTreatment','Values'),Field('CropHealthScans','PreventiveAction','Values')])
],
'09_Sustainability_and_Energy': [
    ('Energy_KPI_Status','cardVisual',280,130,260,140,[Field('EnergyUsage','BatteryLevelPct','Values',AVG,'Battery Level')]),
    ('Energy_KPI_Renewable','cardVisual',550,130,260,140,[Field('EnergyUsage','RenewableEnergyUsagePct','Values',AVG,'Renewable Energy')]),
    ('Energy_KPI_Carbon','cardVisual',820,130,260,140,[Field('EnergyUsage','CarbonReductionKg','Values',SUM,'Carbon Reduction')]),
    ('Energy_KPI_Consumption','cardVisual',1090,130,260,140,[Field('EnergyUsage','EnergyConsumptionKwh','Values',SUM,'Energy Use')]),
    ('Energy_KPI_Offgrid','cardVisual',1360,130,260,140,[Field('EnergyUsage','OffGridOperationStatus','Values',DC,'Off-grid Status')]),
    ('Energy_KPI_Charging','cardVisual',1630,130,260,140,[Field('EnergyUsage','RobotChargingStatus','Values',DC,'Charging States')]),
    ('Energy_Trend','areaChart',280,300,850,360,[Field('EnergyUsage','Date','Category',None,'Date',True),Field('EnergyUsage','RenewableEnergyUsagePct','Y',AVG,'Renewable'),Field('EnergyUsage','EnergyConsumptionKwh','Y',SUM,'Consumption')]),
    ('Energy_Charging_Status','matrix',1160,300,730,360,[Field('Farms','FarmName','Rows'),Field('EnergyUsage','RobotChargingStatus','Columns'),Field('EnergyUsage','BatteryLevelPct','Values',AVG,'Battery')]),
    ('Energy_Carbon_Reduction','clusteredBarChart',280,690,1610,250,[Field('Farms','FarmName','Category',None,'Farm',True),Field('EnergyUsage','CarbonReductionKg','Y',SUM,'Carbon Reduction')])
],
'10_Alerts_and_Reports': [
    ('Alerts_Command_Center','matrix',280,130,760,390,[Field('Alerts','AlertType','Rows'),Field('Alerts','PriorityLevel','Columns'),Field('Alerts','AlertID','Values',CNT,'Alerts')]),
    ('Alerts_Priority_Breakdown','stackedColumnChart',1070,130,820,390,[Field('Alerts','PriorityLevel','Category',None,'Priority',True),Field('Alerts','AlertID','Y',CNT,'Alerts'),Field('Alerts','AlertType','Series',None,'Alert Type')]),
    ('Alerts_Actions_Feed','tableEx',280,550,760,390,[Field('Alerts','AlertMessage','Values'),Field('Alerts','RecommendedAction','Values'),Field('Alerts','ResolutionStatus','Values')]),
    ('Reports_Catalog','tableEx',1070,550,820,390,[Field('Reports','ReportName','Values'),Field('Reports','GeneratedDate','Values'),Field('Reports','ExportFormat','Values'),Field('Reports','DecisionSupportSummary','Values')])
]
}

# match page display names in PBIX sections
page_key_by_display = {
    '01_AgriNova_Overview1':'01_AgriNova_Overview',
    '02_Smart_Farm_Monitoring':'02_Smart_Farm_Monitoring',
    '03_Crop_Health_and_Vision_Intelligence':'03_Crop_Health_and_Vision_Intelligence',
    '04_Robotics_and_Drone_Operations':'04_Robotics_and_Drone_Operations',
    '05_IoT_Sensor_Network':'05_IoT_Sensor_Network',
    '06_Price_Prediction':'06_Price_Prediction',
    '07_Blockchain_Security':'07_Blockchain_Security',
    '08_AI_Assistant':'08_AI_Assistant',
    '09_Sustainability_and_Energy':'09_Sustainability_and_Energy',
    '10_Alerts_and_Reports':'10_Alerts_and_Reports'
}

# Power BI object styling for transparent enterprise overlays
common_objects = {
    'categoryAxis': [{'properties': {'labelColor': color('#D8F7FF'), 'showAxisTitle': lit(False), 'fontSize': lit('9')}}],
    'valueAxis': [{'properties': {'labelColor': color('#D8F7FF'), 'showAxisTitle': lit(False), 'gridlineStyle': lit('dotted'), 'gridlineColor': color('#1C4664'), 'fontSize': lit('9')}}],
    'legend': [{'properties': {'labelColor': color('#D8F7FF'), 'showTitle': lit(False), 'position': lit('BottomCenter')}}],
    'labels': [{'properties': {'show': lit(False), 'color': color('#F7FFFE')}}]
}

def vc_objects(title, tooltip=None):
    return {
        'title': [{'properties': {'show': lit(True), 'text': lit(title), 'fontColor': color('#E7F6FF'), 'fontSize': lit('10'), 'fontFamily': lit('Segoe UI Semibold')}}],
        'background': [{'properties': {'show': lit(True), 'color': color('#061421'), 'transparency': lit(82)}}],
        'border': [{'properties': {'show': lit(False), 'color': color('#1C4664'), 'radius': lit(8)}}],
        'dropShadow': [{'properties': {'show': lit(False)}}],
        'visualHeader': [{'properties': {'show': lit(False)}}],
        'visualTooltip': [{'properties': {'show': lit(True), 'type': lit('Auto'), 'background': color('#061421'), 'titleFontColor': color('#35F29A'), 'valueFontColor': color('#E7F6FF'), 'fontSize': lit('10'), 'transparency': lit(5)}}]
    }

def build_visual(page, name, visual_type, x,y,w,h, fields, idx):
    scale = 2/3
    pos = {'x': round(x*scale,2), 'y': round(y*scale,2), 'z': 50+idx, 'width': round(w*scale,2), 'height': round(h*scale,2), 'tabOrder': idx}
    aliases = {}
    selects=[]; projections={}; colprops={}; metadata=[]
    froms=[]
    for f in fields:
        expr, ref, typ = f.expr_and_ref(aliases)
        selects.append({**expr, 'Name': ref})
        proj = {'queryRef': ref}
        if f.active: proj['active']=True
        projections.setdefault(f.role, []).append(proj)
        colprops[ref] = {'displayName': f.display}
        md = {'Restatement': f.display, 'Name': ref, 'Type': typ}
        if f.fmt: md['Format'] = f.fmt
        metadata.append(md)
    for table, alias in aliases.items():
        froms.append({'Name': alias, 'Entity': table, 'Type': 0})
    proto = {'Version': 2, 'From': froms, 'Select': selects}
    # Sort by first category, else first aggregate descending.
    cats = [f for f in fields if f.role in ('Category','Rows') and f.agg is None]
    if cats:
        a=aliases[cats[0].table]
        proto['OrderBy']=[{'Direction':1,'Expression':col_expr(a,cats[0].column)}]
    elif selects:
        proto['OrderBy']=[{'Direction':2,'Expression':selects[0].copy() if False else selects[0]}]
    sv = {
        'visualType': visual_type,
        'projections': projections,
        'prototypeQuery': proto,
        'columnProperties': colprops,
        'drillFilterOtherVisuals': True,
        'hasDefaultSort': True,
        'objects': deepcopy(common_objects),
        'vcObjects': vc_objects(name.replace('_',' '))
    }
    if visual_type in ('tableEx','matrix'):
        sv['objects'].update({
            'grid': [{'properties': {'gridVertical': lit(False), 'gridHorizontal': lit(False), 'outlineColor': color('#1C4664'), 'textSize': lit(9)}}],
            'values': [{'properties': {'fontColorPrimary': color('#E7F6FF'), 'backColorPrimary': color('#061421'), 'backColorSecondary': color('#071B2B')}}],
            'columnHeaders': [{'properties': {'fontColor': color('#35F29A'), 'backColor': color('#061421'), 'fontSize': lit(9)}}]
        })
    if visual_type == 'cardVisual':
        sv['objects'].update({
            'calloutValue': [{'properties': {'fontColor': color('#35F29A'), 'fontSize': lit(24), 'fontFamily': lit('Segoe UI Semibold')}}],
            'categoryLabels': [{'properties': {'show': lit(True), 'fontColor': color('#B8D7E8'), 'fontSize': lit(9)}}]
        })
    if visual_type == 'gauge':
        sv['objects'].update({'dataPoint': [{'properties': {'fill': color('#35F29A')}}], 'labels': [{'properties': {'show': lit(True), 'color': color('#E7F6FF')}}]})
    if visual_type == 'slicer':
        sv['objects'].update({'items': [{'properties': {'fontColor': color('#E7F6FF'), 'background': color('#061421'), 'textSize': lit(9)}}], 'header': [{'properties': {'show': lit(False)}}]})
    config = {'name': make_name(name), 'layouts':[{'id':0, 'position':pos}], 'singleVisual': sv}
    dt = {
        'projectionOrdering': {role: list(range(len(vals))) for role, vals in projections.items()},
        'queryMetadata': {'Select': metadata},
        'visualElements': [{'DataRoles': [{'Name': role, 'Projection': i, 'isActive': False} for role, vals in projections.items() for i,_ in enumerate(vals)]}],
        'selects': [{'displayName': m['Restatement'], 'queryName': m['Name'], 'type': m['Type']} for m in metadata]
    }
    return {
        'x': pos['x'], 'y': pos['y'], 'z': pos['z'], 'width': pos['width'], 'height': pos['height'],
        'config': json.dumps(config, separators=(',',':')),
        'filters': '[]',
        'query': json.dumps(proto, separators=(',',':')),
        'dataTransforms': json.dumps(dt, separators=(',',':'))
    }

patched_count=0
for section in layout['sections']:
    key = page_key_by_display.get(section.get('displayName'))
    if not key: continue
    visuals=[]
    for idx, spec in enumerate(pages[key], start=1):
        visuals.append(build_visual(key, *spec, idx=idx))
    section['visualContainers'] = visuals
    patched_count += len(visuals)

layout_path.write_text(json.dumps(layout, ensure_ascii=False, separators=(',',':')), encoding='utf-16le')
if PATCHED.exists(): PATCHED.unlink()
with zipfile.ZipFile(PATCHED, 'w', compression=zipfile.ZIP_DEFLATED) as z:
    for file in WORK.rglob('*'):
        if file.is_file():
            z.write(file, file.relative_to(WORK).as_posix())
# Replace original PBIX with patched copy, preserving backup.
shutil.copy2(PATCHED, PBIX)
print(f'Backup: {BACKUP}')
print(f'Patched visuals: {patched_count}')
print(f'Patched PBIX: {PBIX}')
print(f'Working copy: {PATCHED}')
