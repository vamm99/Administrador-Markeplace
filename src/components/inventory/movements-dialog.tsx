'use client';

import { useState, useEffect } from 'react';
import { InventoryItem, Kardex } from '@/lib/types/kardex';
import { getKardexByProductAction } from '@/app/actions/kardex';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MovementsDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onClose: () => void;
}

export function MovementsDialog({ item, open, onClose }: MovementsDialogProps) {
  const [movements, setMovements] = useState<Kardex[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (item && open) {
      loadMovements();
    }
  }, [item, open, page]);

  const loadMovements = async () => {
    if (!item) return;

    setLoading(true);
    const result = await getKardexByProductAction(item.product._id, page, 10);

    if (result.success && result.data) {
      setMovements(result.data.data || []);
      setTotalPages(result.data.meta?.totalPages || 1);
    } else {
      toast.error(result.error || 'Error al cargar movimientos');
    }
    setLoading(false);
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

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Movimientos de Inventario</DialogTitle>
          <DialogDescription>
            Historial de movimientos de: <strong>{item.product.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info del Producto */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Stock Actual</p>
              <p className="text-2xl font-bold">{item.currentStock} unidades</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Último Movimiento</p>
              <p className="font-medium">
                {item.lastMovement
                  ? formatDate(item.lastMovement.createdAt)
                  : 'Sin movimientos'}
              </p>
            </div>
          </div>

          {/* Tabla de Movimientos */}
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Cargando movimientos...</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Comentario</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Stock Resultante</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                          No hay movimientos registrados
                        </TableCell>
                      </TableRow>
                    ) : (
                      movements.map((movement) => (
                        <TableRow key={movement._id}>
                          <TableCell className="font-medium">
                            {formatDate(movement.createdAt)}
                          </TableCell>
                          <TableCell>{movement.comment}</TableCell>
                          <TableCell>
                            <span
                              className={
                                movement.quantity > 0
                                  ? 'text-green-600 font-semibold'
                                  : 'text-red-600 font-semibold'
                              }
                            >
                              {movement.quantity > 0 ? '+' : ''}
                              {movement.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {movement.stock} unidades
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <span className="flex items-center px-4">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
