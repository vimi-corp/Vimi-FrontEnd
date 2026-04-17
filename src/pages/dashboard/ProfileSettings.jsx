import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/useAuth';
import { users } from '../../lib/api';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', company: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        company: '' // Backend may not support company on User yet
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await users.updateMe({ fullName: form.fullName });
      toast.success('Profile updated successfully!');
      // Note: A full page reload or AuthContext refresh might be needed to see changes
      // in the top Header Avatar immediately, but toast is sufficient for notification.
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-3xl animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">Update your personal account details.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-6 pb-8 border-b border-slate-100 mb-8">
           <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 shadow-inner flex items-center justify-center cursor-pointer group relative overflow-hidden ring-4 ring-slate-50">
             <span className="text-white font-black text-2xl group-hover:opacity-0 transition-opacity">
               {getInitials(form.fullName)}
             </span>
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-white text-xs text-center leading-tight">
               Upload<br/>Photo
             </div>
           </div>
           <div>
             <h3 className="font-bold text-slate-800 text-lg">{form.fullName || 'Merchant'}</h3>
             <button type="button" className="mt-1 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">Change Avatar</button>
           </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <label className="text-sm font-bold text-slate-800 md:col-span-1">Full Name</label>
            <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="md:col-span-3 w-full px-4 py-3 rounded-xl border border-slate-200 font-medium text-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <label className="text-sm font-bold text-slate-800 md:col-span-1">Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} disabled className="md:col-span-3 w-full px-4 py-3 rounded-xl border border-slate-200 font-medium text-slate-500 bg-slate-50 outline-none cursor-not-allowed" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <label className="text-sm font-bold text-slate-800 md:col-span-1">Company</label>
            <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Optional company name" className="md:col-span-3 w-full px-4 py-3 rounded-xl border border-slate-200 font-medium text-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all" />
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button disabled={loading} type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
