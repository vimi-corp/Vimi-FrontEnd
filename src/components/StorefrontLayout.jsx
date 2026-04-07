import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, X, Instagram, Facebook, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

// ── Storefront Header ─────────────────────────────────────────────────────
function StorefrontHeader({ store, cartCount = 0, onCartOpen, onSearch }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { config } = store;
  const primary = config?.primary_color ?? '#8B3DFF';

  return (
    <>
      {/* Announcement bar */}
      {config?.announcement_bar_enabled && config?.announcement_bar_text && (
        <div
          className="w-full py-2 px-4 text-center text-xs font-medium text-white"
          style={{ backgroundColor: primary }}
        >
          {config.announcement_bar_text}
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

          {/* Logo */}
          <a href="/" className="flex-shrink-0 flex items-center gap-2.5">
            {config?.logo_url ? (
              <img src={config.logo_url} alt={store.name} className="h-9 w-auto object-contain" />
            ) : (
              <div
                className="h-9 px-3 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: primary }}
              >
                <span className="text-white font-bold text-sm tracking-tight">{store.name}</span>
              </div>
            )}
          </a>

          {/* Desktop nav — categories */}
          <nav className="hidden md:flex items-center gap-1 flex-1 ml-4">
            {(store.categories ?? []).slice(0, 6).map(cat => (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600
                           hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={onSearch}
              className="w-9 h-9 rounded-lg flex items-center justify-center
                         text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
            >
              <Search size={18} />
            </button>

            <button
              onClick={onCartOpen}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center
                         text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white
                             text-[10px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: primary }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center
                         text-gray-500 hover:bg-gray-50 transition-all"
              onClick={() => setMobileOpen(p => !p)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-3 bg-white">
            {(store.categories ?? []).map(cat => (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex items-center justify-between py-2.5 text-sm
                           font-medium text-gray-700 border-b border-gray-50 last:border-0"
              >
                {cat.name}
                <ChevronRight size={14} className="text-gray-400" />
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
}

// ── Storefront Footer ─────────────────────────────────────────────────────
function StorefrontFooter({ store }) {
  const { config } = store;
  const primary = config?.primary_color ?? '#8B3DFF';
  const social  = config?.social_links ?? {};

  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <div>
            <div
              className="inline-flex items-center justify-center h-9 px-3 rounded-xl mb-3"
              style={{ backgroundColor: primary }}
            >
              <span className="text-white font-bold text-sm">{store.name}</span>
            </div>
            {config?.description && (
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                {config.description}
              </p>
            )}
            {/* Social links */}
            <div className="flex items-center gap-2 mt-4">
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer"
                   className="w-8 h-8 rounded-lg bg-white border border-gray-200
                              flex items-center justify-center text-gray-500
                              hover:text-gray-900 hover:border-gray-300 transition-all">
                  <Instagram size={14} />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noreferrer"
                   className="w-8 h-8 rounded-lg bg-white border border-gray-200
                              flex items-center justify-center text-gray-500
                              hover:text-gray-900 hover:border-gray-300 transition-all">
                  <Facebook size={14} />
                </a>
              )}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact</h3>
            <div className="space-y-1.5 text-sm text-gray-500">
              {config?.contact_email   && <p>{config.contact_email}</p>}
              {config?.contact_phone   && <p>{config.contact_phone}</p>}
              {config?.contact_address && <p className="leading-relaxed">{config.contact_address}</p>}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Shop</h3>
            <div className="space-y-1.5">
              {(store.categories ?? []).slice(0, 5).map(cat => (
                <a key={cat.id} href={`/category/${cat.slug}`}
                   className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {store.name}. All rights reserved.
          </p>
          <a
            href="https://vimi.id.vn"
            target="_blank" rel="noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Powered by <span className="font-semibold">Vimi</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

// ── Layout wrapper ────────────────────────────────────────────────────────
export default function StorefrontLayout({ store, children }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        '--store-primary':    store.config?.primary_color    ?? '#8B3DFF',
        '--store-accent':     store.config?.accent_color     ?? '#00C4CC',
        '--store-bg':         store.config?.background_color ?? '#FFFFFF',
        '--store-text':       store.config?.text_color       ?? '#1A1D23',
        '--store-font':       store.config?.font_family      ?? 'DM Sans',
        fontFamily:           'var(--store-font), sans-serif',
        backgroundColor:      'var(--store-bg)',
        color:                'var(--store-text)',
      }}
    >
      {/* Inject per-store custom CSS (Pro plan only — sanitized server-side) */}
      {store.config?.custom_css && (
        <style>{store.config.custom_css}</style>
      )}

      <StorefrontHeader
        store={store}
        onCartOpen={() => setCartOpen(true)}
      />

      <main className="flex-1">
        {children}
      </main>

      <StorefrontFooter store={store} />
    </div>
  );
}
