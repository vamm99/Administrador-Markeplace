// Tipos para el módulo de categorías

import { ApiResponse } from './api';

// ============================================
// INTERFACES
// ============================================

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
  description: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export interface CategoryFilters {
  search?: string;
}

// ============================================
// RESPUESTAS DE LA API
// ============================================

export interface CategoriesListResponse extends ApiResponse<Category[]> {
  data: Category[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryResponse extends ApiResponse<Category> {
  data: Category;
}
