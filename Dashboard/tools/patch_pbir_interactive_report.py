import json, pathlib, shutil, time, hashlib
ROOT = pathlib.Path(r'D:\NMU\level 4\SEMESTER 2\graduation project\Dashboard')
REPORT = ROOT/'powerbi'/'AgriNova'/'AgriNova.Report'
DEF = REPORT/'definition'
PAGES_DIR = DEF/'pages'
RES = REPORT/'StaticResources'/'RegisteredResources'
RES.mkdir(parents=True, exist_ok=True)

# Copy premium mockup backgrounds into PBIR registered resources using stable names.
mockup_dir = ROOT/'manual_build'/'mockups'
bg_map = {
 'Page_AgriNova_Overview':'01_AgriNova_Overview.png',
 'Page_Smart_Farm_Monitoring':'02_Smart_Farm_Monitoring.png',
 'Page_Crop_Health_Vision_Intelligence':'03_Crop_Health_and_Vision_Intelligence.png',
 'Page_Robotics_Drone_Operations':'04_Robotics_and_Drone_Operations.png',
 'Page_IoT_Sensor_Network':'05_IoT_Sensor_Network.png',
 'Page_Price_Prediction':'06_Price_Prediction.png',
 'Page_Blockchain_Security':'07_Blockchain_Security.png',
 'Page_AI_Assistant':'08_AI_Assistant.png',
 'Page_Sustainability_Energy':'09_Sustainability_and_Energy.png',
 'Page_Alerts_Reports':'10_Alerts_and_Reports.png'
}
for page, fname in bg_map.items():
    src = mockup_dir/fname
    if src.exists(): shutil.copy2(src, RES/fname)

# Helpers
AVG=1; SUM=0; DC=2; CNT=5

def expr_col(table, col):
    return {'Column': {'Expression': {'SourceRef': {'Entity': table}}, 'Property': col}}

def expr_agg(table, col, fn):
    return {'Aggregation': {'Expression': expr_col(table, col), 'Function': fn}}

class Field:
    def __init__(self, table, column, role, agg=None, display=None, active=False, fmt=None):
        self.table=table; self.column=column; self.role=role; self.agg=agg; self.display=display or column; self.active=active; self.fmt=fmt
    def expr_ref_type(self):
        if self.agg is None:
            ref=f'{self.table}.{self.column}'; expr=expr_col(self.table,self.column)
        else:
            aggname={0:'Sum',1:'Average',2:'DistinctCount',5:'CountNonNull'}[self.agg]
            ref=f'{aggname}({self.table}.{self.column})'; expr=expr_agg(self.table,self.column,self.agg)
        return expr, ref

def container_objects(title, tooltip_page=None, nav_target=None):
    objs = {
      'title':[{'properties':{'show': True, 'text': title, 'fontColor': {'solid': {'color':'#E7F6FF'}}, 'fontSize': 10, 'fontFamily':'Segoe UI Semibold'}}],
      'background':[{'properties':{'show': True, 'color': {'solid': {'color':'#061421'}}, 'transparency': 82}}],
      'border':[{'properties':{'show': False, 'color': {'solid': {'color':'#1C4664'}}, 'radius': 8}}],
      'dropShadow':[{'properties':{'show': False}}],
      'visualHeader':[{'properties':{'show': False}}],
      'visualTooltip':[{'properties':{'show': True, 'type': 'Auto', 'background': {'solid': {'color':'#061421'}}, 'titleFontColor': {'solid': {'color':'#35F29A'}}, 'valueFontColor': {'solid': {'color':'#E7F6FF'}}, 'transparency': 5, 'fontSize': 10}}]
    }
    if tooltip_page:
        objs['visualTooltip']=[{'properties':{'show': True, 'type':'ReportPage', 'section': tooltip_page, 'background': {'solid': {'color':'#061421'}}, 'transparency': 0}}]
    if nav_target:
        objs['visualLink']=[{'properties':{'show': True, 'type':'PageNavigation', 'navigationSection': nav_target, 'showDefaultTooltip': False}}]
    return objs

