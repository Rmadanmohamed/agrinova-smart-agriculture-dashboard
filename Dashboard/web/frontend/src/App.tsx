import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';
import { Sidebar } from './components/Sidebar';
import { fetchDashboardData } from './services/api';
import type { DashboardData } from './services/types';
import { calculateSummary } from './utils/calculations';
import { Overview } from './pages/Overview';
import { SmartFarmMonitoring } from './pages/SmartFarmMonitoring';
import { CropHealth } from './pages/CropHealth';
import { RoboticsDrones } from './pages/RoboticsDrones';
import { IoTNetwork } from './pages/IoTNetwork';
import { PricePrediction } from './pages/PricePrediction';
import { BlockchainSecurity } from './pages/BlockchainSecurity';
import { AIAssistant } from './pages/AIAssistant';
import { SustainabilityEnergy } from './pages/SustainabilityEnergy';
import { AlertsReports } from './pages/AlertsReports';

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetchDashboardData().then(setData).catch((err: Error) => setError(err.message));
  }, []);

  const summary = useMemo(() => (data ? calculateSummary(data) : null), [data]);

  if (error) return <ErrorState message={error} />;
  if (!data || !summary) return <LoadingState />;

  const pageProps = { data, summary };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content-shell">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Overview {...pageProps} />} />
            <Route path="/smart-farm-monitoring" element={<SmartFarmMonitoring {...pageProps} />} />
            <Route path="/crop-health" element={<CropHealth {...pageProps} />} />
            <Route path="/robotics-drones" element={<RoboticsDrones {...pageProps} />} />
            <Route path="/iot-network" element={<IoTNetwork {...pageProps} />} />
            <Route path="/price-prediction" element={<PricePrediction {...pageProps} />} />
            <Route path="/blockchain-security" element={<BlockchainSecurity {...pageProps} />} />
            <Route path="/ai-assistant" element={<AIAssistant {...pageProps} />} />
            <Route path="/sustainability-energy" element={<SustainabilityEnergy {...pageProps} />} />
            <Route path="/alerts-reports" element={<AlertsReports {...pageProps} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}
