import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { tokenStore } from '../../lib/api';

/**
 * Landing page for the OAuth2 redirect.
 * Spring Boot redirects here as:
 *   http://localhost:5173/auth/oauth2/callback?token=<jwt>
 *
 * This component:
 *   1. Reads the token from the query string.
 *   2. Stores it via tokenStore (same as normal login).
 *   3. Navigates to /dashboard (or /onboarding if first-time).
 */
export default function OAuth2Callback() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const err   = searchParams.get('error');

    if (err || !token) {
      setError(err === 'oauth_no_email'
        ? 'Google did not share your email address. Please allow email access and try again.'
        : 'OAuth2 login failed. Please try again.');
      return;
    }

    // Persist the JWT — same mechanism as email/password login
    tokenStore.set(token);

    // Hard reload so AuthProvider re-runs /api/auth/me and hydrates user state
    window.location.replace('/dashboard');
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4"
           style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-6">⚠️</div>
          <h1 className="text-xl font-black text-slate-800 mb-3">Sign-in failed</h1>
          <p className="text-slate-500 text-sm mb-8">{error}</p>
          <a href="/login"
             className="inline-block px-6 py-3 rounded-2xl bg-[#8B3DFF] text-white font-bold text-sm hover:opacity-90 transition-opacity">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
             style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Signing you in…</p>
      </div>
    </div>
  );
}
