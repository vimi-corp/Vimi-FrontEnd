import React, { useEffect, useState } from 'react';
import { Search, Users as UsersIcon, Info } from 'lucide-react';
import { customers } from '../../lib/api';

const MOCK_CUSTOMERS = [
  { id: 'CUST-001', name: 'John Doe', email: 'john@example.com', orders: 3, totalSpent: 1250000, lastOrder: '2026-04-10' },
  { id: 'CUST-002', name: 'Jane Smith', email: 'jane@example.com', orders: 1, totalSpent: 450000, lastOrder: '2026-04-12' },
  { id: 'CUST-003', name: 'Alice Johnson', email: 'alice@example.com', orders: 5, totalSpent: 3500000, lastOrder: '2026-04-14' },
];

export default function Customers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch from API, but fallback to mock data since endpoint isn't ready
    customers.list()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setItems(res.data);
        } else {
          setItems(MOCK_CUSTOMERS);
        }
      })
      .catch(() => {
        setItems(MOCK_CUSTOMERS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1D23] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Customers</h1>
          <p className="text-[#6B7280] mt-1 text-sm font-medium">Manage your customer relationships and view order history.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <h3 className="text-sm font-semibold text-amber-800">Demo Data - Backend endpoint coming soon</h3>
          <p className="text-sm text-amber-700 mt-1">
            The `GET /api/customers` endpoint is not fully available yet. Displaying mock data for demonstration purposes.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-100">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search customers..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#8B3DFF] focus:ring-1 focus:ring-[#8B3DFF] outline-none bg-white transition-all" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#F8F9FA] border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg">Customer Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4 text-right">Total Spent</th>
                <th className="px-6 py-4 text-right rounded-tr-lg">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-12 mx-auto"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <UsersIcon size={24} className="text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-700">No customers yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-slate-800 font-semibold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#8B3DFF]/10 text-[#8B3DFF] flex items-center justify-center font-bold text-xs uppercase">
                        {c.name.charAt(0)}
                      </div>
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{c.email}</td>
                    <td className="px-6 py-4 text-center font-medium bg-slate-50/50">{c.orders}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-600">₫{(c.totalSpent || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-slate-500">{new Date(c.lastOrder).toLocaleDateString()}</td>
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
