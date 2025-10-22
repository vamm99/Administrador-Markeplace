'use client';

import { useState, useEffect } from 'react';
import { User, UpdateUserData, TypeDocument, UserRole } from '@/lib/types/user';
import { getUserDataAction, updateProfileAction, changePasswordAction } from '@/app/actions/profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User as UserIcon, Mail, Phone, IdCard, Shield, Calendar, Save, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateUserData>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    const result = await getUserDataAction();

    if (result.success && result.data) {
      setUser(result.data);
      setFormData({
        name: result.data.name,
        lastName: result.data.lastName,
        phone: result.data.phone,
        email: result.data.email,
        typeDocument: result.data.typeDocument,
        idNumber: result.data.idNumber,
      });
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const result = await updateProfileAction(user._id, formData);

    if (result.success) {
      toast.success('¡Perfil actualizado exitosamente!');
      loadUserData();
    } else {
      toast.error(result.error || 'No se pudo actualizar el perfil. Inténtalo nuevamente.');
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden. Por favor verifica e inténtalo nuevamente.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setSaving(true);
    const result = await changePasswordAction(
      user._id,
      passwordData.currentPassword,
      passwordData.newPassword
    );

    if (result.success) {
      toast.success('¡Contraseña actualizada exitosamente!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } else {
      toast.error(result.error || 'No se pudo cambiar la contraseña. Verifica tu contraseña actual e inténtalo nuevamente.');
    }
    setSaving(false);
  };

  const getInitials = (name?: string, lastName?: string) => {
    if (!name) return 'U';
    const firstInitial = name.charAt(0).toUpperCase();
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-500">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No se pudo cargar el perfil</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-gray-500 mt-1">Administra tu información personal</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt="Avatar"
              />
              <AvatarFallback className="text-2xl">
                {getInitials(user.name, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {user.name} {user.lastName}
              </CardTitle>
              <CardDescription className="text-base">{user.email}</CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium capitalize">{user.role}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className={`text-sm ${user.status ? 'text-green-600' : 'text-gray-500'}`}>
                  {user.status ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Information Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <IdCard className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Documento</p>
                <p className="font-medium">
                  {user.typeDocument.toUpperCase()} - {user.idNumber}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Miembro desde</p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
            <CardDescription>Actualiza tu información personal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={saving}
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={saving}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={saving}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={saving}
                  />
                </div>

                {/* Document Type */}
                <div className="space-y-2">
                  <Label htmlFor="typeDocument">Tipo de Documento</Label>
                  <Select
                    value={formData.typeDocument}
                    onValueChange={(value) =>
                      setFormData({ ...formData, typeDocument: value as TypeDocument })
                    }
                    disabled={saving}
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

                {/* ID Number */}
                <div className="space-y-2">
                  <Label htmlFor="idNumber">Número de Documento</Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber || ''}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Cambiar Contraseña
          </CardTitle>
          <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button onClick={() => setShowPasswordForm(true)} variant="outline">
              Cambiar Contraseña
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  disabled={saving}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  disabled={saving}
                  minLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  disabled={saving}
                  minLength={6}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
