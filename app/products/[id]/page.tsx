"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { updateStock, fetchStockHistory } from "@/lib/api";
import { mutate } from "swr";
import styles from "./StockPage.module.css";

export default function StockPage() {
  const params = useParams();
  const id = params.id as string;

  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [qty, setQty] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    if (!id) return;
    const data = await fetchStockHistory(id);
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, [id]);

  const submit = async () => {
    if (qty <= 0) return;

    setLoading(true);

    await updateStock({
      productId: id,
      type,
      quantity: qty,
      note,
    });

    await loadHistory();
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/products`);

    setQty(0);
    setNote("");

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Stock Movement</h1>
          <p className={styles.subtitle}>Manage your inventory transactions</p>
        </div>

        {/* Form Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>New Transaction</h2>

          <div className={styles.formContent}>
            {/* Type Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Transaction Type</label>
              <div className={styles.buttonGrid}>
                <button
                  onClick={() => setType("IN")}
                  className={`${styles.typeButton} ${
                    type === "IN" ? styles.typeButtonIn : styles.typeButtonInactive
                  }`}
                >
                  <span className={styles.buttonContent}>
                    <svg
                      className={styles.icon}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                    Stock IN
                  </span>
                </button>
                <button
                  onClick={() => setType("OUT")}
                  className={`${styles.typeButton} ${
                    type === "OUT" ? styles.typeButtonOut : styles.typeButtonInactive
                  }`}
                >
                  <span className={styles.buttonContent}>
                    <svg
                      className={styles.icon}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 13l-5 5m0 0l-5-5m5 5V6"
                      />
                    </svg>
                    Stock OUT
                  </span>
                </button>
              </div>
            </div>

            {/* Quantity Input */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Quantity</label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={qty || ""}
                onChange={(e) => setQty(Number(e.target.value))}
                className={styles.input}
                min="0"
              />
            </div>

            {/* Note Input */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Note <span className={styles.optional}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="Add a note about this transaction"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={styles.input}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={submit}
              disabled={loading || qty <= 0}
              className={`${styles.submitButton} ${
                loading || qty <= 0 ? styles.submitButtonDisabled : ""
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
                  Updating...
                </span>
              ) : (
                "Update Stock"
              )}
            </button>
          </div>
        </div>

        {/* History Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitleWithIcon}>
            <svg
              className={styles.iconLarge}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Transaction History
          </h2>

          {history.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg
                  className={styles.iconXLarge}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className={styles.emptyTitle}>No stock movements yet</p>
              <p className={styles.emptySubtitle}>
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className={styles.historyList}>
              {history.map((h: any) => (
                <div
                  key={h._id}
                  className={`${styles.historyItem} ${
                    h.type === "IN" ? styles.historyItemIn : styles.historyItemOut
                  }`}
                >
                  <div className={styles.historyContent}>
                    <div className={styles.historyLeft}>
                      <div
                        className={`${styles.historyIcon} ${
                          h.type === "IN"
                            ? styles.historyIconIn
                            : styles.historyIconOut
                        }`}
                      >
                        {h.type === "IN" ? (
                          <svg
                            className={styles.icon}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 11l5-5m0 0l5 5m-5-5v12"
                            />
                          </svg>
                        ) : (
                          <svg
                            className={styles.icon}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 13l-5 5m0 0l-5-5m5 5V6"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className={styles.historyTitle}>
                          {h.type === "IN" ? "Stock Added" : "Stock Removed"}
                        </p>
                        {h.note && (
                          <p className={styles.historyNote}>{h.note}</p>
                        )}
                      </div>
                    </div>
                    <div className={styles.historyRight}>
                      <p
                        className={`${styles.historyQty} ${
                          h.type === "IN"
                            ? styles.historyQtyIn
                            : styles.historyQtyOut
                        }`}
                      >
                        {h.type === "IN" ? "+" : "-"}
                        {h.quantity}
                      </p>
                      <p className={styles.historyDate}>
                        {new Date(h.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}