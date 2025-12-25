"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
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
import styles from "./StockValue.module.css";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function StockValueReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/stock-value`);
      const result = await res.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error loading report:", error);
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/reports/export-csv?type=stock-value`, '_blank');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.loading}>Loading report...</div>
        </div>
      </div>
    );
  }

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
            <h1 className={styles.title}>Stock Value Report</h1>
            <p className={styles.subtitle}>Total inventory value and breakdown by category</p>
          </div>

          <div className={styles.actions}>
            <button onClick={handleExport} className={styles.exportBtn}>
              <svg className={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <button onClick={handlePrint} className={styles.printBtn}>
              <svg className={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#eff6ff' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#3b82f6' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Total Products</p>
              <p className={styles.summaryValue}>{data?.totalProducts || 0}</p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#f0fdf4' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#10b981' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Total Cost Value</p>
              <p className={styles.summaryValue}>${data?.totalCostValue?.toLocaleString() || 0}</p>
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
              <p className={styles.summaryValue}>${data?.totalSellingValue?.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#ecfdf5' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#10b981' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Potential Profit</p>
              <p className={styles.summaryValue}>${data?.potentialProfit?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className={styles.chartsGrid}>
          {/* Category Value Bar Chart */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Value by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.byCategory || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="totalCostValue" fill="#3b82f6" name="Cost Value" />
                <Bar dataKey="totalSellingValue" fill="#10b981" name="Selling Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution Pie Chart */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Value Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.byCategory || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name , percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalCostValue"
                >
                  {(data?.byCategory || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Products Table */}
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>Products Breakdown</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Cost Price</th>
                  <th>Selling Price</th>
                  <th>Total Cost</th>
                  <th>Total Selling</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {data?.products?.map((product: any) => {
                  const totalCost = product.quantity * (product.costPrice || 0);
                  const totalSelling = product.quantity * (product.sellingPrice || 0);
                  const profit = totalSelling - totalCost;

                  return (
                    <tr key={product._id}>
                      <td className={styles.productName}>{product.name}</td>
                      <td><code className={styles.sku}>{product.sku}</code></td>
                      <td>{product.category || 'N/A'}</td>
                      <td>{product.quantity}</td>
                      <td>${(product.costPrice || 0).toFixed(2)}</td>
                      <td>${(product.sellingPrice || 0).toFixed(2)}</td>
                      <td className={styles.costValue}>${totalCost.toFixed(2)}</td>
                      <td className={styles.sellingValue}>${totalSelling.toFixed(2)}</td>
                      <td className={profit >= 0 ? styles.profit : styles.loss}>
                        ${profit.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {(!data?.products || data.products.length === 0) && (
              <div className={styles.emptyState}>
                <p>No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* Print Footer */}
        <div className={styles.printFooter}>
          <p>Generated on {new Date().toLocaleString()}</p>
          <p>Inventory Management System - Stock Value Report</p>
        </div>
      </div>
    </div>
  );
}