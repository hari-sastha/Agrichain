import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DEMO_USERS } from '../data/mockSeedData';
import { Leaf, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { UserRole } from '../types/user';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@agrichain.demo');
  const [password, setPassword] = useState('Admin@123');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email)) {
      navigate('/dashboard');
    }
  };

  const handleQuickDemoSelect = (demoEmail: string, demoPass: string, role: UserRole) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    login(demoEmail, role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans antialiased">
      <div className="max-w-md w-full bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Welcome to AgriChain</h2>
          <p className="text-xs text-slate-500 font-medium">
            Sign in to access your role-based cold-chain traceability portal.
          </p>
        </div>

        {/* Demo Quick Select Buttons */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>One-Click Demo Account Login</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {DEMO_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickDemoSelect(u.email, `${u.role.charAt(0)}${u.role.slice(1).toLowerCase()}@123`, u.role)}
                className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-900 truncate">
                  {u.role}
                </div>
                <div className="text-[9px] text-slate-400 truncate">{u.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-semibold text-emerald-800 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-emerald-700 focus:ring-emerald-500" />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-emerald-800 hover:underline">
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
};
