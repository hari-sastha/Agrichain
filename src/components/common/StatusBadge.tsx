import React from 'react';

export type StatusBadgeType =
  | 'CREATED'
  | 'AT_FARM'
  | 'IN_WAREHOUSE'
  | 'IN_TRANSIT'
  | 'AT_PORT'
  | 'EXPORTED'
  | 'DELIVERED'
  | 'ALERT'
  | 'CLOSED'
  | 'ACTIVE'
  | 'OFFLINE'
  | 'WARNING'
  | 'CRITICAL'
  | 'VERIFIED'
  | 'TAMPERED';

interface StatusBadgeProps {
  status: StatusBadgeType | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeConfig = (s: string) => {
    switch (s) {
      case 'IN_TRANSIT':
      case 'ACTIVE':
      case 'ONLINE':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          symbol: '●',
          label: s.replace('_', ' '),
        };
      case 'VERIFIED':
      case 'DELIVERED':
      case 'CLOSED':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          symbol: '✓',
          label: s === 'VERIFIED' ? '✓ Verified' : s.replace('_', ' '),
        };
      case 'WARNING':
      case 'AT_WAREHOUSE':
      case 'IN_WAREHOUSE':
      case 'AT_FARM':
      case 'CREATED':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          symbol: '⚠',
          label: s === 'WARNING' ? '⚠ Warning' : s.replace('_', ' '),
        };
      case 'ALERT':
      case 'CRITICAL':
      case 'TAMPERED':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse',
          symbol: '✕',
          label: s === 'TAMPERED' ? '✕ Tampered' : s === 'CRITICAL' ? '✕ Critical' : '✕ Alert',
        };
      case 'OFFLINE':
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-300',
          symbol: '○',
          label: '○ Offline',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          symbol: '•',
          label: s.replace('_', ' '),
        };
    }
  };

  const config = getBadgeConfig(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses[size]}`}
    >
      <span className="font-mono">{config.symbol}</span>
      <span>{config.label}</span>
    </span>
  );
};
