'use client';

import { useState } from 'react';
import { Sale, ProductItem } from '@/lib/types/sale';
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
import { Eye, CheckCircle } from 'lucide-react';
import { updateSaleStatusAction } from '@/app/actions/sales';
import { toast } from 'sonner';

interface SalesTableProps {
  sales: Sale[];
  onViewDetails: (sale: Sale) => void;
  onRefresh: () => void;
}

export function SalesTable({ sales, onViewDetails, onRefresh }: SalesTableProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCompleteStatus = async (saleId: string) => {
    if (!confirm('¿Marcar esta venta como completada?')) return;

    setLoading(saleId);
    const result = await updateSaleStatusAction(saleId, 'completed');

    if (result.success) {
      toast.success('¡Venta marcada como completada exitosamente!');
      onRefresh();
    } else {
      toast.error(result.error || 'No se pudo actualizar el estado de la venta. Inténtalo nuevamente.');
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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProductsCount = (products: ProductItem[]) => {
    if (!products || !Array.isArray(products)) return 0;
    return products.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No hay ventas registradas
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale._id}>
                <TableCell className="font-medium">
                  {formatDate(sale.createdAt)}
                </TableCell>
                <TableCell>
                  {sale.products && Array.isArray(sale.products) ? sale.products.length : 0} producto(s)
                </TableCell>
                <TableCell>
                  {getProductsCount(sale.products || [])} unidad(es)
                </TableCell>
                <TableCell className="font-semibold">
                  {formatPrice(sale.total)}
                </TableCell>
                <TableCell>
                  {sale.status === 'completed' ? (
                    <Badge variant="default" className="bg-green-500">
                      Completada
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pendiente</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(sale)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  {sale.status === 'pending' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleCompleteStatus(sale._id)}
                      disabled={loading === sale._id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {loading === sale._id ? 'Procesando...' : 'Completar'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
