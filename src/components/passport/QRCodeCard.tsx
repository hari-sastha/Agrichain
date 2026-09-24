import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode, ExternalLink, Printer } from 'lucide-react';

interface QRCodeCardProps {
  shipmentId: string;
  productName: string;
  passportUrl?: string;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  shipmentId,
  productName,
  passportUrl,
}) => {
  const targetUrl = passportUrl || `${window.location.origin}/passport/${shipmentId}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-3 text-emerald-900 font-extrabold text-xs uppercase tracking-wider">
        <QrCode className="w-4 h-4 text-emerald-700" />
        <span>Digital Product Passport QR</span>
      </div>

      <div className="p-4 bg-white rounded-2xl border-2 border-emerald-800 shadow-md mb-4">
        <QRCodeSVG
          value={targetUrl}
          size={160}
          bgColor="#FFFFFF"
          fgColor="#0F5132"
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="font-mono font-black text-slate-900 text-lg">{shipmentId}</div>
      <p className="text-xs text-slate-500 max-w-xs mt-1 font-medium">{productName}</p>

      <div className="mt-4 flex items-center gap-2 w-full">
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <span>Open Passport</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={handlePrint}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition-colors"
          title="Print Label"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
