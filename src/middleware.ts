import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de Next.js para proteger rutas
 * Se ejecuta antes de cada request
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obtener el token de las cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Si está en una ruta pública y tiene token, redirigir al dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  
  // Si está en una ruta privada y NO tiene token, redirigir al login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Permitir el acceso
  return NextResponse.next();
}

/**
 * Configuración del middleware
 * Define en qué rutas se ejecuta
 */
export const config = {
  matcher: [
    /*
     * Ejecutar en todas las rutas excepto:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     * - archivos públicos (*.svg, *.png, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
};
