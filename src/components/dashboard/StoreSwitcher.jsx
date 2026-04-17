import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Store as StoreIcon } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import clsx from 'clsx';

export default function StoreSwitcher() {
  const { stores, activeStore, switchStore } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!stores || stores.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200",
          isOpen ? "bg-surface-hover border-canva-purple/30" : "bg-surface-page border-surface-border hover:border-canva-purple/30 hover:bg-surface-hover"
        )}
      >
        <div className="w-6 h-6 rounded bg-canva-purple/10 flex items-center justify-center text-canva-purple">
          <StoreIcon size={14} />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-bold text-ink leading-tight truncate max-w-[120px]">
            {activeStore?.name || 'My Store'}
          </div>
        </div>
        <ChevronDown size={14} className="text-ink-subtle ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-surface-card rounded-xl shadow-modal border border-surface-border z-50 overflow-hidden animate-scale-in">
          <div className="px-3 py-2 border-b border-surface-border bg-slate-50">
            <span className="text-xs font-bold text-ink-subtle uppercase tracking-wider">Switch Store</span>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => {
                  setIsOpen(false);
                  if (store.id !== activeStore?.id) switchStore(store.id);
                }}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  store.id === activeStore?.id ? "bg-canva-purple/5" : "hover:bg-surface-hover"
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-surface-page border border-surface-border flex items-center justify-center font-bold text-ink-subtle text-xs">
                  {store.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={clsx("text-sm font-medium truncate", store.id === activeStore?.id ? "text-canva-purple font-bold" : "text-ink")}>
                    {store.name}
                  </div>
                  <div className="text-xs text-ink-subtle truncate">{store.subdomain}.vimi.id.vn</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
