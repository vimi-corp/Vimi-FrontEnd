import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, Package, ShoppingCart, Settings, ChevronRight, LogOut, Users, BarChart2, CreditCard, Crown, Star } from 'lucide-react';
import { stores } from '../lib/api';
import StoreSwitcher from './StoreSwitcher';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { id: 'home',      path: '/dashboard',           exact: true,  label: 'Overview',  icon: LayoutDashboard },
  { id: 'analytics', path: '/dashboard/analytics', exact: false, label: 'Analytics',  icon: BarChart2 },
  { id: 'products',  path: '/dashboard/products',  exact: false, label: 'Products',   icon: Package },
  { id: 'orders',    path: '/dashboard/orders',    exact: false, label: 'Orders',     icon: ShoppingCart },
  { id: 'customers', path: '/dashboard/customers', exact: false, label: 'Customers',  icon: Users },
  { id: 'pricing',   path: '/pricing',             exact: true,  label: 'Pricing',    icon: CreditCard },
  { id: 'settings',  path: '/dashboard/settings',  exact: false, label: 'Settings',   icon: Settings },
];

const BUSINESS_ITEMS = [
  { id: 'adv-analytics', path: '/dashboard/advanced-analytics', label: 'Adv. Analytics', icon: BarChart2 },
  { id: 'api-access',    path: '/dashboard/api-access',         label: 'API Access',     icon: LayoutDashboard },
  { id: 'team',          path: '/dashboard/team',               label: 'Team Mgmt',      icon: Users },
];

export default function Sidebar({ onCollapseChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [storeInfo, setStoreInfo] = useState({ name: '', subdomain: '' });
  const { theme } = useTheme();

  const isBusiness = theme === 'business';
  const isPremium = theme === 'premium';
  const menuItems = isBusiness ? [...NAV_ITEMS, ...BUSINESS_ITEMS] : NAV_ITEMS;

  const toggleCollapse = () => {
    setIsCollapsed(p => !p);
    if (onCollapseChange) onCollapseChange(!isCollapsed); // pass new state visually 
  };

  useEffect(() => {
    stores.get().then(res => {
      if (res.data) setStoreInfo({ name: res.data.name, subdomain: res.data.subdomain });
    }).catch(() => {});
  }, []);

  return (
    <aside
      className={clsx(
        'theme-sidebar fixed left-0 top-0 h-full flex flex-col z-40 border-r transition-all duration-300 ease-in-out hidden sm:flex',
        isCollapsed ? 'w-[4.5rem]' : 'w-[260px]',
      )}
    >
      {/* ── Header / Logo ──────────────────────────────────────────────── */}
      <div
        className="relative flex items-center gap-3 px-5 border-b min-h-[72px] shrink-0 sticky top-0 z-10 w-full theme-sidebar"
      >
        {isCollapsed ? (
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-inner flex items-center justify-center overflow-hidden p-1">
            <img src="/favicon.svg" alt="VIMI" className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="flex-1 min-w-0 pr-4 animate-fade-in-fast -ml-2">
            <StoreSwitcher />
          </div>
        )}

        <button
          onClick={toggleCollapse}
          className={clsx(
            'theme-sidebar flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 border theme-border opacity-70 hover:opacity-100',
            isCollapsed && 'absolute -right-3 top-1/2 -translate-y-1/2 shadow-sm'
          )}
        >
          <ChevronRight
            size={14}
            className={clsx('transition-transform duration-300', !isCollapsed && 'rotate-180')}
            style={{ color: 'var(--theme-text-muted)' }}
          />
        </button>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
        {!isCollapsed && (
          <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>Main Menu</p>
        )}
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => clsx(
              'flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 group relative font-medium',
              isActive ? 'font-semibold' : ''
            )}
            style={({ isActive }) => isActive ? {
              backgroundColor: 'var(--theme-sidebar-active-bg)',
              color: 'var(--theme-sidebar-active-text)',
            } : {
              color: 'var(--theme-text-muted)',
            }}
          >
            {({ isActive }) => (
              <>
                {isActive && !isCollapsed && (
                  <div
                    className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-lg"
                    style={{ backgroundColor: 'var(--theme-sidebar-active-text)' }}
                  />
                )}

                <span className={clsx('flex-shrink-0 transition-transform duration-200', !isActive && 'group-hover:scale-110')}>
                  <item.icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    style={{ color: isActive ? 'var(--theme-sidebar-active-text)' : 'var(--theme-text-muted)' }}
                  />
                </span>

                {!isCollapsed && (
                  <span className="flex-1 truncate tracking-wide text-sm">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom Section ────────────────────────────────────────────── */}
      <div className="p-4 border-t theme-border">
        {!isCollapsed && (isPremium || isBusiness) && (
          <div
            className="mb-4 p-3 rounded-xl flex items-center gap-3 border"
            style={{
              backgroundColor: 'var(--theme-sidebar-active-bg)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--theme-accent)', color: '#fff' }}
            >
              {isPremium ? <Star size={18} /> : <Crown size={18} />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1" style={{ color: 'var(--theme-text-muted)' }}>Account Status</p>
              <p className="text-xs font-bold" style={{ color: 'var(--theme-text)' }}>{isPremium ? 'Premium Merchant' : 'Business Enterprise'}</p>
            </div>
          </div>
        )}
        <button
          className="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl transition-colors group hover:bg-red-500/10 hover:text-red-500"
          style={{ color: 'var(--theme-text-muted)' }}
        >
          <LogOut size={18} className="transition-colors group-hover:text-red-500" />
          {!isCollapsed && <span className="font-semibold text-sm tracking-wide">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
