import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  ShieldCheck,
  Cpu,
  WifiOff,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe2,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-white">AGRICHAIN</span>
              <span className="text-[10px] text-emerald-400 block font-medium">Trust Every Journey</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#iot-monitoring" className="hover:text-emerald-400 transition-colors">IoT Monitoring</a>
            <a href="#blockchain" className="hover:text-emerald-400 transition-colors">Blockchain Integrity</a>
            <a href="#digital-passport" className="hover:text-emerald-400 transition-colors">Digital Passport</a>
            <a href="#smes" className="hover:text-emerald-400 transition-colors">SME Benefits</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-900/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Trusted Digital Passport for Agricultural Cold-Chain Traceability</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Transparent Agricultural Traceability <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              From Farm to Final Destination.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-300 font-medium">
            Secure, affordable, and tamper-evident traceability for global food supply chains. Connecting IoT telemetry, cryptographic SHA-256 validation, and Hyperledger Fabric blockchain evidence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl transition-all shadow-xl shadow-emerald-950 flex items-center justify-center gap-3"
            >
              <span>Start Tracking Journey</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/passport/MANGO-001"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5 text-emerald-400" />
              <span>Explore Sample Passport</span>
            </Link>
          </div>

          {/* Supply Chain Flow Visualization */}
          <div className="mt-16 pt-10 border-t border-slate-800">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-8">
              End-to-End Immutable Supply Chain Pipeline
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { stage: 'FARM', title: 'Farm Harvest', icon: Leaf },
                { stage: 'WAREHOUSE', title: 'Cold Storage Vault', icon: Lock },
                { stage: 'TRANSPORT', title: 'Refrigerated Transit', icon: Cpu },
                { stage: 'PORT', title: 'Customs & Port', icon: Globe2 },
                { stage: 'EXPORTER', title: 'Export Clearance', icon: TrendingUp },
                { stage: 'IMPORTER', title: 'Final Passport Seal', icon: FileCheck },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.stage}
                    className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex flex-col items-center text-center hover:border-emerald-500/50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{item.stage}</span>
                    <span className="text-xs font-bold text-slate-200 mt-0.5">{item.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Grid */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-950/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Problem */}
          <div className="p-8 bg-slate-900 rounded-3xl border border-rose-900/30 space-y-4">
            <div className="inline-flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
              <span>The Industry Problem</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Agricultural Exporters Face Severe Blind Spots</h3>
            <ul className="space-y-3 text-xs font-medium text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Supply-chain blind spots & untracked temperature excursions leading to crop spoilage.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Deep-sea network outages causing complete data blackouts during transit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Risks of manual data manipulation and fraudulent compliance certificates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Prohibitive enterprise hardware & software costs locking out smallholder farmers and SMEs.</span>
              </li>
            </ul>
          </div>

          {/* Solution */}
          <div className="p-8 bg-slate-900 rounded-3xl border border-emerald-900/40 space-y-4">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
              <span>The AgriChain Solution</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Resilient, Offline-First & Tamper-Evident Architecture</h3>
            <ul className="space-y-3 text-xs font-medium text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Real-time environmental IoT monitoring (Temperature, Humidity, Ethylene, GPS).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Offline-first local logging with automatic background cryptographic synchronization upon reconnect.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Hyperledger Fabric blockchain anchoring ensuring immutable, tamper-evident audit evidence.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Publicly verifiable QR Digital Product Passports accessible by importers and consumers instantly.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 text-slate-400 text-xs text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-white font-extrabold text-sm">
          <Leaf className="w-4 h-4 text-emerald-500" />
          <span>AGRICHAIN</span>
        </div>
        <p>"Trust Every Journey. Transparent agricultural traceability from farm to destination."</p>
        <p>© 2026 AgriChain. All rights reserved.</p>
      </footer>
    </div>
  );
};
