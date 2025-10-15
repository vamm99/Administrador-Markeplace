# 📡 Integración con API NestJS

Documentación completa sobre cómo consumir tu API NestJS desde Next.js.

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Arquitectura](#arquitectura)
3. [Cómo Funciona](#cómo-funciona)
4. [Uso Básico](#uso-básico)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [Seguridad](#seguridad)

---

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# URL de tu API NestJS
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Importante:** Cambia el puerto según tu configuración de NestJS.

### 2. Inicia tu API NestJS

```bash
cd /home/victor/NestJs/Auth-Init
npm run dev
```

### 3. Inicia Next.js

```bash
cd /home/victor/NextJs/administrador
npm run dev
```

---

## 🏗️ Arquitectura

La implementación sigue las mejores prácticas de Next.js 15:

```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts          # Cliente HTTP reutilizable
│   │   └── examples.ts        # Ejemplos de uso
│   ├── auth/
│   │   └── session.ts         # Gestión de sesiones con cookies
│   └── types/
│       └── api.ts             # Tipos TypeScript de la API
├── app/
│   └── actions/
│       └── auth.ts            # Server Actions (login, register, etc.)
├── middleware.ts              # Protección de rutas
└── components/
    └── login.tsx              # Componente de login
```

---

## 🔍 Cómo Funciona

### 1. **Cliente API** (`lib/api/client.ts`)

Es el núcleo de la comunicación con tu API NestJS. Proporciona funciones helper:

- `apiClient<T>()` - Cliente genérico
- `apiGet<T>()` - Peticiones GET
- `apiPost<T>()` - Peticiones POST
- `apiPut<T>()` - Peticiones PUT
- `apiDelete<T>()` - Peticiones DELETE

**Características:**
- ✅ Manejo automático de headers
- ✅ Gestión de tokens JWT
- ✅ Manejo de errores
- ✅ TypeScript completo

### 2. **Server Actions** (`app/actions/auth.ts`)

Son funciones que se ejecutan **en el servidor**, nunca en el cliente.

**Ventajas:**
- 🔒 **Seguridad**: Las credenciales nunca se exponen al navegador
- 🚀 **Rendimiento**: Menos JavaScript en el cliente
- 🎯 **Simplicidad**: No necesitas crear API routes

**Ejemplo:**
```typescript
'use server';

export async function loginAction(credentials: LoginCredentials) {
  // Esta función se ejecuta en el servidor
  const response = await apiPost('/auth/login', credentials);
  await setSession(response.token, response.data);
  return { success: true };
}
```

### 3. **Gestión de Sesiones** (`lib/auth/session.ts`)

Usa **cookies HTTP-only** para almacenar el token JWT de forma segura.

**Funciones disponibles:**
- `setSession(token, user)` - Guarda la sesión
- `getSession()` - Obtiene el token
- `getUserData()` - Obtiene datos del usuario
- `clearSession()` - Cierra sesión
- `isAuthenticated()` - Verifica autenticación

### 4. **Middleware** (`middleware.ts`)

Protege rutas automáticamente antes de que se carguen.

**Comportamiento:**
- Si estás en `/login` y tienes token → Redirige a `/`
- Si estás en ruta privada sin token → Redirige a `/login`

---

## 💡 Uso Básico

### Login

**En tu componente:**
```tsx
'use client';

import { loginAction } from '@/app/actions/auth';

export function Login() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await loginAction({ email, password });
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Obtener Datos del Usuario

**En Server Components:**
```tsx
import { getUserData } from '@/lib/auth/session';

export default async function Dashboard() {
  const user = await getUserData();
  
  return <h1>Bienvenido {user?.name}</h1>;
}
```

**En Client Components:**
```tsx
'use client';

import { useEffect, useState } from 'react';
import { getUserDataAction } from '@/app/actions/auth';

export function UserProfile() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    async function loadUser() {
      const result = await getUserDataAction();
      if (result.success) setUser(result.data);
    }
    loadUser();
  }, []);
  
  return <div>{user?.name}</div>;
}
```

---

## 📚 Ejemplos Prácticos

### Ejemplo 1: Obtener Productos

**1. Crea la Server Action:**
```typescript
// src/app/actions/products.ts
'use server';

