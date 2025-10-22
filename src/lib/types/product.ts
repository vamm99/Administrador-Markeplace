// Tipos para el módulo de productos

import { ApiResponse } from './api';

// ============================================
// INTERFACES
// ============================================

export interface Product {
  _id: string;
  name: string;
  description: string;
  image_url: string;
  cost: number;
  price: number;
  stock: number;
  discount: number;
  status: boolean;
  category_id: string | { _id: string; name: string }; // Ajusta según tu modelo
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  image_url: string;
  cost: number;
  price: number;
  stock: number;
  discount: number;
  status: boolean;
  category_id: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  image_url?: string;
  cost?: number;
  price?: number;
  stock?: number;
  discount?: number;
  status?: boolean;
  category_id?: string;
}

export interface ProductFilters {
  search?: string;
  category_id?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

// ============================================
// RESPUESTAS DE LA API
// ============================================

export interface ProductsListResponse extends ApiResponse<Product[]> {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductResponse extends ApiResponse<Product> {
  data: Product;
}
