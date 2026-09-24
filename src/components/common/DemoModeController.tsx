import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, WifiOff, ShieldAlert, Sparkles, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useSimulation } from '../../contexts/SimulationContext';
import { useBlockchain } from '../../contexts/BlockchainContext';

export const DemoModeController: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAutoStoryRunning, setIsAutoStoryRunning] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const { triggerScenario, resetSimulation } = useSimulation();
  const { simulateDataTamper, restoreDataIntegrity } = useBlockchain();

  const storySteps = [
    { time: '0s', label: 'Device Online & Initializing', action: () => triggerScenario('NORMAL') },
    { time: '5s', label: 'Normal Transport Monitoring', action: () => triggerScenario('NORMAL') },
    { time: '10s', label: 'Temperature Spike Detected', action: () => triggerScenario('TEMPERATURE_SPIKE') },
    { time: '15s', label: 'Warning & Alert Triggered', action: () => {} },
    { time: '20s', label: 'Network Dropout (Offline Mode)', action: () => triggerScenario('NETWORK_OUTAGE') },
    { time: '25s', label: 'Local Offline Data Accumulates', action: () => {} },
    { time: '35s', label: 'Network Restored & Auto-Sync', action: () => triggerScenario('FULL_RECOVERY') },
    { time: '40s', label: 'SHA-256 Hashing & Fabric Tx', action: () => {} },
    { time: '45s', label: 'Blockchain Verification Passed', action: () => restoreDataIntegrity('MANGO-001') },
    { time: '50s', label: 'Data Tampering Attack Demo', action: () => simulateDataTamper('MANGO-001') },
    { time: '55s', label: 'Integrity Restored & Journey Complete', action: () => restoreDataIntegrity('MANGO-001') },
  ];

  useEffect(() => {
    let timer: any = null;
    if (isAutoStoryRunning && storyStep < storySteps.length) {
      storySteps[storyStep].action();
      timer = setTimeout(() => {
        if (storyStep + 1 < storySteps.length) {
          setStoryStep((prev) => prev + 1);
        } else {
          setIsAutoStoryRunning(false);
        }
      }, 4500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAutoStoryRunning, storyStep]);

  const startAutoStory = () => {
    setStoryStep(0);
    setIsAutoStoryRunning(true);
  };

  const stopAutoStory = () => {
    setIsAutoStoryRunning(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white font-extrabold text-xs rounded-2xl shadow-2xl border border-emerald-500/30 hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>Interactive Demo Presentation Toolbar</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      ) : (
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-700 max-w-sm w-full animate-in zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-300">
                Live Demo Control Panel
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Scenario Buttons */}
          <div className="mt-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Single-Click Scenario Triggers
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => triggerScenario('NORMAL')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold text-left border border-slate-700"
              >
                ✓ Normal Journey
              </button>
              <button
                onClick={() => triggerScenario('TEMPERATURE_SPIKE')}
                className="px-3 py-2 bg-amber-950/60 hover:bg-amber-900 text-amber-200 rounded-xl text-xs font-semibold text-left border border-amber-800/50"
              >
                ⚠ Temp Spike (14°C)
              </button>
              <button
                onClick={() => triggerScenario('NETWORK_OUTAGE')}
                className="px-3 py-2 bg-amber-950/80 hover:bg-amber-900 text-amber-300 rounded-xl text-xs font-semibold text-left border border-amber-700"
              >
                📡 Network Dropout
              </button>
              <button
                onClick={() => triggerScenario('FULL_RECOVERY')}
                className="px-3 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-semibold text-left border border-emerald-700"
              >
                🔄 Auto-Sync Data
              </button>
              <button
                onClick={() => simulateDataTamper('MANGO-001')}
                className="px-3 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-semibold text-left border border-rose-800"
              >
                🚨 Tamper Attack
              </button>
              <button
                onClick={() => restoreDataIntegrity('MANGO-001')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs font-semibold text-left border border-slate-700"
              >
                🛡️ Restore Integrity
              </button>
            </div>
          </div>

          {/* Automated Story Timeline Runner */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Automated Demo Story Script
              </span>
              {!isAutoStoryRunning ? (
                <button
                  onClick={startAutoStory}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow"
                >
                  <Play className="w-3.5 h-3.5" /> Start Story
                </button>
              ) : (
                <button
                  onClick={stopAutoStory}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all shadow"
                >
                  <Pause className="w-3.5 h-3.5" /> Pause
                </button>
              )}
            </div>

            {isAutoStoryRunning && (
              <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/40 mt-2 text-xs">
                <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                  <span>Step {storyStep + 1}/{storySteps.length}: {storySteps[storyStep].time}</span>
                  <span className="animate-pulse">● Live Running</span>
                </div>
                <div className="text-slate-200 font-medium">{storySteps[storyStep].label}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
