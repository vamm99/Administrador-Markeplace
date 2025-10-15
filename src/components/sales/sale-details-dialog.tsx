'use client';

import { Sale, ProductItem } from '@/lib/types/sale';
import { Product } from '@/lib/types/product';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SaleDetailsDialogProps {
  sale: Sale | null;
  open: boolean;
  onClose: () => void;
}

export function SaleDetailsDialog({ sale, open, onClose }: SaleDetailsDialogProps) {
  if (!sale) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProductName = (item: ProductItem): string => {
    if (!item || !item.product_id) return 'Producto desconocido';

    if (typeof item.product_id === 'string') {
      return 'Producto';
    }

    const product = item.product_id as Product;
    return product?.name || 'Producto sin nombre';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de la Venta</DialogTitle>
          <DialogDescription>
            Información completa de la venta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info General */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="font-medium">{formatDate(sale.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estado</p>
              {sale.status === 'completed' ? (
                <Badge variant="default" className="bg-green-500">
                  Completada
                </Badge>
              ) : (
                <Badge variant="secondary">Pendiente</Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Productos */}
          <div>
            <h3 className="font-semibold mb-3">Productos</h3>
            <div className="space-y-3">
              {sale.products && Array.isArray(sale.products) && sale.products.length > 0 ? (
                sale.products.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{getProductName(item)}</p>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity || 0} x {formatPrice(item.price || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice((item.price || 0) * (item.quantity || 0))}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No hay productos en esta venta</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-green-600">{formatPrice(sale.total)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
