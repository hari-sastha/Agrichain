export type AlertType = 
  | 'TEMPERATURE_BREACH'
  | 'HUMIDITY_EXCURSION'
  | 'ETHYLENE_SPIKE'
  | 'NETWORK_OUTAGE'
  | 'TAMPER_ALERT'
  | 'BATTERY_CRITICAL'
  | 'ROUTE_DEVIATION';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  shipmentId: string;
  deviceId: string;
  title: string;
  message: string;
  value: string;
  expectedRange: string;
  timestamp: string;
  status: AlertStatus;
  acknowledgedBy?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface ThresholdConfig {
  tempMin: number; // e.g. 2°C
  tempMax: number; // e.g. 8°C
  tempWarningMax: number; // e.g. 10°C
  humidityMax: number; // e.g. 80%
  ethyleneMax: number; // e.g. 3.0 ppm
  batteryWarningMin: number; // e.g. 20%
  batteryCriticalMin: number; // e.g. 10%
}
