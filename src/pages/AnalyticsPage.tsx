import React from 'react';
import { SensorChart } from '../components/analytics/SensorChart';
import { useSimulation } from '../contexts/SimulationContext';
import { KpiCard } from '../components/common/KpiCard';
import { BarChart3, TrendingUp, ShieldCheck, Clock, RefreshCw } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { historyReadings } = useSimulation();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">Cold-Chain Quality Analytics</h1>
        <p className="text-xs text-slate-500 font-medium">
          Comprehensive compliance trends, device uptime, alert frequency, and blockchain transactions analytics.
        </p>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Temperature Compliance" value="98.4%" subtitle="2°C – 8°C Strict Threshold" icon={ShieldCheck} variant="success" />
        <KpiCard title="Device Fleet Uptime" value="99.9%" subtitle="Zero unrecoverable loss" icon={Clock} variant="default" />
        <KpiCard title="Alert Resolution Rate" value="96.2%" subtitle="Avg resolution: 14 mins" icon={TrendingUp} variant="info" />
        <KpiCard title="Offline Auto-Sync Rate" value="100%" subtitle="0 Data points lost" icon={RefreshCw} variant="success" />
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <SensorChart
          data={historyReadings}
          metric="temperature"
          title="Historical Temperature Compliance Trend"
          unit="°C"
          color="#0F5132"
        />
        <SensorChart
          data={historyReadings}
          metric="humidity"
          title="Humidity Compliance Trend"
          unit="%"
          color="#0284C7"
        />
        <SensorChart
          data={historyReadings}
          metric="ethylene"
          title="Ethylene Gas Gas Accumulation Rate"
          unit="ppm"
          color="#D97706"
        />
        <SensorChart
          data={historyReadings}
          metric="battery"
          title="IoT Device Battery Performance"
          unit="%"
          color="#64748B"
        />
      </div>
    </div>
  );
};
