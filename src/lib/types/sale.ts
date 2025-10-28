import { ApiResponse } from './api';
import { Product } from './product';

export type SaleStatus = 'pending' | 'completed';

export interface ProductItem {
  product_id: Product | string | {
    _id: string;
    name: string;
    price: number;
    image_url?: string;
  };
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Sale {
  _id: string;
  products: ProductItem[];
  total: number;
  status: SaleStatus;
  orderNumber?: string;
  payment_id?: string;
  user_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSaleData {
  products: {
    product_id: string;
    price: number;
    quantity: number;
  }[];
  total: number;
}

export interface SaleFilters {
  status?: SaleStatus;
  startDate?: string;
  endDate?: string;
}

export interface SalesListResponse extends ApiResponse<Sale[]> {
  data: Sale[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SaleResponse extends ApiResponse<Sale> {
  data: Sale;
}

export interface SalesStats {
  totalSales: number;
  pending: number;
  statusCounts: {
    pending: number;
    completed: number;
  };
  totalRevenue: number;
}

export interface SalesStatsResponse extends ApiResponse<SalesStats> {
  data: SalesStats;
}
