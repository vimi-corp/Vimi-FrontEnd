import React from 'react';
import { Palette, Shield, User, Bell, Globe, Monitor, Zap } from 'lucide-react';
import clsx from 'clsx';
import { useTheme, THEMES } from '../../context/ThemeContext';

function SettingSection({ title, children, icon: Icon }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mb-6">
      <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-violet-600">
          <Icon size={18} />
        </div>
        <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your platform preferences and account security.</p>
      </div>

      <div className="max-w-4xl">
        {/* Appearance Section */}
        <SettingSection title="Appearance" icon={Palette}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">Choose Theme</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(THEMES).map(([id, t]) => (
                  <button
                    key={id}
                    onClick={() => setTheme(id)}
                    className={clsx(
                      'flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all group',
                      theme === id 
                        ? 'border-violet-600 bg-violet-50/50' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    )}
                  >
                    <div className="w-full h-24 rounded-xl shadow-inner mb-2 relative overflow-hidden flex flex-col p-2 gap-1"
                      style={{ background: t['--theme-bg'] }}>
                      <div className="w-full h-3 rounded-md bg-white/20" style={{ background: t['--theme-surface'] }} />
                      <div className="w-2/3 h-3 rounded-md bg-white/20" style={{ background: t['--theme-surface'] }} />
                      <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full shadow-lg flex items-center justify-center"
                        style={{ background: t['--theme-accent'] }}>
                        <div className="w-3 h-3 bg-white rounded-full opacity-60" />
                      </div>
                    </div>
                    <span className={clsx(
                      'text-sm font-bold tracking-tight',
                      theme === id ? 'text-violet-700' : 'text-slate-600 group-hover:text-slate-900'
                    )}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-sm">Reduced Motion</p>
                <p className="text-xs text-slate-500 font-medium">Disable complex animations for better performance.</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-slate-200 relative transition-colors">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>
        </SettingSection>

        {/* Security Section */}
        <SettingSection title="Security" icon={Shield}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Zap size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500 font-medium">Add an extra layer of security to your account.</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl text-sm font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 transition-colors">
                Enable
              </button>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Monitor size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Active Sessions</p>
                  <p className="text-xs text-slate-500 font-medium">Manage devices currently logged into your account.</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                View All
              </button>
            </div>
          </div>
        </SettingSection>

        {/* Danger Zone */}
        <div className="mt-12 p-8 rounded-3xl border border-red-100 bg-red-50/30 flex items-center justify-between">
           <div>
             <h4 className="font-bold text-red-900 mb-1">Danger Zone</h4>
             <p className="text-xs text-red-700/70 font-medium leading-relaxed max-w-sm">
               Once you delete your account, there is no going back. Please be certain.
             </p>
           </div>
           <button className="px-6 py-3 rounded-2xl bg-white border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-all shadow-sm">
             Delete Account
           </button>
        </div>
      </div>
    </div>
  );
}
