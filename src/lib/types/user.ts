// Tipos específicos para el módulo de usuarios

import { ApiResponse } from './api';

// ============================================
// ENUMS
// ============================================

export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  CUSTOMER = 'customer',
}

export enum TypeDocument {
  CC = 'cc',
  CE = 'ce',
  TI = 'ti',
  NIT = 'nit',
  PASSPORT = 'passport',
}

// ============================================
// INTERFACES
// ============================================

export interface User {
  _id: string;
  name: string;
  lastName: string;
  idNumber: string;
  typeDocument: TypeDocument;
  phone: string;
  email: string;
  role: UserRole;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  lastName: string;
  idNumber: string;
  typeDocument: TypeDocument;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  status?: boolean;
}

export interface UpdateUserData {
  name?: string;
  lastName?: string;
  idNumber?: string;
  typeDocument?: TypeDocument;
  phone?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: boolean;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Array<{
    _id: UserRole;
    count: number;
  }>;
}

// ============================================
// RESPUESTAS DE LA API
// ============================================

export interface UsersListResponse extends ApiResponse<User[]> {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserResponse extends ApiResponse<User> {
  data: User;
}

export interface UserStatsResponse extends ApiResponse<UserStats> {
  data: UserStats;
}
