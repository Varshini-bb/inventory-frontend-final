"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { Bell, BellRing, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import "../app/notifications/NotificationsPage.css"; // ← Changed this

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPriorityColor = (priority: string) => {
    return priority; // Returns: urgent, high, medium, or low
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "LOW_STOCK":
        return "📦";
      case "EXPIRY_ALERT":
        return "⏰";
      case "REORDER_REMINDER":
        return "🔄";
      case "STOCK_OUT":
        return "❌";
      default:
        return "🔔";
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notification-bell-button"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellRing className="notification-bell-icon ringing" />
        ) : (
          <Bell className="notification-bell-icon" />
        )}

        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <div>
              <h3 className="notification-header-title">Notifications</h3>
              <p className="notification-header-subtitle">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-read-button">
                <Check style={{ width: "1rem", height: "1rem" }} />
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell className="notification-empty-icon" />
                <p className="notification-empty-title">No notifications</p>
                <p className="notification-empty-text">You're all set!</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.isRead ? "unread" : ""}`}
                >
                  <div className="notification-content">
                    <div className="notification-icon">{getTypeIcon(notification.type)}</div>

                    <div className="notification-details">
                      <div className="notification-title-row">
                        <h4 className="notification-title">{notification.title}</h4>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="notification-mark-read-btn"
                            title="Mark as read"
                          >
                            <Check style={{ width: "1rem", height: "1rem" }} />
                          </button>
                        )}
                      </div>

                      <p className="notification-message">{notification.message}</p>

                      <div className="notification-meta">
                        <span className={`notification-priority ${getPriorityColor(notification.priority)}`}>
                          {notification.priority.toUpperCase()}
                        </span>

                        <div className="notification-actions">
                          <span className="notification-time">{formatDate(notification.createdAt)}</span>
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="notification-delete-btn"
                            title="Delete"
                          >
                            <Trash2 style={{ width: "1rem", height: "1rem" }} />
                          </button>
                        </div>
                      </div>

                      {notification.product && (
                        <div className="notification-product-info">
                          <span className="notification-product-name">{notification.product.name}</span>
                          <span className="notification-product-sku">SKU: {notification.product.sku}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <Link href="/notifications" className="notification-footer-link">
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}