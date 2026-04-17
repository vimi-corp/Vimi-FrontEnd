import React, { useEffect, useState } from 'react';
import { Plus, Search, MoreHorizontal, PackageOpen, X, Upload, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { products } from '../../lib/api';

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '' });

  const loadProducts = () => {
    setLoading(true);
    products.list()
      .then(res => setItems(res.data || []))
      .catch((err) => toast.error(err.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.price) {
      toast.error('Name and price are required.');
      return;
    }
    setCreating(true);
    try {
      await products.create({
        name: form.name,
        price: Number(form.price),
        stock: form.stock ? Number(form.stock) : 0,
        description: form.description
      });
      toast.success('Product created successfully!');
      setShowModal(false);
      setForm({ name: '', price: '', stock: '', description: '' });
      loadProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to create product.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1D23] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Products</h1>
          <p className="text-[#6B7280] mt-1 text-sm font-medium">Manage your catalog, pricing, and inventory.</p>
        </div>
        <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-[#8B3DFF] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
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
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
                    <td className="px-6 py-5"><div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div></td>
                    <td className="px-6 py-5"><div className="h-8 bg-slate-200 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <PackageOpen size={24} className="text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-700">No products yet</p>
                      <p className="text-slate-400 text-sm max-w-sm mx-auto mb-2">Get started by creating your first product to display on your storefront.</p>
                      <button onClick={() => setShowModal(true)} className="text-sm font-semibold text-[#8B3DFF] hover:underline">Create a Product</button>
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

      {/* Internal Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in-fast">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Add New Product</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                disabled={creating}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Premium Cotton T-Shirt" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#8B3DFF] focus:ring-1 focus:ring-[#8B3DFF] outline-none transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₫</span>
                      <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0" className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#8B3DFF] focus:ring-1 focus:ring-[#8B3DFF] outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Stock</label>
                    <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="Unlimited" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#8B3DFF] focus:ring-1 focus:ring-[#8B3DFF] outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="3" placeholder="Describe your product..." className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#8B3DFF] focus:ring-1 focus:ring-[#8B3DFF] outline-none transition-all resize-none"></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Image</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer text-sm">
                    <Upload size={24} className="mb-2 text-slate-400" />
                    <span className="font-medium text-[#8B3DFF]">Click to upload</span>
                    <span className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max 2MB)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                disabled={creating}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
               >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                disabled={creating || !form.name || !form.price}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 text-white transition-all bg-[#8B3DFF] hover:bg-[#722CEB] shadow-sm hover:shadow disabled:opacity-60"
              >
                {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />} 
                {creating ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
