export interface IProduct {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  category?: string;
}

export interface INotification {
  _id: string;
  type: "LOW_STOCK" | "EXPIRY_ALERT" | "REORDER_REMINDER" | "STOCK_OUT";
  title: string;
  message: string;
  product: IProduct;
  priority: "low" | "medium" | "high" | "urgent";
  isRead: boolean;
  isEmailSent: boolean;
  isPushSent: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    currentStock?: number;
    threshold?: number;
    expiryDate?: string;
    daysUntilExpiry?: number;
    reorderPoint?: number;
    suggestedQuantity?: number;
  };
}

export interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  subscribeToPush: () => Promise<void>;
  isPushSupported: boolean;
  isPushSubscribed: boolean;
}