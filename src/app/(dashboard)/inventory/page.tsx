'use client';

import { useState, useEffect } from 'react';
import { InventoryItem } from '@/lib/types/kardex';
import {
  getInventoryAction,
  getInventoryStatsAction,
  getKardexForExportAction,
} from '@/app/actions/kardex';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { MovementsDialog } from '@/components/inventory/movements-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Download,
  Package,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Archive,
} from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [movementsOpen, setMovementsOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const loadInventory = async () => {
    setLoading(true);
    const result = await getInventoryAction();

    if (result.success && result.data) {
      setInventory(result.data.data || []);
    } else {
      toast.error(result.error || 'Error al cargar inventario');
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const result = await getInventoryStatsAction();
    if (result.success && result.data) {
      setStats(result.data.data);
    }
  };

  useEffect(() => {
    loadInventory();
    loadStats();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Obtener movimientos de kardex
      const kardexResult = await getKardexForExportAction(startDate, endDate);

      if (kardexResult.success && kardexResult.data) {
        const kardexData = kardexResult.data.data || [];

        // Preparar datos de Kardex (Movimientos)
        const kardexExcelData = kardexData.map((item) => ({
          Producto: item.product.name,
          Categoría: item.product.category_id,
          Fecha: new Date(item.createdAt).toLocaleDateString('es-ES'),
          Hora: new Date(item.createdAt).toLocaleTimeString('es-ES'),
          Comentario: item.kardex.comment,
          Cantidad: item.kardex.quantity,
          'Stock Resultante': item.kardex.stock,
        }));

        // Preparar datos de Inventario (Stock Actual)
        const inventoryExcelData = inventory.map((item) => ({
          Producto: item.product.name,
          Categoría: item.product.category_id,
          'Stock Actual': item.currentStock,
          Estado:
            item.currentStock === 0
              ? 'Sin Stock'
              : item.currentStock < 10
              ? 'Stock Bajo'
              : 'Stock OK',
          'Precio Unitario': item.product.price,
          'Valor Total': item.currentStock * item.product.price,
          'Último Movimiento': item.lastMovement
            ? new Date(item.lastMovement.createdAt).toLocaleDateString('es-ES')
            : 'Sin movimientos',
        }));

        // Crear libro de Excel con dos hojas
        const wb = XLSX.utils.book_new();

        // Hoja 1: Inventario (Stock Actual)
        const wsInventory = XLSX.utils.json_to_sheet(inventoryExcelData);
        XLSX.utils.book_append_sheet(wb, wsInventory, 'Inventario');

        // Hoja 2: Kardex (Movimientos)
        const wsKardex = XLSX.utils.json_to_sheet(kardexExcelData);
        XLSX.utils.book_append_sheet(wb, wsKardex, 'Movimientos Kardex');

        // Descargar archivo
        const fileName = `inventario_completo_${
          startDate || 'todos'
        }_${
          endDate || 'hasta_hoy'
        }.xlsx`;
        XLSX.writeFile(wb, fileName);

        toast.success('Archivo Excel descargado exitosamente con 2 hojas');
      } else {
        toast.error(kardexResult.error || 'Error al exportar inventario');
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al generar archivo Excel');
    } finally {
      setExporting(false);
    }
  };

  const handleViewMovements = (item: InventoryItem) => {
    setSelectedItem(item);
    setMovementsOpen(true);
  };

  const handleCloseMovements = () => {
    setSelectedItem(null);
    setMovementsOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventario</h1>
          <p className="text-gray-500">
            Gestiona tu inventario y revisa movimientos
          </p>
        </div>
        <Button onClick={loadInventory} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Productos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Productos en inventario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <Archive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">Unidades totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">
              Productos con menos de 10 unidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">
              Productos agotados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar Movimientos de Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha Fin</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2 flex items-end">
              <Button
                onClick={handleExport}
                disabled={exporting}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? 'Exportando...' : 'Exportar Excel'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      {loading ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-gray-500">
              Cargando inventario...
            </div>
          </CardContent>
        </Card>
      ) : (
        <InventoryTable
          inventory={inventory}
          onViewMovements={handleViewMovements}
        />
      )}

      {/* Movements Dialog */}
      <MovementsDialog
        item={selectedItem}
        open={movementsOpen}
        onClose={handleCloseMovements}
      />
    </div>
  );
}
