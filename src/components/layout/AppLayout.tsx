import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useSimulation } from '../../contexts/SimulationContext';
import { WifiOff, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentScenario, offlineQueueCount, syncProgress, triggerScenario } = useSimulation();
  const [globalSearch, setGlobalSearch] = useState('');

  const isOffline = currentScenario === 'NETWORK_OUTAGE';

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={() => {}} onSearchQueryChange={(q) => setGlobalSearch(q)} />

        {/* Network Offline Alert Banner */}
        {isOffline && (
          <div className="bg-amber-500 text-white px-4 py-2.5 flex items-center justify-between shadow-md border-b border-amber-600 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <WifiOff className="w-5 h-5 animate-pulse text-amber-100" />
              <div>
                <strong className="uppercase tracking-wider">NETWORK OFFLINE:</strong> Device connection interrupted. Sensor data is being securely stored locally.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-amber-900/40 text-amber-100 px-3 py-1 rounded-lg border border-amber-400/40 font-mono font-bold">
                Pending records: {offlineQueueCount || 24}
              </span>
              <button
                onClick={() => triggerScenario('FULL_RECOVERY')}
                className="px-3 py-1 bg-white text-amber-950 hover:bg-amber-100 text-xs font-bold rounded-lg transition-colors shadow"
              >
                Simulate Connection Restoration →
              </button>
            </div>
          </div>
        )}

        {/* Sync Progress Banner Modal overlay */}
        {syncProgress.isSyncing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-md w-full text-center animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-4 animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Automated Data Synchronization</h3>
              <p className="mt-1 text-xs text-slate-500">{syncProgress.message}</p>

              <div className="mt-5 w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-emerald-800 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(5, (syncProgress.progress / (syncProgress.total || 1)) * 100))}%`,
                  }}
                ></div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                <span>Batch Hashing & Verification</span>
                <span>
                  {syncProgress.progress} / {syncProgress.total} records
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