import { getSession } from '@/lib/auth/session';
import { apiGet } from '@/lib/api/client';

export async function getProductsAction() {
  const token = await getSession();
  if (!token) return { success: false, error: 'No autenticado' };
  
  const response = await apiGet('/product', token);
  return { success: true, data: response };
}
```

**2. Úsala en tu componente:**
```tsx
'use client';

import { getProductsAction } from '@/app/actions/products';

export function ProductsList() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    getProductsAction().then(result => {
      if (result.success) setProducts(result.data.data);
    });
  }, []);
  
  return (
    <div>
      {products.map(product => (
        <div key={product._id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Ejemplo 2: Crear Producto

**1. Crea la Server Action:**
```typescript
'use server';

export async function createProductAction(productData: ProductDto) {
  const token = await getSession();
  if (!token) return { success: false, error: 'No autenticado' };
  
  const response = await apiPost('/product', productData, token);
  return { success: true, data: response };
}
```

**2. Úsala en un formulario:**
```tsx
'use client';

export function CreateProductForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createProductAction({
      name,
      description,
      price,
      stock,
      category_id
    });
    
    if (result.success) {
      alert('Producto creado!');
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Ejemplo 3: Proteger una Página

**Opción A: Con Middleware (Automático)**

El middleware ya protege todas las rutas excepto `/login`.

**Opción B: Manualmente en la Página**

```tsx
// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/session';

export default async function DashboardPage() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/login');
  }
  
  return <div>Dashboard protegido</div>;
}
```

---

## 🔒 Seguridad

### ✅ Buenas Prácticas Implementadas

1. **Cookies HTTP-only**: El token no es accesible desde JavaScript del cliente
2. **Server Actions**: Las credenciales nunca se envían al navegador
3. **CORS habilitado**: Tu API NestJS acepta peticiones del frontend
4. **Validación**: Todos los datos se validan antes de enviar

### ⚠️ Importante en Producción

1. **HTTPS**: Usa siempre HTTPS en producción
2. **Variables de entorno**: Nunca commitees `.env.local`
3. **Tokens**: Configura tiempo de expiración en NestJS
4. **Rate limiting**: Implementa límites de peticiones

---

## 🎯 Flujo Completo de Autenticación

```
1. Usuario ingresa credenciales en /login
   ↓
2. Componente Login llama a loginAction() (Server Action)
   ↓
3. loginAction() hace POST a /auth/login en NestJS
   ↓
4. NestJS valida y retorna { token, data: user }
   ↓
5. setSession() guarda token en cookie HTTP-only
   ↓
6. Usuario es redirigido a /
   ↓
7. Middleware verifica cookie en cada navegación
   ↓
8. Peticiones futuras incluyen el token automáticamente
```

---

## 🆘 Troubleshooting

### Error: "Failed to fetch"

**Causa**: La API NestJS no está corriendo o la URL es incorrecta.

**Solución**:
1. Verifica que NestJS esté corriendo: `npm run dev`
2. Revisa el puerto en `.env.local`
3. Verifica CORS en NestJS (ya está habilitado)

### Error: "Unauthorized"

**Causa**: El token no se está enviando o es inválido.

**Solución**:
1. Verifica que el login fue exitoso
2. Revisa las cookies en DevTools
3. Verifica que el token no haya expirado

### Error: TypeScript

**Causa**: Tipos no coinciden con la API.

**Solución**:
1. Revisa `src/lib/types/api.ts`
2. Asegúrate que coincidan con los DTOs de NestJS

---

## 📝 Próximos Pasos

1. ✅ Implementar registro de usuarios
2. ✅ Agregar recuperación de contraseña
3. ✅ Crear módulos para productos, categorías, etc.
4. ✅ Implementar paginación
5. ✅ Agregar manejo de errores global

---

## 🤝 Contribuir

Si encuentras algún problema o tienes sugerencias, no dudes en mejorar esta implementación.

---

**Creado con ❤️ para tu proyecto de administración**
