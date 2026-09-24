import React, { createContext, useContext, useState, useEffect } from 'react';
import { IoTDevice, TelemetryReading, SimulationScenario } from '../types/telemetry';
import { iotSimulator } from '../services/ioTSimulator';

interface SyncProgressState {
  isSyncing: boolean;
  progress: number;
  total: number;
  message: string;
}

interface SimulationContextType {
  devices: IoTDevice[];
  latestReadings: Map<string, TelemetryReading>;
  historyReadings: TelemetryReading[];
  offlineQueueCount: number;
  currentScenario: SimulationScenario;
  syncProgress: SyncProgressState;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  triggerScenario: (scenario: SimulationScenario) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<IoTDevice[]>(iotSimulator.getDevices());
  const [latestReadings, setLatestReadings] = useState<Map<string, TelemetryReading>>(new Map());
  const [historyReadings, setHistoryReadings] = useState<TelemetryReading[]>([]);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [currentScenario, setCurrentScenario] = useState<SimulationScenario>(iotSimulator.getCurrentScenario());
  const [syncProgress, setSyncProgress] = useState<SyncProgressState>({
    isSyncing: false,
    progress: 0,
    total: 0,
    message: '',
  });

  useEffect(() => {
    const unsubscribeTelemetry = iotSimulator.subscribe((reading, updatedDevices) => {
      setDevices(updatedDevices);
      setCurrentScenario(iotSimulator.getCurrentScenario());
      setOfflineQueueCount(iotSimulator.getOfflineQueueCount());

      setLatestReadings((prev) => {
        const next = new Map(prev);
        next.set(reading.deviceId, reading);
        return next;
      });

      setHistoryReadings((prev) => [reading, ...prev.slice(0, 199)]); // Keep last 200 readings
    });

    const unsubscribeSync = iotSimulator.subscribeSync((isSyncing, progress, total, message) => {
      setSyncProgress({ isSyncing, progress, total, message });
      setOfflineQueueCount(iotSimulator.getOfflineQueueCount());
    });

    return () => {
      unsubscribeTelemetry();
      unsubscribeSync();
    };
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        devices,
        latestReadings,
        historyReadings,
        offlineQueueCount,
        currentScenario,
        syncProgress,
        startSimulation: () => iotSimulator.startSimulation(),
        pauseSimulation: () => iotSimulator.pauseSimulation(),
        resetSimulation: () => iotSimulator.resetSimulation(),
        triggerScenario: (s) => iotSimulator.triggerScenario(s),
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