def visual_objects(vtype):
    base={
      'categoryAxis':[{'properties':{'labelColor': {'solid': {'color':'#D8F7FF'}}, 'showAxisTitle': False, 'fontSize': 9}}],
      'valueAxis':[{'properties':{'labelColor': {'solid': {'color':'#D8F7FF'}}, 'showAxisTitle': False, 'gridlineStyle':'dotted', 'gridlineColor': {'solid': {'color':'#1C4664'}}, 'fontSize': 9}}],
      'legend':[{'properties':{'labelColor': {'solid': {'color':'#D8F7FF'}}, 'showTitle': False, 'position':'BottomCenter'}}],
      'labels':[{'properties':{'show': False, 'color': {'solid': {'color':'#F7FFFE'}}}}]
    }
    if vtype in ('tableEx','matrix'):
        base.update({
          'grid':[{'properties':{'gridVertical': False, 'gridHorizontal': False, 'outlineColor': {'solid': {'color':'#1C4664'}}, 'textSize': 9}}],
          'values':[{'properties':{'fontColorPrimary': {'solid': {'color':'#E7F6FF'}}, 'backColorPrimary': {'solid': {'color':'#061421'}}, 'backColorSecondary': {'solid': {'color':'#071B2B'}}}}],
          'columnHeaders':[{'properties':{'fontColor': {'solid': {'color':'#35F29A'}}, 'backColor': {'solid': {'color':'#061421'}}, 'fontSize': 9}}]
        })
    if vtype == 'cardVisual':
        base.update({'calloutValue':[{'properties':{'fontColor': {'solid': {'color':'#35F29A'}}, 'fontSize': 24, 'fontFamily':'Segoe UI Semibold'}}], 'categoryLabels':[{'properties':{'show': True, 'fontColor': {'solid': {'color':'#B8D7E8'}}, 'fontSize': 9}}]})
    if vtype == 'slicer':
        base.update({'items':[{'properties':{'fontColor': {'solid': {'color':'#E7F6FF'}}, 'background': {'solid': {'color':'#061421'}}, 'textSize': 9}}], 'header':[{'properties':{'show': False}}]})
    return base

def make_visual(name,vtype,x,y,w,h,fields,z,title=None,tooltip_page=None,drill_target=None):
    qs={}
    for f in fields:
        expr, ref = f.expr_ref_type()
        proj={'field':expr, 'queryRef':ref, 'displayName':f.display}
        if f.active: proj['active']=True
        if f.fmt: proj['format']=f.fmt
        qs.setdefault(f.role, {'projections': []})['projections'].append(proj)
    visual={'visualType':vtype, 'query': {'queryState': qs}, 'objects': visual_objects(vtype), 'visualContainerObjects': container_objects(title or name.replace('_',' '), tooltip_page)}
    if drill_target:
        visual['visualContainerObjects'].setdefault('visualLink',[]).append({'properties':{'show': True, 'type':'Drillthrough', 'drillthroughSection': drill_target, 'showDefaultTooltip': True}})
    return {
      '$schema':'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.1.0/schema.json',
      'name':name,
      'position':{'x':x,'y':y,'z':z,'height':h,'width':w,'tabOrder':z},
      'visual':visual,
      'howCreated':'Default',
      'annotations':[{'name':'AgriNovaInteraction','value':'Query-bound overlay visual with native cross-filtering, enhanced tooltip behavior, and dark transparent styling.'}]
    }

