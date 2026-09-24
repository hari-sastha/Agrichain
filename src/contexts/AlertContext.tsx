import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, AlertStatus, ThresholdConfig } from '../types/alert';
import { INITIAL_ALERTS } from '../data/mockSeedData';
import { useSimulation } from './SimulationContext';

interface AlertContextType {
  alerts: Alert[];
  unreadCount: number;
  activeCount: number;
  thresholds: ThresholdConfig;
  acknowledgeAlert: (alertId: string, userName: string) => void;
  resolveAlert: (alertId: string, userName: string) => void;
  updateThresholds: (newThresholds: Partial<ThresholdConfig>) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [thresholds, setThresholds] = useState<ThresholdConfig>({
    tempMin: 2.0,
    tempMax: 8.0,
    tempWarningMax: 10.0,
    humidityMax: 80,
    ethyleneMax: 3.0,
    batteryWarningMin: 20,
    batteryCriticalMin: 10,
  });

  const { latestReadings } = useSimulation();

  // Evaluate rule-based alert engine on every new reading
  useEffect(() => {
    latestReadings.forEach((reading) => {
      // 1. Temperature Check (>10°C Critical, 8-10°C Warning)
      if (reading.temperature > thresholds.tempWarningMax) {
        addAlertIfNotExists({
          type: 'TEMPERATURE_BREACH',
          severity: 'CRITICAL',
          shipmentId: reading.shipmentId,
          deviceId: reading.deviceId,
          title: 'Critical Temperature Excursion',
          message: `Temperature reached ${reading.temperature}°C (Threshold > ${thresholds.tempWarningMax}°C).`,
          value: `${reading.temperature}°C`,
          expectedRange: `${thresholds.tempMin}°C – ${thresholds.tempMax}°C`,
        });
      } else if (reading.temperature > thresholds.tempMax) {
        addAlertIfNotExists({
          type: 'TEMPERATURE_BREACH',
          severity: 'WARNING',
          shipmentId: reading.shipmentId,
          deviceId: reading.deviceId,
          title: 'Temperature Warning Level',
          message: `Temperature reached ${reading.temperature}°C (Warning threshold ${thresholds.tempMax}°C).`,
          value: `${reading.temperature}°C`,
          expectedRange: `${thresholds.tempMin}°C – ${thresholds.tempMax}°C`,
        });
      }

      // 2. Humidity Check (>80%)
      if (reading.humidity > thresholds.humidityMax) {
        addAlertIfNotExists({
          type: 'HUMIDITY_EXCURSION',
          severity: 'WARNING',
          shipmentId: reading.shipmentId,
          deviceId: reading.deviceId,
          title: 'High Humidity Alert',
          message: `Humidity reached ${reading.humidity}% (Max threshold ${thresholds.humidityMax}%).`,
          value: `${reading.humidity}%`,
          expectedRange: `< ${thresholds.humidityMax}%`,
        });
      }

      // 3. Ethylene Check (>3.0 ppm)
      if (reading.ethylene > thresholds.ethyleneMax) {
        addAlertIfNotExists({
          type: 'ETHYLENE_SPIKE',
          severity: 'WARNING',
          shipmentId: reading.shipmentId,
          deviceId: reading.deviceId,
          title: 'Ethylene Gas Spike',
          message: `Ethylene gas level reached ${reading.ethylene} ppm (Max threshold ${thresholds.ethyleneMax} ppm). Accelerated ripening risk.`,
          value: `${reading.ethylene} ppm`,
          expectedRange: `< ${thresholds.ethyleneMax} ppm`,
        });
      }

      // 4. Battery Level Check (<10% Critical, <20% Warning)
      if (reading.battery < thresholds.batteryCriticalMin) {
        addAlertIfNotExists({
          type: 'BATTERY_CRITICAL',
          severity: 'CRITICAL',
          shipmentId: reading.shipmentId,
          deviceId: reading.deviceId,
          title: 'Device Battery Critical',
          message: `Device battery at ${reading.battery}%. Risk of telemetry loss.`,
          value: `${reading.battery}%`,
          expectedRange: `> ${thresholds.batteryWarningMin}%`,
        });
      }

      // 5. Tamper Detection
      if (reading.tamperStatus === 'TAMPERED') {
        addAlertIfNotExists({
          type: 'TAMPER_ALERT',
          severity: 'CRITICAL',
          shipmentId: reading.shipmentId,
          deviceId: reading.deviceId,
          title: 'Physical Device Tamper Detected',
          message: `Device ${reading.deviceId} tamper switch tripped! Container enclosure seal compromised.`,
          value: 'TAMPERED',
          expectedRange: 'OK',
        });
      }
    });
  }, [latestReadings, thresholds]);

  const addAlertIfNotExists = (alertData: Omit<Alert, 'id' | 'timestamp' | 'status'>) => {
    setAlerts((prev) => {
      // Prevent duplicate active alerts for same device + type within last 2 minutes
      const existing = prev.find(
        (a) =>
          a.deviceId === alertData.deviceId &&
          a.type === alertData.type &&
          a.status === 'ACTIVE'
      );
      if (existing) return prev;

      const newAlert: Alert = {
        ...alertData,
        id: `alt-${Date.now()}-${Math.floor(Math.random() * 100)}`,
        timestamp: new Date().toISOString(),
        status: 'ACTIVE',
      };
      return [newAlert, ...prev];
    });
  };

  const acknowledgeAlert = (alertId: string, userName: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' as AlertStatus, acknowledgedBy: userName } : a
      )
    );
  };

  const resolveAlert = (alertId: string, userName: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'RESOLVED' as AlertStatus,
              resolvedBy: userName,
              resolvedAt: new Date().toISOString(),
            }
          : a
      )
    );
  };

  const updateThresholds = (newThresholds: Partial<ThresholdConfig>) => {
    setThresholds((prev) => ({ ...prev, ...newThresholds }));
  };

  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;
  const unreadCount = alerts.filter((a) => a.status !== 'RESOLVED').length;

  return (
    <AlertContext.Provider
      value={{
        alerts,
        unreadCount,
        activeCount,
        thresholds,
        acknowledgeAlert,
        resolveAlert,
        updateThresholds,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
