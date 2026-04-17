import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Check, Zap, Crown, Rocket, ArrowRight, Sparkles,
  ShoppingBag, BarChart3, Globe, Headphones, Shield,
  Users, TrendingUp, Star,
} from 'lucide-react';

/* ─── Shared styles injected into document head ─────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

  @keyframes float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-18px) rotate(2deg); }
    66%      { transform: translateY(8px) rotate(-1deg); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: .6; }
    100% { transform: scale(1.35); opacity: 0; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(24px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes countUp {
    from { opacity:0; transform:scale(.8); }
    to   { opacity:1; transform:scale(1); }
  }

  .pricing-page { font-family: 'Inter', sans-serif; }

  .orb { animation: float 14s ease-in-out infinite; }
  .orb-2 { animation: float 18s ease-in-out infinite reverse; animation-delay:-6s; }
  .orb-3 { animation: float 11s ease-in-out infinite; animation-delay:-3s; }

  .shimmer-text {
    background: linear-gradient(90deg, #7c3aed 0%, #a78bfa 40%, #7c3aed 60%, #c4b5fd 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .plan-card {
    transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease;
    animation: fadeUp .6s ease both;
  }
  .plan-card:hover { transform: translateY(-8px); }
  .plan-card.featured:hover { transform: translateY(-12px); }

  .btn-primary-glow {
    position:relative; overflow:hidden;
    transition: transform .2s, box-shadow .2s;
  }
  .btn-primary-glow:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px -8px rgba(124,58,237,.65);
  }
  .btn-primary-glow:active { transform: translateY(0); }
  .btn-primary-glow::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(to bottom, rgba(255,255,255,.15) 0%, transparent 60%);
    pointer-events:none;
  }

  .btn-outline-glow {
    transition: transform .2s, box-shadow .2s, background .2s;
  }
  .btn-outline-glow:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px -4px rgba(124,58,237,.2);
    background: rgba(124,58,237,.06);
  }

  .pulse-ring::before {
    content:''; position:absolute; inset:-6px; border-radius: inherit;
    border: 2px solid rgba(124,58,237,.4);
    animation: pulse-ring 2.5s ease-out infinite;
    pointer-events: none;
  }

  .strike {
    position:relative; display:inline-block;
    color: #94a3b8;
  }
  .strike::after {
    content:''; position:absolute;
    left:0; right:0; top:50%; height:2px;
    background: #ef4444;
    transform: rotate(-8deg);
    border-radius:2px;
  }

  .feature-check { 
    transition: transform .2s;
  }
  .plan-card:hover .feature-check { transform: scale(1.1); }

  .badge-popular {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    animation: shimmer 3s linear infinite;
    background-size: 200% auto;
  }

  .grid-bg {
    background-image: 
      linear-gradient(rgba(124,58,237,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }
`;

/* ─── Feature list item ─────────────────────────────────────────────────── */
function Feature({ text, highlight = false }) {
  return (
    <li className="flex items-start gap-3 py-1">
      <span className={`feature-check mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
        highlight ? 'bg-violet-100' : 'bg-slate-100'
      }`}>
        <Check size={11} strokeWidth={3} className={highlight ? 'text-violet-600' : 'text-slate-500'} />
      </span>
      <span className={`text-[14px] leading-snug ${highlight ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
        {text}
      </span>
    </li>
  );
}

/* ─── Stat badge ────────────────────────────────────────────────────────── */
function StatBadge({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4 bg-white/70 backdrop-blur rounded-2xl border border-slate-200/60 shadow-sm">
      <Icon size={18} className="text-violet-500 mb-1" />
      <span className="font-bold text-slate-800 text-lg leading-none">{value}</span>
      <span className="text-xs text-slate-500 font-medium">{label}</span>
    </div>
  );
}

/* ─── FAQ Item ──────────────────────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        open ? 'border-violet-200 bg-violet-50/50' : 'border-slate-200 bg-white hover:border-violet-200'
      }`}
    >
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-semibold text-slate-800 text-[15px] pr-4">{q}</span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
          open ? 'bg-violet-600 rotate-45' : 'bg-slate-100'
        }`}>
          <span className={`text-lg leading-none font-bold ${open ? 'text-white' : 'text-slate-400'}`}>+</span>
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

import { useTheme } from '../context/ThemeContext';
import CheckoutModal from '../components/CheckoutModal';

/* ─── Main Pricing Page ─────────────────────────────────────────────────── */
export default function PricingPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [billing, setBilling] = useState('monthly'); // 'monthly' | 'yearly'
  const [modal, setModal] = useState({ open: false, plan: null });

  const yearlyDiscount = 0.2; // 20% off yearly
  const premiumMonthly = 29;
  const businessMonthly = 79;
  const premiumYearly = Math.round(premiumMonthly * (1 - yearlyDiscount));
  const businessYearly = Math.round(businessMonthly * (1 - yearlyDiscount));

  const handleUpgrade = (planId) => {
    if (planId === 'free') {
       navigate('/register');
       return;
    }
    setModal({ open: true, plan: planId });
  };

  const onPaymentSuccess = (planId) => {
    setTheme(planId, true); // Update theme and play animation
  };

  const plans = [
    {
      id: 'free',
      icon: Zap,
      name: 'Free Trial',
      badge: null,
      originalPrice: '$20',
      price: 'Free',
      priceNote: 'for 6 months',
      subNote: 'Then $20/mo — cancel anytime',
      cta: 'Start Free Trial',
      ctaStyle: 'outline',
      href: '/register',
      color: '#64748b',
      accentBg: 'bg-slate-50',
      delay: '0s',
      features: [
        { text: 'Full access for 6 months', highlight: true },
        { text: '1 storefront with custom domain' },
        { text: 'Up to 50 products' },
        { text: 'Basic analytics dashboard' },
        { text: 'Vimi-branded storefront' },
        { text: 'Email support' },
        { text: 'Community templates' },
      ],
    },
    {
      id: 'premium',
      icon: Crown,
      name: 'Premium',
      badge: '⭐ Most Popular',
      originalPrice: null,
      price: billing === 'monthly' ? `$${premiumMonthly}` : `$${premiumYearly}`,
      priceNote: 'per month',
      subNote: billing === 'yearly' ? `Billed $${premiumYearly * 12}/year — save 20%` : 'Billed monthly',
      cta: 'Choose Premium',
      ctaStyle: 'primary',
      href: '/register?plan=premium',
      color: '#7c3aed',
      accentBg: 'bg-violet-50',
      featured: true,
      delay: '.1s',
      features: [
        { text: 'Everything in Free Trial', highlight: true },
        { text: 'Unlimited products', highlight: true },
        { text: 'Remove Vimi branding', highlight: true },
        { text: '3 storefronts with custom domains' },
        { text: 'Advanced analytics & revenue reports' },
        { text: 'Priority email & chat support' },
        { text: 'All premium templates' },
        { text: 'Discount code & coupon tools' },
        { text: 'Basic SEO tools' },
      ],
    },
    {
      id: 'business',
      icon: Rocket,
      name: 'Business',
      badge: null,
      originalPrice: null,
      price: billing === 'monthly' ? `$${businessMonthly}` : `$${businessYearly}`,
      priceNote: 'per month',
      subNote: billing === 'yearly' ? `Billed $${businessYearly * 12}/year — save 20%` : 'Billed monthly',
      cta: 'Choose Business',
      ctaStyle: 'dark',
      href: '/register?plan=business',
      color: '#0f172a',
      accentBg: 'bg-slate-900',
      delay: '.2s',
      features: [
        { text: 'Everything in Premium', highlight: true },
        { text: 'Unlimited storefronts', highlight: true },
        { text: 'White-label solution', highlight: true },
        { text: 'Multi-user team access (up to 10)', highlight: true },
        { text: 'Dedicated account manager' },
        { text: 'Custom integrations & API access' },
        { text: 'Advanced inventory management' },
        { text: 'Multi-currency & region support' },
        { text: 'SLA uptime guarantee (99.9%)' },
        { text: '24/7 priority phone support' },
      ],
    },
  ];

  const faqs = [
    {
      q: 'Do I need a credit card for the Free Trial?',
      a: 'No! You get 6 full months completely free without entering any payment information. After the trial, you can upgrade to a paid plan or your store will be paused.',
    },
    {
      q: 'Can I switch plans at any time?',
      a: 'Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your dashboard settings. Changes take effect at the start of your next billing cycle.',
    },
    {
      q: 'What happens after my 6-month free trial ends?',
      a: 'We\'ll send you a reminder email before your trial ends. If you choose not to upgrade, your store will be paused (not deleted) so you never lose your data.',
    },
    {
      q: 'Is there a transaction fee on sales?',
      a: 'Vimi charges 0% transaction fees on all plans. You only pay the standard payment processor fee (e.g., Stripe: 2.9% + 30¢).',
    },
    {
      q: 'Can I get a refund?',
      a: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact our support team and we\'ll issue a full refund, no questions asked.',
    },
  ];

  return (
    <div className="pricing-page min-h-screen theme-bg relative overflow-x-hidden">
      <style>{CSS}</style>

      {/* ── Background decorations ─────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb   absolute -top-48   -right-48   w-[700px] h-[700px] rounded-full bg-violet-300/20 blur-3xl" />
        <div className="orb-2 absolute -bottom-32 -left-32    w-[500px] h-[500px] rounded-full bg-indigo-200/20  blur-3xl" />
        <div className="orb-3 absolute top-1/2   left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-fuchsia-200/10 blur-3xl" />
      </div>

      {/* ── Top nav bar ────────────────────────────────────────────────────── */}
      <nav className="relative z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #00C4CC)' }}
            >
              <span className="font-black text-white text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>V</span>
            </div>
            <span className="font-black text-slate-800 text-xl tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              vimi
            </span>
          </button>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <button onClick={() => navigate('/dashboard')} className="hover:text-slate-800 transition-colors">Dashboard</button>
            <button onClick={() => navigate('/onboarding/templates')} className="hover:text-slate-800 transition-colors">Templates</button>
            <button className="text-violet-600 font-semibold">Pricing</button>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors px-3 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-primary-glow text-sm font-bold text-white px-5 py-2.5 rounded-xl shadow-sm"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Hero Section ────────────────────────────────────────────────── */}
        <header className="pt-20 pb-16 text-center" style={{ animation: 'fadeUp .7s ease both' }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
            <Sparkles size={12} />
            Simple, Transparent Pricing
          </div>

          <h1
            className="font-black text-5xl sm:text-6xl lg:text-7xl text-slate-900 tracking-tight leading-[1.05] mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Choose the Perfect Plan<br />
            for <span className="shimmer-text">Your Business</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            Start completely free for 6 months — no credit card required. 
            Scale when you're ready with transparent, all-in-one pricing.
          </p>

          {/* Social proof stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <StatBadge icon={Users}     value="2,400+" label="Active Stores" />
            <StatBadge icon={TrendingUp} value="₫12B+"  label="GMV Processed" />
            <StatBadge icon={Star}      value="4.9/5"  label="Merchant Rating" />
            <StatBadge icon={Shield}    value="99.9%"  label="Uptime SLA" />
          </div>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl gap-1 relative">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                billing === 'monthly'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                billing === 'yearly'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Yearly
              <span className="text-[10px] font-black text-white bg-gradient-to-r from-violet-500 to-purple-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Save 20%
              </span>
            </button>
          </div>
        </header>

        {/* ── Plan Cards ──────────────────────────────────────────────────── */}
        <section className="pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isFeatured = !!plan.featured;
              const isDark = plan.id === 'business';

              return (
                <div
                  key={plan.id}
                  className={clsx(
                    'plan-card relative flex flex-col rounded-3xl overflow-hidden transition-all duration-500',
                    isFeatured 
                      ? 'featured ring-2 ring-violet-500 shadow-[0_24px_80px_-12px_rgba(124,58,237,.35)] scale-105 z-10' 
                      : 'border border-slate-200 shadow-xl shadow-slate-200/60 opacity-90 hover:opacity-100',
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white',
                    billing === 'yearly' && isFeatured && 'shadow-[0_0_50px_rgba(139,61,255,0.4)] ring-[3px]'
                  )}
                  style={{ animationDelay: plan.delay }}
                >
                  {/* Featured top accent bar */}
                  {isFeatured && (
                    <div
                      className="h-1.5 w-full"
                      style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }}
                    />
                  )}

                  <div className="flex flex-col flex-1 p-8">
                    {/* Badge */}
                    {plan.badge ? (
                      <div className="mb-4">
                        <span className="badge-popular text-white text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                          {plan.badge}
                        </span>
                      </div>
                    ) : (
                      <div className="mb-4 h-7" /> /* spacer for alignment */
                    )}

                    {/* Plan header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${
                          isFeatured ? '' : isDark ? 'bg-slate-800' : plan.accentBg
                        }`}
                        style={isFeatured ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)' } : {}}
                      >
                        <Icon size={20} className={isFeatured ? 'text-white' : isDark ? 'text-slate-300' : ''} style={!isFeatured && !isDark ? { color: plan.color } : {}} />
                      </div>
                      <h2
                        className={`font-black text-xl tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {plan.name}
                      </h2>
                    </div>

                    {/* Price block */}
                    <div className="mb-6 pb-6 border-b border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,.1)' : '#e2e8f0' }}>
                      {/* Original price strikethrough — only on Free */}
                      {plan.originalPrice && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="strike text-lg font-bold">{plan.originalPrice}<span className="text-sm font-medium">/mo</span></span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">100% OFF</span>
                        </div>
                      )}

                      <div className="flex items-end gap-2 flex-wrap">
                        <span
                          className={`font-black leading-none tracking-tighter ${
                            plan.id === 'free' ? 'text-5xl' : 'text-5xl'
                          } ${isDark ? 'text-white' : isFeatured ? 'text-violet-700' : 'text-slate-800'}`}
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {plan.price}
                        </span>
                        {plan.id !== 'free' && (
                          <span className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                            {plan.priceNote}
                          </span>
                        )}
                        {plan.id === 'free' && (
                          <span className={`text-base font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {plan.priceNote}
                          </span>
                        )}
                      </div>

                      <p className={`text-xs font-medium mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {plan.subNote}
                      </p>
                    </div>

                    {/* Feature list */}
                    <ul className="space-y-0.5 flex-1 mb-8">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 py-1.5">
                          <span className={`feature-check mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                            isDark
                              ? f.highlight ? 'bg-violet-500/30' : 'bg-slate-700'
                              : f.highlight ? 'bg-violet-100' : 'bg-slate-100'
                          }`}>
                            <Check size={10} strokeWidth={3.5} className={
                              isDark
                                ? f.highlight ? 'text-violet-400' : 'text-slate-400'
                                : f.highlight ? 'text-violet-600' : 'text-slate-400'
                            } />
                          </span>
                          <span className={`text-[13.5px] leading-snug ${
                            isDark
                              ? f.highlight ? 'text-slate-200 font-medium' : 'text-slate-400'
                              : f.highlight ? 'text-slate-700 font-medium' : 'text-slate-500'
                          }`}>
                            {f.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      className={clsx(
                        'w-full py-4 rounded-2xl font-bold text-[15px] text-center transition-all btn-primary-glow',
                        plan.ctaStyle === 'primary' && 'text-white pulse-ring',
                        plan.ctaStyle === 'dark' && 'text-slate-100',
                        plan.ctaStyle === 'outline' && 'border-2 border-slate-200 text-slate-700 bg-white'
                      )}
                      style={
                        plan.ctaStyle === 'primary' 
                          ? { background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', boxShadow: '0 10px 30px -5px rgba(124,58,237,.5)' }
                          : plan.ctaStyle === 'dark'
                          ? { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', boxShadow: '0 10px 30px -5px rgba(15,23,42,.4)' }
                          : {}
                      }
                    >
                      <span className="flex items-center justify-center gap-2">
                        {plan.cta} <ArrowRight size={16} strokeWidth={2.5} />
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust note */}
          <p className="text-center text-slate-400 text-sm mt-8 flex items-center justify-center gap-2 font-medium">
            <Shield size={14} className="text-violet-400" />
            No credit card required · 30-day money-back guarantee · Cancel anytime
          </p>
        </section>

        {/* ── Feature comparison strip ────────────────────────────────────── */}
        <section className="pb-24">
          <div className="text-center mb-12">
            <h2 className="font-black text-3xl sm:text-4xl text-slate-800 mb-3 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Everything you need to sell online
            </h2>
            <p className="text-slate-500 text-base">All plans include core storefront features. Upgrade for more power.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Globe,       title: 'Custom Domains',    desc: 'Your brand, your domain. Connect any domain name instantly.' },
              { icon: ShoppingBag, title: 'Product Catalog',   desc: 'Rich product pages with variants, images, and inventory tracking.' },
              { icon: BarChart3,   title: 'Sales Analytics',   desc: 'Real-time reports on revenue, traffic, and customer behavior.' },
              { icon: Headphones,  title: 'Expert Support',    desc: 'Get help from real people who know your business inside out.' },
            ].map((feat, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300"
                style={{ animation: `fadeUp .6s ease ${i * .1}s both` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mb-4 group-hover:bg-violet-100 transition-colors">
                  <feat.icon size={22} className="text-violet-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-[15px]">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ Section ─────────────────────────────────────────────────── */}
        <section className="pb-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-black text-3xl sm:text-4xl text-slate-800 mb-3 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-base">Everything you need to know before getting started.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* ── Bottom CTA Banner ───────────────────────────────────────────── */}
        <section className="pb-24">
          <div
            className="relative overflow-hidden rounded-3xl p-12 sm:p-16 text-center"
            style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #6d28d9 100%)' }}
          >
            {/* Background orbs */}
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
                <Zap size={12} /> Limited Offer
              </div>
              <h2
                className="font-black text-4xl sm:text-5xl text-white mb-4 tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                6 months of premium features,<br />completely free.
              </h2>
              <p className="text-violet-200 text-lg mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                Launch your store today. No credit card. No commitment. 
                Just your business, live and selling in minutes.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="group inline-flex items-center gap-2 bg-white text-violet-700 font-bold text-base px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                >
                  Start Free — No Card Needed
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => navigate('/onboarding/templates')}
                  className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold text-base px-8 py-4 rounded-2xl backdrop-blur-sm hover:bg-white/25 transition-all duration-300"
                >
                  Browse Templates
                </button>
              </div>
              <p className="text-violet-300/70 text-xs mt-6 font-medium">
                Trusted by 2,400+ merchants across Southeast Asia
              </p>
            </div>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="pb-12 text-center border-t border-slate-200 pt-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #00C4CC)' }}
            >
              <span className="font-black text-white text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>V</span>
            </div>
            <span className="font-black text-slate-700 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>vimi</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 Vimi. All rights reserved.{' '}
            <button className="text-violet-500 hover:text-violet-700 transition-colors font-medium ml-2">Privacy</button>
            {' · '}
            <button className="text-violet-500 hover:text-violet-700 transition-colors font-medium">Terms</button>
          </p>
        </footer>

      </div>

      <CheckoutModal 
        isOpen={modal.open}
        onClose={() => setModal({ open: false, plan: null })}
        plan={modal.plan}
        billing={billing}
        onSuccess={onPaymentSuccess}
      />
    </div>
  );
}
