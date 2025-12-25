"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import styles from "./Monthly.module.css";

export default function MonthlyStatistics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadStats();
  }, [selectedYear]);

  const loadStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`);
      const data = await res.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading stats:", error);
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.loading}>Loading statistics...</div>
        </div>
      </div>
    );
  }

  // Process monthly data
  const monthlyData = stats?.monthlyMovements?.reduce((acc: any[], curr: any) => {
    const monthYear = `${curr._id.year}-${String(curr._id.month).padStart(2, '0')}`;
    const existing = acc.find(item => item.month === monthYear);
    
    if (existing) {
      if (curr._id.type === 'IN') existing.in = curr.totalQuantity;
      if (curr._id.type === 'OUT') existing.out = curr.totalQuantity;
    } else {
      acc.push({
        month: monthYear,
        monthName: new Date(curr._id.year, curr._id.month - 1).toLocaleDateString('default', { month: 'short', year: 'numeric' }),
        in: curr._id.type === 'IN' ? curr.totalQuantity : 0,
        out: curr._id.type === 'OUT' ? curr.totalQuantity : 0
      });
    }
    
    return acc;
  }, []).sort((a : any, b : any) => a.month.localeCompare(b.month)) || [];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <Link href="/reports" className={styles.backLink}>
              <svg className={styles.backIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Reports
            </Link>
            <h1 className={styles.title}>Monthly Statistics</h1>
            <p className={styles.subtitle}>Transaction summaries and trends by month</p>
          </div>

          <div className={styles.actions}>
            <button onClick={handlePrint} className={styles.printBtn}>
              <svg className={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#eff6ff' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#3b82f6' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Total Products</p>
              <p className={styles.summaryValue}>{stats?.totalProducts || 0}</p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#f0fdf4' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#10b981' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Total Value</p>
              <p className={styles.summaryValue}>${(stats?.totalValue || 0).toLocaleString()}</p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#dbeafe' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#3b82f6' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Potential Revenue</p>
              <p className={styles.summaryValue}>${(stats?.potentialRevenue || 0).toLocaleString()}</p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#ecfdf5' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#10b981' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Potential Profit</p>
              <p className={styles.summaryValue}>${(stats?.totalProfit || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        {monthlyData.length > 0 && (
          <>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Stock Movements Trend (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="in" stroke="#10b981" strokeWidth={3} name="Stock In" />
                  <Line type="monotone" dataKey="out" stroke="#ef4444" strokeWidth={3} name="Stock Out" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Monthly Comparison</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="in" fill="#10b981" name="Stock In" />
                  <Bar dataKey="out" fill="#ef4444" name="Stock Out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Monthly Table */}
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>Monthly Breakdown</h3>
          <div className={styles.tableWrapper}>
            {monthlyData.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Stock In</th>
                    <th>Stock Out</th>
                    <th>Net Change</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((month: any, index: number) => {
                    const netChange = month.in - month.out;
                    return (
                      <tr key={index}>
                        <td className={styles.monthName}>{month.monthName}</td>
                        <td className={styles.stockIn}>{month.in}</td>
                        <td className={styles.stockOut}>{month.out}</td>
                        <td className={netChange >= 0 ? styles.netPositive : styles.netNegative}>
                          {netChange >= 0 ? '+' : ''}{netChange}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className={styles.emptyState}>
                <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3>No Data Available</h3>
                <p>No stock movements found for the selected period.</p>
              </div>
            )}
          </div>
        </div>

        {/* Print Footer */}
        <div className={styles.printFooter}>
          <p>Generated on {new Date().toLocaleString()}</p>
          <p>Inventory Management System - Monthly Statistics</p>
        </div>
      </div>
    </div>
  );
}