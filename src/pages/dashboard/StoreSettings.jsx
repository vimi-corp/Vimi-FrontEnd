import React, { useState, useEffect } from 'react';
import { stores } from '../../lib/api';
import { Save } from 'lucide-react';
import clsx from 'clsx';

export default function StoreSettings() {
  const [form, setForm] = useState({ name: '', subdomain: '', theme: '#8B3DFF' });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    stores.get().then(res => {
      if (res.data) setForm({ name: res.data.name || '', subdomain: res.data.subdomain || '', theme: res.data.theme || '#8B3DFF' });
    }).catch(() => {})
      .finally(() => setInitialLoad(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await stores.updateConfig(form);
      alert('Settings saved successfully!');
    } catch {
      // Intentionally silent handle for mock demo or provide alert
    } finally {
      setLoading(false);
    }
  };

  if(initialLoad) return <div className="p-8 animate-pulse flex flex-col gap-4 max-w-2xl"><div className="h-8 bg-slate-200 w-1/3 rounded-lg"></div><div className="h-64 bg-slate-100 rounded-2xl mt-4"></div></div>;

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1A1D23] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Store Settings</h1>
        <p className="text-[#6B7280] mt-1 text-sm font-medium">Configure your core brand properties and URLs.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border border-slate-100 p-8">
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <div className="md:col-span-1 pt-2">
              <label className="text-sm font-bold text-slate-800">Store Name</label>
              <p className="text-xs text-slate-500 mt-1">Displayed on storefront headers</p>
            </div>
            <div className="md:col-span-3">
              <input type="text" placeholder="My Awesome Store" value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
                     className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:border-[#8B3DFF] focus:ring-1 focus:ring-[#8B3DFF] outline-none transition-all placeholder:text-slate-400" />
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-2" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <div className="md:col-span-1 pt-2">
              <label className="text-sm font-bold text-slate-800">Domain Routing</label>
              <p className="text-xs text-slate-500 mt-1">Your free Vimi subdomain network prefix</p>
            </div>
            <div className="md:col-span-3">
              <div className="flex items-center shadow-sm rounded-xl overflow-hidden border border-slate-200 focus-within:border-[#8B3DFF] focus-within:ring-1 focus-within:ring-[#8B3DFF] transition-all">
                <span className="text-slate-400 font-semibold text-sm bg-slate-50 px-4 py-2.5 border-r border-slate-200">https://</span>
                <input type="text" placeholder="mystore" value={form.subdomain} onChange={e => setForm({...form, subdomain: e.target.value})} 
                       className="flex-1 w-full px-3 py-2.5 bg-white text-sm font-bold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-300" />
                <span className="text-slate-500 font-semibold text-sm bg-slate-50 px-4 py-2.5 border-l border-slate-200">.vimi.id.vn</span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-2" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <div className="md:col-span-1 pt-2">
              <label className="text-sm font-bold text-slate-800">Theme Color</label>
              <p className="text-xs text-slate-500 mt-1">Accent color for buttons & links</p>
            </div>
            <div className="md:col-span-3 flex items-center gap-4">
              <div className="relative overflow-hidden w-12 h-12 rounded-xl shadow-sm border-2 border-white ring-1 ring-slate-200 cursor-pointer group">
                <input type="color" value={form.theme} onChange={e => setForm({...form, theme: e.target.value})} 
                       className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" />
              </div>
              <span className="text-slate-600 font-mono text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">{form.theme}</span>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
          <button disabled={loading} type="submit" 
                  className={clsx(
                    "flex items-center gap-2 bg-[#8B3DFF] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200",
                    loading ? "opacity-70 cursor-wait" : "hover:shadow-lg hover:-translate-y-0.5"
                  )}
                  style={{ boxShadow: loading ? 'none' : '0 4px 14px rgba(139,61,255,0.3)', background: 'linear-gradient(135deg, #8B3DFF 0%, #6B20EF 100%)' }}>
            {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <Save size={16} />}
            {loading ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
