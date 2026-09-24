import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSimulation } from '../contexts/SimulationContext';
import { useBlockchain } from '../contexts/BlockchainContext';
import { useAlerts } from '../contexts/AlertContext';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { RouteMap } from '../components/shipment/RouteMap';
import { TransactionTable } from '../components/blockchain/TransactionTable';
import { SensorChart } from '../components/analytics/SensorChart';
import { INITIAL_SHIPMENTS } from '../data/mockSeedData';
import {
  Package,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Cpu,
  WifiOff,
  Link as ChainIcon,
  RefreshCw,
  ArrowUpRight,
  ChevronRight,
  Activity,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { devices, historyReadings, offlineQueueCount, currentScenario } = useSimulation();
  const { transactions } = useBlockchain();
  const { alerts, activeCount } = useAlerts();

  const activeDevices = devices.filter((d) => d.connectivity === 'ONLINE').length;
  const offlineDevices = devices.filter((d) => d.connectivity === 'OFFLINE').length;
  const verifiedTxCount = transactions.filter((t) => t.status === 'CONFIRMED').length;

  const mangoShipment = INITIAL_SHIPMENTS[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase">
              Role View: {user?.role}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">{user?.organization}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Supply Chain Overview</h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time cold-chain telemetry, SHA-256 cryptographic verification & Fabric blockchain metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/shipments"
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl transition-all shadow flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Manage Shipments</span>
          </Link>
          <Link
            to="/iot-devices"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all shadow flex items-center gap-2"
          >
            <Cpu className="w-4 h-4" />
            <span>IoT Simulator</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Shipments"
          value="42"
          subtitle="35 Safe • 5 Attention • 2 Critical"
          icon={Package}
          variant="default"
          trend={{ value: '12% vs last month', isPositive: true }}
        />
        <KpiCard
          title="Safe Shipments"
          value="35"
          subtitle="All sensors within threshold"
          icon={ShieldCheck}
          variant="success"
        />
        <KpiCard
          title="Attention / Warnings"
          value="5"
          subtitle="High humidity or ethylene"
          icon={AlertTriangle}
          variant="warning"
        />
        <KpiCard
          title="Critical Alerts"
          value={activeCount > 0 ? activeCount : '2'}
          subtitle="Temperature breaches or tamper"
          icon={Flame}
          variant="danger"
        />
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Connected Devices</div>
            <div className="text-xl font-extrabold text-slate-900">{activeDevices} / {devices.length}</div>
          </div>
          <Cpu className="w-8 h-8 text-emerald-600/30" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Offline Devices</div>
            <div className="text-xl font-extrabold text-slate-900">{offlineDevices}</div>
          </div>
          <WifiOff className="w-8 h-8 text-amber-600/30" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Blockchain Verified</div>
            <div className="text-xl font-extrabold text-slate-900">{verifiedTxCount} Txs</div>
          </div>
          <ChainIcon className="w-8 h-8 text-emerald-600/30" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Data Synced Rate</div>
            <div className="text-xl font-extrabold text-slate-900">100%</div>
          </div>
          <RefreshCw className="w-8 h-8 text-sky-600/30" />
        </div>
      </div>

      {/* Live Map & Live Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Supply Chain Route Tracking</h3>
              <p className="text-xs text-slate-500">MANGO-001 • Erode, Tamil Nadu → Dubai, UAE</p>
            </div>
            <StatusBadge status={mangoShipment.status} />
          </div>

          <RouteMap coordinates={mangoShipment.routeCoordinates} />
        </div>

        <div className="space-y-4">
          <SensorChart
            data={historyReadings}
            metric="temperature"
            title="Live Temperature Stream (AG-SENSOR-001)"
            unit="°C"
            color="#0F5132"
          />
        </div>
      </div>

      {/* Active Alerts & Blockchain Transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Alerts Widget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Recent Rule-Based Alerts</h3>
            </div>
            <Link to="/alerts" className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1">
              <span>Alert Center</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {alerts.slice(0, 4).map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{a.title}</span>
                    <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                      {a.shipmentId}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{a.message}</p>
                </div>
                <StatusBadge status={a.severity} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Device Health */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">IoT Device Health & Battery</h3>
            </div>
            <Link to="/iot-devices" className="text-xs font-bold text-emerald-800 hover:underline">
              View All 5 Devices →
            </Link>
          </div>

          <div className="space-y-3">
            {devices.map((d) => (
              <div key={d.deviceId} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] flex items-center justify-center">
                    {d.deviceId.slice(-3)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{d.deviceId}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Shipment: {d.shipmentId} • Energy: {d.energySource}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <div className="font-bold text-slate-800">{d.temperature}°C</div>
                    <div className="text-[10px] text-slate-500">{d.battery}% Batt</div>
                  </div>
                  <StatusBadge status={d.connectivity} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blockchain Ledger Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ChainIcon className="w-5 h-5 text-emerald-700" />
            <span>Recent Hyperledger Fabric Transactions</span>
          </h3>
          <Link to="/blockchain" className="text-xs font-bold text-emerald-800 hover:underline">
            Explorer Full Ledger →
          </Link>
        </div>

        <TransactionTable transactions={transactions.slice(0, 5)} />
      </div>
    </div>
  );
};
