'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, UserFilters, UserRole } from '@/lib/types/user';
import { getUsersAction, getUserStatsAction } from '@/app/actions/users';
import { UsersTable } from '@/components/users/users-table';
import { UserForm } from '@/components/users/user-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Users, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';
import { toast } from 'sonner';

// Hook personalizado para debouncing
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function UsersPageContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<UserFilters>({});
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  // Debounce search value to avoid excessive API calls
  const debouncedSearch = useDebounce(searchValue, 500);

  // Memoizar los filtros para evitar re-renders innecesarios
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const result = await getUsersAction(page, 10, memoizedFilters);

    if (result.success && result.data) {
      setUsers(result.data.data || []);
      setTotalPages(result.data.meta?.totalPages || 1);
      setTotal(result.data.meta?.total || 0);
    } else {
      toast.error(result.error || 'No se pudieron cargar los usuarios. Inténtalo nuevamente.');
    }
    setLoading(false);
  }, [page, memoizedFilters]);

  const loadStats = useCallback(async () => {
    const result = await getUserStatsAction();
    if (result.success && result.data) {
      setStats(result.data.data);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [loadUsers, loadStats]);

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters(prev => ({ ...prev, search: debouncedSearch }));
      setPage(1);
    }
  }, [debouncedSearch, filters.search]);

  const handleSearch = useCallback((search: string) => {
    setSearchValue(search);
  }, []);

  const handleRoleFilter = useCallback((role: string) => {
    // Si es "all", remover el filtro de rol
    if (role === 'all') {
      setFilters(prev => {
        const { role: _, ...rest } = prev;
        return rest;
      });
    } else {
      setFilters(prev => ({ ...prev, role: role as UserRole }));
    }
    setPage(1);
  }, []);

  const handleStatusFilter = useCallback((status: string) => {
    // Si es "all", remover el filtro de estado
    if (status === 'all') {
      setFilters(prev => {
        const { status: _, ...rest } = prev;
        return rest;
      });
    } else {
      setFilters(prev => ({ ...prev, status }));
    }
    setPage(1);
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedUser(null);
  };

  const handleFormSuccess = () => {
    loadUsers();
    loadStats();
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Inactivos</CardTitle>
            <UserX className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, email o documento..."
                  className="pl-10"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>

            {/* Role Filter */}
            <Select onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                <SelectItem value={UserRole.SELLER}>Vendedor</SelectItem>
                <SelectItem value={UserRole.CUSTOMER}>Cliente</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="true">Activos</SelectItem>
                <SelectItem value="false">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button
              variant="outline"
              onClick={() => {
                loadUsers();
                loadStats();
              }}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-500">Cargando usuarios...</p>
        </div>
      ) : (
        <>
          <UsersTable
            users={users}
            onEdit={handleEdit}
            onRefresh={handleFormSuccess}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {page} de {totalPages} ({total} usuarios)
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}

      {/* User Form Dialog */}
      <UserForm
        user={selectedUser}
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <UsersPageContent />
    </RoleGuard>
  );
}
