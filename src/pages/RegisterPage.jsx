import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Zap, Check } from 'lucide-react';
import clsx from 'clsx';

// ── Password strength indicator ───────────────────────────────────────────
const PW_RULES = [
  { label: 'At least 8 characters',     test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',       test: (p) => /[A-Z]/.test(p) },
  { label: 'One number',                 test: (p) => /[0-9]/.test(p) },
];

const strength = (pw) => PW_RULES.filter(r => r.test(pw)).length;

function PasswordStrength({ password }) {
  if (!password) return null;
  const s = strength(password);
  const colors = ['bg-red-400', 'bg-amber-400', 'bg-emerald-400'];
  const labels = ['Weak', 'Fair', 'Strong'];

  return (
    <div className="mt-2 space-y-2">
      {/* Bars */}
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={clsx(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i < s ? colors[s - 1] : 'bg-[#E2E8F0]',
            )}
          />
        ))}
      </div>
      {/* Rules */}
      <div className="grid grid-cols-3 gap-1">
        {PW_RULES.map(rule => (
          <div key={rule.label}
            className={clsx(
              'flex items-center gap-1 text-[10px] font-medium transition-colors',
              rule.test(password) ? 'text-emerald-600' : 'text-[#9CA3AF]',
            )}>
            <div className={clsx(
              'w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0',
              rule.test(password) ? 'bg-emerald-100' : 'bg-[#E2E8F0]',
            )}>
              {rule.test(password) && <Check size={8} className="text-emerald-600" strokeWidth={3} />}
            </div>
            <span className="leading-tight">{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, type = 'text', icon: Icon, value, onChange, placeholder, error, rightEl, hint }) {
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
      {error  && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-[#9CA3AF]">{hint}</p>}
    </div>
  );
}

// ── Register Page ─────────────────────────────────────────────────────────
export default function RegisterPage({ onRegister, onGoLogin }) {
  const [fullName,  setFullName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState('');
  const [fieldErrs, setFieldErrs] = useState({});

  const clearFieldErr = (field) => setFieldErrs(p => ({ ...p, [field]: '' }));

  const validate = () => {
    const errs = {};
    if (!fullName.trim() || fullName.trim().length < 2)
      errs.fullName = 'Full name must be at least 2 characters';
    if (!email || !/\S+@\S+\.\S+/.test(email))
      errs.email = 'Enter a valid email address';
    if (!password || strength(password) < 2)
      errs.password = 'Password is too weak — meet at least 2 requirements';
    setFieldErrs(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await onRegister(email.toLowerCase(), password, fullName.trim());
      setSuccess(true);
    } catch (err) {
      setError(err.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)]
                        p-10 max-w-[400px] w-full text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
            <Check size={28} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-[#1A1D23] mb-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Account created!
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
            We've sent a verification link to{' '}
            <span className="font-semibold text-[#2D3748]">{email}</span>.
            Check your inbox and click the link to activate your account.
          </p>
          <button
            onClick={onGoLogin}
            className="w-full h-11 rounded-xl text-sm font-semibold text-white
                       transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #8B3DFF, #6B20EF)' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Left panel ───────────────────────────────────────────────── */}
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

        {/* Feature list */}
        <div>
          <h2 className="text-white font-bold text-3xl mb-3 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Start Your
            <span style={{
              background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}> Empire</span>
          </h2>
          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            Build your online store in minutes. No code required.
          </p>

          <div className="space-y-4">
            {[
              { icon: '🏪', title: 'Your own storefront',   sub: 'yourname.vimi.id.vn — live instantly' },
              { icon: '🎨', title: 'Full design control',   sub: 'Colors, fonts, logo — all yours' },
              { icon: '📦', title: 'Unlimited products',    sub: 'On Pro plan — upgrade anytime' },
              { icon: '📊', title: 'Built-in analytics',    sub: 'Revenue, orders, visitors at a glance' },
              { icon: '🤖', title: 'AI Trimi assistant',     sub: 'Write product descriptions in seconds' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <div className="text-white text-sm font-semibold">{f.title}</div>
                  <div className="text-white/50 text-xs mt-0.5">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="mt-8 flex items-center gap-3 pt-6 border-t border-white/10">
            <div className="flex -space-x-2">
              {['H', 'T', 'A', 'M'].map((l, i) => (
                <div key={i}
                  className="w-7 h-7 rounded-full border-2 border-[#1E0848] flex items-center
                             justify-center text-xs font-bold text-white"
                  style={{ background: `hsl(${i * 70 + 260}, 80%, 55%)` }}>
                  {l}
                </div>
              ))}
            </div>
            <p className="text-white/60 text-xs">
              <span className="text-white font-semibold">2,400+ merchants</span> already building
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel: form ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F8F9FA]">
        <div className="w-full max-w-[440px]">

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
                Create your account
              </h1>
              <p className="text-sm text-[#6B7280]">
                Free forever. No credit card required.
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
                label="Full Name"
                icon={User}
                value={fullName}
                onChange={(v) => { setFullName(v); clearFieldErr('fullName'); }}
                placeholder="Your full name"
                error={fieldErrs.fullName}
              />

              <Field
                label="Email Address"
                type="email"
                icon={Mail}
                value={email}
                onChange={(v) => { setEmail(v); clearFieldErr('email'); }}
                placeholder="you@example.com"
                error={fieldErrs.email}
              />

              <div>
                <Field
                  label="Password"
                  type={showPw ? 'text' : 'password'}
                  icon={Lock}
                  value={password}
                  onChange={(v) => { setPassword(v); clearFieldErr('password'); }}
                  placeholder="Create a strong password"
                  error={fieldErrs.password}
                  rightEl={
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors flex-shrink-0">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                <PasswordStrength password={password} />
              </div>

              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                By creating an account you agree to our{' '}
                <a href="#" className="underline hover:text-[#6B7280]">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="underline hover:text-[#6B7280]">Privacy Policy</a>.
              </p>

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
                style={{
                  background: 'linear-gradient(135deg, #8B3DFF 0%, #00C4CC 100%)',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(139,61,255,0.35)',
                }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#9CA3AF]">
              Already have an account?{' '}
              <button onClick={onGoLogin}
                className="font-semibold hover:underline" style={{ color: '#8B3DFF' }}>
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
