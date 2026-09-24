import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Activity,
  Cpu,
  Bell,
  Link as ChainIcon,
  GitCommit,
  QrCode,
  BarChart3,
  FileSpreadsheet,
  Users,
  Settings,
  Leaf,
  LogOut,
  ScanLine
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAlerts } from '../../contexts/AlertContext';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { user, logout } = useAuth();
  const { activeCount } = useAlerts();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Shipments', path: '/shipments', icon: Package },
    { label: 'Live Monitoring', path: '/monitoring', icon: Activity },
    { label: 'IoT Devices', path: '/iot-devices', icon: Cpu },
    { label: 'Alert Center', path: '/alerts', icon: Bell, badge: activeCount > 0 ? activeCount : undefined },
    { label: 'Blockchain Explorer', path: '/blockchain', icon: ChainIcon },
    { label: 'Chain of Custody', path: '/chain-of-custody/MANGO-001', icon: GitCommit },
    { label: 'Digital Passport', path: '/passport/MANGO-001', icon: QrCode },
    { label: 'QR Verification', path: '/verify', icon: ScanLine },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Audit Reports', path: '/reports', icon: FileSpreadsheet },
    { label: 'User Directory', path: '/users', icon: Users },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-emerald-700/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <Leaf className="w-6 h-6" />
        </div>
        <div>
          <div className="text-lg font-black tracking-wide text-white flex items-center gap-1.5">
            AGRICHAIN
            <span className="text-[10px] bg-emerald-900/80 text-emerald-400 px-1.5 py-0.5 rounded font-bold border border-emerald-700/50">PRO</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Trust Every Journey</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-700/30 text-emerald-300 border border-emerald-600/40 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/90 text-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
          <div className="truncate">
            <div className="text-xs font-bold text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-emerald-400 font-mono font-medium uppercase">{user?.role}</div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
