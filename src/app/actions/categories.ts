'use server';

// Server Actions para el módulo de categorías

import { revalidatePath } from 'next/cache';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import { getSession } from '@/lib/auth/session';
import { ActionResult } from '@/lib/types/api';
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  CategoryFilters,
  CategoriesListResponse,
  CategoryResponse,
} from '@/lib/types/category';

/**
 * Obtener todas las categorías
 * Nota: Como el backend no tiene endpoints implementados, 
 * usaremos una estructura básica que puedes adaptar
 */
export async function getCategoriesAction(
  page: number = 1,
  limit: number = 100,
  filters?: CategoryFilters
): Promise<ActionResult<CategoriesListResponse>> {
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

    const response = await apiGet<CategoriesListResponse>(
      `/category?${params.toString()}`,
      token
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener categorías',
    };
  }
}

/**
 * Obtener todas las categorías sin paginación (para selects)
 */
export async function getAllCategoriesAction(): Promise<ActionResult<Category[]>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiGet<CategoriesListResponse>('/category?limit=1000', token);

    return {
      success: true,
      data: response.data || [],
    };
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener categorías',
    };
  }
}

/**
 * Obtener una categoría por ID
 */
export async function getCategoryByIdAction(
  categoryId: string
): Promise<ActionResult<CategoryResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiGet<CategoryResponse>(`/category/${categoryId}`, token);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener categoría',
    };
  }
}

/**
 * Crear una nueva categoría
 */
export async function createCategoryAction(
  categoryData: CreateCategoryData
): Promise<ActionResult<CategoryResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiPost<CategoryResponse>('/category', categoryData, token);

    revalidatePath('/categories');

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear categoría',
    };
  }
}

/**
 * Actualizar una categoría
 */
export async function updateCategoryAction(
  categoryId: string,
  categoryData: UpdateCategoryData
): Promise<ActionResult<CategoryResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiPut<CategoryResponse>(
      `/category/${categoryId}`,
      categoryData,
      token
    );

    revalidatePath('/categories');
    revalidatePath(`/categories/${categoryId}`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar categoría',
    };
  }
}

/**
 * Eliminar una categoría
 */
export async function deleteCategoryAction(
  categoryId: string
): Promise<ActionResult<void>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    await apiDelete(`/category/${categoryId}`, token);

    revalidatePath('/categories');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al eliminar categoría',
    };
  }
}
