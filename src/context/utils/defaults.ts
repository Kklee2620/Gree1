
import { Cart, UserProfileSummary, NotificationSummary, Language, Currency } from '../types';

// Default cart state
export const defaultCart: Cart = {
  items: [],
  subtotal: 0,
  currency: 'VND'
};

// Default user state
export const defaultUser: UserProfileSummary = {
  isLoggedIn: false
};

// Default notifications state
export const defaultNotifications: NotificationSummary = {
  unreadCount: 0
};

// Default locale settings
export const defaultLanguage: Language = {
  code: 'vi',
  name: 'Tiếng Việt'
};

export const defaultCurrency: Currency = {
  code: 'VND',
  symbol: '₫'
};

// Common app settings
export const APP_CONFIG = {
  appName: 'Yapee',
  contactInfo: {
    address: '74 đường số 13, Phường Bình Trị Đông B, quận Bình Tân',
    hotline: '0333.938.014',
    workingHours: '8h00 - 19h00'
  }
};
