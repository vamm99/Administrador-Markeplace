'use server';

// Server Actions para el perfil del usuario

import { revalidatePath } from 'next/cache';
import { apiGet, apiPut } from '@/lib/api/client';
import { getSession, getUserData } from '@/lib/auth/session';
import { ActionResult } from '@/lib/types/api';
import { User as UserType, UpdateUserData, UserResponse } from '@/lib/types/user';

/**
 * Obtener datos del usuario actual desde las cookies
 */
export async function getUserDataAction(): Promise<ActionResult<UserType>> {
  try {
    const user = await getUserData();
    
    if (!user) {
      return {
        success: false,
        error: 'No se encontraron datos del usuario',
      };
    }

    return {
      success: true,
      data: user as UserType,
    };
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener datos del usuario',
    };
  }
}

/**
 * Obtener perfil completo del usuario desde la API
 */
export async function getProfileAction(): Promise<ActionResult<UserResponse>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await apiGet<UserResponse>('/auth/profile', token);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener perfil',
    };
  }
}

/**
 * Actualizar perfil del usuario actual
 */
export async function updateProfileAction(
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

    // Revalidar el perfil
    revalidatePath('/profile');

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar perfil',
    };
  }
}

/**
 * Cambiar contraseña del usuario actual
 */
export async function changePasswordAction(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<ActionResult<void>> {
  try {
    const token = await getSession();
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    // Aquí deberías tener un endpoint específico en tu API para cambiar contraseña
    // Por ahora usamos el update general
    const response = await apiPut<UserResponse>(
      `/user/${userId}`,
      { password: newPassword },
      token
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cambiar contraseña',
    };
  }
}
