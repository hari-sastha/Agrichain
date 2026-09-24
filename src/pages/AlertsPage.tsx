import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlerts } from '../contexts/AlertContext';
import { useAuth } from '../contexts/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { AlertTriangle, Bell, CheckCircle2, ShieldAlert, ArrowUpRight, Check, XCircle } from 'lucide-react';
import { AlertStatus } from '../types/alert';

export const AlertsPage: React.FC = () => {
  const { alerts, activeCount, acknowledgeAlert, resolveAlert } = useAlerts();
  const { user } = useAuth();
  const [filterTab, setFilterTab] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'RESOLVED'>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (filterTab === 'CRITICAL') return a.severity === 'CRITICAL' && a.status !== 'RESOLVED';
    if (filterTab === 'WARNING') return a.severity === 'WARNING' && a.status !== 'RESOLVED';
    if (filterTab === 'RESOLVED') return a.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Alert Center</h1>
          <p className="text-xs text-slate-500 font-medium">
            Rule-based threshold alerts for temperature breaches, ethylene spikes, battery drain & tamper events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-extrabold rounded-xl border border-rose-200">
            {activeCount} Active Unresolved Alerts
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {(['ALL', 'CRITICAL', 'WARNING', 'RESOLVED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterTab === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
            No alerts matching the selected filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                alert.severity === 'CRITICAL' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl ${
                    alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{alert.title}</span>
                    <StatusBadge status={alert.severity} size="sm" />
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                      {alert.shipmentId}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium max-w-2xl">{alert.message}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
                    <span>
                      Recorded Value: <strong className="text-slate-900">{alert.value}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Expected Range: <strong className="text-slate-700">{alert.expectedRange}</strong>
                    </span>
                    <span>•</span>
                    <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {alert.status === 'ACTIVE' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id, user?.name || 'Authorized User')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                  >
                    Acknowledge
                  </button>
                )}

                {alert.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => resolveAlert(alert.id, user?.name || 'Authorized User')}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolve Alert</span>
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200">
                    ✓ Resolved by {alert.resolvedBy || 'System'}
                  </span>
                )}

                <Link
                  to={`/shipments/${alert.shipmentId}`}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition-colors"
                  title="View Shipment Details"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
