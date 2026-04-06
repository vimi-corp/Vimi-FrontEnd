import React, { useState } from 'react';
import clsx from 'clsx';
import Sidebar from '@/components/Sidebar';
import Header  from '@/components/Header';
import Dashboard from '@/pages/Dashboard';

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

const PageContent = ({ activeNav }) => {
  switch (activeNav) {
    case 'home':
    default:
      return <Dashboard />;

    // Placeholder shells for future pages
    case 'stores':
    case 'templates':
    case 'ai':
    case 'analytics':
    case 'customers':
    case 'orders':
    case 'settings':
    case 'help':
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center
                        animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-canva-purple/10 flex items-center justify-center mb-4">
            <span className="text-3xl">🚧</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-ink mb-2">
            {PAGE_TITLES[activeNav]}
          </h2>
          <p className="text-ink-muted text-sm max-w-xs">
            This section is coming in the next step. The routing shell is wired and ready.
          </p>
        </div>
      );
  }
};

export default function DashboardLayout() {
  const [activeNav,       setActiveNav]       = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sidebar reports its own collapse state via the onNavChange callback.
  // We mirror it here so the Header and content area can adjust their
  // left offset dynamically.
  const handleNavChange = (id) => setActiveNav(id);

  return (
    <div className="min-h-screen bg-surface-page font-sans">

      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={handleNavChange}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main area: offset by sidebar width */}
      <div className={clsx(
        'transition-all duration-300 ease-in-out flex flex-col min-h-screen',
        sidebarCollapsed ? 'ml-[4.5rem]' : 'ml-[15.5rem]',
      )}>

        {/* Sticky header */}
        <Header
          pageTitle={PAGE_TITLES[activeNav] ?? 'Dashboard'}
          isSidebarCollapsed={sidebarCollapsed}
        />

        {/* Page content */}
        <main className="flex-1 pt-16">
          <div className="max-w-[1400px] mx-auto px-6 py-8">
            <PageContent activeNav={activeNav} />
          </div>
        </main>
      </div>
    </div>
  );
}
