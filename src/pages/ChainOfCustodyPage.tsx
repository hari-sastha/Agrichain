import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { INITIAL_SHIPMENTS } from '../data/mockSeedData';
import { StatusBadge } from '../components/common/StatusBadge';
import { GitCommit, ShieldCheck, MapPin, User, Building, Calendar, ArrowLeft, Package } from 'lucide-react';

export const ChainOfCustodyPage: React.FC = () => {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const shipment = INITIAL_SHIPMENTS.find((s) => s.shipmentId === shipmentId) || INITIAL_SHIPMENTS[0];

  const stages = [
    { stage: 'FARM', label: 'Farm Origin', done: true },
    { stage: 'WAREHOUSE', label: 'Cold Warehouse', done: true },
    { stage: 'TRANSPORT', label: 'Refrigerated Transit', done: true },
    { stage: 'PORT', label: 'Port Customs Clearance', done: false },
    { stage: 'EXPORT', label: 'Export Inspection', done: false },
    { stage: 'IMPORTER', label: 'Importer Handover', done: false },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to={`/shipments/${shipment.shipmentId}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shipment Details</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-700" />
              <span className="font-mono font-black text-xl text-slate-900">{shipment.shipmentId}</span>
              <StatusBadge status={shipment.status} />
            </div>
            <h2 className="text-base font-bold text-slate-700 mt-1">{shipment.product}</h2>
          </div>

          <div className="text-xs text-slate-500 font-medium text-right">
            <div>Origin: <strong>{shipment.origin}</strong></div>
            <div>Destination: <strong>{shipment.destination}</strong></div>
          </div>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {stages.map((st, idx) => (
              <div
                key={st.stage}
                className={`p-3 rounded-xl border text-center transition-all ${
                  st.done
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-400 font-medium'
                }`}
              >
                <div className="text-[10px] font-mono uppercase">{st.stage}</div>
                <div className="text-xs mt-0.5">{st.done ? '✓ Completed' : 'Pending'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical Visual Timeline */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-emerald-700" />
          <span>Verified Chain of Custody Timeline</span>
        </h3>

        <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-1 before:bg-emerald-800">
          {shipment.custodyHistory.map((evt, idx) => (
            <div key={evt.id} className="relative group">
              <div className="absolute -left-8 top-1.5 w-7 h-7 rounded-full bg-emerald-800 border-4 border-white flex items-center justify-center text-white text-xs font-bold shadow">
                ✓
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300">
                      {evt.stage}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm">{evt.stageTitle}</h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">{new Date(evt.timestamp).toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Handling Organization</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      {evt.organization}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Responsible Person / Role</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {evt.personName} ({evt.role})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {evt.location}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200/60">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-400">Transaction ID:</span>
                    <span className="font-bold text-emerald-800">{evt.transactionId}</span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fabric Verified ✓</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
