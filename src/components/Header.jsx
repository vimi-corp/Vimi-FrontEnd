import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronRight, Command, X } from 'lucide-react';
import clsx from 'clsx';

// ── Mock quick-search results ────────────────────────────────────────────
const QUICK_RESULTS = [
  { type: 'store',    label: 'Trimi Official',   sub: 'Active · 128 products',   href: '#' },
  { type: 'store',    label: 'HoangSneaker',     sub: 'Active · 47 products',    href: '#' },
  { type: 'template', label: 'Minimalist Shop',  sub: 'Template · E-commerce',   href: '#' },
  { type: 'doc',      label: 'Shipping settings','sub': 'Settings → Shipping',    href: '#' },
];

const TYPE_CHIP = {
  store:    'bg-canva-purple/10 text-canva-purple',
  template: 'bg-canva-cyan/10   text-canva-cyan-mid',
  doc:      'bg-surface-hover   text-ink-muted',
};

const NOTIFICATIONS = [
  { id: 1, title: 'New order #1042',      sub: 'HoangSneaker · 2 min ago',   dot: 'bg-success' },
  { id: 2, title: 'Product stock low',    sub: 'Trimi Official · 1 hr ago',  dot: 'bg-warning' },
  { id: 3, title: 'Your plan renews soon',sub: 'Pro plan · 3 days left',     dot: 'bg-canva-purple' },
];

export default function Header({ pageTitle = 'Home', isSidebarCollapsed = false }) {
  const [query, setQuery]             = useState('');
  const [searchFocused, setFocused]   = useState(false);
  const [showNotif, setShowNotif]     = useState(false);
  const inputRef                      = useRef(null);
  const notifRef                      = useRef(null);

  // ── Keyboard shortcut: Cmd/Ctrl + K ──────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Close notification dropdown on outside click ──────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hasResults = query.length >= 1;

  return (
    <header className={clsx(
      'fixed top-0 right-0 z-30 flex items-center gap-4',
      'h-16 px-6 bg-surface-card/90 backdrop-blur-sm',
      'border-b border-surface-border',
      'transition-all duration-300',
      isSidebarCollapsed ? 'sm:left-[4.5rem] left-0' : 'sm:left-[260px] left-0',
    )}>

      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div className="hidden sm:flex items-center gap-1.5 text-sm flex-shrink-0">
        <span className="text-ink-muted font-medium">Vimi</span>
        <ChevronRight size={13} className="text-ink-ghost" />
        <span className="text-ink font-semibold">{pageTitle}</span>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-5 bg-surface-border flex-shrink-0" />

      {/* ── Search bar ───────────────────────────────────────────────────── */}
      <div className="relative flex-1 max-w-xl">
        <div className={clsx(
          'flex items-center gap-2.5 px-3.5 rounded-xl h-10 transition-all duration-200',
          'border bg-surface-page',
          searchFocused
            ? 'border-canva-purple/50 shadow-focus ring-1 ring-canva-purple/20'
            : 'border-surface-border hover:border-canva-purple/30',
        )}>
          <Search
            size={15}
            className={clsx(
              'flex-shrink-0 transition-colors duration-200',
              searchFocused ? 'text-canva-purple' : 'text-ink-subtle',
            )}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search stores, products, orders…"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-subtle
                       outline-none min-w-0"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="flex-shrink-0 text-ink-subtle hover:text-ink">
              <X size={14} />
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-0.5 flex-shrink-0">
              <kbd className="flex items-center justify-center w-5 h-5 rounded bg-surface-border
                              text-ink-subtle text-xs font-mono">
                <Command size={10} />
              </kbd>
              <kbd className="flex items-center justify-center w-5 h-5 rounded bg-surface-border
                              text-ink-subtle text-xs font-mono">
                K
              </kbd>
            </div>
          )}
        </div>

        {/* ── Dropdown results ─────────────────────────────────────────── */}
        {searchFocused && hasResults && (
          <div className="absolute top-full left-0 right-0 mt-2 card shadow-modal z-50
                          overflow-hidden animate-scale-in">
            <div className="p-2">
              <p className="px-3 py-1.5 text-2xs font-bold text-ink-subtle uppercase tracking-wider">
                Quick results
              </p>
              {QUICK_RESULTS.filter(r =>
                r.label.toLowerCase().includes(query.toLowerCase())
              ).map((result, i) => (
                <a
                  key={i}
                  href={result.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                             hover:bg-surface-hover transition-colors duration-100 group"
                >
                  <span className={clsx(
                    'flex-shrink-0 text-2xs font-bold px-1.5 py-0.5 rounded-md',
                    TYPE_CHIP[result.type],
                  )}>
                    {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink truncate">{result.label}</div>
                    <div className="text-xs text-ink-muted truncate">{result.sub}</div>
                  </div>
                  <ChevronRight size={13} className="flex-shrink-0 text-ink-ghost
                                                     group-hover:text-ink-muted transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Right actions ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotif(p => !p)}
            className={clsx(
              'relative w-9 h-9 rounded-xl flex items-center justify-center',
              'text-ink-muted hover:text-ink hover:bg-surface-hover',
              'transition-all duration-150',
              showNotif && 'bg-surface-hover text-ink',
            )}
          >
            <Bell size={17} />
            {/* Unread dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-canva-purple
                             ring-2 ring-white animate-pulse-soft" />
          </button>

          {/* Notification dropdown */}
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 card shadow-modal z-50
                            overflow-hidden animate-scale-in">
              <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between">
                <span className="font-display font-semibold text-sm text-ink">Notifications</span>
                <span className="text-xs text-canva-purple font-medium cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-surface-border">
                {NOTIFICATIONS.map(n => (
                  <div key={n.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-surface-hover
                               transition-colors cursor-pointer">
                    <div className={clsx('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', n.dot)} />
                    <div>
                      <div className="text-sm font-medium text-ink">{n.title}</div>
                      <div className="text-xs text-ink-muted mt-0.5">{n.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-surface-border">
                <button className="text-xs text-ink-muted hover:text-ink transition-colors w-full text-center">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-canva-gradient flex items-center justify-center
                        cursor-pointer hover:scale-105 transition-transform duration-150 shadow-purple-glow/40">
          <span className="text-xs font-bold text-white font-display">HT</span>
        </div>
      </div>
    </header>
  );
}
