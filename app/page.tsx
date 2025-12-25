"use client";

import ProductTable from "@/components/ProductTable";
import { fetchProducts, deleteProduct, duplicateProduct } from "@/lib/api";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { useState } from "react";
import styles from "./Products.module.css";

export default function Products() {
  const { data: products, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/products`,
    fetchProducts
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteProduct(id);
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    } catch (error) {
      alert("Failed to delete product. Please try again.");
      console.error(error);
    }
    setDeletingId(null);
  };

  const handleDuplicate = async (id: string) => {
    setDuplicatingId(id);
    try {
      await duplicateProduct(id);
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    } catch (error) {
      alert("Failed to duplicate product. Please try again.");
      console.error(error);
    }
    setDuplicatingId(null);
  };

  // Error State
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>
              <svg className={styles.iconXLarge} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className={styles.errorTitle}>Failed to Load Products</h2>
            <p className={styles.errorText}>We couldn't retrieve your inventory. Please try again.</p>
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
              <svg className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (!products) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.titleGroup}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonBadge}></div>
              </div>
              <div className={styles.skeletonSubtitle}></div>
            </div>
            <div className={styles.skeletonButton}></div>
          </div>

          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonCardHeader}>
                  <div className={styles.skeletonIcon}></div>
                  <div className={styles.skeletonStatus}></div>
                </div>
                <div className={styles.skeletonCardBody}>
                  <div className={styles.skeletonProductTitle}></div>
                  <div className={styles.skeletonMetrics}>
                    <div className={styles.skeletonMetric}></div>
                    <div className={styles.skeletonMetric}></div>
                  </div>
                  <div className={styles.skeletonProgress}></div>
                </div>
                <div className={styles.skeletonCardFooter}>
                  <div className={styles.skeletonManageButton}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.titleGroup}>
              <h1 className={styles.title}>Inventory</h1>
              <div className={styles.stats}>
                <span className={styles.statBadge}>
                  {products.length} {products.length === 1 ? 'Product' : 'Products'}
                </span>
                <span className={styles.statBadge}>
                  {products.filter((p: any) => Number(p.quantity ?? 0) === 0).length} Out of Stock
                </span>
              </div>
            </div>
            <p className={styles.subtitle}>Track and manage your product inventory</p>
          </div>
          <Link href="/products/new" className={styles.addButton}>
            <svg className={styles.iconWhite} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Product
          </Link>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyContent}>
              <div className={styles.emptyIconWrapper}>
                <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className={styles.emptyTitle}>No products yet</h2>
              <p className={styles.emptyText}>Get started by creating your first product</p>
              <Link href="/products/new" className={styles.emptyButton}>
                <svg className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Product
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((p: any) => {
              const quantity = Number(p.quantity ?? 0);
              const threshold = Number(p.lowStockThreshold ?? 0);

              let statusText = "In Stock";
              let statusClass = styles.statusOk;
              let cardClass = styles.card;

              if (quantity === 0) {
                statusText = "Out of Stock";
                statusClass = styles.statusDead;
                cardClass = `${styles.card} ${styles.cardDead}`;
              } else if (quantity < threshold) {
                statusText = "Low Stock";
                statusClass = styles.statusLow;
                cardClass = `${styles.card} ${styles.cardLow}`;
              }

              // Get product image
              const productImage = p.primaryImage || (p.images && p.images.length > 0 ? p.images[0] : null);
              const imageUrl = productImage 
                ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${productImage}`
                : null;

              return (
                <div key={p._id} className={cardClass}>
                  {/* Card Header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.productIconLarge}>
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={p.name}
                          className={styles.productImage}
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
                          }}
                        />
                      ) : null}
                      <svg
                        className={`${styles.productSvg} ${imageUrl ? styles.hidden : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                      <span className={styles.statusDot}></span>
                      {statusText}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.productTitle}>{p.name}</h3>

                    <div className={styles.metrics}>
                      <div className={styles.metric}>
                        <span className={styles.metricLabel}>Current Stock</span>
                        <span className={styles.metricValue}>{quantity}</span>
                      </div>
                      <div className={styles.metricDivider}></div>
                      <div className={styles.metric}>
                        <span className={styles.metricLabel}>Threshold</span>
                        <span className={styles.metricValue}>{threshold}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${Math.min((quantity / (threshold * 2)) * 100, 100)}%`,
                            background: quantity === 0 ? "#ef4444" : quantity < threshold ? "#f59e0b" : "#10b981",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer - Action Buttons */}
                  <div className={styles.cardFooter}>
                    <div className={styles.actionButtons}>
                      <Link href={`/products/${p._id}/edit`} className={styles.editButton} title="Edit Product">
                        <svg className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDuplicate(p._id)}
                        disabled={duplicatingId === p._id}
                        className={styles.duplicateButton}
                        title="Duplicate Product"
                      >
                        <svg className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {duplicatingId === p._id ? "..." : "Copy"}
                      </button>

                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        disabled={deletingId === p._id}
                        className={styles.deleteButton}
                        title="Delete Product"
                      >
                        <svg className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {deletingId === p._id ? "..." : "Delete"}
                      </button>

                      <Link href={`/stock/${p._id}`} className={styles.stockButton} title="Manage Stock">
                        <svg className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        Stock
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}