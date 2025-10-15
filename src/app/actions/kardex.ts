'use server';

import { revalidatePath } from 'next/cache';
import { apiGet, apiPost } from '@/lib/api/client';
import { getSession } from '@/lib/auth/session';
import { ActionResult } from '@/lib/types/api';
import {
  Kardex,
  CreateKardexData,
  KardexFilters,
  KardexListResponse,
  InventoryResponse,
  InventoryStatsResponse,
  KardexExportResponse,
} from '@/lib/types/kardex';

/**
 * Obtener inventario del usuario
 */
export async function getInventoryAction(): Promise<ActionResult<InventoryResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiGet<InventoryResponse>('/kardex/inventory', token);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener inventario',
    };
  }
}

/**
 * Obtener estadísticas de inventario
 */
export async function getInventoryStatsAction(): Promise<ActionResult<InventoryStatsResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiGet<InventoryStatsResponse>('/kardex/stats', token);

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
 * Obtener movimientos de kardex por producto
 */
export async function getKardexByProductAction(
  product_id: string,
  page: number = 1,
  limit: number = 10,
  filters?: KardexFilters
): Promise<ActionResult<KardexListResponse>> {
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

    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await apiGet<KardexListResponse>(
      `/kardex/product/${product_id}?${params.toString()}`,
      token
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener kardex:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener kardex',
    };
  }
}

/**
 * Crear un movimiento de kardex
 */
export async function createKardexAction(
  kardexData: CreateKardexData
): Promise<ActionResult<any>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiPost<any>('/kardex', kardexData, token);

    revalidatePath('/inventory');

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al crear kardex:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear kardex',
    };
  }
}

/**
 * Obtener kardex para exportar
 */
export async function getKardexForExportAction(
  startDate?: string,
  endDate?: string
): Promise<ActionResult<KardexExportResponse>> {
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

    const response = await apiGet<KardexExportResponse>(
      `/kardex/export?${params.toString()}`,
      token
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener kardex para exportar:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener kardex',
    };
  }
}
