import React, { useEffect, useState } from 'react';
import { Plus, Search, MoreHorizontal, PackageOpen } from 'lucide-react';
import { products } from '../../lib/api';

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    products.list()
      .then(res => setItems(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1D23] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Products</h1>
          <p className="text-[#6B7280] mt-1 text-sm font-medium">Manage your catalog, pricing, and inventory.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#8B3DFF] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                style={{ boxShadow: '0 4px 14px rgba(139,61,255,0.3)', background: 'linear-gradient(135deg, #8B3DFF 0%, #6B20EF 100%)' }}>
          <Plus size={16} strokeWidth={3} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-100">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#8B3DFF] focus:ring-1 focus:ring-[#8B3DFF] outline-none bg-white transition-all" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#F8F9FA] border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg">Product Name</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-[#8B3DFF] border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <PackageOpen size={24} className="text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-700">No products yet</p>
                      <p className="text-slate-400 text-sm max-w-sm mx-auto mb-2">Get started by creating your first product to display on your storefront.</p>
                      <button className="text-sm font-semibold text-[#8B3DFF] hover:underline">Create a Product</button>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-slate-800 font-semibold">{p.name}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">₫{(p.price || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">{p.stock || '∞'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-[#00C4CC]/10 text-[#009b9e] px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                        {p.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-[#8B3DFF] transition-colors p-1 rounded hover:bg-[#8B3DFF]/10">
                        <MoreHorizontal size={18} />
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
