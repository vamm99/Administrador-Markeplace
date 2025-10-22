'use server';

// Server Actions para autenticación
import { redirect } from 'next/navigation';
import { apiPost } from '@/lib/api/client';
import { setSession, clearSession } from '@/lib/auth/session';
import { 
  LoginCredentials, 
  LoginResponse,
  RegisterData,
  RegisterResponse,
  ActionResult 
} from '@/lib/types/api';

/**
 * Server Action para iniciar sesión
 * Se ejecuta en el servidor, nunca expone credenciales al cliente
 */
export async function loginAction(
  credentials: LoginCredentials
): Promise<ActionResult<LoginResponse>> {
  try {
    // Validación básica
    if (!credentials.email || !credentials.password) {
      return {
        success: false,
        error: 'Email y contraseña son requeridos',
      };
    }

    // Llamar a la API de NestJS
    const response = await apiPost<LoginResponse>(
      '/auth/login',
      credentials
    );

    // Guardar el token y datos del usuario en cookies
    await setSession(response.token, response.data);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    
    return {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : 'Error al iniciar sesión. Verifica tus credenciales.',
    };
  }
}

/**
 * Server Action para registrar un nuevo usuario
 */
export async function registerAction(
  userData: RegisterData
): Promise<ActionResult<RegisterResponse>> {
  try {
    // Llamar a la API de NestJS
    const response = await apiPost<RegisterResponse>(
      '/auth/register',
      userData
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    
    return {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : 'Error al registrar usuario.',
    };
  }
}

/**
 * Server Action para cerrar sesión
 */
export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect('/login');
}

/**
 * Server Action para verificar si el usuario está autenticado
 * Útil para proteger páginas
 */
export async function verifyAuthAction(): Promise<ActionResult<boolean>> {
  try {
    const { isAuthenticated } = await import('@/lib/auth/session');
    const authenticated = await isAuthenticated();
    
    return {
      success: true,
      data: authenticated,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al verificar autenticación',
    };
  }
}
