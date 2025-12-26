"use client";

import React, { useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import NotificationSettings from "@/components/NotificationSettings";
import { Bell, Trash2, Check, Filter } from "lucide-react";
import Link from "next/link";
import "./NotificationsPage.css";

export default function NotificationsPage() {
  const { notifications, loading, markAsRead, deleteNotification, markAllAsRead } =
    useNotifications();
  const [filter, setFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread" && notif.isRead) return false;
    if (filter === "read" && !notif.isRead) return false;
    if (priorityFilter !== "all" && notif.priority !== priorityFilter) return false;
    return true;
  });

  const getTypeIconClass = (type: string) => {
    switch (type) {
      case "LOW_STOCK":
        return "low-stock";
      case "EXPIRY_ALERT":
        return "expiry-alert";
      case "REORDER_REMINDER":
        return "reorder-reminder";
      case "STOCK_OUT":
        return "stock-out";
      default:
        return "";
    }
  };

  const getPriorityClass = (priority: string) => {
    return priority; // Returns: urgent, high, medium, or low
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="page-header">
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Manage your inventory alerts and notifications</p>
        </div>

        <div className="settings-wrapper">
          <NotificationSettings />
        </div>

        <div className="filters-card">
          <div className="filters-container">
            <div className="filter-label">
              <Filter className="filter-icon" />
              <span className="filter-text">Filter:</span>
            </div>

            <div className="filter-buttons">
              {["all", "unread", "read"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`filter-button ${filter === f ? "active" : "inactive"}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="filter-buttons">
              {["all", "urgent", "high", "medium", "low"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`filter-button ${priorityFilter === p ? "active" : "inactive"}`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            {notifications.some((n) => !n.isRead) && (
              <button onClick={markAllAsRead} className="mark-all-filters">
                <Check style={{ width: "1rem", height: "1rem" }} />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="notifications-card">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <Bell className="empty-icon" />
              <p className="empty-title">No notifications</p>
              <p className="empty-description">
                {filter !== "all" ? `No ${filter} notifications found` : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-list-item ${!notification.isRead ? "unread" : ""}`}
                >
                  <div className="notification-row">
                    <div className={`type-icon ${getTypeIconClass(notification.type)}`}>
                      {notification.type === "LOW_STOCK" && "📦"}
                      {notification.type === "EXPIRY_ALERT" && "⏰"}
                      {notification.type === "REORDER_REMINDER" && "🔄"}
                      {notification.type === "STOCK_OUT" && "❌"}
                    </div>

                    <div className="notification-body">
                      <div className="notification-header-row">
                        <div>
                          <h3 className="notification-heading">{notification.title}</h3>
                          <p className="notification-message-text">{notification.message}</p>
                        </div>

                        <div className="action-buttons">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="action-button mark-read"
                              title="Mark as read"
                            >
                              <Check style={{ width: "1.25rem", height: "1.25rem" }} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="action-button delete"
                            title="Delete"
                          >
                            <Trash2 style={{ width: "1.25rem", height: "1.25rem" }} />
                          </button>
                        </div>
                      </div>

                      {notification.product && (
                        <div className="product-info-card">
                          <div className="product-info-row">
                            <div>
                              <p className="product-name">{notification.product.name}</p>
                              <p className="product-sku">SKU: {notification.product.sku}</p>
                            </div>
                            <Link
                              href={`/products/${notification.product._id}`}
                              className="product-link"
                            >
                              View Product →
                            </Link>
                          </div>
                        </div>
                      )}

                      <div className="notification-metadata">
                        <span className={`priority-badge ${getPriorityClass(notification.priority)}`}>
                          {notification.priority.toUpperCase()}
                        </span>
                        <span className="notification-timestamp">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
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