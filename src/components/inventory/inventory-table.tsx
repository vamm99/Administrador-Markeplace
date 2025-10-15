'use client';

import { InventoryItem } from '@/lib/types/kardex';
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
import { Eye, AlertTriangle, CheckCircle } from 'lucide-react';

interface InventoryTableProps {
  inventory: InventoryItem[];
  onViewMovements: (item: InventoryItem) => void;
}

export function InventoryTable({ inventory, onViewMovements }: InventoryTableProps) {
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: 'Sin Stock', color: 'bg-red-500', icon: AlertTriangle };
    } else if (stock < 10) {
      return { label: 'Stock Bajo', color: 'bg-yellow-500', icon: AlertTriangle };
    } else {
      return { label: 'Stock OK', color: 'bg-green-500', icon: CheckCircle };
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
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
            <TableHead>Producto</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Stock Actual</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Último Movimiento</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No hay productos en el inventario
              </TableCell>
            </TableRow>
          ) : (
            inventory.map((item) => {
              const status = getStockStatus(item.currentStock);
              const StatusIcon = status.icon;

              return (
                <TableRow key={item.product._id}>
                  <TableCell className="font-medium">
                    {item.product.name}
                  </TableCell>
                  <TableCell>
                    {typeof item.product.category_id === 'string'
                      ? item.product.category_id
                      : item.product.category_id?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {item.currentStock} unidades
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.lastMovement
                      ? formatDate(item.lastMovement.createdAt)
                      : 'Sin movimientos'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewMovements(item)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Movimientos
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
