import React, { useState } from 'react';
import clsx from 'clsx';
import { ArrowRight, Sparkles, Star, TrendingUp, Filter, Grid3X3, List, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest first' },
  { value: 'popular',    label: 'Best selling' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name',       label: 'Name A–Z' },
];

// ── Hero Banner ───────────────────────────────────────────────────────────
function HeroBanner({ store }) {
  const { config } = store;
  const primary = config?.primary_color ?? '#8B3DFF';
  const accent  = config?.accent_color  ?? '#00C4CC';
  const hasBanner = !!config?.banner_url;

  if (hasBanner) {
    return (
      <div className="relative w-full h-[420px] sm:h-[560px] overflow-hidden">
        <img
          src={config.banner_url}
          alt={`${store.name} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-lg">
              <h1 className="font-bold text-4xl sm:text-5xl text-white leading-tight mb-4 text-balance">
                {config?.seo_meta?.title ?? store.name}
              </h1>
              {config?.description && (
                <p className="text-white/80 text-base sm:text-lg mb-6 leading-relaxed line-clamp-2">
                  {config.description}
                </p>
              )}
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                           text-white shadow-lg hover:shadow-xl hover:scale-[1.02]
                           active:scale-[0.98] transition-all duration-200"
                style={{ backgroundColor: primary }}
              >
                Shop now
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generated gradient banner when no image is uploaded
  return (
    <div
      className="relative w-full h-[360px] sm:h-[480px] overflow-hidden flex items-center"
      style={{ background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)` }}
    >
      {/* Decorative orbs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-10 left-20 w-60 h-60 rounded-full bg-black/10 blur-2xl" />

      {/* Floating shapes */}
      <div className="absolute top-10 right-16 w-24 h-24 rounded-3xl bg-white/10 rotate-12" />
      <div className="absolute bottom-10 right-36 w-16 h-16 rounded-2xl bg-white/5 -rotate-6" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20
                          rounded-full px-3 py-1.5 mb-5 text-xs font-medium text-white/90">
            <Sparkles size={11} />
            Welcome to {store.name}
          </div>
          <h1 className="font-bold text-4xl sm:text-5xl text-white leading-tight mb-4 text-balance">
            {config?.seo_meta?.title ?? `Discover ${store.name}`}
          </h1>
          {config?.description && (
            <p className="text-white/75 text-base sm:text-lg mb-7 leading-relaxed max-w-md">
              {config.description}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <a
              href="#products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                         bg-white shadow-lg hover:shadow-xl hover:scale-[1.02]
                         active:scale-[0.98] transition-all duration-200"
              style={{ color: primary }}
            >
              Shop all products
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Category chips ────────────────────────────────────────────────────────
function CategoryChips({ categories, active, onSelect, primaryColor }) {
  if (!categories.length) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={clsx(
          'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
          !active
            ? 'text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        )}
        style={!active ? { backgroundColor: primaryColor } : {}}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={clsx(
            'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
            active === cat.slug
              ? 'text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          )}
          style={active === cat.slug ? { backgroundColor: primaryColor } : {}}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

// ── Product grid skeleton ─────────────────────────────────────────────────
const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-square rounded-2xl bg-gray-100 mb-3" />
    <div className="h-3 bg-gray-100 rounded-full w-1/3 mb-2" />
    <div className="h-4 bg-gray-100 rounded-full w-4/5 mb-2" />
    <div className="h-4 bg-gray-100 rounded-full w-2/5" />
  </div>
);

// ── Main homepage ─────────────────────────────────────────────────────────
export default function StorefrontHome({
  store, products, categories, pagination,
  loading, onAddToCart, onLoadMore, fetchPage,
}) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [sort,           setSort]           = useState('created_at');
  const [sortOpen,       setSortOpen]       = useState(false);
  const [view,           setView]           = useState('grid'); // 'grid' | 'list'

  const primary = store.config?.primary_color ?? '#8B3DFF';

  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    fetchPage({ category_slug: slug ?? undefined, page: '1' });
  };

  const handleSortChange = (val) => {
    setSort(val);
    setSortOpen(false);
    fetchPage({ sort: val, page: '1' });
  };

  const sortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'Sort';

  return (
    <div>
      {/* Hero */}
      <HeroBanner store={store} />

      {/* Trust bar */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-medium">
            {[
              { icon: '🚚', text: 'Free shipping over ₫500K' },
              { icon: '🔄', text: '30-day returns' },
              { icon: '🔒', text: 'Secure checkout' },
              { icon: '⭐', text: 'Verified store' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-bold text-2xl text-gray-900">
              {activeCategory
                ? categories.find(c => c.slug === activeCategory)?.name ?? 'Products'
                : 'All Products'}
            </h2>
            {pagination && (
              <p className="text-sm text-gray-400 mt-0.5">
                {pagination.total} {pagination.total === 1 ? 'product' : 'products'}
              </p>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(p => !p)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                           bg-white border border-gray-200 text-gray-700
                           hover:border-gray-300 transition-colors"
              >
                <Filter size={13} className="text-gray-400" />
                {sortLabel}
                <ChevronDown size={13} className={clsx('text-gray-400 transition-transform', sortOpen && 'rotate-180')} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl border
                                border-gray-200 shadow-lg z-20 py-1 overflow-hidden">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSortChange(opt.value)}
                      className={clsx(
                        'w-full text-left px-4 py-2.5 text-sm transition-colors',
                        sort === opt.value
                          ? 'font-semibold'
                          : 'text-gray-700 hover:bg-gray-50',
                      )}
                      style={sort === opt.value ? { color: primary } : {}}
                    >
                      {opt.value === sort && '✓ '}{opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-0.5">
              <button
                onClick={() => setView('grid')}
                className={clsx(
                  'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                  view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600',
                )}
              >
                <Grid3X3 size={13} />
              </button>
              <button
                onClick={() => setView('list')}
                className={clsx(
                  'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                  view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600',
                )}
              >
                <List size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Category chips */}
        <div className="mb-6">
          <CategoryChips
            categories={categories}
            active={activeCategory}
            onSelect={handleCategoryChange}
            primaryColor={primary}
          />
        </div>

        {/* Product grid */}
        {loading && products.length === 0 ? (
          <div className={clsx(
            'grid gap-4',
            view === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1',
          )}>
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-1">No products found</h3>
            <p className="text-sm text-gray-400">
              {activeCategory ? 'Try a different category.' : 'This store has no active products yet.'}
            </p>
          </div>
        ) : (
          <div className={clsx(
            'grid gap-4',
            view === 'grid'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2',
          )}>
            {products.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(i, 7) * 50}ms` }}
              >
                <ProductCard
                  product={product}
                  primaryColor={primary}
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination?.hasNextPage && (
          <div className="flex justify-center mt-12">
            <button
              onClick={onLoadMore}
              disabled={loading}
              className={clsx(
                'flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm',
                'border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md',
              )}
              style={{ borderColor: primary, color: primary }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <TrendingUp size={15} />
              )}
              {loading ? 'Loading…' : `Load more (${pagination.total - products.length} remaining)`}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
