import React, { useState } from 'react';
import clsx from 'clsx';
import {
  Plus, ArrowRight, TrendingUp, ShoppingBag, Users, DollarSign,
  ExternalLink, MoreHorizontal, Globe, Zap, BarChart3, Star,
  Package, Palette, ArrowUpRight, Eye, ShoppingCart,
} from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Add Product',     icon: Package,  color: 'bg-canva-purple/10 text-canva-purple',  href: '#' },
  { label: 'View Orders',     icon: ShoppingCart, color: 'bg-canva-cyan/10 text-canva-cyan-mid', href: '#' },
  { label: 'Edit Theme',      icon: Palette,  color: 'bg-pink-100 text-pink-600',             href: '#' },
  { label: 'Analytics',       icon: BarChart3, color: 'bg-amber-50 text-amber-600',           href: '#' },
  { label: 'AI Trimi',        icon: Zap,      color: 'bg-violet-50 text-violet-600',          href: '#' },
  { label: 'Custom Domain',   icon: Globe,    color: 'bg-emerald-50 text-emerald-600',        href: '#' },
];

const STORES = [
  {
    id: 1,
    name:      'Trimi Official',
    slug:      'trimi',
    status:    'active',
    products:  128,
    orders:    342,
    revenue:   '₫48.6M',
    visits:    '12.4K',
    logo:      'T',
    gradient:  'from-canva-purple to-canva-purple-dark',
    growth:    '+18%',
    theme:     'Minimal Luxe',
  },
  {
    id: 2,
    name:      'HoangSneaker',
    slug:      'hoangsneaker',
    status:    'active',
    products:  47,
    orders:    89,
    revenue:   '₫12.1M',
    visits:    '3.8K',
    logo:      'H',
    gradient:  'from-canva-cyan to-canva-cyan-mid',
    growth:    '+31%',
    theme:     'Urban Sport',
  },
  {
    id: 3,
    name:      'Bloom Garden',
    slug:      'bloomgarden',
    status:    'paused',
    products:  22,
    orders:    14,
    revenue:   '₫2.3M',
    visits:    '890',
    logo:      'B',
    gradient:  'from-emerald-400 to-teal-500',
    growth:    '+4%',
    theme:     'Nature Fresh',
  },
];

const STATS = [
  { label: 'Total Revenue',  value: '₫63.0M', sub: '+22% this month', icon: DollarSign, color: 'text-canva-purple', bg: 'bg-canva-purple/8' },
  { label: 'Total Orders',   value: '445',    sub: '+14 today',        icon: ShoppingBag, color: 'text-canva-cyan-mid', bg: 'bg-canva-cyan/8' },
  { label: 'Total Visitors', value: '17.1K',  sub: 'across all stores',icon: Users,      color: 'text-pink-500',     bg: 'bg-pink-50' },
  { label: 'Active Stores',  value: '2 / 3',  sub: '1 store paused',   icon: Globe,      color: 'text-amber-500',    bg: 'bg-amber-50' },
];

// ── Sub-components ───────────────────────────────────────────────────────
const StatCard = ({ stat, delay }) => (
  <div className={clsx('card p-5 animate-fade-in', delay)}>
    <div className="flex items-start justify-between mb-3">
      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
        <stat.icon size={18} className={stat.color} />
      </div>
      <ArrowUpRight size={14} className="text-ink-ghost" />
    </div>
    <div className="font-display font-bold text-2xl text-ink leading-none">{stat.value}</div>
    <div className="text-sm text-ink-muted mt-1">{stat.label}</div>
    <div className="text-xs text-success mt-1 font-medium">{stat.sub}</div>
  </div>
);

