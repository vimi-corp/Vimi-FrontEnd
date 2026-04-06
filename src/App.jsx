import React, { Suspense, lazy } from 'react';
import { getSubdomain, isTenantDomain } from '@/lib/subdomain';

// ── Lazy-load both app shells to keep initial bundle minimal ─────────────
// MainDashboard: the full Canva-style merchant platform  (vimi.id.vn)
// StorefrontRouter: the per-merchant public store shell  (*.vimi.id.vn)
const MainDashboard   = lazy(() => import('@/layouts/DashboardLayout'));
const StorefrontRouter = lazy(() => import('@/pages/StorefrontRouter'));

// ── Full-screen loader shown during lazy import ──────────────────────────
const AppLoader = () => (
  <div className="fixed inset-0 bg-surface-page flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      {/* Animated Vimi wordmark */}
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-btn-primary shadow-purple-glow
                        flex items-center justify-center animate-pulse-soft">
          <span className="font-display font-black text-white text-2xl tracking-tight">V</span>
        </div>
        {/* Spinning ring */}
        <div className="absolute -inset-1 rounded-[18px] border-2 border-canva-purple/30
                        border-t-canva-purple animate-spin" />
      </div>
      <p className="text-ink-muted text-sm font-medium tracking-wide animate-fade-in">
        Loading Vimi…
      </p>
    </div>
  </div>
);

// ── Root App ─────────────────────────────────────────────────────────────
export default function App() {
  // This is evaluated once on mount. Subdomain routing is URL-driven, so a
  // re-render won't change it — no need for state.
  const subdomain = getSubdomain();
  const isTenant  = isTenantDomain();

  return (
    <Suspense fallback={<AppLoader />}>
      {isTenant ? (
        // ── Storefront shell: renders the public-facing merchant store
        <StorefrontRouter subdomain={subdomain} />
      ) : (
        // ── Merchant dashboard: the full Canva-style SaaS platform
        <MainDashboard />
      )}
    </Suspense>
  );
}
