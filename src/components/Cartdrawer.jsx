import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function CartDrawer({ open, onClose, items = [], onUpdate, onCheckout, primaryColor = '#8B3DFF' }) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={clsx(
          'fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl',
          'flex flex-col transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} style={{ color: primaryColor }} />
            <span className="font-semibold text-gray-900">
              Your Cart {items.length > 0 && <span className="text-gray-400 font-normal">({items.length})</span>}
            </span>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center
                       text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">Your cart is empty</p>
              <button onClick={onClose}
                className="mt-4 text-sm font-semibold hover:underline"
                style={{ color: primaryColor }}>
                Continue shopping
              </button>
            </div>
          ) : items.map(item => (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                {item.variant && (
                  <p className="text-xs text-gray-400 mt-0.5">{item.variant}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button onClick={() => onUpdate(item.id, item.qty - 1)}
                      className="w-6 h-6 rounded-lg border border-gray-200 flex items-center
                                 justify-center text-gray-500 hover:border-gray-400 transition-colors">
                      <Minus size={10} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                    <button onClick={() => onUpdate(item.id, item.qty + 1)}
                      className="w-6 h-6 rounded-lg border border-gray-200 flex items-center
                                 justify-center text-gray-500 hover:border-gray-400 transition-colors">
                      <Plus size={10} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: primaryColor }}>
                      {formatVND(Number(item.price) * item.qty)}
                    </span>
                    <button onClick={() => onUpdate(item.id, 0)}
                      className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold text-gray-900">{formatVND(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
            <button
              onClick={onCheckout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                         text-white font-semibold text-sm
                         hover:opacity-90 active:scale-[0.98] transition-all duration-150"
              style={{ backgroundColor: primaryColor }}
            >
              Proceed to Checkout
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
