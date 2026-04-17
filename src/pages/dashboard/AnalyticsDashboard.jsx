import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import api from '@/lib/api';
import { TrendingUp, Users, ShoppingBag, Loader2 } from 'lucide-react';

const COLORS = ['#8B3DFF', '#00C4CC', '#FF5733', '#FACC15', '#A855F7'];

export default function AnalyticsDashboard() {
  const [revenueData, setRevenueData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [revRes, statusRes, trafficRes] = await Promise.all([
          api.get('/api/analytics/revenue-over-time?granularity=day'),
          api.get('/api/analytics/order-status-distribution'),
          api.get('/api/analytics/hourly-traffic')
        ]);
        
        setRevenueData(revRes.data);
        setStatusData(statusRes.data);
        setTrafficData(trafficRes.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex h-[400px] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-canva-purple" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-canva-purple rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Monthly Revenue</p>
            <h4 className="text-2xl font-bold text-slate-900">$24,500</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Orders</p>
            <h4 className="text-2xl font-bold text-slate-900">1,245</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Customers</p>
            <h4 className="text-2xl font-bold text-slate-900">842</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-100">
          <h3 className="font-semibold text-lg mb-6 text-slate-800">Revenue (Last 30 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData.slice(-30)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="DATE" tickLine={false} axisLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} tick={{fill: '#64748b', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                />
                <Line type="monotone" dataKey="REVENUE" stroke="#8B3DFF" strokeWidth={3} dot={false} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-100">
          <h3 className="font-semibold text-lg mb-6 text-slate-800">Order Status Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="COUNT"
                  nameKey="STATUS"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Traffic Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-100 lg:col-span-2">
          <h3 className="font-semibold text-lg mb-6 text-slate-800">Store Traffic (Visits by Hour)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="HOUR" tickLine={false} axisLine={false} tick={{fill: '#64748b', fontSize: 12}} formatter={(val) => `${val}:00`} />
                <YAxis tickLine={false} axisLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <RechartsTooltip 
                  cursor={{fill: '#F1F5F9'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="VIEWS" fill="#00C4CC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
