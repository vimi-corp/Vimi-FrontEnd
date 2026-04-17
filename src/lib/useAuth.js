import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import api, { auth as authApi, tokenStore } from './api.js';

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
  const [stores,  setStores]  = useState([]);
  const [activeStore, setActiveStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const DEMO_STORE = {
    id: 'demo_store_1',
    name: 'Demo Store',
    subdomain: 'demo-store',
    subscriptionStatus: 'ACTIVE',
    plan: 'BUSINESS',
    trialEndsAt: null,
    autoRenew: true,
  };
  const DEMO_USER = {
    id: 'demo_user_1',
    email: 'demo@vimi.com',
    role: 'ROLE_MERCHANT',
    verified: true,
    fullName: 'Demo User',
  };

  // On mount — try to restore session from stored access token
  useEffect(() => {
    const restore = async () => {
      if (import.meta.env.VITE_ENABLE_AUTH_BYPASS === 'true') {
        const mockUser = {
          id: 'dev_bypass_id',
          email: 'admin@bypass.local',
          fullName: 'Development Admin',
          role: 'ADMIN',
          verified: true,
          storeId: 'store_dev_1'
        };
        tokenStore.set('mock_jwt_token_for_dev_bypass');
        setUser(mockUser);
        setActiveStore({ id: 'store_dev_1', name: 'Dev Bypass Store', subscriptionStatus: 'ACTIVE' });
        setStores([{ id: 'store_dev_1', name: 'Dev Bypass Store', subscriptionStatus: 'ACTIVE' }]);
        setLoading(false);
        return;
      }

      // Restore demo mode session (no API needed)
      if (localStorage.getItem('vimi_demo_mode') === 'true') {
        setUser(DEMO_USER);
        setStores([DEMO_STORE]);
        setActiveStore(DEMO_STORE);
        setLoading(false);
        return;
      }

      if (!tokenStore.get()) { setLoading(false); return; }
      try {
        const { data } = await authApi.me();
        setUser(data.user);
        
        // Load stores
        const storesRes = await api.getUserStores();
        if (storesRes.data && storesRes.data.length > 0) {
            setStores(storesRes.data);
            setActiveStore(storesRes.data[0]);
        }
      } catch {
        tokenStore.clear();
      } finally {
        setLoading(false);
      }
    };
    restore();

    const handler = () => { setUser(null); setStores([]); setActiveStore(null); tokenStore.clear(); };
    window.addEventListener('vimi:logout', handler);
    return () => window.removeEventListener('vimi:logout', handler);
  }, []);

  const loginAsDemo = useCallback(() => {
    localStorage.setItem('vimi_demo_mode', 'true');
    // Don't set vimi_template_selected — let user pick a template first
    setUser(DEMO_USER);
    setStores([DEMO_STORE]);
    setActiveStore(DEMO_STORE);
  }, []);

  const login = useCallback(async (email, password, rememberMe = false) => {
    const { data } = await authApi.login({ email, password, rememberMe });
    setUser(data.user);
    // Reload page to re-trigger complete fetch logic gracefully
    window.location.reload();
    return data.user;
  }, []);

  const register = useCallback(async (email, password, full_name) => {
    const { data } = await authApi.register({ email, password, fullName: full_name });
    return data;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('vimi_demo_mode');
    localStorage.removeItem('vimi_template_selected');
    await authApi.logout().catch(() => {});
    setUser(null);
    setStores([]);
    setActiveStore(null);
    window.location.reload(); // clear cache safely
  }, []);

  const switchStore = useCallback(async (storeId) => {
    try {
        const res = await api.switchStore(storeId);
        tokenStore.set(res.data.access_token);
        window.location.reload(); // Refresh the app context cleanly
    } catch (err) {
        console.error("Failed to switch store", err);
    }
  }, []);

  return { user, stores, activeStore, loading, login, loginAsDemo, register, logout, switchStore };
};
