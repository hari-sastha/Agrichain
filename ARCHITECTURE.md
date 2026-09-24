# AgriChain — Technical System Architecture & Integration Guide

## 1. System High-Level Architecture Diagram

```
[ Physical / Simulated ESP32 IoT Sensors ]
            │
            ▼ (MQTT Telemetry Stream / JSON)
[ Telemetry Interface (IMQTTTelemetryService) ]
            │
    ┌───────┴───────────────────────┐
    │                               │
(ONLINE Mode)                (OFFLINE Mode)
    │                               │
    ▼                               ▼
[ Express API / Backend ]     [ Client IndexedDB Queue ]
    │                               │ (Network Restoration)
    ├───────────────────────────────┼───────────────────┐
    ▼                               ▼                   ▼
[ Canonical JSON ]          [ SHA-256 Hasher ]  [ WebSockets / SSE ]
    │                               │                   │
    ▼                               ▼                   ▼
[ Hyperledger Fabric Gateway ]  [ Block Ledger ]    [ React Dashboard ]
```

---

## 2. IoT & MQTT Telemetry Layer
The IoT layer defines a clean abstraction (`IMQTTTelemetryService`) decouplable from the simulated engine.
Future physical ESP32 devices connect directly via MQTT over TLS (`mqtts://broker.agrichain.com:8883`) publishing to topic: `agrichain/telemetry/{deviceId}`.

### Device Model:
```typescript
interface IoTDevice {
  deviceId: string;
  shipmentId: string;
  temperature: number;
  humidity: number;
  ethylene: number;
  latitude: number;
  longitude: number;
  battery: number;
  connectivity: 'ONLINE' | 'OFFLINE';
  tamperStatus: 'OK' | 'TAMPERED';
  energySource: 'SOLAR' | 'THERMAL' | 'BATTERY' | 'HYBRID';
}
```

---

## 3. Offline Synchronization Protocol

When a network outage occurs:
1. `connectivity` toggles to `OFFLINE`.
2. Telemetry readings are stored in local client state (`offlineQueue`).
3. Upon reconnection (`FULL_RECOVERY` event):
   - **Step 1**: Read pending local records.
   - **Step 2**: Validate record structure.
   - **Step 3**: Compute SHA-256 hash over canonical JSON payload.
   - **Step 4**: Post batch to Express API `/api/telemetry`.
   - **Step 5**: Broadcast transaction payload to Hyperledger Fabric Orderer node.
   - **Step 6**: Mark local records as `synced: true` and `blockchainVerified: true`.
   - **Step 7**: Trigger UI sync completion notification.

---

## 4. Hyperledger Fabric Blockchain Smart Contract Model

Chaincode methods exposed on `agrichain-cc`:
- `CreateShipment(ctx, shipmentId, product, origin, destination)`
- `RegisterDevice(ctx, deviceId, shipmentId)`
- `RecordSensorBatch(ctx, shipmentId, deviceId, payloadHash)`
- `TransferCustody(ctx, shipmentId, newOwner, stage)`
- `RecordAlert(ctx, shipmentId, alertType, severity)`
- `VerifyIntegrity(ctx, shipmentId, currentDataHash)`

---

## 5. Data Tamper Verification Algorithm

```typescript
export function verifyDataIntegrity(data: any, expectedHash: string): boolean {
  const canonicalStr = canonicalizeJson(data);
  const computedHash = sha256(canonicalStr);
  return computedHash.toLowerCase() === expectedHash.toLowerCase();
}
```
If an adversary tampers with stored sensor readings (e.g. changing 7.4°C to 17.4°C), the computed canonical SHA-256 hash diverges from the blockchain-anchored hash, instantly flagging `DATA INTEGRITY FAILED ✕`.
