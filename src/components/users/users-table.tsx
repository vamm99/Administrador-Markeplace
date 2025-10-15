'use client';

import { useState } from 'react';
import { User, UserRole } from '@/lib/types/user';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, UserX } from 'lucide-react';
import { deactivateUserAction, deleteUserAction } from '@/app/actions/users';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onRefresh: () => void;
}

export function UsersTable({ users, onEdit, onRefresh }: UsersTableProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDeactivate = async (userId: string) => {
    if (!confirm('¿Estás seguro de desactivar este usuario?')) return;

    setLoading(userId);
    const result = await deactivateUserAction(userId);

    if (result.success) {
      alert('Usuario desactivado exitosamente');
      onRefresh();
    } else {
      alert(result.error || 'Error al desactivar usuario');
    }
    setLoading(null);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar permanentemente este usuario?')) return;

    setLoading(userId);
    const result = await deleteUserAction(userId);

    if (result.success) {
      alert('Usuario eliminado exitosamente');
      onRefresh();
    } else {
      alert(result.error || 'Error al eliminar usuario');
    }
    setLoading(null);
  };

  const getRoleBadge = (role: UserRole) => {
    const colors = {
      [UserRole.ADMIN]: 'bg-red-100 text-red-800',
      [UserRole.SELLER]: 'bg-blue-100 text-blue-800',
      [UserRole.CUSTOMER]: 'bg-green-100 text-green-800',
    };

    return (
      <Badge className={colors[role]}>
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800">Activo</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No hay usuarios para mostrar
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">
                  {user.name} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.typeDocument.toUpperCase()} - {user.idNumber}
                </TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(user)}
                      disabled={loading === user._id}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeactivate(user._id)}
                      disabled={loading === user._id || !user.status}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                      disabled={loading === user._id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
