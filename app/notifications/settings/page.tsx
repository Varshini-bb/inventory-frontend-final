"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getNotificationSettings, updateNotificationSettings } from "@/lib/api";
import styles from "./Settings.module.css";

export default function NotificationSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getNotificationSettings();
      setSettings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading settings:", error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateNotificationSettings(settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    }
    setSaving(false);
  };

  const updateSetting = (path: string[], value: any) => {
    setSettings((prev: any) => {
      const newSettings = { ...prev };
      let current = newSettings;
      
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newSettings;
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.loading}>Loading settings...</div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.error}>Failed to load settings</div>
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
            <Link href="/notifications" className={styles.backLink}>
              <svg className={styles.backIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Notifications
            </Link>
            <h1 className={styles.title}>Notification Settings</h1>
            <p className={styles.subtitle}>Configure your alert preferences</p>
          </div>
        </div>

        {/* Email Notifications */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: '#dbeafe' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#3b82f6' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2>Email Notifications</h2>
              <p>Receive alerts via email</p>
            </div>
          </div>

          <div className={styles.settingGroup}>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <h3>Enable Email Notifications</h3>
                <p>Receive inventory alerts via email</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications?.enabled || false}
                  onChange={(e) => updateSetting(['emailNotifications', 'enabled'], e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            {settings.emailNotifications?.enabled && (
              <>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={settings.emailNotifications?.email || ''}
                    onChange={(e) => updateSetting(['emailNotifications', 'email'], e.target.value)}
                    placeholder="your@email.com"
                    className={styles.input}
                  />
                  <p className={styles.hint}>Alerts will be sent to this email address</p>
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications?.lowStock || false}
                      onChange={(e) => updateSetting(['emailNotifications', 'lowStock'], e.target.checked)}
                    />
                    <span>Low Stock Alerts</span>
                  </label>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications?.outOfStock || false}
                      onChange={(e) => updateSetting(['emailNotifications', 'outOfStock'], e.target.checked)}
                    />
                    <span>Out of Stock Alerts</span>
                  </label>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications?.expiry || false}
                      onChange={(e) => updateSetting(['emailNotifications', 'expiry'], e.target.checked)}
                    />
                    <span>Expiry Alerts</span>
                  </label>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications?.reorder || false}
                      onChange={(e) => updateSetting(['emailNotifications', 'reorder'], e.target.checked)}
                    />
                    <span>Reorder Reminders</span>
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Push Notifications */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: '#d1fae5' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#10b981' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h2>Browser Notifications</h2>
              <p>Real-time alerts in your browser</p>
            </div>
          </div>

          <div className={styles.settingGroup}>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <h3>Enable Browser Notifications</h3>
                <p>Show desktop notifications for important alerts</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications?.enabled || false}
                  onChange={(e) => updateSetting(['pushNotifications', 'enabled'], e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            {settings.pushNotifications?.enabled && (
              <div className={styles.checkboxGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications?.lowStock || false}
                    onChange={(e) => updateSetting(['pushNotifications', 'lowStock'], e.target.checked)}
                  />
                  <span>Low Stock Alerts</span>
                </label>

                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications?.outOfStock || false}
                    onChange={(e) => updateSetting(['pushNotifications', 'outOfStock'], e.target.checked)}
                  />
                  <span>Out of Stock Alerts</span>
                </label>

                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications?.expiry || false}
                    onChange={(e) => updateSetting(['pushNotifications', 'expiry'], e.target.checked)}
                  />
                  <span>Expiry Alerts</span>
                </label>

                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications?.reorder || false}
                    onChange={(e) => updateSetting(['pushNotifications', 'reorder'], e.target.checked)}
                  />
                  <span>Reorder Reminders</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className={styles.footer}>
          <button onClick={handleSave} disabled={saving} className={styles.saveButton}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}