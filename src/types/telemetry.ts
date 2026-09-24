export type EnergySource = 'SOLAR' | 'THERMAL' | 'BATTERY' | 'HYBRID';

export type ConnectivityStatus = 'ONLINE' | 'OFFLINE';

export type TamperStatus = 'OK' | 'TAMPERED';

export type SimulationScenario = 
  | 'NORMAL'
  | 'TEMPERATURE_SPIKE'
  | 'HIGH_HUMIDITY'
  | 'ETHYLENE_SPIKE'
  | 'NETWORK_OUTAGE'
  | 'DEVICE_TAMPER'
  | 'BATTERY_LOW'
  | 'FULL_RECOVERY';

export interface TelemetryReading {
  id: string;
  deviceId: string;
  shipmentId: string;
  timestamp: string;
  temperature: number; // °C
  humidity: number; // %
  ethylene: number; // ppm
  latitude: number;
  longitude: number;
  battery: number; // %
  signalStrength: number; // dBm (-50 to -110)
  connectivity: ConnectivityStatus;
  tamperStatus: TamperStatus;
  encrypted: boolean;
  synced: boolean;
  blockchainVerified: boolean;
  hash: string;
}

export interface IoTDevice {
  deviceId: string; // e.g. AG-SENSOR-001
  shipmentId: string;
  status: 'ACTIVE' | 'OFFLINE' | 'WARNING' | 'CRITICAL' | 'UNASSIGNED';
  battery: number;
  signalStrength: number;
  temperature: number;
  humidity: number;
  ethylene: number;
  latitude: number;
  longitude: number;
  connectivity: ConnectivityStatus;
  tamperStatus: TamperStatus;
  energySource: EnergySource;
  batteryHealth: number; // %
  lastSeen: string;
  firmwareVersion: string;
}
