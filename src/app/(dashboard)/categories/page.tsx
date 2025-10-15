'use client';

import { useState, useEffect } from 'react';
import { Category, CategoryFilters } from '@/lib/types/category';
import { getCategoriesAction } from '@/app/actions/categories';
import { CategoriesTable } from '@/components/categories/categories-table';
import { CategoryForm } from '@/components/categories/category-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, FolderOpen, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CategoryFilters>({});
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    const result = await getCategoriesAction(1, 100, filters);

    if (result.success && result.data) {
      setCategories(result.data.data || []);
    } else {
      toast.error(result.error || 'Error al cargar categorías');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, [filters]);

  const handleSearch = (search: string) => {
    setFilters({ ...filters, search });
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedCategory(null);
  };

  const handleFormSuccess = () => {
    loadCategories();
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
          <p className="text-gray-500 mt-1">
            Administra las categorías de productos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categorías</CardTitle>
            <FolderOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar categorías por nombre..."
                  className="pl-10"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              onClick={loadCategories}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-500">Cargando categorías...</p>
        </div>
      ) : (
        <CategoriesTable
          categories={categories}
          onEdit={handleEdit}
          onRefresh={handleFormSuccess}
        />
      )}

      {/* Category Form Dialog */}
      <CategoryForm
        category={selectedCategory}
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
