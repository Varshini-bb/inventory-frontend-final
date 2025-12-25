"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchNotifications, markNotificationAsRead, dismissNotification } from "@/lib/api";
import styles from "./NotificationBell.module.css";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications({ dismissed: false });
      setNotifications(data.notifications.slice(0, 5)); // Show latest 5
      setUnreadCount(data.unreadCount);
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

  const handleDismiss = async (id: string) => {
    try {
      await dismissNotification(id);
      loadNotifications();
    } catch (error) {
      console.error("Error dismissing:", error);
    }
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
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.bellButton}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <svg className={styles.bellIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <>
          <div className={styles.overlay} onClick={() => setShowDropdown(false)} />
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <h3>Notifications</h3>
              {notifications.length > 0 && (
                <Link href="/notifications" onClick={() => setShowDropdown(false)}>
                  View All
                </Link>
              )}
            </div>

            <div className={styles.notificationList}>
              {loading ? (
                <div className={styles.loading}>Loading...</div>
              ) : notifications.length === 0 ? (
                <div className={styles.empty}>
                  <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                    onClick={() => !notification.read && handleMarkAsRead(notification._id)}
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
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className={styles.time}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <button
                      className={styles.dismissBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(notification._id);
                      }}
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className={styles.dropdownFooter}>
                <Link href="/notifications" onClick={() => setShowDropdown(false)}>
                  View All Notifications
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}