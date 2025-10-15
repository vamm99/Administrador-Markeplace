// Cliente HTTP para consumir la API de NestJS

import { ApiError } from '@/lib/types/api';

// URL base de tu API NestJS
// Por defecto usa localhost:3006 (puerto común de NestJS)
// Puedes configurarlo en .env.local con NEXT_PUBLIC_API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';

/**
 * Cliente API genérico para hacer peticiones HTTP
 * @param endpoint - Ruta del endpoint (ej: '/auth/login')
 * @param options - Opciones de fetch (method, body, headers, etc.)
 * @param token - Token de autenticación opcional
 * @returns Promise con los datos tipados
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
  token?: string
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Agregar token de autorización si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Agregar headers adicionales del options
  if (options?.headers) {
    const additionalHeaders = new Headers(options.headers);
    additionalHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Clonamos la respuesta para poder leer el body de varias formas si hay un error
    const clonedResponse = response.clone();
    
    let data: any = null;
    let rawText: string | null = null;

    try {
        // 1. Intentar parsear como JSON para casos de éxito o errores estructurados
        data = await response.json();
    } catch (e) {
        // 2. Si falla el JSON, leer el body como texto sin formato (para 500s o HTML)
        rawText = await clonedResponse.text().catch(() => null);
    }
    
    if (!response.ok) {
      // Determinar el mensaje de error más informativo
      let errorMessage = response.statusText;

      if (data && typeof data === 'object' && 'message' in data) {
        // Usar mensaje estructurado de la API (ej: NestJS Validation Error, 404, etc.)
        errorMessage = (data as ApiError).message;
      } else if (rawText) {
        // Usar el cuerpo de la respuesta como texto sin formato (si existe)
        errorMessage = rawText;
      }
      
      // Re-lanzar con el error de la API (incluyendo el status)
      throw new Error(`Error ${response.status} en la API: ${errorMessage}`);
    }

    // Si la respuesta fue OK y se pudo parsear como JSON
    return data as T;
  } catch (error) {
    // Re-lanzar el error de red o el error de API que creamos arriba
    if (error instanceof Error) {
      throw error;
    }
    // Error de conexión de red (ej: CORS, DNS no resuelto)
    throw new Error('Error de conexión con el servidor (verifique la red o la URL de la API)');
  }
}

/**
 * Cliente API específico para peticiones GET
 */
export async function apiGet<T>(endpoint: string, token?: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'GET' }, token);
}

/**
 * Cliente API específico para peticiones POST
 */
export async function apiPost<T>(
  endpoint: string,
  body: unknown,
  token?: string
): Promise<T> {
  return apiClient<T>(
    endpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    token
  );
}

/**
 * Cliente API específico para peticiones PUT
 */
export async function apiPut<T>(
  endpoint: string,
  body: unknown,
  token?: string
): Promise<T> {
  return apiClient<T>(
    endpoint,
    {
      method: 'PUT',
      body: JSON.stringify(body),
    },
    token
  );
}

/**
 * Cliente API específico para peticiones DELETE
 */
export async function apiDelete<T>(endpoint: string, token?: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'DELETE' }, token);
}
