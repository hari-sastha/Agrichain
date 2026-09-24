import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shipment, ShipmentStatus, ProductCategory } from '../types/shipment';
import { INITIAL_SHIPMENTS } from '../data/mockSeedData';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { useBlockchain } from '../contexts/BlockchainContext';
import { Package, Plus, Search, Filter, QrCode, ArrowUpRight, ShieldCheck, MapPin } from 'lucide-react';

export const ShipmentsPage: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { recordShipmentOnChain } = useBlockchain();

  // Form State
  const [shipmentId, setShipmentId] = useState(`AGRI-${Math.floor(Math.random() * 900 + 100)}`);
  const [product, setProduct] = useState('Alphonso Mango (Grade A Export)');
  const [category, setCategory] = useState<ProductCategory>('Fresh Fruit');
  const [quantity, setQuantity] = useState('5,000 kg');
  const [origin, setOrigin] = useState('Erode, Tamil Nadu, India');
  const [destination, setDestination] = useState('Dubai, UAE');
  const [producer, setProducer] = useState('GreenValley Organic Farms');
  const [transporter, setTransporter] = useState('ColdExpress Freight Solutions');
  const [sensorDeviceId, setSensorDeviceId] = useState('AG-SENSOR-001');

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.shipmentId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.product.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    const newShipment: Shipment = {
      id: `shp-${Date.now()}`,
      shipmentId,
      product,
      category,
      quantity,
      origin,
      destination,
      producer,
      transporter,
      importer: 'Global Import Hub LLC',
      expectedDelivery: new Date(Date.now() + 864000000).toISOString().split('T')[0],
      harvestDate: new Date().toISOString().split('T')[0],
      sensorDeviceId,
      status: 'CREATED',
      currentOwner: producer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      routeCoordinates: [
        [11.341, 77.7172],
        [13.0827, 80.2707],
        [25.2048, 55.2708],
      ],
      currentLocationIndex: 0,
      custodyHistory: [
        {
          id: `cst-${Date.now()}`,
          shipmentId,
          stage: 'FARM',
          stageTitle: 'Created & Phytosanitary Checked',
          organization: producer,
          personName: 'Ramesh Kumar',
          role: 'Lead Producer',
          location: origin,
          timestamp: new Date().toISOString(),
          transactionId: `TX-FARM-${Math.floor(Math.random() * 9000 + 1000)}`,
          blockchainVerified: true,
        },
      ],
    };

    // Record on blockchain
    await recordShipmentOnChain(newShipment);

    setShipments([newShipment, ...shipments]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Shipment Management</h1>
          <p className="text-xs text-slate-500 font-medium">
            Register, track, and verify agricultural export shipments across global transit nodes.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Shipment</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, Product, Origin, Destination..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="ALERT">Alert State</option>
            <option value="IN_WAREHOUSE">In Warehouse</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      {/* Shipments Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <th className="py-3.5 px-4">Shipment ID</th>
                <th className="py-3.5 px-4">Product & Category</th>
                <th className="py-3.5 px-4">Origin → Destination</th>
                <th className="py-3.5 px-4">IoT Sensor</th>
                <th className="py-3.5 px-4">Current Owner</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredShipments.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-black text-emerald-800">
                    <Link to={`/shipments/${s.shipmentId}`} className="hover:underline flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-emerald-600" />
                      <span>{s.shipmentId}</span>
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{s.product}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{s.category} • {s.quantity}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-slate-800 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate max-w-[120px]">{s.origin.split(',')[0]}</span>
                      <span className="text-slate-400">→</span>
                      <span className="truncate max-w-[120px]">{s.destination.split(',')[0]}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px]">{s.sensorDeviceId}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium truncate max-w-[140px]">{s.currentOwner}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/passport/${s.shipmentId}`}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                        title="Digital Passport QR"
                      >
                        <QrCode className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/shipments/${s.shipmentId}`}
                        className="p-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Shipment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create & Register New Export Shipment"
        subtitle="Generates blockchain anchor transaction and links IoT sensor."
      >
        <form onSubmit={handleCreateShipment} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Shipment ID</label>
              <input
                type="text"
                required
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold uppercase"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Product Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="Fresh Fruit">Fresh Fruit</option>
                <option value="Fresh Vegetable">Fresh Vegetable</option>
                <option value="Cold Seafood">Cold Seafood</option>
                <option value="Pharmaceutical Produce">Pharmaceutical Produce</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Description</label>
            <input
              type="text"
              required
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Origin Location</label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Destination Location</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Producer / Farm</label>
              <input
                type="text"
                required
                value={producer}
                onChange={(e) => setProducer(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Assign IoT Sensor Device</label>
              <select
                value={sensorDeviceId}
                onChange={(e) => setSensorDeviceId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              >
                <option value="AG-SENSOR-001">AG-SENSOR-001 (Active)</option>
                <option value="AG-SENSOR-002">AG-SENSOR-002 (Active)</option>
                <option value="AG-SENSOR-003">AG-SENSOR-003 (Active)</option>
                <option value="AG-SENSOR-004">AG-SENSOR-004 (Offline)</option>
                <option value="AG-SENSOR-005">AG-SENSOR-005 (Active)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl transition-all shadow-md mt-4"
          >
            Create Shipment & Broadcast Blockchain Transaction
          </button>
        </form>
      </Modal>
    </div>
  );
};
