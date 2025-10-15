'use client';

import { useState, useEffect } from 'react';
import { Category, CreateCategoryData, UpdateCategoryData } from '@/lib/types/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createCategoryAction, updateCategoryAction } from '@/app/actions/categories';
import { toast } from 'sonner';

interface CategoryFormProps {
  category?: Category | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CategoryForm({ category, open, onClose, onSuccess }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
      });
    } else {
      // Reset form
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        // Actualizar categoría
        const updateData: UpdateCategoryData = { ...formData };
        const result = await updateCategoryAction(category._id, updateData);

        if (result.success) {
          toast.success('Categoría actualizada exitosamente');
          onSuccess();
          onClose();
        } else {
          toast.error(result.error || 'Error al actualizar categoría');
        }
      } else {
        // Crear categoría
        const result = await createCategoryAction(formData);

        if (result.success) {
          toast.success('Categoría creada exitosamente');
          onSuccess();
          onClose();
        } else {
          toast.error(result.error || 'Error al crear categoría');
        }
      }
    } catch (error) {
      toast.error('Error inesperado');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Editar Categoría' : 'Crear Nueva Categoría'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? 'Actualiza la información de la categoría'
              : 'Completa el formulario para crear una nueva categoría'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
              placeholder="Ej: Electrónica"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              disabled={loading}
              placeholder="Descripción de la categoría..."
              className="w-full min-h-[100px] px-3 py-2 border rounded-md"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : category ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
