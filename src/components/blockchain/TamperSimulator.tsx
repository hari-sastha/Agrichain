import React, { useState } from 'react';
import { useBlockchain } from '../../contexts/BlockchainContext';
import { VerificationResult } from '../../types/blockchain';
import { ShieldAlert, ShieldCheck, AlertOctagon, RotateCcw, Lock } from 'lucide-react';

interface TamperSimulatorProps {
  shipmentId: string;
  originalTemp?: number;
}

export const TamperSimulator: React.FC<TamperSimulatorProps> = ({
  shipmentId,
  originalTemp = 7.4,
}) => {
  const { verifyIntegrity, simulateDataTamper, restoreDataIntegrity, tamperedShipments } = useBlockchain();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const isTampered = tamperedShipments.has(shipmentId);

  const handleTamperToggle = async () => {
    if (isTampered) {
      restoreDataIntegrity(shipmentId);
    } else {
      simulateDataTamper(shipmentId);
    }
    // Auto run verification
    handleRunVerification();
  };

  const handleRunVerification = async () => {
    setIsVerifying(true);
    const telemetry = {
      shipmentId,
      temperature: originalTemp,
      humidity: 65,
      timestamp: new Date().toISOString(),
    };
    const res = await verifyIntegrity(shipmentId, telemetry);
    setResult(res);
    setIsVerifying(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isTampered ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">Cryptographic SHA-256 Data Integrity Verification</h4>
            <p className="text-xs text-slate-500">Cross-examine live telemetry payload against Hyperledger Fabric immutable anchor.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
          >
            {isVerifying ? 'Computing SHA-256...' : 'Run Integrity Check'}
          </button>
          <button
            onClick={handleTamperToggle}
            className={`px-4 py-2 font-bold text-xs rounded-xl transition-all shadow-sm ${
              isTampered
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {isTampered ? 'Restore Original Data' : 'Simulate Data Tampering'}
          </button>
        </div>
      </div>

      {result && (
        <div
          className={`p-4 rounded-xl border ${
            result.verified
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/90 border-rose-300 text-rose-950 animate-in fade-in duration-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.verified ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
            )}
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm uppercase tracking-wide">
                  {result.verified ? 'RESULT: DATA INTEGRITY VERIFIED ✓' : 'RESULT: DATA INTEGRITY FAILED ✕'}
                </span>
                <span className="text-xs font-mono font-bold">Block #{result.blockNumber}</span>
              </div>

              <p className="text-xs font-medium">{result.message}</p>

              <div className="mt-3 p-3 bg-white/80 backdrop-blur rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">BLOCKCHAIN ANCHORED HASH:</span>
                  <span className="font-bold text-slate-800">{result.blockchainHash.substring(0, 32)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CURRENT PAYLOAD HASH:</span>
                  <span className={`font-bold ${result.verified ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {result.currentDataHash.substring(0, 32)}...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
