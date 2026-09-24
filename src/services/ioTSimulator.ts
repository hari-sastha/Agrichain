import { IoTDevice, TelemetryReading, SimulationScenario } from '../types/telemetry';
import { INITIAL_DEVICES } from '../data/mockSeedData';
import { generateSHA256 } from '../utils/crypto';

export type TelemetryListener = (reading: TelemetryReading, devices: IoTDevice[]) => void;
export type SyncStatusListener = (isSyncing: boolean, progress: number, total: number, message: string) => void;

export class IoTSimulationEngine {
  private devices: IoTDevice[] = [...INITIAL_DEVICES];
  private isRunning = true;
  private intervalId: any = null;
  private listeners: Set<TelemetryListener> = new Set();
  private syncListeners: Set<SyncStatusListener> = new Set();
  private offlineQueue: TelemetryReading[] = [];
  private currentScenario: SimulationScenario = 'NORMAL';
  private scenarioStepsCount = 0;

  constructor() {
    this.startSimulation();
  }

  public subscribe(listener: TelemetryListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public subscribeSync(listener: SyncStatusListener): () => void {
    this.syncListeners.add(listener);
    return () => this.syncListeners.delete(listener);
  }

  public getDevices(): IoTDevice[] {
    return [...this.devices];
  }

  public getOfflineQueueCount(): number {
    return this.offlineQueue.length;
  }

  public getOfflineQueue(): TelemetryReading[] {
    return [...this.offlineQueue];
  }

  public getCurrentScenario(): SimulationScenario {
    return this.currentScenario;
  }

  public startSimulation() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.isRunning = true;
    this.intervalId = setInterval(() => this.tick(), 3500);
  }

  public pauseSimulation() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public resetSimulation() {
    this.devices = JSON.parse(JSON.stringify(INITIAL_DEVICES));
    this.offlineQueue = [];
    this.currentScenario = 'NORMAL';
    this.notifyListeners();
  }

  public triggerScenario(scenario: SimulationScenario) {
    this.currentScenario = scenario;
    this.scenarioStepsCount = 0;

    if (scenario === 'NETWORK_OUTAGE') {
      this.devices.forEach((d) => (d.connectivity = 'OFFLINE'));
    } else if (scenario === 'FULL_RECOVERY') {
      this.executeFullSyncSequence();
    } else if (scenario === 'DEVICE_TAMPER') {
      this.devices[0].tamperStatus = 'TAMPERED';
      this.devices[0].status = 'CRITICAL';
    } else if (scenario === 'BATTERY_LOW') {
      this.devices[2].battery = 8;
      this.devices[2].status = 'CRITICAL';
    } else if (scenario === 'NORMAL') {
      this.devices.forEach((d) => {
        d.connectivity = 'ONLINE';
        d.tamperStatus = 'OK';
        d.status = 'ACTIVE';
        d.temperature = 6.5;
        d.humidity = 65;
        d.ethylene = 1.2;
      });
    }

    this.tick();
  }

  private async executeFullSyncSequence() {
    // 1. Connectivity restored
    this.devices.forEach((d) => {
      d.connectivity = 'ONLINE';
      if (d.status === 'OFFLINE') d.status = 'ACTIVE';
    });

    const pendingCount = this.offlineQueue.length || 24; // Ensure min 24 for presentation demo if queue small
    this.notifySync(true, 0, pendingCount, 'Connection restored. Reading pending local data...');

    await new Promise((r) => setTimeout(r, 600));
    this.notifySync(true, Math.floor(pendingCount * 0.3), pendingCount, 'Validating local records & computing SHA-256 hashes...');

    await new Promise((r) => setTimeout(r, 800));
    this.notifySync(true, Math.floor(pendingCount * 0.7), pendingCount, 'Synchronizing batch to Hyperledger Fabric Blockchain...');

    await new Promise((r) => setTimeout(r, 900));
    // Clear queue
    this.offlineQueue = [];
    this.currentScenario = 'NORMAL';
    this.notifySync(false, pendingCount, pendingCount, `Synchronization complete ✓ (${pendingCount}/${pendingCount} records verified)`);
    this.notifyListeners();
  }

