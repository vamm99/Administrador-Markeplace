// Gestión de sesiones con cookies
import { cookies } from 'next/headers';
import { User } from '@/lib/types/api';

const SESSION_COOKIE_NAME = 'auth_token';
const USER_COOKIE_NAME = 'user_data';

/**
 * Guarda el token de autenticación en una cookie HTTP-only
 */
export async function setSession(token: string, user: User) {
  const cookieStore = await cookies();
  
  // Guardar token en cookie HTTP-only (más seguro)
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });

  // Guardar datos del usuario en cookie accesible (para UI)
  cookieStore.set(USER_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });
}

/**
 * Obtiene el token de autenticación de las cookies
 */
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME);
  return token?.value || null;
}

/**
 * Obtiene los datos del usuario de las cookies
 */
export async function getUserData(): Promise<User | null> {
  const cookieStore = await cookies();
  const userData = cookieStore.get(USER_COOKIE_NAME);
  
  if (!userData?.value) return null;
  
  try {
    return JSON.parse(userData.value) as User;
  } catch {
    return null;
  }
}

/**
 * Actualiza solo los datos del usuario en las cookies (mantiene el token)
 */
export async function updateUserData(user: Partial<User>) {
  const cookieStore = await cookies();
  
  // Actualizar datos del usuario en cookie
  cookieStore.set(USER_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });
}

/**
 * Elimina la sesión (logout)
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(USER_COOKIE_NAME);
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getSession();
  return !!token;
}
