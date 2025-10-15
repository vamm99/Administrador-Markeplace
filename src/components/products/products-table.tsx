'use client';

import { useState } from 'react';
import { Product } from '@/lib/types/product';
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
import { Edit, Power, PowerOff, Image as ImageIcon } from 'lucide-react';
import { toggleProductStatusAction } from '@/app/actions/products';
import { toast } from 'sonner';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onRefresh: () => void;
}

export function ProductsTable({ products, onEdit, onRefresh }: ProductsTableProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'desactivar' : 'activar';
    if (!confirm(`¿Estás seguro de ${action} este producto?`)) return;

    setLoading(productId);
    const result = await toggleProductStatusAction(productId, !currentStatus);

    if (result.success) {
      toast.success(`Producto ${action}do exitosamente`);
      onRefresh();
    } else {
      toast.error(result.error || `Error al ${action} producto`);
    }
    setLoading(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800">Activo</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
    );
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge className="bg-red-100 text-red-800">Agotado</Badge>;
    } else if (stock < 10) {
      return <Badge className="bg-yellow-100 text-yellow-800">Bajo Stock</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800">{stock} unidades</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Costo</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Descuento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No hay productos para mostrar
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {product.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-green-600">
                  {formatPrice(product.price)}
                </TableCell>
                <TableCell className="text-gray-600">
                  {formatPrice(product.cost)}
                </TableCell>
                <TableCell>{getStockBadge(product.stock)}</TableCell>
                <TableCell>
                  {product.discount > 0 ? (
                    <Badge className="bg-orange-100 text-orange-800">
                      {product.discount}%
                    </Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                      disabled={loading === product._id}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={product.status ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleStatus(product._id, product.status)}
                      disabled={loading === product._id}
                    >
                      {product.status ? (
                        <PowerOff className="h-4 w-4" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
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
