import React, { useState } from 'react';
import clsx from 'clsx';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header  from '@/components/Header';

import DashboardHome from '@/pages/dashboard/DashboardHome';
import Products      from '@/pages/dashboard/Products';
import Orders        from '@/pages/dashboard/Orders';
import StoreSettings from '@/pages/dashboard/StoreSettings';

// ── Page map — extend this as you build out more routes ──────────────────
const PAGE_TITLES = {
  home:      'Home',
  stores:    'My Stores',
  templates: 'Templates',
  ai:        'AI Trimi',
  analytics: 'Analytics',
  customers: 'Customers',
  orders:    'Orders',
  settings:  'Settings',
  help:      'Help & Support',
};

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const pathParts = location.pathname.split('/');
  const activeNav = pathParts[pathParts.length - 1] === 'dashboard' ? 'home' : pathParts[pathParts.length - 1];

  return (
    <div className="min-h-screen bg-surface-page font-sans">

      {/* Sidebar */}
      <Sidebar
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main area: offset by sidebar width */}
      <div className={clsx(
        'transition-all duration-300 ease-in-out flex flex-col min-h-screen bg-slate-50/50',
        sidebarCollapsed ? 'sm:ml-[4.5rem]' : 'sm:ml-[260px]',
      )}>

        {/* Sticky header */}
        <Header
          pageTitle={PAGE_TITLES[activeNav] ?? 'Dashboard'}
          isSidebarCollapsed={sidebarCollapsed}
        />

        {/* Page content */}
        <main className="flex-1 pt-16">
          <div className="max-w-[1400px] mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="settings" element={<StoreSettings />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-canva-purple/10 flex items-center justify-center mb-4">
                    <span className="text-3xl">🚧</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl text-ink mb-2">
                    {PAGE_TITLES[activeNav] || 'Coming Soon'}
                  </h2>
                  <p className="text-ink-muted text-sm max-w-xs">
                    This section is coming in the next step. The routing shell is wired and ready.
                  </p>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
