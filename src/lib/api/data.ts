
import { ProductSummary, ProductDetail, CategoryNode } from './types';

// Centralized data store (shared between Admin and Client)
export let mockProducts: ProductSummary[] = [];

// Centralized product details store
export let productDetails: Record<string, ProductDetail> = {};

export const mockCategories: CategoryNode[] = [];
