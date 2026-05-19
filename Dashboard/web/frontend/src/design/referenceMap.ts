export interface ReferencePage {
  route: string;
  title: string;
  pageNumber: string;
  image: string;
  notes: {
    layout: string;
    colors: string;
    components: string[];
    charts: string[];
    kpiAreas: string[];
  };
}

export const referencePages: ReferencePage[] = [
  {
    route: '/',
    title: 'Overview',
    pageNumber: '01',
    image: 'web/reference-images/01_AgriNova_Overview.png',
    notes: {
      layout: 'Left fixed navigation, compact top header with page number, six KPI cards, large map/chart row, dense bottom analytics panels.',
      colors: 'Near-black blue background, emerald active states, cyan borders, purple robot accents, yellow warning accents.',
      components: ['Sidebar', 'page number badge', 'KPI strip', 'map panel', 'trend charts', 'alerts panel', 'quick actions'],
      charts: ['Area trend', 'line trend', 'radial health gauge'],
      kpiAreas: ['farms', 'area', 'sensors', 'robots', 'drones', 'system health'],
    },
  },
  {
    route: '/smart-farm-monitoring',
    title: 'Smart Farm Monitoring',
    pageNumber: '02',
    image: 'web/reference-images/02_Smart_Farm_Monitoring.png',
    notes: {
      layout: 'Same command shell with farm telemetry KPIs, sensor/environment panels, farm filter, and lower device tables.',
      colors: 'Emerald/cyan telemetry on deep navy glass panels with status-green highlights.',
      components: ['farm filter', 'KPI strip', 'environment cards', 'sensor table', 'irrigation status'],
      charts: ['Moisture area chart', 'environment line chart'],
      kpiAreas: ['moisture', 'pH', 'humidity', 'temperature', 'online sensors'],
    },
  },
  {
    route: '/crop-health',
    title: 'Crop Health & Vision Intelligence',
    pageNumber: '03',
    image: 'web/reference-images/03_Crop_Health_and_Vision_Intelligence.png',
    notes: {
      layout: 'Vision intelligence layout with health KPIs, large scan analytics, disease/risk panels, and recent scan table.',
      colors: 'Green health signals with magenta/amber risk highlights over dark glass.',
      components: ['health cards', 'vision status pill', 'treatment card', 'scan queue table'],
      charts: ['Health line chart', 'disease bar chart'],
      kpiAreas: ['health score', 'disease signals', 'pest risk', 'scan records'],
    },
  },
  {
    route: '/robotics-drones',
    title: 'Robotics & Drone Operations',
    pageNumber: '04',
    image: 'web/reference-images/04_Robotics_and_Drone_Operations.png',
    notes: {
      layout: 'Fleet control screen with active unit KPIs, coverage chart, battery/status panels, and mission control table.',
      colors: 'Blue/cyan robotics accents, violet automation accents, amber alerts.',
      components: ['fleet cards', 'battery gauge', 'coverage chart', 'mission table'],
      charts: ['Coverage bar chart', 'battery gauge'],
      kpiAreas: ['robots', 'drones', 'route progress', 'obstacle alerts'],
    },
  },
  {
    route: '/iot-network',
    title: 'IoT Sensor Network',
    pageNumber: '05',
    image: 'web/reference-images/05_IoT_Sensor_Network.png',
    notes: {
      layout: 'Network operations page with sensor status KPIs, communication chart, type filter, and registry table.',
      colors: 'Cyan network lines, green online states, red offline states.',
      components: ['sensor filter', 'online/offline KPIs', 'gateway status', 'sensor registry'],
      charts: ['Packet line chart', 'network gauge'],
      kpiAreas: ['online sensors', 'offline sensors', 'gateways', 'packet rate'],
    },
  },
  {
    route: '/price-prediction',
    title: 'Price Prediction',
    pageNumber: '06',
    image: 'web/reference-images/06_Price_Prediction.png',
    notes: {
      layout: 'Exact reference uses six KPI cards, large price trajectory chart left, impact factors center, opportunities right, full forecast table, heatmap, news, and confidence gauge.',
      colors: 'Emerald profit signals, cyan predicted line, violet confidence band, yellow medium-risk badges.',
      components: ['commodity filter tabs', 'KPI strip', 'impact factor bars', 'opportunity table', 'forecast table', 'price heatmap', 'news list', 'confidence gauge'],
      charts: ['Actual vs predicted area/line chart', 'impact factor bars', 'heatmap grid', 'radial confidence gauge'],
      kpiAreas: ['commodities tracked', 'current market price', 'predicted price', 'expected change', 'market risk', 'profitability'],
    },
  },
  {
    route: '/blockchain-security',
    title: 'Blockchain Security',
    pageNumber: '07',
    image: 'web/reference-images/07_Blockchain_Security.png',
    notes: {
      layout: 'Security dashboard with ledger KPIs, validation timeline, audit trail table, hash preview, and contract status.',
      colors: 'Cyan security glow, emerald verified states, amber pending review.',
      components: ['ledger cards', 'audit trail', 'hash preview', 'validation timeline'],
      charts: ['Timeline bars', 'validation gauge'],
      kpiAreas: ['network status', 'transactions', 'verified records', 'secure actions'],
    },
  },
  {
    route: '/ai-assistant',
    title: 'AI Assistant',
    pageNumber: '08',
    image: 'web/reference-images/08_AI_Assistant.png',
    notes: {
      layout: 'Assistant console with AI status KPIs, central conversation surface, suggested questions, and recommendation feed.',
      colors: 'Cyan intelligence glow, emerald online states, violet assistant accents.',
      components: ['assistant console', 'prompt chips', 'recommendation table', 'vision status'],
      charts: ['Status cards and feed, no primary chart required'],
      kpiAreas: ['AI Engine', 'responses', 'availability', 'Vision Intelligence Module'],
    },
  },
  {
    route: '/sustainability-energy',
    title: 'Sustainability & Energy',
    pageNumber: '09',
    image: 'web/reference-images/09_Sustainability_and_Energy.png',
    notes: {
      layout: 'Energy command page with renewable KPIs, sustainability gauge, energy flow chart, and operations table.',
      colors: 'Emerald sustainability, cyan energy flow, amber battery accents.',
      components: ['energy cards', 'sustainability gauge', 'energy flow chart', 'energy operations table'],
      charts: ['Energy area chart', 'sustainability gauge'],
      kpiAreas: ['renewable usage', 'carbon reduction', 'battery', 'water saving'],
    },
  },
  {
    route: '/alerts-reports',
    title: 'Alerts & Reports',
    pageNumber: '10',
    image: 'web/reference-images/10_Alerts_and_Reports.png',
    notes: {
      layout: 'Operations review page with alert KPIs, pressure gauge, alert type chart, resolution status, and recent alert table.',
      colors: 'Red/amber alert accents balanced with cyan system chrome.',
      components: ['alert cards', 'alert pressure gauge', 'alert type chart', 'resolution panel', 'recent alerts table'],
      charts: ['Alert bar chart', 'pressure gauge'],
      kpiAreas: ['active alerts', 'critical', 'warnings', 'reports'],
    },
  },
];

export function getReferenceByTitle(title: string) {
  return referencePages.find((page) => page.title === title);
}
