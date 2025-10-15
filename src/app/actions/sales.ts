'use server';

import { revalidatePath } from 'next/cache';
import { apiGet, apiPost, apiPut } from '@/lib/api/client';
import { getSession } from '@/lib/auth/session';
import { ActionResult } from '@/lib/types/api';
import {
  Sale,
  CreateSaleData,
  SaleFilters,
  SalesListResponse,
  SaleResponse,
  SalesStatsResponse,
} from '@/lib/types/sale';

/**
 * Obtener ventas del usuario con paginación y filtros
 */
export async function getSalesAction(
  page: number = 1,
  limit: number = 10,
  filters?: SaleFilters
): Promise<ActionResult<SalesListResponse>> {
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

    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await apiGet<SalesListResponse>(
      `/sales?${params.toString()}`,
      token
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener ventas',
    };
  }
}

/**
 * Obtener estadísticas de ventas del usuario
 */
export async function getSalesStatsAction(): Promise<ActionResult<SalesStatsResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiGet<SalesStatsResponse>('/sales/stats', token);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener estadísticas',
    };
  }
}

/**
 * Obtener una venta por ID
 */
export async function getSaleByIdAction(
  saleId: string
): Promise<ActionResult<SaleResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiGet<SaleResponse>(`/sales/${saleId}`, token);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener venta:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener venta',
    };
  }
}

/**
 * Crear una nueva venta
 */
export async function createSaleAction(
  saleData: CreateSaleData
): Promise<ActionResult<SaleResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiPost<SaleResponse>('/sales', saleData, token);

    revalidatePath('/sales');

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al crear venta:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear venta',
    };
  }
}

/**
 * Actualizar estado de una venta
 */
export async function updateSaleStatusAction(
  saleId: string,
  status: string
): Promise<ActionResult<SaleResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiPut<SaleResponse>(
      `/sales/${saleId}/status`,
      { status },
      token
    );

    revalidatePath('/sales');

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar estado',
    };
  }
}

/**
 * Obtener ventas para exportar
 */
export async function getSalesForExportAction(
  startDate?: string,
  endDate?: string
): Promise<ActionResult<SalesListResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiGet<SalesListResponse>(
      `/sales/export?${params.toString()}`,
      token
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener ventas para exportar:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener ventas',
    };
  }
}
