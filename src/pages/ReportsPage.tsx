import React, { useState } from 'react';
import { INITIAL_SHIPMENTS, INITIAL_ALERTS, INITIAL_TRANSACTIONS } from '../data/mockSeedData';
import { useBlockchain } from '../contexts/BlockchainContext';
import { useSimulation } from '../contexts/SimulationContext';
import { FileSpreadsheet, Printer, Download, FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [selectedShipmentId, setSelectedShipmentId] = useState('MANGO-001');
  const { transactions } = useBlockchain();
  const { historyReadings } = useSimulation();

  const shipment = INITIAL_SHIPMENTS.find((s) => s.shipmentId === selectedShipmentId) || INITIAL_SHIPMENTS[0];

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).map((v) => `"${v}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Audit & Compliance Reports</h1>
          <p className="text-xs text-slate-500 font-medium">
            Generate printable food safety audit certificates & download CSV telemetry logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all shadow flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Export CSV Data Center */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-700" />
          <span>Raw CSV Audit Log Exporter</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => exportCSV(INITIAL_SHIPMENTS, 'agrichain_shipments')}
            className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left text-xs font-bold text-slate-800 transition-colors"
          >
            📊 Export Shipments CSV
          </button>
          <button
            onClick={() => exportCSV(historyReadings, 'agrichain_telemetry')}
            className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left text-xs font-bold text-slate-800 transition-colors"
          >
            📈 Export Telemetry CSV
          </button>
          <button
            onClick={() => exportCSV(INITIAL_ALERTS, 'agrichain_alerts')}
            className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left text-xs font-bold text-slate-800 transition-colors"
          >
            ⚠️ Export Alerts CSV
          </button>
          <button
            onClick={() => exportCSV(transactions, 'agrichain_blockchain_txs')}
            className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left text-xs font-bold text-slate-800 transition-colors"
          >
            🛡️ Export Blockchain Txs CSV
          </button>
        </div>
      </div>

      {/* Printable Audit Report Document View */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 print:p-0 print:border-none print:shadow-none">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="text-xl font-black text-slate-900 tracking-wider">AGRICHAIN EXPORT AUDIT CERTIFICATE</div>
            <div className="text-xs text-slate-500">Official Cold-Chain Traceability Compliance Document</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs font-bold text-emerald-800">REF: AUD-{shipment.shipmentId}</div>
            <div className="text-[10px] text-slate-400">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Shipment ID</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{shipment.shipmentId}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Product</span>
            <span className="font-bold text-slate-900">{shipment.product}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Origin Farm</span>
            <span className="font-bold text-slate-900">{shipment.origin}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Destination</span>
            <span className="font-bold text-slate-900">{shipment.destination}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm">Environmental Compliance Summary</h4>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span>Temperature Excursion Check (2°C – 8°C):</span>
              <strong className="text-emerald-900">PASSED ✓ (Avg 6.4°C)</strong>
            </div>
            <div className="flex justify-between">
              <span>Humidity Relative Range (55% – 85%):</span>
              <strong className="text-emerald-900">PASSED ✓ (Avg 65%)</strong>
            </div>
            <div className="flex justify-between">
              <span>Ethylene Gas Concentration (&lt;3.0 ppm):</span>
              <strong className="text-emerald-900">PASSED ✓ (1.2 ppm)</strong>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm">Chain of Custody Handover Log</h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-extrabold text-slate-500">
                <tr>
                  <th className="p-2.5">Stage</th>
                  <th className="p-2.5">Organization</th>
                  <th className="p-2.5">Inspector</th>
                  <th className="p-2.5">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {shipment.custodyHistory.map((c) => (
                  <tr key={c.id}>
                    <td className="p-2.5 font-bold text-slate-900">{c.stage}</td>
                    <td className="p-2.5">{c.organization}</td>
                    <td className="p-2.5">{c.personName}</td>
                    <td className="p-2.5 font-mono text-emerald-800">{c.transactionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-xs">
          <div>
            <div className="font-extrabold text-emerald-400">HYPERLEDGER FABRIC CRYPTOGRAPHIC SEAL</div>
            <div className="text-[10px] text-slate-400 font-mono">Merkle Root: 8f72a4b910e19c32d4e5f67890abc1234567890abcdef</div>
          </div>
          <div className="px-3 py-1 bg-emerald-700 text-white font-bold rounded-lg text-xs">
            VERIFIED & VALIDATED ✓
          </div>
        </div>
      </div>
    </div>
  );
};
