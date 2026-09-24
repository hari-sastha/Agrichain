import React from 'react';
import { useSimulation } from '../contexts/SimulationContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Cpu, Play, Pause, RotateCcw, Zap, Wifi, WifiOff, ShieldAlert, Sparkles, Battery, Radio } from 'lucide-react';
import { SimulationScenario } from '../types/telemetry';

export const IoTDevicesPage: React.FC = () => {
  const {
    devices,
    currentScenario,
    offlineQueueCount,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    triggerScenario,
  } = useSimulation();

  const scenarios: { id: SimulationScenario; label: string; desc: string; style: string }[] = [
    {
      id: 'NORMAL',
      label: 'NORMAL',
      desc: 'Healthy environmental drift (5-8°C)',
      style: 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100',
    },
    {
      id: 'TEMPERATURE_SPIKE',
      label: 'TEMP SPIKE (14°C)',
      desc: 'Spikes temperature to trigger Critical Alert',
      style: 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100',
    },
    {
      id: 'HIGH_HUMIDITY',
      label: 'HIGH HUMIDITY',
      desc: 'Increases humidity >80%',
      style: 'bg-sky-50 text-sky-900 border-sky-300 hover:bg-sky-100',
    },
    {
      id: 'ETHYLENE_SPIKE',
      label: 'ETHYLENE SPIKE',
      desc: 'Ethylene gas exceeds 3.0 ppm',
      style: 'bg-orange-50 text-orange-900 border-orange-300 hover:bg-orange-100',
    },
    {
      id: 'NETWORK_OUTAGE',
      label: 'NETWORK OUTAGE',
      desc: 'Disconnects device, logs locally in queue',
      style: 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200 font-bold',
    },
    {
      id: 'FULL_RECOVERY',
      label: 'FULL RECOVERY & SYNC',
      desc: 'Restores network & triggers 7-step auto sync',
      style: 'bg-emerald-800 text-white border-emerald-900 hover:bg-emerald-900 font-bold',
    },
    {
      id: 'DEVICE_TAMPER',
      label: 'DEVICE TAMPER',
      desc: 'Simulates physical enclosure breach',
      style: 'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100',
    },
    {
      id: 'BATTERY_LOW',
      label: 'BATTERY LOW (8%)',
      desc: 'Triggers critical power warning',
      style: 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">IoT Sensor Simulation Engine</h1>
          <p className="text-xs text-slate-500 font-medium">
            Virtual ESP32 hardware simulation producing MQTT-style telemetry with energy harvesting models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startSimulation}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl transition-all shadow flex items-center gap-1.5"
          >
            <Play className="w-4 h-4" />
            <span>Start</span>
          </button>
          <button
            onClick={pauseSimulation}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl transition-all shadow flex items-center gap-1.5"
          >
            <Pause className="w-4 h-4" />
            <span>Pause</span>
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Demo Scenario Control Hub */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">Single-Click Demo Scenarios</h3>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
            Active: {currentScenario}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => triggerScenario(sc.id)}
              className={`p-3.5 rounded-xl border text-left transition-all shadow-sm ${sc.style} ${
                currentScenario === sc.id ? 'ring-2 ring-emerald-600 scale-[1.02]' : ''
              }`}
            >
              <div className="font-extrabold text-xs uppercase tracking-wider">{sc.label}</div>
              <div className="text-[11px] opacity-80 mt-1 font-medium leading-tight">{sc.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* IoT Devices Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Provisioned IoT Sensor Fleet</h3>
          <span className="text-xs text-slate-500 font-medium">5 Devices Connected</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <th className="py-3.5 px-4">Device ID</th>
                <th className="py-3.5 px-4">Assigned Shipment</th>
                <th className="py-3.5 px-4">Connectivity</th>
                <th className="py-3.5 px-4">Live Values</th>
                <th className="py-3.5 px-4">Battery & Energy</th>
                <th className="py-3.5 px-4">Signal</th>
                <th className="py-3.5 px-4">Tamper Status</th>
                <th className="py-3.5 px-4 text-right">Firmware</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {devices.map((d) => (
                <tr key={d.deviceId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-black text-emerald-800 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    {d.deviceId}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{d.shipmentId}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={d.connectivity} />
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-slate-900">{d.temperature}°C • {d.humidity}% Hum</div>
                    <div className="text-[10px] text-slate-400">{d.ethylene} ppm Ethylene</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{d.battery}% ({d.energySource})</div>
                    <div className="text-[10px] text-emerald-700 font-medium">{d.batteryHealth}% Health</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{d.signalStrength} dBm</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={d.tamperStatus} />
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-400 text-[11px]">
                    {d.firmwareVersion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
