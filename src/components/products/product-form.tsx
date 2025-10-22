'use client';

import { useState, useEffect } from 'react';
import { Product, CreateProductData, UpdateProductData } from '@/lib/types/product';
import { Category } from '@/lib/types/category';
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
import { createProductAction, updateProductAction } from '@/app/actions/products';
import { getAllCategoriesAction } from '@/app/actions/categories';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: Product | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductForm({ product, open, onClose, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    image_url: '',
    cost: 0,
    price: 0,
    stock: 0,
    discount: 0,
    status: true,
    category_id: '',
  });

  // Cargar categorías al abrir el formulario
  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  const loadCategories = async () => {
    setLoadingCategories(true);
    const result = await getAllCategoriesAction();
    if (result.success && result.data) {
      setCategories(result.data);
    }
    setLoadingCategories(false);
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        image_url: product.image_url,
        cost: product.cost,
        price: product.price,
        stock: product.stock,
        discount: product.discount,
        status: product.status,
        // Asegúrate de que category_id sea un string
        category_id: typeof product.category_id === 'object' 
        ? product.category_id._id 
        : product.category_id,
      });
    } else {
      // Reset form
      setFormData({
        name: '',
        description: '',
        image_url: '',
        cost: 0,
        price: 0,
        stock: 0,
        discount: 0,
        status: true,
        category_id: '',
      });
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product) {
        // Actualizar producto
        const updateData: UpdateProductData = { ...formData };
        const result = await updateProductAction(product._id, updateData);

        if (result.success) {
          toast.success('¡Producto actualizado exitosamente!');
          onSuccess();
          onClose();
        } else {
          toast.error(result.error || 'No se pudo actualizar el producto. Inténtalo nuevamente.');
        }
      } else {
        // Crear producto
        const result = await createProductAction(formData);

        if (result.success) {
          toast.success('¡Producto creado exitosamente!');
          onSuccess();
          onClose();
        } else {
          toast.error(result.error || 'No se pudo crear el producto. Inténtalo nuevamente.');
        }
      }
    } catch (error) {
      toast.error('Error inesperado. Por favor intenta de nuevo.');
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
            {product ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </DialogTitle>
          <DialogDescription>
            {product
              ? 'Actualiza la información del producto'
              : 'Completa el formulario para crear un nuevo producto'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
                placeholder="Ej: Laptop Dell Inspiron"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                disabled={loading}
                placeholder="Descripción detallada del producto..."
                className="w-full min-h-[80px] px-3 py-2 border rounded-md"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image_url">URL de Imagen *</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
                disabled={loading}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150?text=Error';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Cost */}
            <div className="space-y-2">
              <Label htmlFor="cost">Costo *</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost || ''}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value ? parseFloat(e.target.value) : 0 })}
                required
                disabled={loading}
                placeholder="0.00"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Precio de Venta *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : 0 })}
                required
                disabled={loading}
                placeholder="0.00"
              />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock || ''}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value ? parseInt(e.target.value) : 0 })}
                required
                disabled={loading}
                placeholder="0"
              />
            </div>

            {/* Discount */}
            <div className="space-y-2">
              <Label htmlFor="discount">Descuento (%) *</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount || ''}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value ? parseFloat(e.target.value) : 0 })}
                required
                disabled={loading}
                placeholder="0"
              />
            </div>

            {/* Category */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="category_id">Categoría *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                disabled={loading || loadingCategories}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingCategories ? "Cargando categorías..." : "Selecciona una categoría"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.length === 0 ? (
                    <div className="px-2 py-6 text-center text-sm text-gray-500">
                      No hay categorías disponibles
                    </div>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Selecciona la categoría a la que pertenece este producto
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="status"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  disabled={loading}
                  className="w-4 h-4"
                />
                <Label htmlFor="status" className="cursor-pointer">
                  Producto Activo
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : product ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