const StoreCard = ({ store, delay }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = store.status === 'active';

  return (
    <div className={clsx(
      'card group relative overflow-hidden transition-all duration-300 animate-fade-in',
      'hover:shadow-card-hover hover:-translate-y-0.5',
      delay,
    )}>
      {/* Top accent bar */}
      <div className={clsx('h-1 w-full bg-gradient-to-r', store.gradient)} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Store logo */}
            <div className={clsx(
              'w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center',
              'shadow-md font-display font-bold text-white text-lg',
              store.gradient,
            )}>
              {store.logo}
            </div>
            <div>
              <h3 className="font-display font-semibold text-ink text-base leading-tight">
                {store.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={clsx(
                  'w-1.5 h-1.5 rounded-full',
                  isActive ? 'bg-success animate-pulse-soft' : 'bg-ink-ghost',
                )} />
                <span className={clsx(
                  'text-xs font-medium',
                  isActive ? 'text-success-dark' : 'text-ink-subtle',
                )}>
                  {isActive ? 'Live' : 'Paused'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100
                          transition-opacity duration-200">
            <a
              href={`https://${store.slug}.vimi.id.vn`}
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-lg flex items-center justify-center
                         text-ink-subtle hover:text-ink hover:bg-surface-hover transition-all"
            >
              <ExternalLink size={13} />
            </a>
            <button
              onClick={() => setMenuOpen(p => !p)}
              className="w-7 h-7 rounded-lg flex items-center justify-center
                         text-ink-subtle hover:text-ink hover:bg-surface-hover transition-all"
            >
              <MoreHorizontal size={13} />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Revenue',  value: store.revenue },
            { label: 'Orders',   value: store.orders },
            { label: 'Visitors', value: store.visits },
          ].map(s => (
            <div key={s.label} className="bg-surface-overlay rounded-xl p-2.5 text-center">
              <div className="font-display font-semibold text-sm text-ink">{s.value}</div>
              <div className="text-2xs text-ink-subtle mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={13} className="text-success" />
            <span className="text-xs font-semibold text-success">{store.growth}</span>
            <span className="text-xs text-ink-subtle">vs last month</span>
          </div>
          <button className="flex items-center gap-1 text-xs font-semibold text-canva-purple
                             hover:text-canva-purple-dark transition-colors">
            Manage
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Build New Store card ─────────────────────────────────────────────────
const NewStoreCard = ({ delay }) => (
  <div className={clsx(
    'relative overflow-hidden rounded-2xl cursor-pointer group animate-fade-in',
    'border-2 border-dashed border-surface-border hover:border-canva-purple/40',
    'bg-surface-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5',
    delay,
  )}>
    {/* Subtle gradient bg on hover */}
    <div className="absolute inset-0 bg-purple-soft opacity-0 group-hover:opacity-100
                    transition-opacity duration-300" />

    <div className="relative p-5 flex flex-col items-center justify-center min-h-[220px] gap-3">
      {/* Plus icon */}
      <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-surface-border
                      group-hover:border-canva-purple/50 flex items-center justify-center
                      bg-surface-page group-hover:bg-canva-purple/5 transition-all duration-300">
        <Plus
          size={22}
          className="text-ink-subtle group-hover:text-canva-purple transition-colors duration-300"
          strokeWidth={1.5}
        />
      </div>

      <div className="text-center">
        <div className="font-display font-semibold text-ink text-base group-hover:text-canva-purple
                        transition-colors duration-200">
          Build New Store
        </div>
        <div className="text-xs text-ink-muted mt-1 leading-relaxed max-w-[140px]">
          Launch in minutes with AI-powered setup
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs font-medium text-canva-purple
                      opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1
                      group-hover:translate-y-0">
        <Zap size={11} strokeWidth={2.5} />
        Start with AI Trimi
      </div>
    </div>
  </div>
);

// ── Main Dashboard page ──────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <div className="space-y-8 pb-8">

      {/* ── Welcome Banner ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-canva-gradient
                          shadow-purple-glow min-h-[200px] p-8 flex items-center
                          animate-fade-in">
        {/* Decorative orbs */}
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full
                        bg-canva-cyan/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 left-24 w-40 h-40 rounded-full
                        bg-canva-purple-pale/10 blur-2xl pointer-events-none" />
        <div className="absolute top-6 right-32 w-16 h-16 rounded-full
                        bg-white/5 blur-xl pointer-events-none" />

        {/* Floating shapes */}
        <div className="absolute top-8 right-16 w-32 h-32 rounded-3xl bg-white/5
                        rotate-12 animate-float pointer-events-none hidden lg:block" />
        <div className="absolute -bottom-4 right-48 w-20 h-20 rounded-2xl bg-canva-cyan/10
                        -rotate-6 animate-float pointer-events-none hidden lg:block"
          style={{ animationDelay: '1.5s' }} />

        {/* Content */}
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full
                          px-3 py-1 mb-4 text-xs font-medium text-white/80 border border-white/10">
            <Star size={11} className="text-canva-yellow" fill="currentColor" />
            You have 3 active stores this month
          </div>

          <h1 className="font-display font-extrabold text-white text-4xl md:text-5xl
                         leading-tight mb-3 text-balance">
            Welcome back,{' '}
            <span className="text-canva-cyan">Hoàng</span> 👋
          </h1>

          <p className="text-white/70 text-base max-w-md leading-relaxed mb-6">
            Your stores generated{' '}
            <span className="text-white font-semibold">₫63M</span> revenue this month.
            Keep going — you're on fire 🔥
          </p>

          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 bg-white text-canva-purple
                               font-display font-bold text-sm px-5 py-2.5 rounded-xl
                               shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                               transition-all duration-200">
              <Plus size={15} strokeWidth={2.5} />
              Create New Store
            </button>
            <button className="flex items-center gap-2 bg-white/10 border border-white/20
                               text-white font-display font-semibold text-sm px-5 py-2.5 rounded-xl
                               hover:bg-white/20 transition-all duration-200">
              <Eye size={14} />
              View Analytics
            </button>
          </div>
        </div>

        {/* Right illustration: floating stat cards */}
        <div className="hidden xl:flex flex-col gap-3 relative z-10 ml-8 flex-shrink-0">
          {[
            { label: 'Revenue today', value: '₫2.4M', icon: '📈', up: true },
            { label: 'New orders',    value: '14',    icon: '📦', up: true },
          ].map((s, i) => (
            <div
              key={i}
              className="glass rounded-2xl px-4 py-3 min-w-[160px] animate-float"
              style={{ animationDelay: `${i * 0.8}s` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{s.icon}</span>
                <span className="text-xs text-white/60">{s.label}</span>
              </div>
              <div className="font-display font-bold text-white text-xl">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              stat={stat}
              delay={`stagger-${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── Quick actions ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-ink">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((action, i) => (
            <a
              key={action.label}
              href={action.href}
              className={clsx(
                'card p-4 flex flex-col items-center gap-2.5 text-center cursor-pointer',
                'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200',
                'animate-fade-in group',
                `stagger-${i + 1}`,
              )}
            >
              <div className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                'group-hover:scale-110 transition-transform duration-200',
                action.color,
              )}>
                <action.icon size={18} />
              </div>
              <span className="text-xs font-semibold text-ink leading-tight">
                {action.label}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Stores grid ─────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-ink">Your Stores</h2>
            <p className="text-sm text-ink-muted mt-0.5">Manage and monitor all your storefronts</p>
          </div>
          <button className="btn-secondary text-sm gap-2">
            <Globe size={14} />
            All Stores
          </button>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STORES.map((store, i) => (
            <StoreCard
              key={store.id}
              store={store}
              delay={`stagger-${i + 1}`}
            />
          ))}
          {/* The "+ Build New Store" dashed card always comes last */}
          <NewStoreCard delay={`stagger-${STORES.length + 1}`} />
        </div>
      </section>

    </div>
  );
}
