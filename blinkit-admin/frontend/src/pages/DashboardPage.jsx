import React, { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import './DashboardPage.css';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [chart, setChart] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/summary'),
      api.get(`/analytics/chart?days=${days}`),
      api.get('/analytics/top-products'),
    ]).then(([s, c, t]) => {
      setSummary(s.data);
      setChart(c.data);
      setTopProducts(t.data);
    }).finally(() => setLoading(false));
  }, [days]);

  if (loading) return <div className="spinner" />;

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard icon="💰" label="Monthly Revenue" value={`₹${(summary?.monthlyRevenue || 0).toLocaleString('en-IN')}`} sub="This month" color="green" />
        <StatCard icon="🛒" label="Total Orders" value={summary?.totalOrders || 0} sub={`${summary?.todayOrders || 0} today`} color="blue" />
        <StatCard icon="👥" label="Total Users" value={summary?.totalUsers || 0} sub="Registered" color="orange" />
        <StatCard icon="📦" label="Products" value={summary?.totalProducts || 0} sub="In catalog" color="purple" />
        <StatCard icon="⏳" label="Pending Orders" value={summary?.pendingOrders || 0} sub="Need action" color="red" />
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="chart-header">
            <h3 className="chart-title">Revenue Overview</h3>
            <div className="chart-days">
              {[7, 14, 30].map(d => (
                <button key={d} className={`day-btn ${days === d ? 'active' : ''}`} onClick={() => setDays(d)}>{d}d</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0c831f" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0c831f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={v => [`₹${v}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#0c831f" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-header">
            <h3 className="chart-title">Order Count</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={v => [v, 'Orders']} />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="chart-title" style={{ marginBottom: 14 }}>🔥 Top Selling Products</h3>
        {topProducts.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📊</div><p>No data yet</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>#</th><th>Product</th><th>Units Sold</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p._id}>
                  <td><span className="rank-badge">{i + 1}</span></td>
                  <td><strong>{p._id}</strong></td>
                  <td>{p.sold} units</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{p.revenue.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
