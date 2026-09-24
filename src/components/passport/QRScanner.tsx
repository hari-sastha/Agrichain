import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Search, QrCode, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QRScanner: React.FC = () => {
  const [manualId, setManualId] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanner = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const scanner = new Html5Qrcode('qr-reader-viewport');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          // Extract shipmentId from URL or raw text
          const parts = decodedText.split('/');
          const id = parts[parts.length - 1] || decodedText;
          stopScanner();
          navigate(`/passport/${id}`);
        },
        () => {}
      );
    } catch (err: any) {
      setCameraError('Camera access denied or unavailable. Please use manual Shipment ID entry.');
      setIsCameraActive(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        scannerRef.current?.clear();
        setIsCameraActive(false);
      });
    } else {
      setIsCameraActive(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      navigate(`/passport/${manualId.trim().toUpperCase()}`);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-6 text-center">
      <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto">
        <QrCode className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900">Verify Shipment Passport</h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Scan the shipment digital passport QR code or enter the unique identifier to audit blockchain authenticity.
        </p>
      </div>

      {/* Camera Scanner Container */}
      <div className="space-y-3">
        {!isCameraActive ? (
          <button
            onClick={startScanner}
            className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Camera className="w-4 h-4" />
            <span>Activate Camera Scanner</span>
          </button>
        ) : (
          <div className="space-y-3">
            <div id="qr-reader-viewport" className="w-full h-64 bg-slate-900 rounded-2xl overflow-hidden border-2 border-emerald-500"></div>
            <button
              onClick={stopScanner}
              className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              Stop Camera
            </button>
          </div>
        )}

        {cameraError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          OR MANUAL ID ENTRY
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* Manual Input Form */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. MANGO-001 or BANANA-002"
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-mono font-bold rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none uppercase"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 transition-colors shadow-sm"
        >
          <Search className="w-4 h-4" />
          <span>Verify</span>
        </button>
      </form>
    </div>
  );
};