# visual specs: page folder -> list tuples
specs={
'Page_AgriNova_Overview': [
('Overview_KPI_Farms','cardVisual',280,130,215,118,[Field('Farms','FarmID','Values',DC,'Total Farms')],'Page_TT_CropHealth','Page_DT_FarmProfile'),
('Overview_KPI_Area','cardVisual',500,130,215,118,[Field('Farms','AreaHa','Values',SUM,'Total Area')],None,'Page_DT_FarmProfile'),
('Overview_KPI_Sensors','cardVisual',720,130,215,118,[Field('Sensors','SensorID','Values',DC,'Sensors')],'Page_TT_IoTUptime','Page_DT_SensorDetail'),
('Overview_KPI_Robots','cardVisual',940,130,215,118,[Field('RobotMissions','RobotID','Values',DC,'Robots')],'Page_TT_RobotStatus','Page_DT_RobotMission'),
('Overview_KPI_Drones','cardVisual',1160,130,215,118,[Field('DroneMissions','DroneID','Values',DC,'Drones')],'Page_TT_DroneCoverage','Page_DT_DroneMission'),
('Overview_KPI_Health','cardVisual',1380,130,220,118,[Field('CropHealthScans','CropHealthScore','Values',AVG,'System Health')],'Page_TT_CropHealth','Page_DT_CropAnalytics'),
('Overview_System_Gauge','gauge',1620,130,270,260,[Field('CropHealthScans','CropHealthScore','Value',AVG,'System Health')],'Page_TT_CropHealth',None),
('Overview_Farm_Map','map',280,270,520,330,[Field('Farms','Latitude','Latitude',AVG,'Latitude'),Field('Farms','Longitude','Longitude',AVG,'Longitude'),Field('Farms','FarmID','Size',DC,'Farms'),Field('Farms','Status','Category',None,'Status',True)],None,'Page_DT_FarmProfile'),
('Overview_Crop_Health_Area','areaChart',830,270,500,330,[Field('CropHealthScans','ScanDate','Category',None,'Scan Date',True),Field('CropHealthScans','CropHealthScore','Y',AVG,'Crop Health')],'Page_TT_CropHealth','Page_DT_CropAnalytics'),
('Overview_Live_Telemetry','tableEx',1360,420,530,180,[Field('Sensors','HeartbeatState','Values'),Field('Sensors','LastSignalTime','Values'),Field('Sensors','PacketRate','Values',SUM,'Packet Rate')],'Page_TT_IoTUptime','Page_DT_SensorDetail'),
('Overview_Alerts','matrix',280,630,620,310,[Field('Alerts','AlertType','Rows'),Field('Alerts','PriorityLevel','Columns'),Field('Alerts','AlertID','Values',CNT,'Alerts')],'Page_TT_AlertSeverity','Page_DT_AlertDetail'),
('Overview_AI_Recommendations','tableEx',930,630,960,310,[Field('AIRecommendations','InteractionType','Values'),Field('AIRecommendations','RecommendationText','Values'),Field('AIRecommendations','AssistantAvailability','Values')],None,None)
],
'Page_Smart_Farm_Monitoring': [
('Farm_Slicer_Farm','slicer',280,130,190,130,[Field('Farms','FarmName','Values')],None,None),('Farm_Slicer_Crop','slicer',475,130,190,130,[Field('Crops','CropName','Values')],None,None),('Farm_KPI_Moisture','cardVisual',720,130,185,170,[Field('SoilReadings','SoilMoisturePct','Values',AVG,'Soil Moisture')],'Page_TT_WaterEfficiency','Page_DT_SensorDetail'),('Farm_KPI_Temp','cardVisual',910,130,185,170,[Field('SoilReadings','SoilTempC','Values',AVG,'Soil Temp')],None,'Page_DT_SensorDetail'),('Farm_KPI_Humidity','cardVisual',1100,130,185,170,[Field('SoilReadings','HumidityPct','Values',AVG,'Humidity')],None,'Page_DT_SensorDetail'),('Farm_KPI_pH','cardVisual',1290,130,185,170,[Field('SoilReadings','PH','Values',AVG,'pH')],None,'Page_DT_SensorDetail'),('Farm_KPI_Nitrogen','cardVisual',1480,130,185,170,[Field('SoilReadings','NitrogenPPM','Values',AVG,'Nitrogen')],None,'Page_DT_SensorDetail'),('Farm_KPI_Light','cardVisual',1670,130,220,170,[Field('SoilReadings','LightLux','Values',AVG,'Light')],None,'Page_DT_SensorDetail'),('Farm_Moisture_Trends','lineChart',280,330,760,330,[Field('SoilReadings','Date','Category',None,'Date',True),Field('SoilReadings','SoilMoisturePct','Y',AVG,'Soil Moisture'),Field('SoilReadings','PH','Y',AVG,'pH')],'Page_TT_WaterEfficiency','Page_DT_SensorDetail'),('Farm_Zone_Heatmap','matrix',1070,330,820,330,[Field('Sensors','Zone','Rows'),Field('Sensors','SensorType','Columns'),Field('Sensors','CommunicationHealth','Values',AVG,'Communication')],'Page_TT_IoTUptime','Page_DT_SensorDetail'),('Farm_Latest_Readings','tableEx',280,690,1610,250,[Field('Sensors','SensorID','Values'),Field('Sensors','Status','Values'),Field('Sensors','Zone','Values'),Field('Sensors','LastSignalTime','Values'),Field('Sensors','CommunicationHealth','Values',AVG,'Communication')],'Page_TT_IoTUptime','Page_DT_SensorDetail')],
'Page_Crop_Health_Vision_Intelligence': [
('Vision_KPI_Health','cardVisual',280,130,250,140,[Field('CropHealthScans','CropHealthScore','Values',AVG,'Health Score')],'Page_TT_CropHealth','Page_DT_CropScan'),('Vision_KPI_Diseases','cardVisual',540,130,250,140,[Field('CropHealthScans','DetectedDisease','Values',DC,'Detected Diseases')],'Page_TT_CropHealth','Page_DT_CropScan'),('Vision_KPI_Scans','cardVisual',800,130,250,140,[Field('CropHealthScans','ScanID','Values',DC,'Images Analyzed')],None,'Page_DT_CropScan'),('Vision_KPI_Risk','cardVisual',1060,130,250,140,[Field('CropHealthScans','PestRiskLevel','Values',DC,'Risk Levels')],None,'Page_DT_CropScan'),('Vision_KPI_Stress','cardVisual',1320,130,250,140,[Field('CropHealthScans','PlantStressIndicator','Values',DC,'Stress Signals')],None,'Page_DT_CropScan'),('Vision_KPI_Treatment','cardVisual',1580,130,310,140,[Field('CropHealthScans','RecommendedTreatment','Values',DC,'Treatments')],None,'Page_DT_CropScan'),('Vision_Disease_Distribution','stackedBarChart',280,300,520,290,[Field('Crops','CropName','Category',None,'Crop',True),Field('CropHealthScans','ScanID','Y',CNT,'Scans'),Field('CropHealthScans','DetectedDisease','Series',None,'Disease')],'Page_TT_CropHealth','Page_DT_CropAnalytics'),('Vision_Scan_History','tableEx',830,300,1060,290,[Field('CropHealthScans','ScanID','Values'),Field('CropHealthScans','ScanDate','Values'),Field('CropHealthScans','CropHealthScore','Values',AVG,'Health'),Field('CropHealthScans','DetectedDisease','Values'),Field('CropHealthScans','PestRiskLevel','Values')],None,'Page_DT_CropScan'),('Vision_Diagnosis_Actions','multiRowCard',280,620,1610,320,[Field('CropHealthScans','ImageDiagnosisResult','Values'),Field('CropHealthScans','RecommendedTreatment','Values'),Field('CropHealthScans','PreventiveAction','Values')],None,'Page_DT_CropScan')],
'Page_Robotics_Drone_Operations': [
('Robotics_Robot_Cards','multiRowCard',280,130,380,260,[Field('RobotMissions','BatteryPct','Values',AVG,'Robot Battery'),Field('RobotMissions','RouteProgressPct','Values',AVG,'Route Progress'),Field('RobotMissions','FieldCoveragePct','Values',AVG,'Field Coverage')],'Page_TT_RobotStatus','Page_DT_RobotMission'),('Robotics_Robot_Status','donutChart',680,130,390,260,[Field('RobotMissions','RobotStatus','Category',None,'Robot Status',True),Field('RobotMissions','RobotMissionID','Y',CNT,'Missions')],'Page_TT_RobotStatus','Page_DT_RobotMission'),('Robotics_Robot_Missions','tableEx',280,420,790,310,[Field('RobotMissions','RobotID','Values'),Field('RobotMissions','MissionState','Values'),Field('RobotMissions','ObstacleAlerts','Values',SUM,'Obstacle Alerts'),Field('RobotMissions','LastMissionSummary','Values')],None,'Page_DT_RobotMission'),('Robotics_Drone_Cards','multiRowCard',1100,130,380,260,[Field('DroneMissions','BatteryPct','Values',AVG,'Drone Battery'),Field('DroneMissions','FlightCoveragePct','Values',AVG,'Flight Coverage'),Field('DroneMissions','AerialCropHealthPct','Values',AVG,'Aerial Health')],'Page_TT_DroneCoverage','Page_DT_DroneMission'),('Robotics_Drone_Status','donutChart',1500,130,390,260,[Field('DroneMissions','DroneFlightStatus','Category',None,'Flight Status',True),Field('DroneMissions','DroneMissionID','Y',CNT,'Flights')],'Page_TT_DroneCoverage','Page_DT_DroneMission'),('Robotics_Drone_Missions','tableEx',1100,420,790,310,[Field('DroneMissions','DroneID','Values'),Field('DroneMissions','MissionState','Values'),Field('DroneMissions','ThermalStressZones','Values',SUM,'Thermal Zones'),Field('DroneMissions','HighRiskFieldZones','Values')],None,'Page_DT_DroneMission'),('Robotics_Performance_Trend','lineChart',280,760,1610,180,[Field('RobotMissions','MissionDate','Category',None,'Mission Date',True),Field('RobotMissions','BatteryPct','Y',AVG,'Robot Battery'),Field('RobotMissions','FieldCoveragePct','Y',AVG,'Robot Coverage')],None,'Page_DT_RobotMission')],
'Page_IoT_Sensor_Network': [
('IOT_KPI_Total','cardVisual',280,130,250,130,[Field('Sensors','SensorID','Values',DC,'Total Sensors')],'Page_TT_IoTUptime','Page_DT_SensorDetail'),('IOT_KPI_Online','cardVisual',540,130,250,130,[Field('Sensors','CommunicationHealth','Values',AVG,'Communication')],'Page_TT_IoTUptime','Page_DT_SensorDetail'),('IOT_KPI_Packets','cardVisual',800,130,250,130,[Field('Sensors','PacketRate','Values',SUM,'Data Packets')],None,'Page_DT_SensorDetail'),('IOT_KPI_Gateways','cardVisual',1060,130,250,130,[Field('Sensors','EdgeGateway','Values',DC,'Gateways')],None,'Page_DT_SensorDetail'),('IOT_KPI_Live','cardVisual',1320,130,250,130,[Field('Sensors','HeartbeatState','Values',DC,'Heartbeat States')],None,'Page_DT_SensorDetail'),('IOT_KPI_Types','cardVisual',1580,130,310,130,[Field('Sensors','SensorType','Values',DC,'Sensor Types')],None,'Page_DT_SensorDetail'),('IOT_Gateway_Tree','decompositionTreeVisual',280,290,640,360,[Field('Sensors','CommunicationHealth','Analyze',AVG,'Communication'),Field('Farms','FarmName','ExplainBy',None,'Farm'),Field('Sensors','EdgeGateway','ExplainBy',None,'Gateway'),Field('Sensors','SensorType','ExplainBy',None,'Type')],'Page_TT_IoTUptime','Page_DT_SensorDetail'),('IOT_Communication_Heatmap','matrix',950,290,940,360,[Field('Farms','FarmName','Rows'),Field('Sensors','SensorType','Columns'),Field('Sensors','CommunicationHealth','Values',AVG,'Communication')],'Page_TT_IoTUptime','Page_DT_SensorDetail'),('IOT_Packet_Rate_Trend','areaChart',280,680,1610,260,[Field('Sensors','LastSignalTime','Category',None,'Last Signal',True),Field('Sensors','PacketRate','Y',SUM,'Packet Rate')],None,'Page_DT_SensorDetail')],
'Page_Price_Prediction': [
('Price_Commodity_Slicer','slicer',280,130,300,160,[Field('PricePredictions','CropName','Values')],None,None),('Price_KPI_Current','cardVisual',610,130,250,160,[Field('PricePredictions','CurrentMarketPriceEGP','Values',AVG,'Current Price')],None,'Page_DT_PriceCommodity'),('Price_KPI_Predicted','cardVisual',870,130,250,160,[Field('PricePredictions','PredictedPrice60DaysEGP','Values',AVG,'Predicted 60 Days')],None,'Page_DT_PriceCommodity'),('Price_KPI_Trend','cardVisual',1130,130,250,160,[Field('PricePredictions','ExpectedTrend','Values',DC,'Trend Signals')],None,'Page_DT_PriceCommodity'),('Price_KPI_Risk','cardVisual',1390,130,250,160,[Field('PricePredictions','MarketRisk','Values',DC,'Market Risk')],'Page_TT_MarketRisk','Page_DT_PriceCommodity'),('Price_KPI_Profit','cardVisual',1650,130,240,160,[Field('PricePredictions','ProfitabilityIndicator','Values',DC,'Profitability')],'Page_TT_Profitability','Page_DT_PriceCommodity'),('Price_Trajectory','areaChart',280,330,930,360,[Field('PricePredictions','Date','Category',None,'Date',True),Field('PricePredictions','CurrentMarketPriceEGP','Y',AVG,'Current Price'),Field('PricePredictions','PredictedPrice60DaysEGP','Y',AVG,'Predicted Price')],None,'Page_DT_PriceCommodity'),('Price_Impact_Factors','clusteredBarChart',1240,330,650,360,[Field('PricePredictions','CropName','Category',None,'Commodity',True),Field('PricePredictions','SupplyDemandImpact','Y',AVG,'Supply Demand'),Field('PricePredictions','USDEGPImpact','Y',AVG,'USD/EGP'),Field('PricePredictions','InflationImpact','Y',AVG,'Inflation'),Field('PricePredictions','SeasonalEffect','Y',AVG,'Seasonal')],None,'Page_DT_PriceCommodity'),('Price_Commodity_Matrix','matrix',280,720,1610,220,[Field('PricePredictions','CropName','Rows'),Field('PricePredictions','CurrentMarketPriceEGP','Values',AVG,'Current'),Field('PricePredictions','PredictedPrice60DaysEGP','Values',AVG,'60-Day'),Field('PricePredictions','ExpectedTrend','Values'),Field('PricePredictions','VolatilityLevel','Values'),Field('PricePredictions','SmartRecommendation','Values')],None,'Page_DT_PriceCommodity')],
'Page_Blockchain_Security': [
('Blockchain_KPI_Integrity','cardVisual',280,130,260,130,[Field('BlockchainTransactions','ValidationState','Values',DC,'Validation States')],'Page_TT_BlockchainIntegrity','Page_DT_BlockchainTransaction'),('Blockchain_KPI_Records','cardVisual',550,130,260,130,[Field('BlockchainTransactions','VerifiedFarmRecords','Values',SUM,'Verified Records')],None,'Page_DT_BlockchainTransaction'),('Blockchain_KPI_Secure','cardVisual',820,130,260,130,[Field('BlockchainTransactions','SecureTransactions','Values',SUM,'Secure Transactions')],None,'Page_DT_BlockchainTransaction'),('Blockchain_KPI_Contracts','cardVisual',1090,130,260,130,[Field('BlockchainTransactions','SmartContractStatus','Values',DC,'Smart Contracts')],None,'Page_DT_BlockchainTransaction'),('Blockchain_KPI_Blocks','cardVisual',1360,130,260,130,[Field('BlockchainTransactions','BlockIndex','Values',DC,'Total Blocks')],None,'Page_DT_BlockchainTransaction'),('Blockchain_KPI_Network','cardVisual',1630,130,260,130,[Field('BlockchainTransactions','BlockchainNetworkStatus','Values',DC,'Network Health')],None,'Page_DT_BlockchainTransaction'),('Blockchain_Block_History','tableEx',280,300,1610,330,[Field('BlockchainTransactions','BlockIndex','Values'),Field('BlockchainTransactions','RecordType','Values'),Field('BlockchainTransactions','HashPreview','Values'),Field('BlockchainTransactions','PreviousHashPreview','Values'),Field('BlockchainTransactions','ValidationState','Values')],'Page_TT_BlockchainIntegrity','Page_DT_BlockchainTransaction'),('Blockchain_Validation_Timeline','areaChart',280,670,770,270,[Field('BlockchainTransactions','TransactionDate','Category',None,'Transaction Date',True),Field('BlockchainTransactions','TransactionID','Y',CNT,'Transactions')],None,'Page_DT_BlockchainTransaction'),('Blockchain_Audit_Panel','matrix',1080,670,810,270,[Field('BlockchainTransactions','TraceabilityStage','Rows'),Field('BlockchainTransactions','DataIntegrityStatus','Columns'),Field('BlockchainTransactions','TransactionID','Values',CNT,'Transactions')],None,'Page_DT_BlockchainTransaction')],
'Page_AI_Assistant': [('AI_Chat_Surface','tableEx',280,130,880,810,[Field('AIRecommendations','FarmerQuestion','Values'),Field('AIRecommendations','RecommendationText','Values'),Field('AIRecommendations','AssistantAvailability','Values')],None,None),('AI_Suggested_Questions','slicer',1190,130,700,170,[Field('AIRecommendations','InteractionType','Values')],None,None),('AI_Guidance_Cards','multiRowCard',1190,330,700,300,[Field('AIRecommendations','InteractionType','Values'),Field('AIRecommendations','RecommendationText','Values')],None,None),('AI_Image_Diagnosis','tableEx',1190,660,700,280,[Field('CropHealthScans','ImageDiagnosisResult','Values'),Field('CropHealthScans','RecommendedTreatment','Values'),Field('CropHealthScans','PreventiveAction','Values')],None,'Page_DT_CropScan')],
'Page_Sustainability_Energy': [('Energy_KPI_Status','cardVisual',280,130,260,140,[Field('EnergyUsage','BatteryLevelPct','Values',AVG,'Battery Level')],'Page_TT_Energy',None),('Energy_KPI_Renewable','cardVisual',550,130,260,140,[Field('EnergyUsage','RenewableEnergyUsagePct','Values',AVG,'Renewable Energy')],'Page_TT_Energy',None),('Energy_KPI_Carbon','cardVisual',820,130,260,140,[Field('EnergyUsage','CarbonReductionKg','Values',SUM,'Carbon Reduction')],None,None),('Energy_KPI_Consumption','cardVisual',1090,130,260,140,[Field('EnergyUsage','EnergyConsumptionKwh','Values',SUM,'Energy Use')],None,None),('Energy_KPI_Offgrid','cardVisual',1360,130,260,140,[Field('EnergyUsage','OffGridOperationStatus','Values',DC,'Off-grid Status')],None,None),('Energy_KPI_Charging','cardVisual',1630,130,260,140,[Field('EnergyUsage','RobotChargingStatus','Values',DC,'Charging States')],None,None),('Energy_Trend','areaChart',280,300,850,360,[Field('EnergyUsage','Date','Category',None,'Date',True),Field('EnergyUsage','RenewableEnergyUsagePct','Y',AVG,'Renewable'),Field('EnergyUsage','EnergyConsumptionKwh','Y',SUM,'Consumption')],'Page_TT_Energy',None),('Energy_Charging_Status','matrix',1160,300,730,360,[Field('Farms','FarmName','Rows'),Field('EnergyUsage','RobotChargingStatus','Columns'),Field('EnergyUsage','BatteryLevelPct','Values',AVG,'Battery')],None,None),('Energy_Carbon_Reduction','clusteredBarChart',280,690,1610,250,[Field('Farms','FarmName','Category',None,'Farm',True),Field('EnergyUsage','CarbonReductionKg','Y',SUM,'Carbon Reduction')],None,None)],
'Page_Alerts_Reports': [('Alerts_Command_Center','matrix',280,130,760,390,[Field('Alerts','AlertType','Rows'),Field('Alerts','PriorityLevel','Columns'),Field('Alerts','AlertID','Values',CNT,'Alerts')],'Page_TT_AlertSeverity','Page_DT_AlertDetail'),('Alerts_Priority_Breakdown','stackedColumnChart',1070,130,820,390,[Field('Alerts','PriorityLevel','Category',None,'Priority',True),Field('Alerts','AlertID','Y',CNT,'Alerts'),Field('Alerts','AlertType','Series',None,'Alert Type')],'Page_TT_AlertSeverity','Page_DT_AlertDetail'),('Alerts_Actions_Feed','tableEx',280,550,760,390,[Field('Alerts','AlertMessage','Values'),Field('Alerts','RecommendedAction','Values'),Field('Alerts','ResolutionStatus','Values')],None,'Page_DT_AlertDetail'),('Reports_Catalog','tableEx',1070,550,820,390,[Field('Reports','ReportName','Values'),Field('Reports','GeneratedDate','Values'),Field('Reports','ExportFormat','Values'),Field('Reports','DecisionSupportSummary','Values')],None,None)]
}

