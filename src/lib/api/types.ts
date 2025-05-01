import { Role } from './enums';

// Shared types for API responses
export type ProductImage = {
  id: string;
  url: string;
  thumbnailUrl: string;
  altText?: string;
};

export type ProductVideo = {
  id: string;
  url: string;
  thumbnailUrl: string;
};

export type Attribute = {
  id: string;
  name: string;
  value: string;
};

export type Variant = {
  id: string;
  sku: string;
  price: number;
  originalPrice?: number;
  stock: number;
  attributes: Attribute[];
  imageId?: string;
};

export type ProductSummary = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  rating: number;
  stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock';
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  images: ProductImage[];
  videos?: ProductVideo[];
  basePrice: number;
  baseOriginalPrice?: number;
  brand?: { id: string; name: string };
  categories: { id: string; name: string; slug: string }[];
  attributes: Attribute[];
  variants: Variant[];
  averageRating: number;
  reviewCount: number;
  specifications?: { name: string; value: string }[];
  stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock';
};

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children: CategoryNode[];
  imageUrl?: string;
};

export type Review = {
  id: string;
  rating: number;
  comment?: string;
  authorName: string;
  createdAt: string;
};

export type SearchSuggestion = { 
  type: 'product' | 'category' | 'query';
  id?: string;
  name: string;
  imageUrl?: string;
  url: string;
};

export type Order = {
  id: string;
  date: Date;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }[];
  total: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: string;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  currency: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  options: Array<{
    name: string;
    value: string;
  }>;
  imageUrl: string;
  stock: number;
};

// User interfaces
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: Role;
  createdAt: string; 
  updatedAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// Product interfaces
export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  category: string;
  rating: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface ProductDetail extends ProductSummary {
  description: string;
  images: string[];
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  relatedProducts?: ProductSummary[];
  reviews?: ReviewSummary[];
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
  priceModifier: number;
}

// Category interfaces
export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  children?: CategoryNode[];
  productCount?: number;
}

// Review interfaces
export interface ReviewSummary {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

// Cart interfaces
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

// Order interfaces
export interface OrderSummary {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total: number;
  items: number;
}

export interface OrderDetail extends OrderSummary {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

// Search interfaces
export interface SearchSuggestion {
  id: string;
  name: string;
  type: 'product' | 'category';
  imageUrl?: string;
}

// Notification interfaces
export interface NotificationSummary {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'system' | 'promotion';
}

// User interfaces
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}
