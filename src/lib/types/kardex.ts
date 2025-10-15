import { ApiResponse } from './api';
import { Product } from './product';

export interface Kardex {
  _id: string;
  comment: string;
  quantity: number;
  stock: number;
  product_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  product: Product;
  currentStock: number;
  lastMovement: Kardex | null;
}

export interface CreateKardexData {
  product_id: string;
  comment: string;
  quantity: number;
  stock: number;
}

export interface KardexFilters {
  product_id?: string;
  startDate?: string;
  endDate?: string;
}

export interface KardexListResponse extends ApiResponse<Kardex[]> {
  data: Kardex[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InventoryResponse extends ApiResponse<InventoryItem[]> {
  data: InventoryItem[];
}

export interface InventoryStats {
  totalProducts: number;
  totalStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface InventoryStatsResponse extends ApiResponse<InventoryStats> {
  data: InventoryStats;
}

export interface KardexExportItem {
  product: Product;
  kardex: Kardex;
  createdAt: Date;
}

export interface KardexExportResponse extends ApiResponse<KardexExportItem[]> {
  data: KardexExportItem[];
}
