import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, Package, ShoppingCart, Settings, ChevronRight, LogOut } from 'lucide-react';
import { stores } from '../lib/api';

const NAV_ITEMS = [
  { id: 'home',     path: '/dashboard',          exact: true,  label: 'Overview', icon: LayoutDashboard },
  { id: 'products', path: '/dashboard/products', exact: false, label: 'Products', icon: Package },
  { id: 'orders',   path: '/dashboard/orders',   exact: false, label: 'Orders',   icon: ShoppingCart },
  { id: 'settings', path: '/dashboard/settings', exact: false, label: 'Settings', icon: Settings },
];

export default function Sidebar({ onCollapseChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [storeInfo, setStoreInfo] = useState({ name: '', subdomain: '' });

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
        'fixed left-0 top-0 h-full flex flex-col z-40 bg-white border-r border-slate-200',
        'transition-all duration-300 ease-in-out hidden sm:flex', // Standard collapse for small displays
        isCollapsed ? 'w-[4.5rem]' : 'w-[260px]',
      )}
    >
      {/* ── Header / Logo ──────────────────────────────────────────────── */}
      <div className="relative flex items-center gap-3 px-5 py-6 border-b border-slate-100">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B3DFF] to-[#00C4CC] shadow-md flex items-center justify-center">
          <span className="font-display font-black text-white text-lg leading-none">V</span>
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0 animate-fade-in-fast">
            <div className="font-bold text-slate-800 text-[15px] leading-tight truncate tracking-tight font-display">
              {storeInfo.name || 'Vimi Dashboard'}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5 font-semibold uppercase tracking-wider">
              {storeInfo.subdomain ? `${storeInfo.subdomain}.vimi.id.vn` : 'Merchant Center'}
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={toggleCollapse}
          className={clsx(
            'flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center',
            'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
            'transition-all duration-200 border border-transparent',
            isCollapsed && 'absolute -right-3 top-1/2 -translate-y-1/2 bg-white border-slate-200 shadow-sm hover:shadow active:scale-95',
          )}
        >
          <ChevronRight
            size={14}
            className={clsx('transition-transform duration-300', !isCollapsed && 'rotate-180')}
          />
        </button>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
        {!isCollapsed && (
           <p className="px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</p>
        )}
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => clsx(
              'flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
              isActive 
                 ? 'bg-blue-50/70 text-blue-600 font-semibold shadow-[0_2px_10px_rgba(37,99,235,0.05)]' 
                 : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && !isCollapsed && (
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-r-lg" />
                )}
                
                <span className={clsx(
                  'flex-shrink-0 transition-transform duration-200',
                  !isActive && 'group-hover:scale-110'
                )}>
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'} />
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
      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group">
          <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
          {!isCollapsed && <span className="font-semibold text-sm tracking-wide">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
