import React, { useState } from 'react';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Store,
  LayoutTemplate,
  Sparkles,
  Settings,
  ChevronRight,
  Plus,
  Zap,
  HelpCircle,
  Bell,
  Users,
  BarChart3,
  ShoppingBag,
  LogOut,
} from 'lucide-react';

// ── Nav section data ─────────────────────────────────────────────────────
const PRIMARY_NAV = [
  { id: 'home',      label: 'Home',        icon: LayoutDashboard, badge: null },
  { id: 'stores',    label: 'My Stores',   icon: Store,           badge: '3' },
  { id: 'templates', label: 'Templates',   icon: LayoutTemplate,  badge: 'New' },
  { id: 'ai',        label: 'AI Trimi',    icon: Sparkles,        badge: 'Beta', glow: true },
];

const SECONDARY_NAV = [
  { id: 'analytics', label: 'Analytics',  icon: BarChart3 },
  { id: 'customers', label: 'Customers',  icon: Users },
  { id: 'orders',    label: 'Orders',     icon: ShoppingBag },
];

const BOTTOM_NAV = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help',     label: 'Help',     icon: HelpCircle },
];

// ── Sub-components ───────────────────────────────────────────────────────
const NavItem = ({ item, active, onClick }) => (
  <button
    onClick={() => onClick(item.id)}
    className={clsx(
      'nav-item w-full text-left group',
      active && 'active',
    )}
  >
    <span className={clsx(
      'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
      active
        ? 'bg-white/20'
        : 'bg-white/5 group-hover:bg-white/10',
      item.glow && !active && 'group-hover:shadow-[0_0_12px_rgba(0,196,204,0.4)]',
    )}>
      <item.icon
        size={16}
        className={clsx(
          'transition-colors duration-150',
          active
            ? 'text-white'
            : item.glow
              ? 'text-canva-cyan group-hover:text-canva-cyan'
              : 'text-slate-400 group-hover:text-white',
        )}
      />
    </span>

    <span className="flex-1 truncate">{item.label}</span>

    {item.badge && (
      <span className={clsx(
        'flex-shrink-0 text-2xs font-bold px-1.5 py-0.5 rounded-md',
        item.badge === 'New'
          ? 'bg-canva-cyan/20 text-canva-cyan'
          : item.badge === 'Beta'
            ? 'bg-canva-purple/30 text-canva-purple-pale'
            : 'bg-white/15 text-slate-300',
      )}>
        {item.badge}
      </span>
    )}
  </button>
);

// ── Main Sidebar ─────────────────────────────────────────────────────────
export default function Sidebar({ activeNav, onNavChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-full flex flex-col z-40',
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[4.5rem]' : 'w-[15.5rem]',
      )}
      style={{
        background: 'linear-gradient(160deg, #130528 0%, #1E0848 50%, #081830 100%)',
      }}
    >
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Logo / Brand ──────────────────────────────────────────────── */}
      <div className="relative flex items-center gap-3 px-4 py-5 border-b border-white/8">
        {/* Logo mark */}
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-btn-primary shadow-purple-glow
                        flex items-center justify-center">
          <span className="font-display font-black text-white text-lg leading-none">V</span>
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0 animate-fade-in-fast">
            <div className="font-display font-extrabold text-white text-lg leading-none tracking-tight">
              vimi
            </div>
            <div className="text-2xs text-canva-cyan/80 font-medium tracking-wider mt-0.5">
              STORE BUILDER
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(p => !p)}
          className={clsx(
            'flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center',
            'text-slate-500 hover:text-white hover:bg-white/10',
            'transition-all duration-200',
            isCollapsed && 'absolute -right-3 top-1/2 -translate-y-1/2 bg-[#1E0848] border border-white/10 shadow-lg',
          )}
        >
          <ChevronRight
            size={12}
            className={clsx(
              'transition-transform duration-300',
              !isCollapsed && 'rotate-180',
            )}
          />
        </button>
      </div>

      {/* ── Create Button ─────────────────────────────────────────────── */}
      <div className="relative px-3 pt-4 pb-3">
        <button className={clsx(
          'w-full flex items-center justify-center gap-2 rounded-xl py-2.5',
          'bg-btn-primary shadow-purple-glow text-white font-display font-semibold',
          'text-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
        )}>
          <Plus size={16} strokeWidth={2.5} />
          {!isCollapsed && <span className="animate-fade-in-fast">Create Store</span>}
        </button>
      </div>

      {/* ── Primary navigation ────────────────────────────────────────── */}
      <nav className="relative flex-1 overflow-y-auto overflow-x-hidden px-2 py-1 space-y-0.5">
        {!isCollapsed && (
          <p className="px-2 py-1.5 text-2xs font-bold text-slate-500 uppercase tracking-widest">
            Main
          </p>
        )}
        {PRIMARY_NAV.map(item => (
          <NavItem
            key={item.id}
            item={item}
            active={activeNav === item.id}
            onClick={onNavChange}
          />
        ))}

        {/* Divider */}
        <div className="my-3 border-t border-white/8" />

        {!isCollapsed && (
          <p className="px-2 py-1.5 text-2xs font-bold text-slate-500 uppercase tracking-widest">
            Business
          </p>
        )}
        {SECONDARY_NAV.map(item => (
          <NavItem
            key={item.id}
            item={item}
            active={activeNav === item.id}
            onClick={onNavChange}
          />
        ))}
      </nav>

      {/* ── Upgrade CTA card ──────────────────────────────────────────── */}
      {!isCollapsed && (
        <div className="relative mx-3 mb-3 overflow-hidden rounded-2xl animate-fade-in"
          style={{ background: 'linear-gradient(135deg, #FF6B9D22 0%, #8B3DFF33 50%, #00C4CC22 100%)',
                   border: '1px solid rgba(139,61,255,0.25)' }}>
          {/* Glowing orb */}
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-canva-purple/20 blur-xl" />

          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-upgrade-gradient flex items-center justify-center">
                <Zap size={12} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold text-white/90 font-display">Go Pro</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Unlock custom domains, advanced analytics, and unlimited products.
            </p>
            <button className="w-full py-2 rounded-xl text-xs font-bold font-display text-white
                               bg-upgrade-gradient shadow-purple-glow/50
                               hover:shadow-purple-glow transition-all duration-200">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom nav + user profile ─────────────────────────────────── */}
      <div className="relative border-t border-white/8 px-2 pt-2 pb-3 space-y-0.5">
        {BOTTOM_NAV.map(item => (
          <NavItem
            key={item.id}
            item={item}
            active={activeNav === item.id}
            onClick={onNavChange}
          />
        ))}

        {/* User row */}
        <div className={clsx(
          'flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl cursor-pointer',
          'hover:bg-white/8 transition-colors duration-150 group',
        )}>
          <div className="flex-shrink-0 relative">
            <div className="w-8 h-8 rounded-full bg-canva-gradient flex items-center justify-center">
              <span className="text-xs font-bold text-white font-display">H</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full
                            bg-success border-2 border-[#130528]" />
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-fade-in-fast">
              <div className="text-sm font-medium text-white/90 truncate leading-tight">Hoàng Trimi</div>
              <div className="text-2xs text-slate-500 truncate">Free plan</div>
            </div>
          )}

          {!isCollapsed && (
            <LogOut size={14} className="flex-shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors" />
          )}
        </div>
      </div>
    </aside>
  );
}
