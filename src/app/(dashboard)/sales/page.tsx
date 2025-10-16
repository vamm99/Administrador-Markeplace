'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Sale, SaleFilters } from '@/lib/types/sale';
import { getSalesAction, getSalesForExportAction } from '@/app/actions/sales';
import { SalesTable } from '@/components/sales/sales-table';
import { SaleDetailsDialog } from '@/components/sales/sale-details-dialog';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, DollarSign, ShoppingCart, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

// Hook personalizado para debouncing
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<SaleFilters>({});
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalRevenue: 0,
  });

  // Memoizar los filtros para evitar re-renders innecesarios
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const loadSales = useCallback(async () => {
    setLoading(true);
    const result = await getSalesAction(page, 10, memoizedFilters);

    if (result.success && result.data) {
      setSales(result.data.data || []);
      setTotalPages(result.data.meta?.totalPages || 1);
      setTotal(result.data.meta?.total || 0);

      // Calcular estadísticas
      const allSales = result.data.data || [];
      setStats({
        total: allSales.length,
        pending: allSales.filter((s) => s.status === 'pending').length,
        completed: allSales.filter((s) => s.status === 'completed').length,
        totalRevenue: allSales.reduce((sum, s) => sum + s.total, 0),
      });
    } else {
      toast.error(result.error || 'Error al cargar ventas');
    }
    setLoading(false);
  }, [page, memoizedFilters]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await getSalesForExportAction(
        filters.startDate,
        filters.endDate
      );

      if (result.success && result.data) {
        const salesData = result.data.data || [];

        // Preparar datos para Excel
        const excelData = salesData.map((sale) => ({
          Fecha: new Date(sale.createdAt).toLocaleDateString('es-ES'),
          Hora: new Date(sale.createdAt).toLocaleTimeString('es-ES'),
          'Cantidad de Productos': sale.products && Array.isArray(sale.products) ? sale.products.length : 0,
          'Unidades Totales': sale.products && Array.isArray(sale.products)
            ? sale.products.reduce(
                (sum, p) => sum + (p.quantity || 0),
                0
              )
            : 0,
          Total: sale.total,
          Estado: sale.status === 'completed' ? 'Completada' : 'Pendiente',
        }));

        // Crear libro de Excel
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Ventas');

        // Descargar archivo
        const fileName = `ventas_${
          filters.startDate || 'todas'
        }_${
          filters.endDate || 'hasta_hoy'
        }.xlsx`;
        XLSX.writeFile(wb, fileName);

        toast.success('Archivo Excel descargado exitosamente');
      } else {
        toast.error(result.error || 'Error al exportar ventas');
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al generar archivo Excel');
    } finally {
      setExporting(false);
    }
  };

  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedSale(null);
    setDetailsOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ventas</h1>
          <p className="text-gray-500">Gestiona tus ventas y exporta reportes</p>
        </div>
        <Button onClick={loadSales} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Exportación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) =>
                  setFilters(prev => ({
                    ...prev,
                    status: value === 'all' ? undefined : (value as any),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate || ''}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha Fin</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate || ''}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2 flex items-end">
              <Button
                onClick={handleExport}
                disabled={exporting || sales.length === 0}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? 'Exportando...' : 'Exportar Excel'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      {loading ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-gray-500">Cargando ventas...</div>
          </CardContent>
        </Card>
      ) : (
        <>
          <SalesTable
            sales={sales}
            onViewDetails={handleViewDetails}
            onRefresh={loadSales}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
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
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}

      {/* Sale Details Dialog */}
      <SaleDetailsDialog
        sale={selectedSale}
        open={detailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
}
