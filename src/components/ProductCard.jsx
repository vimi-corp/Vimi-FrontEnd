import React, { useState } from 'react';
import clsx from 'clsx';
import { ShoppingCart, Heart, Eye } from 'lucide-react';

const STOCK_BADGE = {
  low_stock:    { label: 'Only a few left', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  out_of_stock: { label: 'Sold out',        cls: 'bg-gray-100 text-gray-500 border-gray-200' },
};

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  function ProductCard({ product, primaryColor = '#8B3DFF', onAddToCart }) {
  const [wished, setWished] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageUrl   = product.primary_image_url ?? product.images?.[0]?.url;
  const imageAlt   = product.primary_image_alt ?? product.name;
  const stockBadge = STOCK_BADGE[product.stock_status];
  const isSoldOut  = product.stock_status === 'out_of_stock';
  const hasDiscount = product.compare_at_price && Number(product.compare_at_price) > Number(product.base_price);
  const discountPct = hasDiscount
    ? Math.round((1 - Number(product.base_price) / Number(product.compare_at_price)) * 100)
    : 0;

  return (
    <article
      className={clsx(
        'group relative bg-white rounded-2xl overflow-hidden',
        'border border-gray-100 hover:border-gray-200',
        'transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]',
        'hover:-translate-y-0.5',
        isSoldOut && 'opacity-75',
      )}
    >
      {/* ── Product image ─────────────────────────────────────────────── */}
      <a href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500
                       group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-50">
            📦
          </div>
        )}

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        <div className="absolute bottom-3 left-0 right-0 flex justify-center
                        opacity-0 group-hover:opacity-100 translate-y-2
                        group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart?.(product); }}
            disabled={isSoldOut}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold',
              'shadow-lg transition-all duration-150 active:scale-95',
              isSoldOut ? 'bg-gray-400 cursor-not-allowed' : 'hover:opacity-90',
            )}
            style={{ backgroundColor: isSoldOut ? undefined : primaryColor }}
          >
            <ShoppingCart size={14} />
            {isSoldOut ? 'Sold out' : 'Add to cart'}
          </button>
        </div>

        {/* Badges: discount + stock */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-red-500 text-white shadow-sm">
              -{discountPct}%
            </span>
          )}
          {stockBadge && (
            <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-lg border', stockBadge.cls)}>
              {stockBadge.label}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWished(p => !p); }}
          className={clsx(
            'absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center',
            'bg-white/90 backdrop-blur-sm border border-white/50 shadow-sm',
            'opacity-0 group-hover:opacity-100 transition-all duration-200',
            'hover:scale-110 active:scale-95',
          )}
        >
          <Heart
            size={14}
            className={wished ? 'text-red-500 fill-red-500' : 'text-gray-500'}
          />
        </button>
      </a>

      {/* ── Product info ──────────────────────────────────────────────── */}
      <div className="p-4">
        {product.category_name && (
          <p className="text-xs text-gray-400 font-medium mb-1 truncate">{product.category_name}</p>
        )}
        <a href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2
                         hover:underline underline-offset-2 transition-colors">
            {product.name}
          </h3>
        </a>

        <div className="flex items-center gap-2">
          <span className="font-bold text-base" style={{ color: primaryColor }}>
            {formatVND(product.base_price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatVND(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
export default ProductCard;
