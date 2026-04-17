import React, { Suspense, lazy } from 'react';
import { getSubdomain, isTenantDomain } from './lib/subdomain';
import { AuthContext, useAuthProvider } from './lib/useAuth';
import AuthGate                         from './components/AuthGate';
import VerifyEmail                      from './pages/VerifyEmail';
import { Routes, Route, Navigate }      from 'react-router-dom';

const MainDashboard    = lazy(() => import('./components/DashboardLayout'));
const StorefrontRouter = lazy(() => import('./components/StoreFrontRouter'));
const TemplateGallery  = lazy(() => import('./pages/onboarding/TemplateGallery'));
const CustomizeWizard  = lazy(() => import('./pages/onboarding/CustomizeWizard'));
const PricingPage      = lazy(() => import('./pages/Pricing'));
const ForgotPassword   = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword    = lazy(() => import('./pages/auth/ResetPassword'));
const OAuth2Callback   = lazy(() => import('./pages/auth/OAuth2Callback'));

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
        <Routes>
          <Route path="/verify"                element={<VerifyEmail />} />
          <Route path="/pricing"                element={<PricingPage />} />
          <Route path="/forgot-password"        element={<ForgotPassword />} />
          <Route path="/reset-password"         element={<ResetPassword />} />
          <Route path="/auth/oauth2/callback"   element={<OAuth2Callback />} />
          <Route path="/*" element={
            <AuthProvider>
              <AuthGate>
                <Routes>
                  <Route path="/onboarding" element={<TemplateGallery />} />
                  <Route path="/onboarding/templates" element={<TemplateGallery />} />
                  <Route path="/onboarding/customize/:templateId" element={<CustomizeWizard />} />
                  <Route path="/dashboard/*" element={<MainDashboard />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AuthGate>
            </AuthProvider>
          } />
        </Routes>
      )}
    </Suspense>
  );
}
