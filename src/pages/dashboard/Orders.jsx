import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, Eye, X, Package } from 'lucide-react';
import { orders } from '../../lib/api';

export default function Orders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                    <td className="px-6 py-5"><div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div></td>
                    <td className="px-6 py-5"><div className="h-8 bg-slate-200 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
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
                      <button 
                        onClick={() => setSelectedOrder(o)}
                        className="text-slate-400 hover:text-[#8B3DFF] transition-colors p-1 rounded hover:bg-[#8B3DFF]/10"
                      >
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in-fast">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Order #{selectedOrder.id}</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Customer</p>
                  <p className="font-medium text-slate-800">{selectedOrder.customerName || 'Guest User'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Order Date</p>
                  <p className="font-medium text-slate-800">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Line Items</h3>
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-[#F8F9FA] border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-500">Item</th>
                      <th className="px-4 py-3 font-semibold text-slate-500 text-center">Qty</th>
                      <th className="px-4 py-3 font-semibold text-slate-500 text-right">Price</th>
                      <th className="px-4 py-3 font-semibold text-slate-500 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* STUB DATA FOR LINE ITEMS */}
                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Package size={14} className="text-slate-400" />
                        </div>
                        Sample Product Element
                      </td>
                      <td className="px-4 py-3 text-center">1</td>
                      <td className="px-4 py-3 text-right">₫{((selectedOrder.total || 0) * 0.4).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800">₫{((selectedOrder.total || 0) * 0.4).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Package size={14} className="text-slate-400" />
                        </div>
                        Secondary Item Component
                      </td>
                      <td className="px-4 py-3 text-center">2</td>
                      <td className="px-4 py-3 text-right">₫{((selectedOrder.total || 0) * 0.3).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800">₫{((selectedOrder.total || 0) * 0.6).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-5 flex justify-end">
                <div className="text-right w-1/2">
                   <div className="flex justify-between py-2 text-sm text-slate-500">
                      <span>Subtotal</span>
                      <span>₫{(selectedOrder.total || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between p-3 bg-slate-50 rounded-lg text-sm font-bold text-slate-800 mt-2">
                      <span>Total Amount</span>
                      <span className="text-[#8B3DFF]">₫{(selectedOrder.total || 0).toLocaleString()}</span>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
