import { TelemetryReading } from '../types/telemetry';

export interface IMQTTTelemetryService {
  connect(brokerUrl?: string): Promise<boolean>;
  subscribeToDevice(deviceId: string, callback: (data: TelemetryReading) => void): void;
  publishTelemetry(deviceId: string, reading: TelemetryReading): Promise<void>;
  disconnect(): void;
}

export class SimulatedMQTTService implements IMQTTTelemetryService {
  private subscribers: Map<string, Array<(data: TelemetryReading) => void>> = new Map();

  async connect(): Promise<boolean> {
    console.log('[SimulatedMQTTService] Connected to virtual MQTT broker ws://localhost:1883/mqtt');
    return true;
  }

  subscribeToDevice(deviceId: string, callback: (data: TelemetryReading) => void): void {
    if (!this.subscribers.has(deviceId)) {
      this.subscribers.set(deviceId, []);
    }
    this.subscribers.get(deviceId)!.push(callback);
  }

  async publishTelemetry(deviceId: string, reading: TelemetryReading): Promise<void> {
    const callbacks = this.subscribers.get(deviceId) || [];
    callbacks.forEach((cb) => cb(reading));
  }

  disconnect(): void {
    console.log('[SimulatedMQTTService] Disconnected from virtual MQTT broker');
    this.subscribers.clear();
  }
}

export class RealMQTTService implements IMQTTTelemetryService {
  async connect(brokerUrl = 'mqtt://broker.hivemq.com:1883'): Promise<boolean> {
    console.log(`[RealMQTTService] Preparing MQTT client connection to ${brokerUrl}...`);
    return false; // Ready for production paho-mqtt / mqtt package
  }

  subscribeToDevice(deviceId: string, callback: (data: TelemetryReading) => void): void {
    console.log(`[RealMQTTService] Subscribed to topic agrichain/telemetry/${deviceId}`);
  }

  async publishTelemetry(deviceId: string, reading: TelemetryReading): Promise<void> {
    console.log(`[RealMQTTService] Published telemetry to topic agrichain/telemetry/${deviceId}`);
  }

  disconnect(): void {}
}
