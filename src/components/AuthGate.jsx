import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginPage    from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { useAuth }  from '../lib/useAuth';

// ── Full-screen auth spinner ──────────────────────────────────────────────
const AuthLoader = () => (
  <div className="fixed inset-0 bg-[#F8F9FA] flex items-center justify-center">
    <div className="relative">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center p-2"
        style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
        <img src="/favicon.svg" alt="Vimi" className="w-full h-full object-contain" />
      </div>
      <div className="absolute -inset-1 rounded-[18px] border-2 border-[#8B3DFF]/30
                      border-t-[#8B3DFF] animate-spin" />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// AuthGate — renders children (the full dashboard) only when authenticated.
// Provides login ↔ register navigation without a router.
// ---------------------------------------------------------------------------
export default function AuthGate({ children }) {
  const { user, activeStore, loading, login, loginAsDemo, register } = useAuth();
  const [view, setView] = useState('login'); // 'login' | 'register'
  const navigate  = useNavigate();
  const location  = useLocation();

  if (loading) return <AuthLoader />;

  const bypassEnabled = import.meta.env.VITE_ENABLE_AUTH_BYPASS === 'true';

  if (!user) {
    if (view === 'register') {
      return (
        <RegisterPage
          onRegister={register}
          onLogin={login}
          onLoginDemo={loginAsDemo}
          onGoLogin={() => setView('login')}
        />
      );
    }
    return (
      <LoginPage
        onLogin={login}
        onLoginDemo={loginAsDemo}
        onGoRegister={() => setView('register')}
      />
    );
  }

  // ── Template-selection gate ───────────────────────────────────────────────
  // If the user hasn't chosen a template yet, send them to the gallery first.
  // Skip when they are already on the onboarding route to avoid infinite loops.
  const hasStore         = !!activeStore;
  const templateSelected = bypassEnabled || hasStore || !!localStorage.getItem('vimi_template_selected');
  const isOnboarding     = location.pathname.startsWith('/onboarding');

  if (!templateSelected && !isOnboarding) {
    navigate('/onboarding', { replace: true });
    return null;
  }

  return (
    <>
      {/* 
      {bypassEnabled && (
        <div className="fixed top-0 inset-x-0 z-[9999] bg-yellow-400 text-yellow-900 text-xs font-bold py-1.5 text-center shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
          ⚠ AUTH BYPASS ENABLED - FOR DEVELOPMENT ONLY
        </div>
      )}
      */}
      {children}
    </>
  );
}
