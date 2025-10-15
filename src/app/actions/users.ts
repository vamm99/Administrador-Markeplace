'use server';

// Server Actions para el módulo de usuarios

import { revalidatePath } from 'next/cache';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import { getSession } from '@/lib/auth/session';
import { ActionResult } from '@/lib/types/api';
import {
  User,
  CreateUserData,
  UpdateUserData,
  UserFilters,
  UsersListResponse,
  UserResponse,
  UserStatsResponse,
} from '@/lib/types/user';

/**
 * Obtener todos los usuarios con paginación y filtros
 */
export async function getUsersAction(
  page: number = 1,
  limit: number = 10,
  filters?: UserFilters
): Promise<ActionResult<UsersListResponse>> {
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
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);

    const response = await apiGet<UsersListResponse>(
      `/user?${params.toString()}`,
      token
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener usuarios',
    };
  }
}

/**
 * Obtener un usuario por ID
 */
export async function getUserByIdAction(
  userId: string
): Promise<ActionResult<UserResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiGet<UserResponse>(`/user/${userId}`, token);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener usuario',
    };
  }
}

/**
 * Crear un nuevo usuario
 */
export async function createUserAction(
  userData: CreateUserData
): Promise<ActionResult<UserResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiPost<UserResponse>('/user', userData, token);

    // Revalidar la página de usuarios para mostrar el nuevo usuario
    revalidatePath('/users');

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear usuario',
    };
  }
}

/**
 * Actualizar un usuario
 */
export async function updateUserAction(
  userId: string,
  userData: UpdateUserData
): Promise<ActionResult<UserResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiPut<UserResponse>(
      `/user/${userId}`,
      userData,
      token
    );

    // Revalidar las páginas relevantes
    revalidatePath('/users');
    revalidatePath(`/users/${userId}`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar usuario',
    };
  }
}

/**
 * Desactivar un usuario (soft delete)
 */
export async function deactivateUserAction(
  userId: string
): Promise<ActionResult<UserResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiDelete<UserResponse>(
      `/user/${userId}/soft`,
      token
    );

    revalidatePath('/users');

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al desactivar usuario',
    };
  }
}

/**
 * Eliminar un usuario permanentemente
 */
export async function deleteUserAction(
  userId: string
): Promise<ActionResult<void>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    await apiDelete(`/user/${userId}`, token);

    revalidatePath('/users');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al eliminar usuario',
    };
  }
}

/**
 * Obtener estadísticas de usuarios
 */
export async function getUserStatsAction(): Promise<
  ActionResult<UserStatsResponse>
> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiGet<UserStatsResponse>('/user/stats', token);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al obtener estadísticas',
    };
  }
}
