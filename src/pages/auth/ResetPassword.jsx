import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from '../../lib/api';
import clsx from 'clsx';

const PW_RULES = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: 'One uppercase letter',  test: p => /[A-Z]/.test(p) },
  { label: 'One number',            test: p => /[0-9]/.test(p) },
];

export default function ResetPassword() {
  const [searchParams]           = useSearchParams();
  const navigate                 = useNavigate();
  const token                    = searchParams.get('token') ?? '';

  const [password,   setPassword]   = useState('');
  const [confirm,    setConfirm]    = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [showCfm,    setShowCfm]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState('');

  const passedRules = PW_RULES.filter(r => r.test(password)).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (passedRules < 3) { setError('Please meet all password requirements.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (!token) { setError('Invalid or missing reset token.'); return; }
    setLoading(true);
    try {
      await auth.resetPassword({ token, newPassword: password });
      setDone(true);
    } catch (err) {
      setError(err.message ?? 'Reset link may have expired. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  const PasswordField = ({ label, value, onChange, show, onToggle }) => (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div className="flex items-center gap-3 px-4 h-12 rounded-xl border-2 border-slate-200
                      focus-within:border-[#8B3DFF]/60 focus-within:ring-4 focus-within:ring-[#8B3DFF]/10
                      transition-all bg-slate-50">
        <Lock size={17} className="text-slate-400 shrink-0" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="••••••••"
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
        />
        <button type="button" onClick={onToggle}
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors rounded-lg">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0E8FF] via-[#F8F9FA] to-[#E0FAFB] px-4"
         style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#8B3DFF]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#00C4CC]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.08)] border border-slate-100/60 p-10">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                 style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
              <img src="/favicon.svg" alt="Vimi" className="w-8 h-8 object-contain"
                   style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
          </div>

          {!token ? (
            <div className="text-center">
              <AlertCircle size={44} className="text-red-400 mx-auto mb-4" strokeWidth={1.5} />
              <h1 className="text-xl font-black text-slate-800 mb-2">Invalid Link</h1>
              <p className="text-slate-500 text-sm mb-6">This reset link is invalid or has expired.</p>
              <Link to="/forgot-password" className="font-bold text-[#8B3DFF] hover:opacity-80 text-sm">
                Request a new link →
              </Link>
            </div>
          ) : done ? (
            <div className="text-center">
              <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" strokeWidth={1.5} />
              <h1 className="text-2xl font-black text-slate-800 mb-2">Password updated!</h1>
              <p className="text-slate-500 text-sm mb-8">Your password has been reset. You can now sign in.</p>
              <button onClick={() => navigate('/login')}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #8B3DFF, #6B20EF)', boxShadow: '0 10px 25px -5px rgba(139,61,255,0.4)' }}>
                Sign In <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-slate-800 mb-1 text-center">Set new password</h1>
              <p className="text-center text-slate-500 text-sm mb-8">Choose a strong password for your account.</p>

              {error && (
                <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600 font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <PasswordField label="New Password" value={password} onChange={setPassword}
                               show={showPw} onToggle={() => setShowPw(p => !p)} />

                {/* Strength indicators */}
                {password && (
                  <ul className="space-y-1.5 pl-1">
                    {PW_RULES.map(rule => (
                      <li key={rule.label} className={clsx(
                        'flex items-center gap-2 text-xs font-medium transition-colors',
                        rule.test(password) ? 'text-emerald-600' : 'text-slate-400')}>
                        <span className={clsx('w-1.5 h-1.5 rounded-full',
                          rule.test(password) ? 'bg-emerald-500' : 'bg-slate-300')} />
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                )}

                <PasswordField label="Confirm Password" value={confirm} onChange={setConfirm}
                               show={showCfm} onToggle={() => setShowCfm(p => !p)} />

                <button
                  type="submit"
                  disabled={loading}
                  className={clsx(
                    'w-full py-3.5 rounded-2xl font-bold text-[15px] text-white tracking-wide mt-2',
                    'flex items-center justify-center gap-2 transition-all duration-300',
                    loading ? 'opacity-70 cursor-wait' : 'hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0',
                  )}
                  style={{ background: 'linear-gradient(135deg, #8B3DFF 0%, #6B20EF 100%)',
                           boxShadow: loading ? 'none' : '0 10px 25px -5px rgba(139,61,255,0.4)' }}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <>Reset Password <ArrowRight size={18} strokeWidth={2.5} /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
