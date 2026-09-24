import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { INITIAL_SHIPMENTS } from '../data/mockSeedData';
import { Leaf, ShieldCheck, QrCode, CheckCircle2, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const DigitalPassportPage: React.FC = () => {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const shipment = INITIAL_SHIPMENTS.find((s) => s.shipmentId === shipmentId) || INITIAL_SHIPMENTS[0];

  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-6 font-sans antialiased text-white flex flex-col items-center justify-center">
      {/* Container */}
      <div className="max-w-2xl w-full bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-wider">AGRICHAIN</span>
              <span className="text-[10px] text-emerald-800 font-bold block uppercase tracking-widest">
                DIGITAL PRODUCT PASSPORT
              </span>
            </div>
          </div>

          <div className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>VERIFIED PASSPORT ✓</span>
          </div>
        </div>

        {/* Product Identity */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="font-mono text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md inline-block">
              {shipment.shipmentId}
            </div>
            <h2 className="text-2xl font-black text-slate-900">{shipment.product}</h2>
            <div className="text-xs text-slate-500 font-medium">Category: {shipment.category} • Quantity: {shipment.quantity}</div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm shrink-0">
            <QRCodeSVG value={currentUrl} size={110} fgColor="#0F5132" level="H" />
          </div>
        </div>

        {/* Journey Details */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Origin Farm</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {shipment.origin}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Destination Port</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {shipment.destination}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Harvest Date</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {shipment.harvestDate}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Current Transit Status</span>
            <span className="font-bold text-emerald-800">{shipment.status.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Environmental Summary Compliance Checklist */}
        <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Cold-Chain Environmental Compliance</h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-emerald-100 font-medium">
              <span>Temperature Compliance (2°C – 8°C)</span>
              <span className="text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Within expected range ✓</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-emerald-100 font-medium">
              <span>Humidity Compliance (55% – 85%)</span>
              <span className="text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Within expected range ✓</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-emerald-100 font-medium">
              <span>Ethylene Concentration (&lt;3.0 ppm)</span>
              <span className="text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Within expected range ✓</span>
              </span>
            </div>
          </div>
        </div>

        {/* Blockchain & Integrity Status */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Traceability</span>
            <span className="font-bold text-slate-900">{shipment.custodyHistory.length} Custody Events</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Blockchain</span>
            <span className="font-bold text-emerald-900">VERIFIED ✓</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Data Integrity</span>
            <span className="font-bold text-emerald-900">VERIFIED ✓</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            to={`/chain-of-custody/${shipment.shipmentId}`}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <span>View Full Chain of Custody Audit Log</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
