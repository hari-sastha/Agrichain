import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans antialiased">
      <div className="max-w-md w-full bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Reset Password</h2>
          <p className="text-xs text-slate-500 font-medium">
            Enter your registered email address to receive password reset credentials.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. admin@agrichain.demo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl transition-all shadow-md"
            >
              Send Reset Instructions
            </button>
          </form>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="text-sm font-bold">Instructions Sent!</div>
            <p className="text-xs text-emerald-800">
              Check {email} for instructions to reset your security credentials.
            </p>
          </div>
        )}

        <div className="text-center text-xs text-slate-500">
          <Link to="/login" className="font-bold text-emerald-800 hover:underline">
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
