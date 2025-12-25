/* eslint-disable no-var */

export {};

declare global {
  /**
   * Common ID type
   */
  type ID = string;

  /**
   * Product model used across frontend
   */
  interface Product {
    _id: string;
    name: string;
    sku: string;
    quantity: number;
    lowStockThreshold: number;
    createdAt?: string;
    updatedAt?: string;
  }

  /**
   * Stock movement type
   */
  type StockType = "IN" | "OUT";

  /**
   * Stock history entry
   */
  interface StockHistory {
    _id: string;
    productId: string;
    type: StockType;
    quantity: number;
    note?: string;
    createdAt: string;
  }

  /**
   * API payloads
   */
  interface UpdateStockPayload {
    productId: string;
    type: StockType;
    quantity: number;
    note?: string;
  }
}
