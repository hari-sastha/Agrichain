import React, { useState } from 'react';
import { useAlerts } from '../contexts/AlertContext';
import { Settings as SettingsIcon, Sliders, Shield, Bell, Cpu, Link as ChainIcon } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { thresholds, updateThresholds } = useAlerts();

  const [tempMin, setTempMin] = useState(thresholds.tempMin);
  const [tempMax, setTempMax] = useState(thresholds.tempMax);
  const [tempWarningMax, setTempWarningMax] = useState(thresholds.tempWarningMax);
  const [humidityMax, setHumidityMax] = useState(thresholds.humidityMax);
  const [ethyleneMax, setEthyleneMax] = useState(thresholds.ethyleneMax);
  const [saved, setSaved] = useState(false);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholds({
      tempMin: Number(tempMin),
      tempMax: Number(tempMax),
      tempWarningMax: Number(tempWarningMax),
      humidityMax: Number(humidityMax),
      ethyleneMax: Number(ethyleneMax),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">System & Threshold Settings</h1>
        <p className="text-xs text-slate-500 font-medium">
          Configure rule engine environmental parameters, Fabric network credentials, and simulation parameters.
        </p>
      </div>

      {/* Threshold Configuration Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sliders className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-slate-900 text-sm">Cold-Chain Rule Engine Threshold Configuration</h3>
        </div>

        <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Min Temperature Target (°C)</label>
              <input
                type="number"
                step="0.5"
                value={tempMin}
                onChange={(e) => setTempMin(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Max Safe Temperature (°C)</label>
              <input
                type="number"
                step="0.5"
                value={tempMax}
                onChange={(e) => setTempMax(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Critical Temp Breach Threshold (°C)</label>
              <input
                type="number"
                step="0.5"
                value={tempWarningMax}
                onChange={(e) => setTempWarningMax(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Max Relative Humidity Threshold (%)</label>
              <input
                type="number"
                value={humidityMax}
                onChange={(e) => setHumidityMax(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Max Ethylene Concentration Threshold (ppm)</label>
              <input
                type="number"
                step="0.1"
                value={ethyleneMax}
                onChange={(e) => setEthyleneMax(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl transition-all shadow-md"
            >
              Save Rule Engine Thresholds
            </button>
            {saved && <span className="text-xs font-bold text-emerald-800">✓ Thresholds successfully updated!</span>}
          </div>
        </form>
      </div>
    </div>
  );
};
