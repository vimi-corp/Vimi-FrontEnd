import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronRight, Command, X, Eye, Edit3, Settings, Store, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { stores } from '../lib/api';
import { useAuth } from '../lib/useAuth';

const QUICK_RESULTS = [
  { type: 'store', label: 'Trimi Official', href: '#' },
  { type: 'template', label: 'Minimalist Shop', href: '#' },
  { type: 'doc', label: 'Shipping settings', href: '#' },
];

export default function Header({ pageTitle = 'Home', isSidebarCollapsed = false }) {
  const { activeStore, logout, user } = useAuth();
  const [query, setQuery] = useState('');
  const [searchFocused, setFocused] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const inputRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Subdomain is now derived from activeStore
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 right-0 z-30 flex items-center justify-between',
        'h-[72px] px-6 backdrop-blur-md theme-surface',
        'border-b theme-border shadow-[0_4px_30px_rgba(0,0,0,0.04)]',
        'transition-all duration-300 ease-in-out',
        isSidebarCollapsed ? 'sm:left-[4.5rem] left-0' : 'sm:left-[260px] left-0',
      )}>
      {/* Left items */}
      <div className="flex items-center gap-4 flex-1">
        <div className="hidden sm:flex items-center gap-1.5 text-sm">
          <span className="text-slate-500 font-medium">Vimi</span>
          <ChevronRight size={13} className="text-slate-300" />
          <span className="text-slate-800 font-bold tracking-tight">{pageTitle}</span>
        </div>
        <div className="hidden sm:block w-px h-5 bg-slate-200" />

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <div className={clsx(
            'flex items-center gap-2.5 px-3 rounded-xl h-10 transition-all border',
            searchFocused ? 'border-purple-400 ring-4 ring-purple-100 bg-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'
          )}>
            <Search size={15} className={searchFocused ? 'text-purple-500' : 'text-slate-400'} />
            <input
              ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Search..." className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Editor Actions */}
        <a href={`http://${activeStore?.subdomain || 'demo'}.localhost:5173`} target="_blank" rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm border border-slate-200/50">
          <Eye size={16} className="text-slate-500" />
          Live Store
        </a>

        <Link to={`/dashboard/customize/${activeStore?.templateId || 'default'}`}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 transition-transform shadow-lg shadow-purple-500/30">
          <Edit3 size={16} />
          Edit Storefront
        </Link>
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button onClick={() => setShowNotif(p => !p)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button onClick={() => setShowProfile(p => !p)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 hover:border-purple-300 transition-colors bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center shadow-inner">
            <span className="text-white font-bold text-xs">HT</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 p-1.5 animate-scale-in origin-top-right">
              <div className="px-3 py-3 border-b border-slate-50 mb-1">
                <p className="font-bold text-slate-800 text-sm">{user?.fullName || 'Merchant'}</p>
                <p className="text-xs text-slate-500 font-medium">{user?.email || 'merchant@vimi.id.vn'}</p>
              </div>
              <Link to="/dashboard/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                <Settings size={16} /> Profile Settings
              </Link>
              <Link to="/dashboard/stores" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                <Store size={16} /> My Stores
              </Link>
              <div className="h-px bg-slate-100 my-1 mx-2" />
              <button onClick={() => { setShowProfile(false); logout(); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors text-left">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
