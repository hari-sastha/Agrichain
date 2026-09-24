import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSimulation } from '../../contexts/SimulationContext';
import { useAlerts } from '../../contexts/AlertContext';
import { Search, Bell, Wifi, WifiOff, RefreshCw, UserCheck, ShieldCheck, ChevronDown, LogOut } from 'lucide-react';
import { UserRole } from '../../types/user';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC<{
  onToggleSidebar: () => void;
  onSearchQueryChange?: (q: string) => void;
}> = ({ onToggleSidebar, onSearchQueryChange }) => {
  const { user, switchRole, logout } = useAuth();
  const { offlineQueueCount, currentScenario, syncProgress, triggerScenario } = useSimulation();
  const { activeCount, alerts } = useAlerts();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const isOffline = currentScenario === 'NETWORK_OUTAGE';

  const roles: { role: UserRole; label: string }[] = [
    { role: 'ADMIN', label: 'Admin (System Control)' },
    { role: 'FARMER', label: 'Farmer (Produce Origin)' },
    { role: 'EXPORTER', label: 'Exporter (Compliance)' },
    { role: 'LOGISTICS', label: 'Logistics Provider' },
    { role: 'IMPORTER', label: 'Importer (Verification)' },
    { role: 'AUDITOR', label: 'Auditor (Read Only)' },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearchQueryChange) onSearchQueryChange(e.target.value);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Shipment ID, Device ID, Product, Origin, TX..."
            value={searchVal}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-100/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Connectivity Status Badge */}
        {isOffline ? (
          <button
            onClick={() => triggerScenario('FULL_RECOVERY')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold hover:bg-amber-200 transition-colors animate-pulse"
            title="Click to restore connection and auto-sync"
          >
            <WifiOff className="w-4 h-4 text-amber-700" />
            <span>OFFLINE ({offlineQueueCount} queued)</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span>ONLINE</span>
          </div>
        )}

        {/* Syncing indicator */}
        {syncProgress.isSyncing && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" />
            <span>Syncing {syncProgress.progress}/{syncProgress.total}</span>
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {activeCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">Notifications</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-semibold">
                  {activeCount} Active
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {alerts.slice(0, 5).map((a) => (
                  <div key={a.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="font-semibold text-slate-900">{a.title}</div>
                    <div className="text-slate-500 mt-0.5">{a.message}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{new Date(a.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Demo Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors border border-slate-200"
          >
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Role: <strong className="text-emerald-900">{user?.role}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Switch Demo Role Context
              </div>
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchRole(r.role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    user?.role === r.role ? 'font-bold text-emerald-800 bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{r.label}</span>
                  {user?.role === r.role && <ShieldCheck className="w-4 h-4 text-emerald-700" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
            alt={user?.name}
            className="w-8 h-8 rounded-full border border-emerald-700 object-cover"
          />
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</div>
            <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{user?.organization}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
