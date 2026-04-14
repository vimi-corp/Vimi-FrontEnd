import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, Eye } from 'lucide-react';
import { orders } from '../../lib/api';

export default function Orders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orders.list()
      .then(res => setItems(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch((status || '').toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1A1D23] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Orders</h1>
        <p className="text-[#6B7280] mt-1 text-sm font-medium">Track and fulfill customer orders.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-100">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search order ID..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#8B3DFF] focus:ring-1 focus:ring-[#8B3DFF] outline-none bg-white transition-all" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#F8F9FA] border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                     <div className="flex justify-center"><div className="w-6 h-6 border-2 border-[#8B3DFF] border-t-transparent rounded-full animate-spin"></div></div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <ShoppingBag size={24} className="text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-700">No orders yet</p>
                      <p className="text-slate-400 text-sm">When customers place orders, they will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">#{o.id}</td>
                    <td className="px-6 py-4 font-medium">{o.customerName || 'Guest User'}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">₫{(o.total || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getStatusColor(o.status)}`}>
                        {o.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-[#8B3DFF] transition-colors p-1 rounded hover:bg-[#8B3DFF]/10">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
