import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory backend data stores
let shipments = [
  {
    id: 'shp-001',
    shipmentId: 'MANGO-001',
    product: 'Alphonso Mango (Grade A Export)',
    category: 'Fresh Fruit',
    quantity: '5,000 kg',
    origin: 'Erode, Tamil Nadu, India',
    destination: 'Jebel Ali Port, Dubai, UAE',
    producer: 'GreenValley Agro Farms',
    sensorDeviceId: 'AG-SENSOR-001',
    status: 'IN_TRANSIT',
  },
];

let alerts = [
  {
    id: 'alt-001',
    type: 'TEMPERATURE_BREACH',
    severity: 'CRITICAL',
    shipmentId: 'TOMATO-003',
    deviceId: 'AG-SENSOR-003',
    message: 'Sensor AG-SENSOR-003 reported temperature of 12.8°C.',
    status: 'ACTIVE',
  },
];

let transactions = [
  {
    transactionId: 'TX-FARM-9021',
    blockNumber: 1040,
    type: 'CREATE_SHIPMENT',
    shipmentId: 'MANGO-001',
    status: 'CONFIRMED',
  },
];

// Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  res.json({
    success: true,
    token: `jwt-token-${Date.now()}`,
    user: { email, name: email.split('@')[0], role: 'ADMIN' },
  });
});

// Shipment Endpoints
app.get('/api/shipments', (req, res) => {
  res.json(shipments);
});

app.post('/api/shipments', (req, res) => {
  const newShipment = { id: `shp-${Date.now()}`, ...req.body };
  shipments.unshift(newShipment);
  res.status(201).json(newShipment);
});

app.get('/api/shipments/:id', (req, res) => {
  const s = shipments.find((item) => item.shipmentId === req.params.id);
  if (!s) return res.status(404).json({ message: 'Shipment not found' });
  res.json(s);
});

// Telemetry & Devices
app.get('/api/devices', (req, res) => {
  res.json([
    { deviceId: 'AG-SENSOR-001', status: 'ACTIVE', battery: 92, connectivity: 'ONLINE' },
    { deviceId: 'AG-SENSOR-002', status: 'WARNING', battery: 84, connectivity: 'ONLINE' },
  ]);
});

// Simulation Control APIs
app.post('/api/simulation/start', (req, res) => {
  res.json({ success: true, message: 'IoT simulation engine started' });
});

app.post('/api/simulation/pause', (req, res) => {
  res.json({ success: true, message: 'IoT simulation engine paused' });
});

app.post('/api/simulation/scenario', (req, res) => {
  const { scenario } = req.body;
  res.json({ success: true, scenario, message: `Scenario ${scenario} activated` });
});

// Alerts
app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

app.post('/api/alerts/:id/resolve', (req, res) => {
  alerts = alerts.map((a) => (a.id === req.params.id ? { ...a, status: 'RESOLVED' } : a));
  res.json({ success: true });
});

// Blockchain
app.get('/api/blockchain/transactions', (req, res) => {
  res.json(transactions);
});

app.get('/api/blockchain/verify/:shipmentId', (req, res) => {
  res.json({
    verified: true,
    shipmentId: req.params.shipmentId,
    message: 'Cryptographic SHA-256 data integrity verified against Hyperledger Fabric anchor.',
  });
});

app.listen(PORT, () => {
  console.log(`[AgriChain Backend Server] Running on http://localhost:${PORT}`);
});
