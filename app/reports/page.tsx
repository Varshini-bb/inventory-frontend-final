"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Reports.module.css";

export default function ReportsPage() {
  const [exportType, setExportType] = useState("products");

  const handleExport = async (format: string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/reports/export-csv?type=${exportType}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const reports = [
    {
      title: "Low Stock Report",
      description: "View all products below their stock threshold",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      href: "/reports/low-stock",
      color: "#f59e0b",
      bgColor: "#fef3c7"
    },
    {
      title: "Stock Value Report",
      description: "Total inventory value and breakdown by category",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      href: "/reports/stock-value",
      color: "#10b981",
      bgColor: "#d1fae5"
    },
    {
      title: "Stock Movements Report",
      description: "Track all IN/OUT stock movements over time",
      icon: "M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4",
      href: "/reports/stock-movements",
      color: "#3b82f6",
      bgColor: "#dbeafe"
    },
    {
      title: "Monthly Statistics",
      description: "View transaction summaries by month",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      href: "/reports/monthly",
      color: "#8b5cf6",
      bgColor: "#ede9fe"
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <Link href="/dashboard" className={styles.backLink}>
              <svg className={styles.backIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className={styles.title}>Reports & Analytics</h1>
            <p className={styles.subtitle}>Generate and export inventory reports</p>
          </div>
        </div>

        {/* Export Section */}
        <div className={styles.exportSection}>
          <h2 className={styles.sectionTitle}>Export Data</h2>
          <div className={styles.exportCard}>
            <div className={styles.exportOptions}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Select Report Type</label>
                <select 
                  value={exportType} 
                  onChange={(e) => setExportType(e.target.value)}
                  className={styles.select}
                >
                  <option value="products">All Products</option>
                  <option value="movements">Stock Movements</option>
                  <option value="low-stock">Low Stock Items</option>
                  <option value="stock-value">Stock Value</option>
                </select>
              </div>

              <div className={styles.exportButtons}>
                <button onClick={() => handleExport('csv')} className={styles.exportBtn}>
                  <svg className={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export to CSV
                </button>

                <button onClick={handlePrint} className={styles.printBtn}>
                  <svg className={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className={styles.reportsGrid}>
          {reports.map((report, index) => (
            <Link key={index} href={report.href} className={styles.reportCard}>
              <div className={styles.reportIcon} style={{ backgroundColor: report.bgColor }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: report.color }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={report.icon} />
                </svg>
              </div>
              <h3 className={styles.reportTitle}>{report.title}</h3>
              <p className={styles.reportDescription}>{report.description}</p>
              <div className={styles.reportArrow}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}