// User roles
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

// Order status
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

// Payment status
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Payment methods
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  COD = 'cash_on_delivery',
  E_WALLET = 'e_wallet'
}

// Product stock status
export enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock'
}

// Notification types
export enum NotificationType {
  ORDER = 'order',
  SYSTEM = 'system',
  PROMOTION = 'promotion'
}

// Cart item status
export enum CartItemStatus {
  ACTIVE = 'active',
  SAVED_FOR_LATER = 'saved_for_later'
} 