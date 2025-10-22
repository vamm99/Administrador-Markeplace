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
      const salesData = result.data.data || [];
      setSales(salesData);
      setTotalPages(result.data.meta?.totalPages || 1);
      setTotal(result.data.meta?.total || 0);

      // Calcular estadísticas con los datos de la página actual
      // (por ahora, luego optimizaremos para todas las ventas)
      setStats({
        total: salesData.length,
        pending: salesData.filter((s) => s.status === 'pending').length,
        completed: salesData.filter((s) => s.status === 'completed').length,
        totalRevenue: salesData.reduce((sum, s) => sum + (s.total || 0), 0),
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
      // console.log('Iniciando exportación con filtros:', filters);
      
      const result = await getSalesForExportAction(
        filters.startDate,
        filters.endDate
      );
  
      // console.log('Resultado de exportación:', result);
  
      if (result.success && result.data) {
        const salesData = result.data.data || [];
        
        // console.log('Datos de ventas a exportar:', salesData);
  
        if (salesData.length === 0) {
          toast.warning('No hay ventas para exportar con los filtros seleccionados');
          setExporting(false);
          return;
        }
  
        // Preparar datos para Excel con mejor formato
        const excelData = salesData.flatMap((sale:any) => {
          // Si la venta no tiene productos, crear una fila básica
          if (!sale.products || !Array.isArray(sale.products) || sale.products.length === 0) {
            return [{
              'N° Orden': sale.orderNumber || 'N/A',
              'Fecha': new Date(sale.createdAt).toLocaleDateString('es-ES'),
              'Hora': new Date(sale.createdAt).toLocaleTimeString('es-ES'),
              'Producto': 'Sin productos',
              'Precio Unit.': 0,
              'Cantidad': 0,
              'Subtotal': 0,
              'Total Venta': sale.total || 0,
              'Estado': sale.status === 'completed' ? 'Completada' : 
                       sale.status === 'pending' ? 'Pendiente' : 
                       sale.status === 'cancelled' ? 'Cancelada' : 'Otro',
            }];
          }
  
          // Crear una fila por cada producto
          return sale.products.map((product:any, index:any) => ({
            'N° Orden': index === 0 ? sale.orderNumber || 'N/A' : '', // Solo en la primera fila
            'Fecha': index === 0 ? new Date(sale.createdAt).toLocaleDateString('es-ES') : '',
            'Hora': index === 0 ? new Date(sale.createdAt).toLocaleTimeString('es-ES') : '',
            'Producto': product.name || 'Sin nombre',
            'Precio Unit.': product.price || 0,
            'Cantidad': product.quantity || 0,
            'Subtotal': (product.price || 0) * (product.quantity || 0),
            'Total Venta': index === 0 ? (sale.total || 0) : '', // Solo en la primera fila
            'Estado': index === 0 ? (
              sale.status === 'completed' ? 'Completada' : 
              sale.status === 'pending' ? 'Pendiente' : 
              sale.status === 'cancelled' ? 'Cancelada' : 'Otro'
            ) : '',
          }));
        });
  
        // console.log('Datos formateados para Excel:', excelData);
  
        // Crear libro de Excel
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        // Ajustar ancho de columnas
        const colWidths = [
          { wch: 15 }, // N° Orden
          { wch: 12 }, // Fecha
          { wch: 10 }, // Hora
          { wch: 30 }, // Producto
          { wch: 12 }, // Precio Unit.
          { wch: 10 }, // Cantidad
          { wch: 12 }, // Subtotal
          { wch: 15 }, // Total Venta
          { wch: 12 }, // Estado
        ];
        ws['!cols'] = colWidths;
  
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
  
        // Generar nombre de archivo
        const startDateStr = filters.startDate || 'todas';
        const endDateStr = filters.endDate || 'hasta_hoy';
        const fileName = `ventas_${startDateStr}_${endDateStr}.xlsx`;
        
        // Descargar archivo
        XLSX.writeFile(wb, fileName);
  
        toast.success(`Archivo Excel descargado: ${excelData.length} filas exportadas`);
      } else {
        toast.error(result.error || 'Error al exportar ventas');
      }
    } catch (error) {
      // console.error('Error al exportar:', error);
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