# Generate main page visuals and transparent navigation buttons.
main_order=list(bg_map.keys())
nav_labels=[('Overview','Page_AgriNova_Overview'),('Farm Monitoring','Page_Smart_Farm_Monitoring'),('Crop Health','Page_Crop_Health_Vision_Intelligence'),('Robots & Drones','Page_Robotics_Drone_Operations'),('IoT Network','Page_IoT_Sensor_Network'),('Price Prediction','Page_Price_Prediction'),('Blockchain','Page_Blockchain_Security'),('AI Assistant','Page_AI_Assistant'),('Sustainability','Page_Sustainability_Energy'),('Alerts & Reports','Page_Alerts_Reports')]
for page_name, visual_specs in specs.items():
    page_dir=PAGES_DIR/page_name
    vis_dir=page_dir/'visuals'
    if vis_dir.exists(): shutil.rmtree(vis_dir)
    vis_dir.mkdir(parents=True, exist_ok=True)
    z=1
    # invisible but clickable sidebar navigation strips, aligned to mockup sidebar.
    y0=150
    for i,(label,target) in enumerate(nav_labels):
        btn_name=f'Nav_{i+1:02d}_{target}'
        btn={
          '$schema':'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.1.0/schema.json',
          'name':btn_name,
          'position':{'x':20,'y':y0+i*62,'z':z,'height':44,'width':220,'tabOrder':z},
          'visual':{'visualType':'actionButton','visualContainerObjects':container_objects(label, nav_target=target)},
          'howCreated':'Default',
          'annotations':[{'name':'AgriNovaInteraction','value':'Transparent sidebar page navigation hotspot.'}]
        }
        p=vis_dir/btn_name; p.mkdir(); (p/'visual.json').write_text(json.dumps(btn,indent=2),encoding='utf-8'); z+=1
    for item in visual_specs:
        name,vtype,x,y,w,h,fields,tt,drill=item
        v=make_visual(name,vtype,x,y,w,h,fields,z,tooltip_page=tt,drill_target=drill)
        p=vis_dir/name; p.mkdir(); (p/'visual.json').write_text(json.dumps(v,indent=2),encoding='utf-8'); z+=1
    # Patch page background image.
    page_json_path=page_dir/'page.json'
    pj=json.loads(page_json_path.read_text(encoding='utf-8'))
    fname=bg_map.get(page_name)
    if fname:
        pj['objects']={
          'background':[{'properties':{'color':{'solid':{'color':'#020B18'}},'transparency':100}}],
          'outspace':[{'properties':{'color':{'solid':{'color':'#020B18'}},'transparency':0,'image':{'image':{'name':{'expr':{'Literal':{'Value':f"'{fname}'"}}},'url':{'expr':{'ResourcePackageItem':{'PackageName':'RegisteredResources','PackageType':1,'ItemName':fname}}},'scaling':{'expr':{'Literal':{'Value':"'Fill'"}}}}}}}]
        }
    page_json_path.write_text(json.dumps(pj,indent=2),encoding='utf-8')

