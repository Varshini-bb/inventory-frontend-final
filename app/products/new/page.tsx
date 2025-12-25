"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/api";
import Link from "next/link";
import styles from "./NewProductPage.module.css";

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !sku) return;

    setLoading(true);

    await createProduct({
      name,
      sku,
      quantity,
      lowStockThreshold,
    });

    setLoading(false);

    // go back to product list
    router.push("/");
    router.refresh(); // ensures latest data
  };

  const isValid = name.trim() !== "" && sku.trim() !== "";

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <Link href="/" className={styles.backLink}>
              <svg
                className={styles.backIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Products
            </Link>
            <h1 className={styles.title}>Create New Product</h1>
            <p className={styles.subtitle}>
              Add a new product to your inventory
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <svg
              className={styles.formIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h2 className={styles.formTitle}>Product Information</h2>
          </div>

          <div className={styles.formBody}>
            {/* Product Name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Product Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
            </div>

            {/* SKU */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                SKU <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter SKU code"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className={styles.input}
              />
              <p className={styles.hint}>Unique product identifier</p>
            </div>

            {/* Two Column Grid */}
            <div className={styles.gridTwo}>
              {/* Initial Quantity */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Initial Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className={styles.input}
                  min="0"
                />
              </div>

              {/* Low Stock Threshold */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Low Stock Alert</label>
                <input
                  type="number"
                  placeholder="10"
                  value={lowStockThreshold}
                  onChange={(e) =>
                    setLowStockThreshold(Number(e.target.value))
                  }
                  className={styles.input}
                  min="0"
                />
                <p className={styles.hint}>Alert when stock falls below</p>
              </div>
            </div>

            {/* Info Box */}
            <div className={styles.infoBox}>
              <svg
                className={styles.infoIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className={styles.infoTitle}>Product Setup</p>
                <p className={styles.infoText}>
                  You can adjust stock levels later from the product management
                  page.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
              <Link href="/" className={styles.cancelButton}>
                Cancel
              </Link>
              <button
                onClick={submit}
                disabled={loading || !isValid}
                className={`${styles.submitButton} ${
                  loading || !isValid ? styles.submitButtonDisabled : ""
                }`}
              >
                {loading ? (
                  <span className={styles.buttonContent}>
                    <svg
                      className={styles.spinner}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className={styles.spinnerCircle}
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className={styles.spinnerPath}
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Product...
                  </span>
                ) : (
                  <span className={styles.buttonContent}>
                    <svg
                      className={styles.buttonIcon}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Create Product
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}