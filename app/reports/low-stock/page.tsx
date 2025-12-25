"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./LowStock.module.css";

export default function LowStockReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/low-stock`);
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
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/reports/export-csv?type=low-stock`, '_blank');
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
            <h1 className={styles.title}>Low Stock Report</h1>
            <p className={styles.subtitle}>Products below their stock threshold</p>
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
            <div className={styles.summaryIcon} style={{ background: '#fef3c7' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#f59e0b' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Low Stock Products</p>
              <p className={styles.summaryValue}>{data?.totalProducts || 0}</p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#dbeafe' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#3b82f6' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Total Value at Risk</p>
              <p className={styles.summaryValue}>${data?.totalValue?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Needed</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.products?.map((product: any) => {
                  const needed = product.lowStockThreshold - product.quantity;
                  const value = product.quantity * (product.costPrice || 0);
                  
                  return (
                    <tr key={product._id}>
                      <td className={styles.productName}>{product.name}</td>
                      <td><code className={styles.sku}>{product.sku}</code></td>
                      <td>{product.category || 'N/A'}</td>
                      <td className={styles.stockWarning}>{product.quantity}</td>
                      <td>{product.lowStockThreshold}</td>
                      <td className={styles.needed}>+{needed}</td>
                      <td>${value.toFixed(2)}</td>
                      <td>
                        <Link href={`/stock/${product._id}`} className={styles.actionBtn}>
                          Restock
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {(!data?.products || data.products.length === 0) && (
              <div className={styles.emptyState}>
                <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3>All Stock Levels Good!</h3>
                <p>No products are currently below their stock threshold.</p>
              </div>
            )}
          </div>
        </div>

        {/* Print Footer */}
        <div className={styles.printFooter}>
          <p>Generated on {new Date().toLocaleString()}</p>
          <p>Inventory Management System</p>
        </div>
      </div>
    </div>
  );
}