# Patch report settings/resources for interaction behavior.
rp=DEF/'report.json'
r=json.loads(rp.read_text(encoding='utf-8'))
r.setdefault('settings',{}).update({'hideVisualContainerHeader':True,'useEnhancedTooltips':True,'useScaledTooltips':True,'defaultFilterActionIsDataFilter':True,'defaultDrillFilterOtherVisuals':True,'filterPaneHiddenInEditMode':True,'pagesPosition':'Bottom'})
packages=r.setdefault('resourcePackages',[])
reg=next((p for p in packages if p.get('name')=='RegisteredResources'),None)
if reg is None:
    reg={'name':'RegisteredResources','type':'RegisteredResources','items':[]}; packages.append(reg)
items={it['path']:it for it in reg.setdefault('items',[])}
for fname in bg_map.values():
    items[fname]={'name':fname,'path':fname,'type':'Image'}
# Keep existing theme/icon resources.
for it in list(reg['items']): items[it['path']]=it
reg['items']=list(items.values())
rp.write_text(json.dumps(r,indent=2),encoding='utf-8')

# Add a concise interaction implementation note.
note=ROOT/'manual_build'/'06_INTERACTIVE_POWER_BI_IMPLEMENTATION_NOTES.md'
note.write_text('''# AgriNova Interactive Implementation Notes\n\nThe PBIR report definition has been upgraded with query-bound overlay visuals on all 10 primary pages. Native Power BI cross-filtering is enabled through report settings, enhanced tooltips are on, KPI/chart visuals reference dedicated tooltip pages where appropriate, and major operational visuals include drill-through links to detail pages. Transparent sidebar action-button hotspots are included for page navigation.\n\nOpen `powerbi/AgriNova/AgriNova.pbip` in Power BI Desktop, refresh, review any visual-type auto-fixes, then save as PBIX/PDF. The original `AgriNova_Final.pbix` was restored after legacy PBIX layout injection was rejected by Power BI Desktop load validation.\n''',encoding='utf-8')
print('PBIR interactive report patched')
print('Main pages:', len(specs))
print('Visuals plus nav hotspots:', sum(len(v)+10 for v in specs.values()))
print('Background images registered:', len(bg_map))