  private tick() {
    if (!this.isRunning) return;

    this.scenarioStepsCount += 1;

    this.devices.forEach((device) => {
      // 1. Realistic controlled drift (not random jumps)
      const tempDrift = (Math.random() - 0.48) * 0.2;
      const humDrift = (Math.random() - 0.5) * 0.8;
      const ethDrift = (Math.random() - 0.48) * 0.05;

      // Apply scenario effects
      if (this.currentScenario === 'TEMPERATURE_SPIKE' && device.deviceId === 'AG-SENSOR-001') {
        // Temperature gradually spikes: 7.2 -> 7.8 -> 9.2 -> 11.4 -> 14.2 °C
        device.temperature = Math.min(18.0, device.temperature + 1.2);
        if (device.temperature > 10.0) device.status = 'CRITICAL';
        else if (device.temperature > 8.0) device.status = 'WARNING';
      } else if (this.currentScenario === 'HIGH_HUMIDITY' && device.deviceId === 'AG-SENSOR-002') {
        device.humidity = Math.min(95, device.humidity + 3.5);
        if (device.humidity > 80) device.status = 'WARNING';
      } else if (this.currentScenario === 'ETHYLENE_SPIKE' && device.deviceId === 'AG-SENSOR-002') {
        device.ethylene = Math.min(6.0, device.ethylene + 0.6);
        if (device.ethylene > 3.0) device.status = 'WARNING';
      } else {
        // Normal gradual drift
        device.temperature = Number(Math.max(1.0, Math.min(15.0, device.temperature + tempDrift)).toFixed(1));
        device.humidity = Number(Math.max(40, Math.min(95, device.humidity + humDrift)).toFixed(0));
        device.ethylene = Number(Math.max(0.1, Math.min(5.0, device.ethylene + ethDrift)).toFixed(1));
      }

      // Battery slow drain
      device.battery = Math.max(0, device.battery - 0.02);

      // Device timestamp
      device.lastSeen = new Date().toISOString();

      // Create telemetry reading object
      const reading: TelemetryReading = {
        id: `tel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        deviceId: device.deviceId,
        shipmentId: device.shipmentId,
        timestamp: device.lastSeen,
        temperature: device.temperature,
        humidity: device.humidity,
        ethylene: device.ethylene,
        latitude: device.latitude,
        longitude: device.longitude,
        battery: Math.round(device.battery),
        signalStrength: device.signalStrength,
        connectivity: device.connectivity,
        tamperStatus: device.tamperStatus,
        encrypted: true,
        synced: device.connectivity === 'ONLINE',
        blockchainVerified: device.connectivity === 'ONLINE',
        hash: '',
      };

      // Compute canonical SHA-256 hash
      reading.hash = generateSHA256(reading);

      if (device.connectivity === 'OFFLINE') {
        this.offlineQueue.push(reading);
      }

      // Broadcast to listeners
      this.listeners.forEach((listener) => listener(reading, this.devices));
    });
  }

  private notifyListeners() {
    if (this.devices.length === 0) return;
    const dummyReading: TelemetryReading = {
      id: `tel-${Date.now()}`,
      deviceId: this.devices[0].deviceId,
      shipmentId: this.devices[0].shipmentId,
      timestamp: new Date().toISOString(),
      temperature: this.devices[0].temperature,
      humidity: this.devices[0].humidity,
      ethylene: this.devices[0].ethylene,
      latitude: this.devices[0].latitude,
      longitude: this.devices[0].longitude,
      battery: Math.round(this.devices[0].battery),
      signalStrength: this.devices[0].signalStrength,
      connectivity: this.devices[0].connectivity,
      tamperStatus: this.devices[0].tamperStatus,
      encrypted: true,
      synced: this.devices[0].connectivity === 'ONLINE',
      blockchainVerified: this.devices[0].connectivity === 'ONLINE',
      hash: '',
    };
    dummyReading.hash = generateSHA256(dummyReading);
    this.listeners.forEach((l) => l(dummyReading, this.devices));
  }

  private notifySync(isSyncing: boolean, progress: number, total: number, message: string) {
    this.syncListeners.forEach((l) => l(isSyncing, progress, total, message));
  }
}

export const iotSimulator = new IoTSimulationEngine();
