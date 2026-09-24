import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { INITIAL_SHIPMENTS } from '../data/mockSeedData';
import { useSimulation } from '../contexts/SimulationContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { RouteMap } from '../components/shipment/RouteMap';
import { SensorChart } from '../components/analytics/SensorChart';
import { TamperSimulator } from '../components/blockchain/TamperSimulator';
import { QRCodeCard } from '../components/passport/QRCodeCard';
import { Modal } from '../components/common/Modal';
import { useBlockchain } from '../contexts/BlockchainContext';
import {
  Package,
  MapPin,
  Calendar,
  Cpu,
  Thermometer,
  Droplets,
  Wind,
  Battery,
  ShieldCheck,
  GitCommit,
  Plus,
  ArrowLeft,
  QrCode
} from 'lucide-react';

export const ShipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { devices, historyReadings } = useSimulation();
  const { recordCustodyTransfer } = useBlockchain();

  const shipment = INITIAL_SHIPMENTS.find((s) => s.shipmentId === id) || INITIAL_SHIPMENTS[0];
  const assignedDevice = devices.find((d) => d.deviceId === shipment.sensorDeviceId) || devices[0];

  const [custodyHistory, setCustodyHistory] = useState(shipment.custodyHistory);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // New custody form
  const [stageTitle, setStageTitle] = useState('Port Departure Clearance');
  const [organization, setOrganization] = useState('Chennai Customs Port Authority');
  const [personName, setPersonName] = useState('Officer Rajesh Nair');
  const [location, setLocation] = useState('Chennai Port Terminal 2');

  const handleAddCustodyStep = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStep = {
      id: `cst-${Date.now()}`,
      shipmentId: shipment.shipmentId,
      stage: 'PORT' as const,
      stageTitle,
      organization,
      personName,
      role: 'Inspector',
      location,
      timestamp: new Date().toISOString(),
      transactionId: `TX-PORT-${Math.floor(Math.random() * 9000 + 1000)}`,
      blockchainVerified: true,
    };

    await recordCustodyTransfer(shipment.shipmentId, newStep);
    setCustodyHistory([...custodyHistory, newStep]);
    setIsTransferModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/shipments"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Shipments</span>
        </Link>

        <Link
          to={`/passport/${shipment.shipmentId}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
        >
          <QrCode className="w-4 h-4 text-emerald-700" />
          <span>Public Digital Passport</span>
        </Link>
      </div>

      {/* Shipment Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-slate-900 font-mono">{shipment.shipmentId}</span>
              <StatusBadge status={shipment.status} size="lg" />
            </div>
            <h2 className="text-base font-bold text-slate-700 mt-1">{shipment.product}</h2>
          </div>

          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Update Chain of Custody</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Origin</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {shipment.origin}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Destination</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {shipment.destination}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Producer / Farm</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{shipment.producer}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Assigned Sensor</span>
            <span className="font-mono font-bold text-emerald-800 mt-0.5 block">{shipment.sensorDeviceId}</span>
          </div>
        </div>
      </div>

      {/* Environmental Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Live Temp</div>
            <div className="text-2xl font-extrabold text-slate-900">{assignedDevice.temperature}°C</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Expected: 2–8°C</div>
          </div>
          <Thermometer className="w-8 h-8 text-emerald-600/30" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Humidity</div>
            <div className="text-2xl font-extrabold text-slate-900">{assignedDevice.humidity}%</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Expected: 55–85%</div>
          </div>
          <Droplets className="w-8 h-8 text-sky-600/30" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Ethylene Gas</div>
            <div className="text-2xl font-extrabold text-slate-900">{assignedDevice.ethylene} ppm</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Max: 3.0 ppm</div>
          </div>
          <Wind className="w-8 h-8 text-amber-600/30" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Device Battery</div>
            <div className="text-2xl font-extrabold text-slate-900">{assignedDevice.battery}%</div>
            <div className="text-[10px] text-slate-500 font-semibold">Source: {assignedDevice.energySource}</div>
          </div>
          <Battery className="w-8 h-8 text-slate-600/30" />
        </div>
      </div>

      {/* Cryptographic SHA-256 Tamper Simulator Demo */}
      <TamperSimulator shipmentId={shipment.shipmentId} originalTemp={assignedDevice.temperature} />

      {/* Route Map & QR passport */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Geographic Transit Route Map</h3>
          <RouteMap coordinates={shipment.routeCoordinates} />
        </div>

        <div>
          <QRCodeCard shipmentId={shipment.shipmentId} productName={shipment.product} />
        </div>
      </div>

      {/* Sensor Line Chart */}
      <SensorChart
        data={historyReadings}
        metric="temperature"
        title={`Live Sensor Stream: ${shipment.sensorDeviceId}`}
        unit="°C"
      />

      {/* Vertical Chain of Custody Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-slate-900">Immutable Chain of Custody Audit Log</h3>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-800">
          {custodyHistory.map((step, idx) => (
            <div key={step.id} className="relative group">
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-emerald-800 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{step.stageTitle}</span>
                  <span className="font-mono text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {step.transactionId}
                  </span>
                </div>
                <div className="text-slate-600 font-medium">
                  {step.organization} • Handled by <strong className="text-slate-900">{step.personName}</strong> ({step.role})
                </div>
                <div className="text-[11px] text-slate-400">
                  Location: {step.location} • Time: {new Date(step.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custody Step Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Record Custody Handover Event"
        subtitle="Signs and broadcasts custody transfer onto Hyperledger Fabric."
      >
        <form onSubmit={handleAddCustodyStep} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Stage Event Title</label>
            <input
              type="text"
              required
              value={stageTitle}
              onChange={(e) => setStageTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Organization</label>
            <input
              type="text"
              required
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Responsible Person</label>
              <input
                type="text"
                required
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl transition-all shadow mt-2"
          >
            Record & Sign Custody Transfer
          </button>
        </form>
      </Modal>
    </div>
  );
};
