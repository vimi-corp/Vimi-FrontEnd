import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../../lib/api';
import clsx from 'clsx';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');
    try {
      await auth.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0E8FF] via-[#F8F9FA] to-[#E0FAFB] px-4"
         style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#8B3DFF]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#00C4CC]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.08)] border border-slate-100/60 p-10">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                 style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
              <img src="/favicon.svg" alt="Vimi" className="w-8 h-8 object-contain"
                   style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
          </div>

          {sent ? (
            /* Success state */
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <CheckCircle size={48} className="text-emerald-500" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-black text-slate-800 mb-2">Check your inbox</h1>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                We've sent a password reset link to <strong className="text-slate-700">{email}</strong>.
                The link expires in 1 hour.
              </p>
              <Link to="/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#8B3DFF] hover:opacity-80 transition-opacity">
                <ArrowLeft size={16} /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-slate-800 mb-1 text-center">Forgot password?</h1>
              <p className="text-center text-slate-500 text-sm mb-8 leading-relaxed">
                Enter your email and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600 font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <div className="flex items-center gap-3 px-4 h-12 rounded-xl border-2 border-slate-200
                                  focus-within:border-[#8B3DFF]/60 focus-within:ring-4 focus-within:ring-[#8B3DFF]/10
                                  transition-all bg-slate-50">
                    <Mail size={17} className="text-slate-400 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={clsx(
                    'w-full h-13 py-3.5 rounded-2xl font-bold text-[15px] text-white tracking-wide',
                    'flex items-center justify-center gap-2 transition-all duration-300',
                    loading ? 'opacity-70 cursor-wait' : 'hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0',
                  )}
                  style={{ background: 'linear-gradient(135deg, #8B3DFF 0%, #6B20EF 100%)',
                           boxShadow: loading ? 'none' : '0 10px 25px -5px rgba(139,61,255,0.4)' }}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>Send Reset Link <ArrowRight size={18} strokeWidth={2.5} /></>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-[#8B3DFF] transition-colors">
                  <ArrowLeft size={15} /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
