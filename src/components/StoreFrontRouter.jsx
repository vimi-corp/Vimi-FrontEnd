import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'https://api.stablecast.id.vn';

// ── Loading skeleton ─────────────────────────────────────────────────────
const StorefrontSkeleton = () => (
  <div className="min-h-screen bg-white animate-pulse flex flex-col">
    {/* Fake header */}
    <div className="h-16 bg-gray-100 border-b border-gray-200 flex items-center px-6 gap-4">
      <div className="h-8 w-28 bg-gray-200 rounded-lg" />
      <div className="flex-1" />
      <div className="h-8 w-20 bg-gray-200 rounded-lg" />
    </div>
    {/* Fake hero */}
    <div className="h-64 bg-gray-100 m-6 rounded-2xl" />
    {/* Fake product grid */}
    <div className="px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-56 bg-gray-100 rounded-2xl" />
      ))}
    </div>
  </div>
);

// ── Error state ───────────────────────────────────────────────────────────
const StorefrontError = ({ slug, message }) => (
  <div className="min-h-screen bg-[#F3F5F7] flex items-center justify-center p-6">
    <div className="text-center max-w-sm">
      <div className="text-6xl mb-6">🏪</div>
      <h1 className="font-display font-bold text-2xl text-[#1A1D23] mb-3">
        Store not found
      </h1>
      <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
        <strong className="text-[#1A1D23]">{slug}.vimi.id.vn</strong> doesn't exist or
        has been deactivated. {message && <>({message})</>}
      </p>
      <a
        href="https://vimi.id.vn"
        className="inline-flex items-center gap-2 bg-[#8B3DFF] text-white font-semibold
                   text-sm px-5 py-2.5 rounded-xl hover:bg-[#7B2FEF] transition-colors"
      >
        Build your own store →
      </a>
    </div>
  </div>
);

// ── Minimal storefront shell ──────────────────────────────────────────────
// Full implementation happens in Step 4 (Storefront UI).
// This file handles all the data-fetching and routing logic so Step 4 can
// focus purely on the storefront UI components.
const StorefrontShell = ({ store }) => {
  const { config: cfg, products } = store;

  // Apply the merchant's custom theme colors as CSS variables on :root
  useEffect(() => {
    if (cfg?.primary_color) {
      document.documentElement.style.setProperty('--store-primary', cfg.primary_color);
    }
    if (cfg?.accent_color) {
      document.documentElement.style.setProperty('--store-accent', cfg.accent_color);
    }
    if (cfg?.font_family) {
      document.documentElement.style.setProperty('--store-font', cfg.font_family);
    }
    // Set the browser tab title to the store name
    document.title = `${store.name} — Powered by Vimi`;
  }, [cfg, store.name]);

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header */}
      <header className="h-16 border-b border-gray-100 flex items-center px-6"
        style={{ backgroundColor: cfg?.primary_color ?? '#8B3DFF' }}>
        {cfg?.logo_url ? (
          <img src={cfg.logo_url} alt={store.name} className="h-8 object-contain" />
        ) : (
          <span className="font-display font-bold text-white text-xl">{store.name}</span>
        )}
      </header>

      {/* Placeholder — replaced by full Storefront UI in Step 4 */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-2 bg-[#8B3DFF]/10 text-[#8B3DFF]
                          text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            ✓ Storefront is live
          </div>
          <h1 className="font-display font-bold text-4xl text-[#1A1D23] mb-3">
            {store.name}
          </h1>
          {cfg?.description && (
            <p className="text-[#6B7280] max-w-md mx-auto">{cfg.description}</p>
          )}
          <p className="text-sm text-[#9CA3AF] mt-4">
            Full storefront UI coming in Step 4 · {products?.length ?? 0} products loaded
          </p>
        </div>

        {/* Product preview grid */}
        {products?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 8).map(p => (
              <div key={p.id}
                className="bg-[#F3F5F7] rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name}
                    className="w-full aspect-square object-cover rounded-xl mb-3" />
                ) : (
                  <div className="w-full aspect-square bg-gray-200 rounded-xl mb-3
                                  flex items-center justify-center text-3xl">📦</div>
                )}
                <div className="font-semibold text-sm text-[#1A1D23] truncate">{p.name}</div>
                <div className="text-sm font-bold mt-1" style={{ color: cfg?.primary_color ?? '#8B3DFF' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                    .format(p.base_price)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// ── Main StorefrontRouter ─────────────────────────────────────────────────
export default function StorefrontRouter({ subdomain }) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    if (!subdomain) return;

    const controller = new AbortController();

    const fetchStore = async () => {
      try {
        // Single call returns: store config + product listing
        // Backend endpoint: GET /api/v1/storefront/:slug
        const res = await fetch(
          `${API_BASE}/api/v1/storefront/${encodeURIComponent(subdomain)}`,
          {
            headers: {
              'Content-Type':  'application/json',
              'X-Store-Slug':  subdomain,
            },
            signal: controller.signal,
          },
        );

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error?.message ?? `HTTP ${res.status}`);
        }

        const { data } = await res.json();
        setState({ status: 'success', data, error: null });
      } catch (err) {
        if (err.name === 'AbortError') return;
        setState({ status: 'error', data: null, error: err.message });
      }
    };

    fetchStore();
    return () => controller.abort();
  }, [subdomain]);

  if (state.status === 'loading') return <StorefrontSkeleton />;
  if (state.status === 'error')
    return <StorefrontError slug={subdomain} message={state.error} />;

  return <StorefrontShell store={state.data} />;
}
