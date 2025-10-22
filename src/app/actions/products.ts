'use server';

// Server Actions para el módulo de productos

import { revalidatePath } from 'next/cache';
import { apiGet, apiPost, apiPut } from '@/lib/api/client';
import { getSession } from '@/lib/auth/session';
import { ActionResult } from '@/lib/types/api';
import {
  Product,
  CreateProductData,
  UpdateProductData,
  ProductFilters,
  ProductsListResponse,
  ProductResponse,
} from '@/lib/types/product';

/**
 * Obtener productos del usuario autenticado con paginación y filtros
 */
export async function getProductsAction(
  page: number = 1,
  limit: number = 10,
  filters?: ProductFilters
): Promise<ActionResult<ProductsListResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    // Construir query params
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.search) params.append('search', filters.search);
    if (filters?.category_id) params.append('category_id', filters.category_id);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

    // Usar endpoint /product/user para obtener solo productos del usuario
    const response = await apiGet<ProductsListResponse>(
      `/product/user?${params.toString()}`,
      token
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener productos',
    };
  }
}

/**
 * Obtener productos del usuario actual
 */
export async function getMyProductsAction(
  page: number = 1,
  limit: number = 10
): Promise<ActionResult<ProductsListResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiGet<ProductsListResponse>(
      `/product/user?${params.toString()}`,
      token
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener mis productos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener mis productos',
    };
  }
}

/**
 * Obtener un producto por ID
 */
export async function getProductByIdAction(
  productId: string
): Promise<ActionResult<ProductResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiGet<ProductResponse>(`/product/${productId}`, token);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener producto',
    };
  }
}

/**
 * Crear un nuevo producto
 */
export async function createProductAction(
  productData: CreateProductData
): Promise<ActionResult<ProductResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiPost<ProductResponse>('/product/register', productData, token);

    revalidatePath('/products');

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al crear producto:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear producto',
    };
  }
}

/**
 * Actualizar un producto
 */
export async function updateProductAction(
  productId: string,
  productData: UpdateProductData
): Promise<ActionResult<ProductResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiPut<ProductResponse>(
      `/product/${productId}`,
      productData,
      token
    );

    revalidatePath('/products');
    revalidatePath(`/products/${productId}`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar producto',
    };
  }
}

/**
 * Cambiar estado de un producto
 */
export async function toggleProductStatusAction(
  productId: string,
  status: boolean
): Promise<ActionResult<ProductResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiPut<ProductResponse>(
      `/product/${productId}/status`,
      { status },
      token
    );

    revalidatePath('/products');

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al cambiar estado del producto:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cambiar estado del producto',
    };
  }
}
