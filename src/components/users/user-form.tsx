'use client';

import { useState, useEffect } from 'react';
import { User, CreateUserData, UpdateUserData, UserRole, TypeDocument } from '@/lib/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createUserAction, updateUserAction } from '@/app/actions/users';

interface UserFormProps {
  user?: User | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserForm({ user, open, onClose, onSuccess }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    lastName: '',
    idNumber: '',
    typeDocument: TypeDocument.CC,
    phone: '',
    email: '',
    password: '',
    role: UserRole.CUSTOMER,
    status: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        lastName: user.lastName,
        idNumber: user.idNumber,
        typeDocument: user.typeDocument,
        phone: user.phone,
        email: user.email,
        password: '', // No mostrar contraseña existente
        role: user.role,
        status: user.status,
      });
    } else {
      // Reset form
      setFormData({
        name: '',
        lastName: '',
        idNumber: '',
        typeDocument: TypeDocument.CC,
        phone: '',
        email: '',
        password: '',
        role: UserRole.CUSTOMER,
        status: true,
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // Actualizar usuario
        const updateData: UpdateUserData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // No actualizar contraseña si está vacía
        }

        const result = await updateUserAction(user._id, updateData);

        if (result.success) {
          alert('Usuario actualizado exitosamente');
          onSuccess();
          onClose();
        } else {
          alert(result.error || 'Error al actualizar usuario');
        }
      } else {
        // Crear usuario
        const result = await createUserAction(formData);

        if (result.success) {
          alert('Usuario creado exitosamente');
          onSuccess();
          onClose();
        } else {
          alert(result.error || 'Error al crear usuario');
        }
      }
    } catch (error) {
      alert('Error inesperado');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </DialogTitle>
          <DialogDescription>
            {user
              ? 'Actualiza la información del usuario'
              : 'Completa el formulario para crear un nuevo usuario'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            {/* Apellido */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            {/* Tipo de Documento */}
            <div className="space-y-2">
              <Label htmlFor="typeDocument">Tipo de Documento *</Label>
              <Select
                value={formData.typeDocument}
                onValueChange={(value) =>
                  setFormData({ ...formData, typeDocument: value as TypeDocument })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TypeDocument.CC}>Cédula de Ciudadanía</SelectItem>
                  <SelectItem value={TypeDocument.CE}>Cédula de Extranjería</SelectItem>
                  <SelectItem value={TypeDocument.TI}>Tarjeta de Identidad</SelectItem>
                  <SelectItem value={TypeDocument.NIT}>NIT</SelectItem>
                  <SelectItem value={TypeDocument.PASSPORT}>Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Número de Documento */}
            <div className="space-y-2">
              <Label htmlFor="idNumber">Número de Documento *</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData({ ...formData, idNumber: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Contraseña {user ? '(dejar vacío para no cambiar)' : '*'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!user}
                minLength={6}
                maxLength={12}
                disabled={loading}
              />
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as UserRole })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                  <SelectItem value={UserRole.SELLER}>Vendedor</SelectItem>
                  <SelectItem value={UserRole.CUSTOMER}>Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : user ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
