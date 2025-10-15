/**
 * EJEMPLOS DE USO DEL CLIENTE API
 * 
 * Este archivo muestra cómo consumir los diferentes módulos de tu API NestJS
 * desde Next.js usando el cliente API que creamos.
 */

import { apiGet, apiPost, apiPut, apiDelete } from './client';
import { ApiResponse } from '@/lib/types/api';

// ============================================
// EJEMPLO 1: PRODUCTOS
// ============================================

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductRegisterDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
}

/**
 * Obtener todos los productos con paginación
 */
export async function getAllProducts(
  page: number = 1,
  limit: number = 10,
  token: string
): Promise<ApiResponse<Product[]>> {
  return apiGet<ApiResponse<Product[]>>(
    `/product?page=${page}&limit=${limit}`,
    token
  );
}

/**
 * Crear un nuevo producto
 */
export async function createProduct(
  productData: ProductRegisterDto,
  token: string
): Promise<ApiResponse<Product>> {
  return apiPost<ApiResponse<Product>>(
    '/product',
    productData,
    token
  );
}

/**
 * Actualizar un producto
 */
export async function updateProduct(
  productId: string,
  productData: Partial<ProductRegisterDto>,
  token: string
): Promise<ApiResponse<Product>> {
  return apiPut<ApiResponse<Product>>(
    `/product/${productId}`,
    productData,
    token
  );
}

/**
 * Eliminar un producto
 */
export async function deleteProduct(
  productId: string,
  token: string
): Promise<ApiResponse<void>> {
  return apiDelete<ApiResponse<void>>(
    `/product/${productId}`,
    token
  );
}

// ============================================
// EJEMPLO 2: CATEGORÍAS
// ============================================

interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Obtener todas las categorías
 */
export async function getAllCategories(
  token: string
): Promise<ApiResponse<Category[]>> {
  return apiGet<ApiResponse<Category[]>>(
    '/category',
    token
  );
}

// ============================================
// EJEMPLO 3: CARRITO DE COMPRAS
// ============================================

interface CartItem {
  product_id: string;
  quantity: number;
  price: number;
}

/**
 * Obtener el carrito del usuario
 */
export async function getCart(
  token: string
): Promise<ApiResponse<CartItem[]>> {
  return apiGet<ApiResponse<CartItem[]>>(
    '/cart',
    token
  );
}

/**
 * Agregar producto al carrito
 */
export async function addToCart(
  productId: string,
  quantity: number,
  token: string
): Promise<ApiResponse<void>> {
  return apiPost<ApiResponse<void>>(
    '/cart',
    { product_id: productId, quantity },
    token
  );
}

// ============================================
// EJEMPLO 4: PERFIL DE USUARIO
// ============================================

/**
 * Obtener perfil del usuario autenticado
 */
export async function getProfile(
  token: string
): Promise<ApiResponse<any>> {
  return apiGet<ApiResponse<any>>(
    '/auth/profile',
    token
  );
}

// ============================================
// EJEMPLO 5: USO EN SERVER ACTIONS
// ============================================

/**
 * EJEMPLO: Server Action para obtener productos
 * 
 * Crea este archivo: src/app/actions/products.ts
 */

/*
'use server';

import { getSession } from '@/lib/auth/session';
import { getAllProducts } from '@/lib/api/examples';
import { ActionResult } from '@/lib/types/api';

export async function getProductsAction(
  page: number = 1,
  limit: number = 10
): Promise<ActionResult<any>> {
  try {
    const token = await getSession();
    
    if (!token) {
      return {
        success: false,
        error: 'No autenticado',
      };
    }

    const response = await getAllProducts(page, limit, token);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener productos',
    };
  }
}
*/

// ============================================
// EJEMPLO 6: USO EN CLIENT COMPONENTS
// ============================================

/**
 * EJEMPLO: Componente de React que consume la API
 * 
 * Crea este archivo: src/components/products-list.tsx
 */

/*
'use client';

import { useState, useEffect } from 'react';
import { getProductsAction } from '@/app/actions/products';

export function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      const result = await getProductsAction(1, 10);
      
      if (result.success && result.data) {
        setProducts(result.data.data || []);
      } else {
        setError(result.error || 'Error al cargar productos');
      }
      
      setLoading(false);
    }

    loadProducts();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map((product: any) => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Precio: ${product.price}</p>
        </div>
      ))}
    </div>
  );
}
*/
