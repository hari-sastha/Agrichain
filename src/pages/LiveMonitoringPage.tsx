import React, { useState } from 'react';
import { useSimulation } from '../contexts/SimulationContext';
import { INITIAL_SHIPMENTS } from '../data/mockSeedData';
import { SensorChart } from '../components/analytics/SensorChart';
import { StatusBadge } from '../components/common/StatusBadge';
import { Activity, Thermometer, Droplets, Wind, Battery, Wifi } from 'lucide-react';

export const LiveMonitoringPage: React.FC = () => {
  const { devices, historyReadings } = useSimulation();
  const [selectedShipmentId, setSelectedShipmentId] = useState('MANGO-001');

  const selectedShipment = INITIAL_SHIPMENTS.find((s) => s.shipmentId === selectedShipmentId) || INITIAL_SHIPMENTS[0];
  const assignedDevice = devices.find((d) => d.deviceId === selectedShipment.sensorDeviceId) || devices[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Live Shipment Monitoring</h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time environmental sensor telemetry streaming without browser refresh.
          </p>
        </div>

        {/* Shipment Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700">Select Shipment:</label>
          <select
            value={selectedShipmentId}
            onChange={(e) => setSelectedShipmentId(e.target.value)}
            className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
          >
            {INITIAL_SHIPMENTS.map((s) => (
              <option key={s.id} value={s.shipmentId}>
                {s.shipmentId} - {s.product}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Reading Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Temperature</div>
            <div className="text-3xl font-extrabold text-slate-900">{assignedDevice.temperature}°C</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-1">Normal (2-8°C)</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
            <Thermometer className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Humidity</div>
            <div className="text-3xl font-extrabold text-slate-900">{assignedDevice.humidity}%</div>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">Normal (55-85%)</div>
          </div>
          <div className="p-3 bg-sky-50 rounded-2xl text-sky-700">
            <Droplets className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Ethylene Gas</div>
            <div className="text-3xl font-extrabold text-slate-900">{assignedDevice.ethylene} ppm</div>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">Safe (&lt;3.0 ppm)</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-700">
            <Wind className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Device Battery</div>
            <div className="text-3xl font-extrabold text-slate-900">{assignedDevice.battery}%</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-1">
              {assignedDevice.connectivity === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}
            </div>
          </div>
          <div className="p-3 bg-slate-100 rounded-2xl text-slate-700">
            <Battery className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Real-Time Line Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <SensorChart
          data={historyReadings}
          metric="temperature"
          title="Temperature Stream (°C)"
          unit="°C"
          color="#0F5132"
        />
        <SensorChart
          data={historyReadings}
          metric="humidity"
          title="Humidity Stream (%)"
          unit="%"
          color="#0284C7"
        />
        <SensorChart
          data={historyReadings}
          metric="ethylene"
          title="Ethylene Gas Stream (ppm)"
          unit="ppm"
          color="#D97706"
        />
        <SensorChart
          data={historyReadings}
          metric="battery"
          title="Battery Drain Level (%)"
          unit="%"
          color="#475569"
        />
      </div>
    </div>
  );
};
