import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Store, Check, Plus, Palette } from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export default function StoreSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [stores, setStores] = useState([
    { id: 1, name: 'Vimi Official', subdomain: 'official', active: true },
    { id: 2, name: 'Minimalist Shop', subdomain: 'minimalist', active: false },
  ]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeStore = stores.find(s => s.active) || stores[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 border w-full",
          isOpen ? "border-purple-200 bg-purple-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm"
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-inner text-white font-bold shrink-0">
          {activeStore.name.charAt(0)}
        </div>
        <div className="flex flex-col text-left flex-1 min-w-0 pr-2">
          <span className="text-sm font-black text-slate-800 truncate leading-tight tracking-tight">{activeStore.name}</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">Free Plan</span>
        </div>
        <ChevronDown size={14} className={clsx("text-slate-400 shrink-0 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[240px] bg-white rounded-2xl shadow-xl border border-slate-100 z-[100] overflow-hidden animate-scale-in origin-top">
          <div className="p-1.5 border-b border-slate-50">
            {stores.map(store => (
              <button
                key={store.id}
                onClick={() => {
                  setStores(stores.map(s => ({ ...s, active: s.id === store.id })));
                  setIsOpen(false);
                }}
                className={clsx(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-150 relative overflow-hidden",
                  store.active ? "bg-purple-50 text-purple-700 font-bold" : "hover:bg-slate-50 text-slate-600 font-medium"
                )}
              >
                <Store size={16} className={store.active ? "text-purple-600" : "text-slate-400"} />
                <span className="flex-1 text-sm text-left truncate">{store.name}</span>
                {store.active && <Check size={16} className="text-purple-600" />}
              </button>
            ))}
          </div>
          <div className="p-1.5 bg-slate-50 border-t border-slate-100 flex flex-col">
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 hover:text-slate-800 text-sm font-bold text-slate-600 transition-colors">
              <Plus size={16} className="text-slate-400" />
              Create new store
            </button>
            <Link to="/onboarding/templates" className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 hover:text-slate-800 text-sm font-bold text-slate-600 transition-colors">
              <Palette size={16} className="text-slate-400" />
              Explore Themes
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
