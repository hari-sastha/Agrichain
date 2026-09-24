# AgriChain — Trusted Digital Passport for Agricultural Cold-Chain Traceability

> **"Trust Every Journey. Transparent agricultural traceability from farm to destination."**

AgriChain is a production-style enterprise web application prototype providing transparent agricultural export traceability. The platform connects simulated IoT sensor devices, MQTT-style telemetry, secure offline-first data processing, SHA-256 cryptographic verification, Hyperledger Fabric blockchain records, shipment tracking, automated alerts, chain-of-custody management, and QR-based digital product passports.

---

## 🌟 Key Features

### 1. IoT Simulation Engine & Physics Drift
- Simulates 5 IoT sensor devices (`AG-SENSOR-001` to `AG-SENSOR-005`) emitting temperature (5–12°C), humidity (55–85%), ethylene gas (0.5–4 ppm), battery %, signal dBm, energy harvesting mode (`SOLAR`, `THERMAL`, `BATTERY`, `HYBRID`), and GPS coordinate progression.
- Realistic gradual drift physics (no random jumps).
- Single-click presentation scenarios: `NORMAL`, `TEMPERATURE_SPIKE`, `HIGH_HUMIDITY`, `ETHYLENE_SPIKE`, `NETWORK_OUTAGE`, `DEVICE_TAMPER`, `BATTERY_LOW`, `FULL_RECOVERY`.

### 2. Offline-First Resilience & 7-Step Auto Sync Engine
- Toggling **NETWORK OUTAGE** logs sensor readings locally in IndexedDB/LocalStorage with an offline banner showing queued record counts.
- Restoring connection automatically triggers the **7-Step Sync Sequence**:
  1. Read pending local data
  2. Validate records
  3. Generate cryptographic SHA-256 hash
  4. Synchronize
  5. Record blockchain transaction
  6. Mark records as verified
  7. Update UI with sync progress animation

### 3. SHA-256 Cryptographic Integrity & Tampering Demo
- Deterministic canonical JSON serialization and SHA-256 hashing.
- Interactive **"Simulate Data Tampering"** demo control: alters stored sensor values (7.4°C → 17.4°C) without changing the blockchain hash.
- Triggers instant `DATA INTEGRITY FAILED ✕` alert with side-by-side hash comparison, allowing one-click data restoration.

### 4. Hyperledger Fabric Blockchain Abstraction Layer
- `IBlockchainProvider` architecture with active `MockBlockchainProvider` and ready-to-deploy `HyperledgerFabricProvider`.
- Blockchain Explorer view (`/blockchain`) displaying total transactions, block height (`#1042...`), Merkle roots, endorsing peers, and transaction modal details.

### 5. Role-Based Access Control (RBAC) & One-Click Demo Auth
- Seeded demo credentials for all 6 enterprise roles:
  - **ADMIN**: `admin@agrichain.demo` / `Admin@123`
  - **FARMER**: `farmer@agrichain.demo` / `Farmer@123`
  - **EXPORTER**: `exporter@agrichain.demo` / `Exporter@123`
  - **LOGISTICS**: `logistics@agrichain.demo` / `Logistics@123`
  - **IMPORTER**: `importer@agrichain.demo` / `Importer@123`
  - **AUDITOR**: `auditor@agrichain.demo` / `Auditor@123`
- Topbar role switcher for instant context switching during presentations.

### 6. Digital Product Passport & QR Verification
- Publicly accessible passport route (`/passport/:shipmentId`) detailing harvest origin, cold-chain compliance summary, and cryptographic verification seal.
- `/verify` hub featuring camera QR scanner (`html5-qrcode`) and manual shipment ID input fallback.

### 7. Interactive Guided Demo Story Runner
- Global floating **Presentation Demo Toolbar** executing the 50-second presentation story sequence automatically.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, React Router v6, Tailwind CSS, Lucide Icons, Recharts, Leaflet / OpenStreetMap (`react-leaflet`), `qrcode.react`, `html5-qrcode`, `js-sha256`.
- **Backend**: Node.js, Express.js, CORS, WebSockets (`ws`).
- **Blockchain**: Hyperledger Fabric Abstraction Layer & SHA-256 Mock Adapter.

---

## 🚀 Quick Start & Installation

```bash
# 1. Install dependencies
npm install

# 2. Start frontend dev server
npm run dev

# 3. (Optional) Run backend REST server concurrently
npm run dev:full
```

Open `http://localhost:3000` in your browser.

---

## 📜 Documentation

- See [ARCHITECTURE.md](file:///c:/Users/Harisastha/projects/SIH2/ARCHITECTURE.md) for detailed system architecture, MQTT interface specs, and Hyperledger Fabric integration blueprints.
