'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSalesStatsAction } from '@/app/actions/sales';
import { DollarSign, ShoppingCart, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const result = await getSalesStatsAction();
    if (result.success && result.data) {
      setStats(result.data.data);
    }
    setLoading(false);
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
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Resumen de tus ventas y métricas</p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Cargando estadísticas...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Ventas
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Ventas registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Totales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Ingresos acumulados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas Completadas
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0
                  ? `${((stats.completed / stats.total) * 100).toFixed(1)}% del total`
                  : 'Sin ventas'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0
                  ? `${((stats.pending / stats.total) * 100).toFixed(1)}% del total`
                  : 'Sin ventas'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Ventas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Tasa de Completación</span>
              <span className="font-semibold">
                {stats.total > 0
                  ? `${((stats.completed / stats.total) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Promedio por Venta</span>
              <span className="font-semibold">
                {stats.total > 0
                  ? formatPrice(stats.totalRevenue / stats.total)
                  : formatPrice(0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Estado</span>
              <span className="font-semibold text-green-600">
                {stats.pending === 0 ? 'Todas completadas' : `${stats.pending} pendientes`}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/sales"
              className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Ver Ventas</p>
                  <p className="text-xs text-gray-500">Gestiona tus ventas</p>
                </div>
              </div>
            </a>
            <a
              href="/products"
              className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Ver Productos</p>
                  <p className="text-xs text-gray-500">Administra tu inventario</p>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}