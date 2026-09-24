import React from 'react';
import { DEMO_USERS } from '../data/mockSeedData';
import { Users, ShieldCheck, Mail, Building, Key } from 'lucide-react';

export const UsersPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">User & Role Directory</h1>
        <p className="text-xs text-slate-500 font-medium">
          Authorized platform participants, cryptographic key identities, and role-based permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEMO_USERS.map((u) => (
          <div key={u.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={u.avatarUrl}
                alt={u.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-700"
              />
              <div>
                <div className="font-extrabold text-slate-900 text-sm">{u.name}</div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-[10px]">
                  {u.role}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600 font-medium border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{u.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{u.organization}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
