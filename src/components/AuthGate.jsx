import React, { useState } from 'react';
import LoginPage    from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { useAuth }  from '../lib/useAuth';

// ── Full-screen auth spinner ──────────────────────────────────────────────
const AuthLoader = () => (
  <div className="fixed inset-0 bg-[#F8F9FA] flex items-center justify-center">
    <div className="relative">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
        <span className="font-bold text-white text-2xl"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>V</span>
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
  const { user, loading, login, register } = useAuth();
  const [view, setView] = useState('login'); // 'login' | 'register'

  if (loading) return <AuthLoader />;

  if (!user) {
    if (view === 'register') {
      return (
        <RegisterPage
          onRegister={register}
          onGoLogin={() => setView('login')}
        />
      );
    }
    return (
      <LoginPage
        onLogin={login}
        onGoRegister={() => setView('register')}
      />
    );
  }

  return children;
}
