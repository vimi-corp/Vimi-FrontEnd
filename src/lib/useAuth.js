import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { auth as authApi, tokenStore } from './api.js';

// ---------------------------------------------------------------------------
// AuthContext — provides { user, loading, login, register, logout } to the
// entire merchant dashboard tree. Storefront does not use this context.
// ---------------------------------------------------------------------------
export const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export const useAuthProvider = () => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true on first mount

  // On mount — try to restore session from stored access token
  useEffect(() => {
    const restore = async () => {
      if (!tokenStore.get()) { setLoading(false); return; }
      try {
        const { data } = await authApi.me();
        setUser(data.user);
      } catch {
        tokenStore.clear();
      } finally {
        setLoading(false);
      }
    };
    restore();

    // Listen for forced logout (token expired + refresh failed)
    const handler = () => { setUser(null); tokenStore.clear(); };
    window.addEventListener('vimi:logout', handler);
    return () => window.removeEventListener('vimi:logout', handler);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({ email, password });
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (email, password, full_name) => {
    const { data } = await authApi.register({ email, password, fullName: full_name });
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return { user, loading, login, register, logout };
};
