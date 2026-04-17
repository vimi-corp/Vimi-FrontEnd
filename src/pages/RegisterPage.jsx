import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import clsx from 'clsx';

// Custom CSS for animations and image backgrounds
const customStyles = `
  @keyframes float1 {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-40px) scale(1.05); }
  }
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
    33% { transform: translate(25px, -30px) scale(1.1) rotate(5deg); }
    66% { transform: translate(-20px, 20px) scale(0.95) rotate(-5deg); }
  }
  @keyframes float3 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(30px) rotate(15deg); }
  }
  .particle-1 { animation: float1 18s ease-in-out infinite; }
  .particle-2 { animation: float2 22s ease-in-out infinite; }
  .particle-3 { animation: float3 15s ease-in-out infinite; }
  
  .bg-purple-blur {
    background-image: url('/images/purple-blur.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

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

  return (
    <div className="mt-2 space-y-2 px-1">
      {/* Bars */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={clsx(
              'h-1.5 flex-1 rounded-full transition-colors duration-300',
              i < s ? colors[s - 1] : 'bg-slate-200/60',
            )}
          />
        ))}
      </div>
      {/* Rules */}
      <div className="grid grid-cols-3 gap-1">
        {PW_RULES.map(rule => (
          <div key={rule.label}
            className={clsx(
              'flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-wide transition-colors',
              rule.test(password) ? 'text-emerald-600' : 'text-slate-400',
            )}>
            <div className={clsx(
              'w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
              rule.test(password) ? 'bg-emerald-100' : 'bg-slate-100',
            )}>
              {rule.test(password) && <Check size={10} className="text-emerald-600" strokeWidth={3} />}
            </div>
            <span className="leading-tight">{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reusable input field ──────────────────────────────────────────────────
function Field({ label, type = 'text', icon: Icon, value, onChange, placeholder, error, rightEl }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[13px] font-bold text-slate-700 uppercase tracking-wide">{label}</label>
      <div className={clsx(
        'flex items-center gap-3 px-4 h-14 rounded-2xl border bg-white/60 backdrop-blur-md transition-all duration-300 shadow-sm',
        error
          ? 'border-red-300 ring-4 ring-red-500/10'
          : 'border-slate-200/80 hover:border-slate-300 hover:bg-white focus-within:border-[#8B3DFF] focus-within:ring-4 focus-within:ring-[#8B3DFF]/15 focus-within:bg-white',
      )}>
        {Icon && <Icon size={18} className="flex-shrink-0 text-slate-400" />}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-[15px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal
                     bg-transparent outline-none min-w-0"
        />
        {rightEl}
      </div>
      {error && <p className="text-sm text-red-500 font-medium px-1">{error}</p>}
    </div>
  );
}

// ── Register Page ─────────────────────────────────────────────────────────
export default function RegisterPage({ onRegister, onLogin, onLoginDemo, onGoLogin }) {
  const [fullName,  setFullName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState('');
  const [fieldErrs, setFieldErrs] = useState({});

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const clearFieldErr = (field) => setFieldErrs(p => ({ ...p, [field]: '' }));

  const validate = () => {
    const errs = {};
    const trimmedEmail = email.trim();
    if (!fullName.trim() || fullName.trim().length < 2)
      errs.fullName = 'Full name must be at least 2 characters';
    if (!trimmedEmail || !EMAIL_RE.test(trimmedEmail))
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
      <div className="h-screen overflow-hidden flex items-center justify-center bg-[#FAFAFC] p-6 relative"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{customStyles}</style>

        {/* Animated Particles / Floating Shapes */}
        <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-purple-300/30 mix-blend-multiply blur-3xl particle-1 pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-indigo-200/30 mix-blend-multiply blur-3xl particle-2 pointer-events-none" />

        <div className="relative bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(139,61,255,0.08)] border border-white/60 p-10 max-w-[440px] w-full text-center z-10">
          <div className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl"
            style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
            <Check size={36} className="text-white" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Account created!
          </h2>
          <p className="text-base text-slate-500 font-medium leading-relaxed mb-8">
            We've sent a verification link to{' '}
            <span className="font-bold text-slate-800">{email}</span>.
            Check your inbox and click the link to activate your account.
          </p>
          <button
            onClick={onGoLogin}
            className="w-full h-14 rounded-2xl text-[15px] font-bold text-white tracking-wide transition-all hover:opacity-95 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #8B3DFF, #6B20EF)', boxShadow: '0 10px 25px -5px rgba(139,61,255,0.4)' }}
          >
            Go to Login Let's Go
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex font-sans w-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{customStyles}</style>

      {/* ── Left panel: branding ─────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[520px] flex-shrink-0 p-14 relative overflow-hidden bg-purple-blur">
        {/* Dark overlay to make text readable over the bright pastel gradient generated image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#130528]/95 via-[#1E0848]/85 to-[#8B3DFF]/40 z-0 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[#081830]/40 z-0" />
        
        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-xl overflow-hidden p-1">
               <img src="/favicon.svg" alt="Vimi Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-bold text-3xl tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              vimi
            </span>
          </div>

          {/* Testimonial */}
          <div className="mb-auto mt-20">
             <h2 className="text-white font-black text-4xl mb-6 leading-tight tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Start Your
              <br/>
              <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)', WebkitBackgroundClip: 'text' }}> Empire</span>
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed font-light tracking-wide max-w-sm">
              Build your online store in minutes. No code required.
            </p>

            <div className="space-y-6">
              {[
                { icon: '🏪', title: 'Your own storefront',   sub: 'yourname.vimi.id.vn — live instantly' },
                { icon: '🎨', title: 'Full design control',   sub: 'Colors, fonts, logo — all yours' },
                { icon: '🤖', title: 'AI Trimi assistant',     sub: 'Write product descriptions in seconds' },
              ].map(f => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/5 flex items-center justify-center text-lg flex-shrink-0">
                     {f.icon}
                  </div>
                  <div>
                    <div className="text-white text-base font-bold">{f.title}</div>
                    <div className="text-white/60 text-sm font-medium mt-0.5">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: form ────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6 bg-[#FAFAFC] overflow-y-auto no-scrollbar">
        
        {/* Animated Particles / Floating Shapes */}
        <div className="fixed top-[10%] right-[15%] w-72 h-72 rounded-full bg-purple-300/30 mix-blend-multiply blur-3xl particle-1 pointer-events-none" />
        <div className="fixed bottom-[20%] left-[10%] w-80 h-80 rounded-full bg-indigo-200/30 mix-blend-multiply blur-3xl particle-2 pointer-events-none" />
        <div className="fixed top-[45%] right-[35%] w-56 h-56 rounded-full bg-fuchsia-200/20 mix-blend-multiply blur-3xl particle-3 pointer-events-none" />

        <div className="relative w-full max-w-[480px] animate-[fadeIn_0.5s_ease-out] z-10 py-6">
          
          {/* Overlay Image Behind Form for Depth */}
          <div className="absolute -inset-10 bg-purple-blur opacity-40 blur-3xl rounded-full z-0 pointer-events-none"></div>

          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden relative z-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-xl overflow-hidden p-1"
                 style={{ border: '1px solid rgba(139,61,255,0.2)' }}>
              <img src="/favicon.svg" alt="Vimi Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-3xl text-slate-800 tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              vimi
            </span>
          </div>

          <div className="relative z-10 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(139,61,255,0.08)] border border-white/60 p-8 sm:p-10">
            <div className="mb-6 text-center sm:text-left">
              <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Create account
              </h1>
              <p className="text-base text-slate-500 font-medium">
                Free forever. No credit card required.
              </p>
            </div>

            {/* Global error */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100/50
                              text-sm text-red-600 font-semibold flex items-center gap-3 shadow-sm">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-100 rounded-xl">⚠</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Field
                label="Full Name"
                icon={User}
                value={fullName}
                onChange={(v) => { setFullName(v); clearFieldErr('fullName'); }}
                placeholder="Jane Doe"
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

              <div className="pb-1">
                <Field
                  label="Password"
                  type={showPw ? 'text' : 'password'}
                  icon={Lock}
                  value={password}
                  onChange={(v) => { setPassword(v); clearFieldErr('password'); }}
                  placeholder="Create a strong password"
                  error={fieldErrs.password}
                  rightEl={
                    <button
                      type="button"
                      onClick={() => setShowPw(p => !p)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                <PasswordStrength password={password} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={clsx(
                  'w-full h-14 mt-6 rounded-2xl font-bold text-[15px] text-white tracking-wide',
                  'flex items-center justify-center gap-2',
                  'transition-all duration-300',
                  loading
                    ? 'opacity-70 cursor-wait'
                    : 'hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0',
                )}
                style={{ background: 'linear-gradient(135deg, #8B3DFF 0%, #6B20EF 100%)',
                         boxShadow: loading ? 'none' : '0 10px 25px -5px rgba(139,61,255,0.4)' }}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  <>Create Account <ArrowRight size={18} strokeWidth={2.5} /></>
                )}
              </button>

              <button
                type="button"
                onClick={() => onLoginDemo()}
                className="w-full h-12 mt-2 rounded-2xl font-bold text-[14px] border-2 border-slate-200 text-slate-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-all"
              >
                ✨ Try Demo
              </button>
            </form>

            {/* ── OAuth2 divider ────────────────────────────────────── */}
            <div className="relative my-6 flex items-center">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="mx-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* ── Google button ────────────────────────────────────── */}
            <a
              href="/api/oauth2/authorization/google"
              onClick={e => { window.location.href = '/api/oauth2/authorization/google'; e.preventDefault(); }}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-200
                         bg-white hover:bg-slate-50 hover:border-slate-300
                         text-slate-700 font-semibold text-sm transition-all duration-200
                         shadow-sm hover:shadow active:-translate-y-px"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.22 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-3.72-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign up with Google
            </a>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-[15px] font-medium text-slate-500">
                Already have an account?{' '}
                <button
                  onClick={onGoLogin}
                  className="font-bold hover:opacity-80 transition-opacity ml-1"
                  style={{ color: '#8B3DFF' }}
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
