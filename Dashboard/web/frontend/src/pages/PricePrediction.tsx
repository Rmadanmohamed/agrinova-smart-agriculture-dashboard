import { useMemo, useState } from 'react';
import { CircleDollarSign, LineChart as LineChartIcon, ShieldCheck, ShoppingBasket, Target, TrendingUp } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataTable } from '../components/DataTable';
import { Page } from '../components/Page';
import { Panel } from '../components/Panel';
import { SelectControl } from '../components/SelectControl';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import type { PageProps } from '../services/types';
import { approvedPriceCrops, latestPriceByCrop } from '../utils/calculations';
import { egp, pct, shortDate, toNumber } from '../utils/formatters';

export function PricePrediction({ data, summary }: PageProps) {
  const crops = approvedPriceCrops.filter((crop) => data.pricePredictions.some((row) => row.CropName === crop));
  const [crop, setCrop] = useState(crops[0] ?? 'Tomatoes');
  const rows = useMemo(
    () => data.pricePredictions.filter((row) => row.CropName === crop).sort((a, b) => a.Date.localeCompare(b.Date)),
    [crop, data.pricePredictions],
  );
  const latest = rows[rows.length - 1] ?? latestPriceByCrop(data.pricePredictions)[0];
  const current = toNumber(latest?.CurrentMarketPriceEGP);
  const predicted = toNumber(latest?.PredictedPrice60DaysEGP);
  const change = current ? ((predicted - current) / current) * 100 : 0;
  const chartRows = rows.slice(-36).map((row) => ({
    date: shortDate(row.Date),
    current: toNumber(row.CurrentMarketPriceEGP),
    predicted: toNumber(row.PredictedPrice60DaysEGP),
  }));
  const latestByCrop = latestPriceByCrop(data.pricePredictions).slice(0, 8);
  const opportunities = latestPriceByCrop(data.pricePredictions)
    .map((row) => {
      const rowCurrent = toNumber(row.CurrentMarketPriceEGP);
      const rowPredicted = toNumber(row.PredictedPrice60DaysEGP);
      return {
        ...row,
        ChangePct: rowCurrent ? ((rowPredicted - rowCurrent) / rowCurrent) * 100 : 0,
      };
    })
    .sort((a, b) => b.ChangePct - a.ChangePct)
    .slice(0, 5);
  const impactFactors = [
    { name: 'Supply & Demand', value: Math.round(toNumber(latest?.SupplyDemandImpact) * 100) },
    { name: 'Seasonality', value: Math.round(toNumber(latest?.SeasonalEffect) * 100) },
    { name: 'Market Risk', value: latest?.MarketRisk === 'Low' ? 28 : latest?.MarketRisk === 'Medium' ? 58 : 82 },
    { name: 'Inflation Impact', value: Math.round(toNumber(latest?.InflationImpact) * 100) },
    { name: 'USD/EGP Impact', value: Math.round(toNumber(latest?.USDEGPImpact) * 100) },
  ];
  const heatmapRows = latestByCrop.slice(0, 7).map((row) => {
    const rowCurrent = toNumber(row.CurrentMarketPriceEGP);
    const rowPredicted = toNumber(row.PredictedPrice60DaysEGP);
    const base = rowCurrent ? ((rowPredicted - rowCurrent) / rowCurrent) * 100 : 0;
    return {
      crop: row.CropName,
      weeks: Array.from({ length: 9 }, (_, index) => Number((base * ((index + 1) / 9)).toFixed(1))),
    };
  });

  return (
    <Page
      title="Price Prediction"
      eyebrow="AI-driven market forecasting and price intelligence"
      signal="Market intelligence synced from CSV API"
      actions={<SelectControl label="Commodity" value={crop} options={crops} onChange={setCrop} />}
    >
      <section className="dashboard-grid">
        <div className="col-span-2"><StatCard label="Commodities Tracked" value={crops.length} detail="+ approved produce only" icon={ShoppingBasket} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Current Market Price" value={current.toFixed(2)} detail="+ live CSV signal" icon={CircleDollarSign} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Predicted Price" value={predicted.toFixed(2)} detail="60 days horizon" icon={LineChartIcon} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="Expected Change" value={pct(change, 1)} detail={`Portfolio ${pct(summary.predictedMarketChange, 1)}`} icon={TrendingUp} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Market Risk Score" value={latest?.MarketRisk === 'Low' ? '28/100' : latest?.MarketRisk === 'Medium' ? '58/100' : '82/100'} detail={latest?.MarketRisk ?? 'Medium'} icon={ShieldCheck} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="Profitability Signal" value={latest?.ProfitabilityIndicator ?? 'High'} detail="Opportunity signal" icon={Target} tone="emerald" /></div>

        <Panel title={`Price Trajectory (${crop})`} subtitle="Actual vs Predicted Price (EGP/kg)" className="col-span-5 reference-panel-tall">
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartRows}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#07111c', border: '1px solid rgba(255,255,255,.14)' }} />
                <Area type="monotone" dataKey="current" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.14} />
                <Area type="monotone" dataKey="predicted" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Impact Factors" subtitle="How factors influence predicted prices" className="col-span-3 reference-panel-tall">
          <div className="impact-list">
            {impactFactors.map((factor) => (
              <div key={factor.name} className="impact-row">
                <span>{factor.name}</span>
                <div className="impact-bar"><i style={{ width: `${Math.max(12, Math.min(100, factor.value))}%` }} /></div>
                <strong>+{factor.value}%</strong>
              </div>
            ))}
          </div>
          <div className="impact-scale">
            <span>Negative Impact</span>
            <span>Positive Impact</span>
          </div>
        </Panel>

        <Panel title="Top Opportunities" subtitle="Highest predicted profitability" className="col-span-4 reference-panel-tall">
          <DataTable
            rows={opportunities.map(({ ChangePct, ...row }) => ({ ...row, ChangeLabel: `+${ChangePct.toFixed(1)}%` }))}
            columns={[
              { key: 'CropName', label: 'Commodity' },
              { key: 'ChangeLabel', label: 'Predicted Change' },
              { key: 'ProfitabilityIndicator', label: 'Profitability' },
            ]}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge label={latest?.ExpectedTrend ?? 'Stable'} status={latest?.ExpectedTrend} />
            <StatusBadge label={latest?.MarketRisk ?? 'Medium'} status={latest?.MarketRisk} />
          </div>
        </Panel>

        <Panel title="Commodity Price Forecast Overview" subtitle="Approved fruit and vegetable forecast table" className="col-span-7">
          <DataTable
            rows={latestByCrop}
            columns={[
              { key: 'CropName', label: 'Commodity' },
              { key: 'CurrentMarketPriceEGP', label: 'Current Price' },
              { key: 'PredictedPrice60DaysEGP', label: 'Predicted Price' },
              { key: 'ExpectedTrend', label: 'Trend' },
              { key: 'MarketRisk', label: 'Risk' },
              { key: 'ProfitabilityIndicator', label: 'Signal' },
            ]}
          />
        </Panel>

        <Panel title="Price Heatmap (Change %)" subtitle="60 days forecast" className="col-span-5">
          <div className="heatmap">
            <div className="heatmap-head">
              <span>Commodity</span>
              {Array.from({ length: 9 }, (_, index) => <span key={index}>W{index + 1}</span>)}
            </div>
            {heatmapRows.map((row) => (
              <div className="heatmap-row" key={row.crop}>
                <strong>{row.crop}</strong>
                {row.weeks.map((value, index) => (
                  <span
                    key={`${row.crop}-${index}`}
                    className={value > 7 ? 'heat-high' : value > 4 ? 'heat-mid' : 'heat-low'}
                  >
                    {value.toFixed(1)}%
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Market News & Insights" subtitle="Decision-support signals" className="col-span-9">
          <div className="insight-list">
            <div>Tomato exports expected to increase as buyer demand strengthens.</div>
            <div>Weather patterns indicate favorable growing conditions for bell pepper.</div>
            <div>Strawberry demand remains strong in premium retail channels.</div>
          </div>
        </Panel>

        <Panel title="AI Confidence Score" subtitle="Smart Agriculture Intelligence" className="col-span-3">
          <div className="confidence-ring">
            <span>94%</span>
            <small>High Confidence</small>
          </div>
        </Panel>
      </section>
    </Page>
  );
}
