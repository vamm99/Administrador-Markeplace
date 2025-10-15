// Tipos para la API de NestJS
// Basados en la estructura real de tu backend

// ============================================
// TIPOS DE AUTENTICACIÓN
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  lastName: string;
  idNumber: string;
  typeDocument: 'DNI' | 'CE' | 'PASSPORT';
  phone: string;
  email: string;
  password: string;
  role: string;
  status: boolean;
}

// Usuario completo según tu schema de NestJS
export interface User {
  _id: string;
  name: string;
  lastName: string;
  idNumber: string;
  typeDocument: 'cc' | 'ce' | 'ti' | 'nit' | 'passport';
  phone: string;
  email: string;
  password: string;
  role: 'admin' | 'seller' | 'customer';
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// RESPUESTAS DE LA API
// ============================================

// Estructura genérica de respuesta de tu API NestJS
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  token?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Respuesta específica de login
export interface LoginResponse extends ApiResponse<User> {
  token: string;
  data: User;
}

// Respuesta específica de registro
export interface RegisterResponse extends ApiResponse<User> {
  data: User;
}

// ============================================
// TIPOS DE ERROR
// ============================================

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ============================================
// TIPOS PARA SERVER ACTIONS
// ============================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
