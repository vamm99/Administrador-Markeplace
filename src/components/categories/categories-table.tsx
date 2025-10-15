'use client';

import { useState } from 'react';
import { Category } from '@/lib/types/category';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { deleteCategoryAction } from '@/app/actions/categories';
import { toast } from 'sonner';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onRefresh: () => void;
}

export function CategoriesTable({ categories, onEdit, onRefresh }: CategoriesTableProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?`)) return;

    setLoading(categoryId);
    const result = await deleteCategoryAction(categoryId);

    if (result.success) {
      toast.success('Categoría eliminada exitosamente');
      onRefresh();
    } else {
      toast.error(result.error || 'Error al eliminar categoría');
    }
    setLoading(null);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Fecha de Creación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No hay categorías para mostrar
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-gray-600 max-w-md">
                  {category.description}
                </TableCell>
                <TableCell className="text-gray-500">
                  {formatDate(category.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category)}
                      disabled={loading === category._id}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category._id, category.name)}
                      disabled={loading === category._id}
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
