import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import clsx from 'clsx';

// ── Reusable input field ──────────────────────────────────────────────────
function Field({ label, type = 'text', icon: Icon, value, onChange, placeholder, error, rightEl }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-[#2D3748]">{label}</label>
      <div className={clsx(
        'flex items-center gap-3 px-4 h-12 rounded-xl border bg-white transition-all duration-200',
        error
          ? 'border-red-300 ring-1 ring-red-200'
          : 'border-[#E2E8F0] focus-within:border-[#8B3DFF] focus-within:ring-1 focus-within:ring-[#8B3DFF]/20',
      )}>
        {Icon && <Icon size={16} className="flex-shrink-0 text-[#9CA3AF]" />}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm text-[#2D3748] placeholder:text-[#CBD5E1]
                     bg-transparent outline-none min-w-0"
        />
        {rightEl}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

// ── Login Page ────────────────────────────────────────────────────────────
export default function LoginPage({ onLogin, onGoRegister }) {
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [fieldErrs, setFieldErrs] = useState({});

  const validate = () => {
    const errs = {};
    if (!email)    errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    setFieldErrs(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Left panel: branding ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 p-12"
        style={{ background: 'linear-gradient(160deg, #130528 0%, #1E0848 50%, #081830 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            vimi
          </span>
        </div>

        {/* Testimonial */}
        <div>
          <div className="mb-8">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-sm"
                  style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
                  <span className="text-white text-[10px] flex items-center justify-center h-full">★</span>
                </div>
              ))}
            </div>
            <blockquote className="text-white/80 text-lg leading-relaxed font-light">
              "Vimi helped me launch my fashion store in under 20 minutes.
              The subdomain feature is brilliant — my customers love
              <span className="text-[#00C4CC] font-semibold"> hoangsneaker.vimi.id.vn</span>"
            </blockquote>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
                H
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Hoàng Nguyễn</p>
                <p className="text-white/50 text-xs">Founder, HoangSneaker</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: '2,400+', label: 'Active stores' },
              { val: '₫12B+', label: 'Revenue processed' },
              { val: '99.9%', label: 'Uptime SLA' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 border border-white/10"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="text-white font-bold text-lg leading-none"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {s.val}
                </div>
                <div className="text-white/40 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: form ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F8F9FA]">
        <div className="w-full max-w-[440px] animate-[fadeIn_0.4s_ease-out]">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-xl text-[#1A1D23]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              vimi
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-[#1A1D23] mb-1.5"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Welcome back
              </h1>
              <p className="text-sm text-[#6B7280]">
                Sign in to manage your stores and products.
              </p>
            </div>

            {/* Global error */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100
                              text-sm text-red-600 font-medium flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">⚠</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Field
                label="Email Address"
                type="email"
                icon={Mail}
                value={email}
                onChange={(v) => { setEmail(v); setFieldErrs(p => ({ ...p, email: '' })); }}
                placeholder="you@example.com"
                error={fieldErrs.email}
              />

              <Field
                label="Password"
                type={showPw ? 'text' : 'password'}
                icon={Lock}
                value={password}
                onChange={(v) => { setPassword(v); setFieldErrs(p => ({ ...p, password: '' })); }}
                placeholder="••••••••"
                error={fieldErrs.password}
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors flex-shrink-0"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              <div className="flex justify-end">
                <button type="button"
                  className="text-xs font-semibold hover:underline"
                  style={{ color: '#8B3DFF' }}>
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={clsx(
                  'w-full h-12 rounded-xl font-semibold text-sm text-white',
                  'flex items-center justify-center gap-2',
                  'transition-all duration-200',
                  loading
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]',
                )}
                style={{ background: 'linear-gradient(135deg, #8B3DFF 0%, #6B20EF 100%)',
                         boxShadow: loading ? 'none' : '0 4px 14px rgba(139,61,255,0.35)' }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#9CA3AF]">
              Don't have an account?{' '}
              <button
                onClick={onGoRegister}
                className="font-semibold hover:underline"
                style={{ color: '#8B3DFF' }}
              >
                Create one free
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
