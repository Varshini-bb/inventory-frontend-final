"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import styles from "./Dashboard.module.css";
import { fetchDashboard } from '@/lib/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

 const loadDashboard = async () => {
  try {
    const data = await fetchDashboard();
    console.log("Dashboard data:", data);
    setStats(data);
    setLoading(false);
  } catch (error) {
    console.error("Error loading dashboard:", error);
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.loading}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.error}>Failed to load dashboard</div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const stockStatusData = [
    { name: 'In Stock', value: stats.inStockProducts || 0, color: '#10b981' },
    { name: 'Low Stock', value: stats.lowStockProducts || 0, color: '#f59e0b' },
    { name: 'Out of Stock', value: stats.outOfStockProducts || 0, color: '#ef4444' }
  ];

  // Format monthly movements data - ADD NULL CHECK HERE
  const monthlyData = stats.monthlyMovements && Array.isArray(stats.monthlyMovements) 
    ? stats.monthlyMovements.reduce((acc: any[], curr: any) => {
        const monthYear = `${curr._id.year}-${String(curr._id.month).padStart(2, '0')}`;
        const existing = acc.find(item => item.month === monthYear);
        
        if (existing) {
          if (curr._id.type === 'IN') existing.in = curr.totalQuantity;
          if (curr._id.type === 'OUT') existing.out = curr.totalQuantity;
        } else {
          acc.push({
            month: monthYear,
            in: curr._id.type === 'IN' ? curr.totalQuantity : 0,
            out: curr._id.type === 'OUT' ? curr.totalQuantity : 0
          });
        }
        
        return acc;
      }, []).sort((a: any, b: any) => a.month.localeCompare(b.month))
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Overview of your inventory analytics</p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/products" className={styles.productsButton}>
              <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              View Products
            </Link>
            <Link href="/reports" className={styles.reportsButton}>
              <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Reports
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#eff6ff' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#3b82f6' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Products</p>
              <p className={styles.statValue}>{stats.totalProducts || 0}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f0fdf4' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#10b981' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Inventory Value</p>
              <p className={styles.statValue}>${(stats.totalValue || 0).toLocaleString()}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fef3c7' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#f59e0b' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Low Stock Items</p>
              <p className={styles.statValue}>{stats.lowStockProducts || 0}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fee2e2' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#ef4444' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Out of Stock</p>
              <p className={styles.statValue}>{stats.outOfStockProducts || 0}</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className={styles.chartsGrid}>
          {/* Stock Status Pie Chart */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Stock Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Value Bar Chart */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Inventory Value by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.categoryStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="totalValue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Movements Line Chart */}
        {monthlyData.length > 0 && (
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Stock Movements (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="in" stroke="#10b981" strokeWidth={2} name="Stock In" />
                <Line type="monotone" dataKey="out" stroke="#ef4444" strokeWidth={2} name="Stock Out" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tables Row */}
        <div className={styles.tablesGrid}>
          {/* Low Stock Products */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>Low Stock Alert</h3>
              <Link href="/reports/low-stock" className={styles.viewAllLink}>
                View All
              </Link>
            </div>
            <div className={styles.tableWrapper}>
              {stats.lowStockList && stats.lowStockList.length > 0 ? (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Stock</th>
                      <th>Threshold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockList.map((product: any) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td><code>{product.sku}</code></td>
                        <td className={styles.lowStock}>{product.quantity}</td>
                        <td>{product.lowStockThreshold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={styles.noData}>No low stock items</p>
              )}
            </div>
          </div>

          {/* Recent Movements */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>Recent Movements</h3>
              <Link href="/reports/stock-movements" className={styles.viewAllLink}>
                View All
              </Link>
            </div>
            <div className={styles.tableWrapper}>
              {stats.recentMovements && stats.recentMovements.length > 0 ? (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentMovements.map((movement: any) => (
                      <tr key={movement._id}>
                        <td>{movement.productId?.name || 'N/A'}</td>
                        <td>
                          <span className={movement.type === 'IN' ? styles.badgeIn : styles.badgeOut}>
                            {movement.type}
                          </span>
                        </td>
                        <td>{movement.quantity}</td>
                        <td>{new Date(movement.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={styles.noData}>No recent movements</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}