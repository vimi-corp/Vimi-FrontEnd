import React, { useEffect, useState } from 'react';
import { CreditCard, ShoppingBag, Eye, TrendingUp, Unlock, Zap, Globe, Palette, BarChart3, Headphones, Users, Code2, Check, Crown, Star } from 'lucide-react';
import { dashboard } from '../../lib/api';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

const MetricCard = ({ title, value, detail, icon: Icon }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
           style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1 text-green-600 font-semibold text-xs bg-green-50 px-2 py-1 rounded-md border border-green-100">
        <TrendingUp size={14} /> +12%
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-semibold tracking-wide uppercase">{title}</h3>
    <p className="text-3xl font-bold text-slate-800 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
    {detail && <p className="text-xs text-slate-400 mt-1.5 font-medium">{detail}</p>}
  </div>
);

// ── Plan feature definitions ──────────────────────────────────────────────────
const PLAN_FEATURES = {
  premium: {
    label: 'Premium',
    icon: Star,
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    features: [
      { icon: Globe,      text: 'Unlimited products',               key: 'unlimited_products' },
      { icon: Palette,    text: 'Vimi branding removed',            key: 'no_branding' },
      { icon: Globe,      text: '3 storefronts with custom domains',key: 'multi_domains' },
      { icon: BarChart3,  text: 'Advanced analytics & reports',     key: 'adv_analytics' },
      { icon: Headphones, text: 'Priority email & chat support',    key: 'priority_support' },
      { icon: Palette,    text: 'All premium templates',            key: 'premium_tpls' },
      { icon: Zap,        text: 'Discount codes & coupon tools',    key: 'coupons' },
    ],
  },
  business: {
    label: 'Business',
    icon: Crown,
    gradient: 'linear-gradient(135deg, #111, #1e1e1e)',
    features: [
      { icon: Globe,      text: 'Unlimited storefronts',            key: 'unlimited_stores' },
      { icon: Palette,    text: 'White-label solution',             key: 'white_label' },
      { icon: Users,      text: 'Multi-user team access (up to 10)',key: 'team_access' },
      { icon: Headphones, text: 'Dedicated account manager',        key: 'account_mgr' },
      { icon: Code2,      text: 'Custom integrations & API access', key: 'api_access' },
      { icon: BarChart3,  text: 'Advanced inventory management',    key: 'adv_inventory' },
      { icon: Globe,      text: 'Multi-currency & region support',  key: 'multi_currency' },
    ],
  },
};

function UnlockedFeaturesPanel({ theme }) {
  const plan = PLAN_FEATURES[theme];
  if (!plan) return null;

  const PlanIcon = plan.icon;
  const isBusiness = theme === 'business';

  return (
    <div
      className="rounded-2xl border overflow-hidden animate-fade-in"
      style={{
        background: isBusiness ? '#111' : 'linear-gradient(135deg, #f5f0ff 0%, #faf7ff 100%)',
        borderColor: isBusiness ? '#1e1e1e' : '#ddd6fe',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{
          background: plan.gradient,
          borderBottom: isBusiness ? '1px solid #1e1e1e' : '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <PlanIcon size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {plan.label} Features Unlocked
            </p>
            <p className="text-white/60 text-xs font-medium">
              {plan.features.length} features active on your account
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
          <Unlock size={12} className="text-white/80" />
          <span className="text-white/80 text-xs font-bold uppercase tracking-wide">Active</span>
        </div>
      </div>

      {/* Feature grid */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {plan.features.map((f) => {
          const FIcon = f.icon;
          return (
            <div
              key={f.key}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: isBusiness ? 'rgba(255,255,255,0.04)' : 'rgba(139,92,246,0.06)',
                border: isBusiness ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(139,92,246,0.12)',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: isBusiness ? 'rgba(255,255,255,0.06)' : 'rgba(139,92,246,0.1)',
                }}
              >
                <FIcon
                  size={15}
                  style={{ color: isBusiness ? '#e2e8f0' : '#7c3aed' }}
                />
              </div>
              <span
                className="text-xs font-semibold leading-snug"
                style={{ color: isBusiness ? '#e2e8f0' : '#4c1d95' }}
              >
                {f.text}
              </span>
              <Check
                size={13}
                className="ml-auto flex-shrink-0"
                style={{ color: isBusiness ? '#64748b' : '#7c3aed' }}
              />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="px-6 py-3 flex items-center justify-between"
        style={{
          borderTop: isBusiness ? '1px solid #1e1e1e' : '1px solid rgba(139,92,246,0.1)',
          background: isBusiness ? 'rgba(255,255,255,0.02)' : 'rgba(139,92,246,0.03)',
        }}
      >
        <p className="text-xs" style={{ color: isBusiness ? '#64748b' : '#6d28d9' }}>
          Features apply across all your stores
        </p>
        <Link
          to="/dashboard/settings"
          className="text-xs font-bold flex items-center gap-1 hover:underline"
          style={{ color: isBusiness ? '#94a3b8' : '#7c3aed' }}
        >
          Manage plan →
        </Link>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const [metrics, setMetrics] = useState({ revenue: 0, orders: 0, visitors: 0 });
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    dashboard.metrics()
      .then(res => {
        if(res && res.data) setMetrics(res.data);
      })
      .catch(() => {
        // Silent fallback for non-existent backend endpoints
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A1D23] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Overview</h1>
        <p className="text-[#6B7280] mt-1 text-sm font-medium">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Unlocked features panel — visible when on premium or business */}
      {(theme === 'premium' || theme === 'business') && (
        <UnlockedFeaturesPanel theme={theme} />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-slate-200/60 rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="Total Revenue" value={`₫${(metrics.revenue || 0).toLocaleString()}`} detail="Last 30 days" icon={CreditCard} />
          <MetricCard title="Total Orders" value={metrics.orders || 0} detail="Last 30 days" icon={ShoppingBag} />
          <MetricCard title="Store Visitors" value={metrics.visitors || 0} detail="Last 30 days" icon={Eye} />
        </div>
      )}
    </div>
  );
}
