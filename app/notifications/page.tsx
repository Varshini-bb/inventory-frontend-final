"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  dismissNotification,
  deleteNotification,
  triggerNotificationCheck,
} from "@/lib/api";
import styles from "./Notifications.module.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      const params = filter === "unread" ? { read: false, dismissed: false } : { dismissed: false };
      const data = await fetchNotifications(params);
      setNotifications(data.notifications);
      setLoading(false);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      loadNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await dismissNotification(id);
      loadNotifications();
    } catch (error) {
      console.error("Error dismissing:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notification?")) return;
    
    try {
      await deleteNotification(id);
      loadNotifications();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleCheckNow = async () => {
    setChecking(true);
    try {
      const results = await triggerNotificationCheck();
      alert(`Check complete!\n\nLow Stock: ${results.lowStockCount}\nOut of Stock: ${results.outOfStockCount}\nExpiry: ${results.expiryCount}\nReorder: ${results.reorderCount}`);
      loadNotifications();
    } catch (error) {
      console.error("Error checking:", error);
      alert("Failed to run notification check");
    }
    setChecking(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "#ef4444";
      case "high": return "#f59e0b";
      case "medium": return "#3b82f6";
      case "low": return "#64748b";
      default: return "#64748b";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "out_of_stock":
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case "expiry":
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "reorder":
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "low_stock": return "Low Stock";
      case "out_of_stock": return "Out of Stock";
      case "expiry": return "Expiry Alert";
      case "reorder": return "Reorder Reminder";
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.loading}>Loading notifications...</div>
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
            <Link href="/" className={styles.backLink}>
              <svg className={styles.backIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className={styles.title}>Notifications & Alerts</h1>
            <p className={styles.subtitle}>Manage your inventory notifications</p>
          </div>

          <div className={styles.headerActions}>
            <button onClick={handleCheckNow} disabled={checking} className={styles.checkButton}>
              <svg className={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {checking ? "Checking..." : "Check Now"}
            </button>
            <Link href="/notifications/settings" className={styles.settingsButton}>
              <svg className={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filterBar}>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
              onClick={() => setFilter("all")}
            >
              All Notifications
            </button>
            <button
              className={`${styles.filterBtn} ${filter === "unread" ? styles.active : ""}`}
              onClick={() => setFilter("unread")}
            >
              Unread
            </button>
          </div>

          {notifications.some(n => !n.read) && (
            <button onClick={handleMarkAllAsRead} className={styles.markAllBtn}>
              Mark All as Read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3>No Notifications</h3>
            <p>{filter === "unread" ? "You're all caught up!" : "No notifications to display"}</p>
          </div>
        ) : (
          <div className={styles.notificationsList}>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`${styles.notificationCard} ${!notification.read ? styles.unread : ""}`}
              >
                <div
                  className={styles.iconWrapper}
                  style={{ backgroundColor: `${getPriorityColor(notification.priority)}20` }}
                >
                  <div style={{ color: getPriorityColor(notification.priority) }}>
                    {getTypeIcon(notification.type)}
                  </div>
                </div>

                <div className={styles.content}>
                  <div className={styles.header}>
                    <div>
                      <span
                        className={styles.typeBadge}
                        style={{ backgroundColor: `${getPriorityColor(notification.priority)}20`, color: getPriorityColor(notification.priority) }}
                      >
                        {getTypeLabel(notification.type)}
                      </span>
                      <span className={styles.priorityBadge} style={{ color: getPriorityColor(notification.priority) }}>
                        {notification.priority.toUpperCase()}
                      </span>
                    </div>
                    <span className={styles.time}>
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 className={styles.notificationTitle}>{notification.title}</h3>
                  <p className={styles.message}>{notification.message}</p>

                  {notification.product && (
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{notification.product.name}</span>
                      <span className={styles.sku}>SKU: {notification.product.sku}</span>
                      {notification.product.quantity !== undefined && (
                        <span className={styles.stock}>Stock: {notification.product.quantity}</span>
                      )}
                    </div>
                  )}

                  <div className={styles.actions}>
                    {notification.product && (
                      <Link href={`/stock/${notification.product._id}`} className={styles.actionBtn}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Manage Stock
                      </Link>
                    )}
                    
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className={styles.readBtn}
                      >
                        Mark as Read
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDismiss(notification._id)}
                      className={styles.dismissBtn}
                    >
                      Dismiss
                    </button>
                    
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className={styles.deleteBtn}
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}