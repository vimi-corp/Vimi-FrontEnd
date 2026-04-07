import React, { Suspense, lazy, createContext } from 'react';
import { getSubdomain, isTenantDomain } from '@/lib/subdomain';
import { AuthContext, useAuthProvider }  from '@/hooks/useAuth';
import AuthGate                          from '@/pages/auth/AuthGate';

const MainDashboard    = lazy(() => import('@/layouts/DashboardLayout'));
const StorefrontRouter = lazy(() => import('@/pages/StorefrontRouter'));

const AppLoader = () => (
  <div className="fixed inset-0 bg-[#F8F9FA] flex items-center justify-center">
    <div className="relative">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
        <span className="font-bold text-white text-2xl"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>V</span>
      </div>
      <div className="absolute -inset-1 rounded-[18px] border-2 border-[#8B3DFF]/30 border-t-[#8B3DFF] animate-spin" />
    </div>
  </div>
);

// AuthProvider wraps the entire merchant dashboard tree
function AuthProvider({ children }) {
  const authValue = useAuthProvider();
  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default function App() {
  const subdomain = getSubdomain();
  const isTenant  = isTenantDomain();

  return (
    <Suspense fallback={<AppLoader />}>
      {isTenant ? (
        // Public storefront — no auth required
        <StorefrontRouter subdomain={subdomain} />
      ) : (
        // Merchant dashboard — auth required
        <AuthProvider>
          <AuthGate>
            <MainDashboard />
          </AuthGate>
        </AuthProvider>
      )}
    </Suspense>
  );
}
