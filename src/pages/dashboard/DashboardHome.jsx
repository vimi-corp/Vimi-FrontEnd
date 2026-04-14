import React, { useEffect, useState } from 'react';
import { CreditCard, ShoppingBag, Eye, TrendingUp } from 'lucide-react';
import { dashboard } from '../../lib/api';

const MetricCard = ({ title, value, detail, icon: Icon }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
           style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1 text-green-600 font-semibold text-xs bg-green-50 px-2 py-1 rounded-md border border-green-100">
        <TrendingUp size={14} /> +12%
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-semibold tracking-wide uppercase">{title}</h3>
    <p className="text-3xl font-bold text-slate-800 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
    {detail && <p className="text-xs text-slate-400 mt-1.5 font-medium">{detail}</p>}
  </div>
);

export default function DashboardHome() {
  const [metrics, setMetrics] = useState({ revenue: 0, orders: 0, visitors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboard.metrics()
      .then(res => {
        if(res && res.data) setMetrics(res.data);
      })
      .catch(() => {
        // Silent fallback for non-existent backend endpoints
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A1D23] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Overview</h1>
        <p className="text-[#6B7280] mt-1 text-sm font-medium">Welcome back! Here's what's happening with your store today.</p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-slate-200/60 rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="Total Revenue" value={`₫${(metrics.revenue || 0).toLocaleString()}`} detail="Last 30 days" icon={CreditCard} />
          <MetricCard title="Total Orders" value={metrics.orders || 0} detail="Last 30 days" icon={ShoppingBag} />
          <MetricCard title="Store Visitors" value={metrics.visitors || 0} detail="Last 30 days" icon={Eye} />
        </div>
      )}
    </div>
  );
}
