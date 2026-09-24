import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface VerificationBadgeProps {
  status: 'VERIFIED' | 'WARNING' | 'FAILED';
  hash?: string;
  blockNumber?: number;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  hash,
  blockNumber,
}) => {
  if (status === 'VERIFIED') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Data Integrity: VERIFIED ✓</span>
        {blockNumber && <span className="font-mono text-[10px] text-emerald-700">#{blockNumber}</span>}
      </div>
    );
  }

  if (status === 'WARNING') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
        <ShieldAlert className="w-4 h-4 text-amber-600" />
        <span>Data Integrity: UNVERIFIED ⚠</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold animate-bounce">
      <ShieldX className="w-4 h-4 text-rose-600" />
      <span>DATA INTEGRITY FAILED ✕</span>
    </div>
  );
};
