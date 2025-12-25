"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./StockMovements.module.css";

export default function StockMovementsReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: ""
  });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.type) params.append('type', filters.type);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/stock-movements?${params}`);
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
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/reports/export-csv?type=movements`, '_blank');
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setLoading(true);
    loadReport();
  };

  const clearFilters = () => {
    setFilters({ startDate: "", endDate: "", type: "" });
    setLoading(true);
    setTimeout(() => loadReport(), 100);
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
            <h1 className={styles.title}>Stock Movements Report</h1>
            <p className={styles.subtitle}>Track all IN/OUT stock movements over time</p>
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

        {/* Filters */}
        <div className={styles.filterCard}>
          <h3 className={styles.filterTitle}>Filters</h3>
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Movement Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Types</option>
                <option value="IN">Stock In</option>
                <option value="OUT">Stock Out</option>
              </select>
            </div>
          </div>

          <div className={styles.filterActions}>
            <button onClick={applyFilters} className={styles.applyBtn}>
              Apply Filters
            </button>
            <button onClick={clearFilters} className={styles.clearBtn}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#eff6ff' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#3b82f6' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Total Movements</p>
              <p className={styles.summaryValue}>{data?.totalMovements || 0}</p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#d1fae5' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#10b981' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Stock In</p>
              <p className={styles.summaryValue}>{data?.totalIn || 0}</p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#fee2e2' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#ef4444' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Stock Out</p>
              <p className={styles.summaryValue}>{data?.totalOut || 0}</p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#fef3c7' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#f59e0b' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <div>
              <p className={styles.summaryLabel}>Net Change</p>
              <p className={styles.summaryValue}>{data?.netChange || 0}</p>
            </div>
          </div>
        </div>

        {/* Movements Table */}
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>Movement History</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {data?.movements?.map((movement: any) => (
                  <tr key={movement._id}>
                    <td>{new Date(movement.createdAt).toLocaleString()}</td>
                    <td className={styles.productName}>{movement.product?.name || 'N/A'}</td>
                    <td><code className={styles.sku}>{movement.product?.sku || 'N/A'}</code></td>
                    <td>{movement.product?.category || 'N/A'}</td>
                    <td>
                      <span className={movement.type === 'IN' ? styles.badgeIn : styles.badgeOut}>
                        {movement.type}
                      </span>
                    </td>
                    <td className={styles.quantity}>{movement.quantity}</td>
                    <td className={styles.note}>{movement.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!data?.movements || data.movements.length === 0) && (
              <div className={styles.emptyState}>
                <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3>No Movements Found</h3>
                <p>No stock movements match your filter criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Print Footer */}
        <div className={styles.printFooter}>
          <p>Generated on {new Date().toLocaleString()}</p>
          <p>Inventory Management System - Stock Movements Report</p>
        </div>
      </div>
    </div>
  );
}