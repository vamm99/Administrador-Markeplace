# 📦 Módulo de Productos - Guía Completa

## ✅ Implementación Completada

He implementado un módulo completo de gestión de productos con todas las funcionalidades CRUD.

---

## 🎯 Funcionalidades Implementadas

### **CRUD Completo**
- ✅ **Crear productos** - Formulario completo con validación
- ✅ **Listar productos** - Tabla con paginación y filtros
- ✅ **Editar productos** - Actualización de información
- ✅ **Activar/Desactivar** - Toggle de estado del producto
- ✅ **Búsqueda** - Por nombre o descripción
- ✅ **Filtros** - Por estado (activo/inactivo)

### **Características Adicionales**
- ✅ **Estadísticas** - Total, activos, inactivos, bajo stock
- ✅ **Preview de imágenes** - Visualización en tabla y formulario
- ✅ **Formato de precios** - Moneda colombiana (COP)
- ✅ **Badges de stock** - Agotado, bajo stock, disponible
- ✅ **Descuentos** - Gestión de porcentajes de descuento
- ✅ **Diseño responsive** - Adaptado a todos los dispositivos

---

## 📁 Archivos Creados

```
✅ src/lib/types/product.ts                          - Tipos TypeScript
✅ src/app/actions/products.ts                       - Server Actions
✅ src/components/products/products-table.tsx        - Tabla de productos
✅ src/components/products/product-form.tsx          - Formulario
✅ src/app/(dashboard)/products/page.tsx             - Página principal
✅ src/components/app-sidebar.tsx                    - Link actualizado
```

---

## 📊 Estructura del Producto

```typescript
interface Product {
  _id: string;
  name: string;              // Nombre del producto
  description: string;       // Descripción detallada
  image_url: string;        // URL de la imagen
  cost: number;             // Costo del producto
  price: number;            // Precio de venta
  stock: number;            // Cantidad en inventario
  discount: number;         // Descuento en porcentaje (0-100)
  status: boolean;          // Activo/Inactivo
  category_id: string;      // ID de la categoría
  createdAt: Date;          // Fecha de creación
  updatedAt: Date;          // Última actualización
}
```

---

## 🚀 Cómo Usar

### **1. Acceder al Módulo**

- Click en "Productos" en el sidebar
- O navega a `/products`

### **2. Crear un Producto**

1. Click en "Nuevo Producto"
2. Completa el formulario:
   - **Nombre**: Nombre del producto
   - **Descripción**: Descripción detallada
   - **URL de Imagen**: Link a la imagen del producto
   - **Costo**: Precio de costo
   - **Precio de Venta**: Precio al público
   - **Stock**: Cantidad disponible
   - **Descuento**: Porcentaje (0-100)
   - **ID de Categoría**: Categoría a la que pertenece
   - **Estado**: Activo/Inactivo
3. Click en "Crear"

### **3. Editar un Producto**

1. Click en el botón de editar (✏️) en la tabla
2. Modifica los campos necesarios
3. Click en "Actualizar"

### **4. Activar/Desactivar Producto**

1. Click en el botón de estado (⚡/🔌) en la tabla
2. Confirma la acción
3. El producto cambia de estado

### **5. Buscar Productos**

- Escribe en la barra de búsqueda
- Busca por nombre o descripción
- Los resultados se filtran automáticamente

### **6. Filtrar por Estado**

- Usa el dropdown "Filtrar por estado"
- Selecciona: Todos, Activos o Inactivos

---

## 📡 Endpoints de la API

### **GET** `/product`
Obtener todos los productos con paginación

**Query Params:**
- `page`: Número de página (default: 1)
- `limit`: Productos por página (default: 10)
- `search`: Buscar por nombre/descripción
- `status`: Filtrar por estado (true/false)

### **GET** `/product/user`
Obtener productos del usuario actual

### **GET** `/product/:id`
Obtener un producto por ID

### **POST** `/product/register`
Crear un nuevo producto

**Body:**
```json
{
  "name": "Laptop Dell",
  "description": "Laptop Dell Inspiron 15...",
  "image_url": "https://...",
  "cost": 1500000,
  "price": 2000000,
  "stock": 10,
  "discount": 10,
  "status": true,
  "category_id": "507f1f77bcf86cd799439011"
}
```

### **PUT** `/product/:id`
Actualizar un producto

---

## 🎨 Características de la UI

### **Tabla de Productos**

- **Imagen**: Miniatura del producto (80x80px)
- **Nombre y Descripción**: Información principal
- **Precio**: Formato de moneda colombiana
- **Costo**: Precio de costo
- **Stock**: Badge con colores:
  - 🔴 Rojo: Agotado (0 unidades)
  - 🟡 Amarillo: Bajo stock (< 10 unidades)
  - 🔵 Azul: Disponible (≥ 10 unidades)
- **Descuento**: Badge naranja si tiene descuento
- **Estado**: Badge verde (activo) o gris (inactivo)
- **Acciones**: Editar y Activar/Desactivar

### **Formulario de Producto**

- **Preview de imagen**: Se muestra al ingresar URL
- **Validación**: Campos requeridos marcados con *
- **Números**: Inputs numéricos con validación
- **Checkbox**: Para activar/desactivar producto
- **Responsive**: Se adapta a móvil y desktop

### **Tarjetas de Estadísticas**

1. **Total Productos**: Cantidad total
2. **Activos**: Productos disponibles para venta
3. **Inactivos**: Productos desactivados
4. **Bajo Stock**: Productos con menos de 10 unidades

---

## 💰 Formato de Precios

Los precios se muestran en formato de moneda colombiana:

```typescript
// Entrada: 2000000
// Salida: $2.000.000
```

---

## 🎯 Server Actions Disponibles

### **`getProductsAction(page, limit, filters)`**
Obtiene productos con paginación y filtros

```typescript
const result = await getProductsAction(1, 10, {
  search: "laptop",
  status: "true"
});
```

### **`getMyProductsAction(page, limit)`**
Obtiene productos del usuario actual

```typescript
const result = await getMyProductsAction(1, 10);
```

### **`getProductByIdAction(productId)`**
Obtiene un producto específico

```typescript
const result = await getProductByIdAction("507f1f77bcf86cd799439011");
```

### **`createProductAction(productData)`**
Crea un nuevo producto

```typescript
const result = await createProductAction({
  name: "Nuevo Producto",
  description: "Descripción...",
  // ... otros campos
});
```

### **`updateProductAction(productId, productData)`**
Actualiza un producto

```typescript
const result = await updateProductAction(productId, {
  price: 2500000,
  stock: 15
});
```

### **`toggleProductStatusAction(productId, status)`**
Cambia el estado de un producto

```typescript
const result = await toggleProductStatusAction(productId, false);
```

---

## 🔐 Permisos

Según tu backend, algunos endpoints requieren roles específicos:

- **Crear producto**: `admin` o `seller`
- **Ver todos los productos**: Público
- **Ver mis productos**: `admin` o `seller`
- **Editar producto**: `admin` o `seller`
- **Cambiar estado**: `admin` o `seller`

---

## 🎨 Badges y Colores

### **Estado del Producto**
- 🟢 Verde: Activo
- ⚫ Gris: Inactivo

### **Stock**
- 🔴 Rojo: Agotado (0)
- 🟡 Amarillo: Bajo stock (< 10)
- 🔵 Azul: Disponible (≥ 10)

### **Descuento**
- 🟠 Naranja: Tiene descuento
- ➖ Gris: Sin descuento

---

## 🐛 Troubleshooting

### **No se muestran las imágenes**
**Solución:**
- Verifica que la URL sea válida
- Asegúrate que la imagen sea accesible públicamente
- Revisa la consola del navegador para errores CORS

### **Error al crear producto**
**Solución:**
- Verifica que todos los campos requeridos estén completos
- Asegúrate que el `category_id` sea válido
- Revisa que los números sean positivos

### **No aparecen productos**
**Solución:**
- Verifica que el backend esté corriendo
- Revisa que estés autenticado
- Verifica los filtros aplicados

---

## ✨ Próximas Mejoras Sugeridas

1. **Upload de imágenes** - Subir imágenes directamente
2. **Gestión de categorías** - CRUD de categorías
3. **Múltiples imágenes** - Galería de fotos por producto
4. **Variantes** - Tallas, colores, etc.
5. **Historial de precios** - Tracking de cambios de precio
6. **Importar/Exportar** - CSV/Excel de productos
7. **Código de barras** - Generación y escaneo
8. **Alertas de stock** - Notificaciones cuando stock es bajo

---

## 📊 Ejemplo de Flujo Completo

```typescript
// 1. Crear un producto
const createResult = await createProductAction({
  name: "Laptop HP Pavilion",
  description: "Laptop HP Pavilion 15 con Intel Core i5",
  image_url: "https://example.com/laptop.jpg",
  cost: 1800000,
  price: 2500000,
  stock: 5,
  discount: 15,
  status: true,
  category_id: "507f1f77bcf86cd799439011"
});

// 2. Listar productos
const listResult = await getProductsAction(1, 10);

// 3. Actualizar stock
const updateResult = await updateProductAction(productId, {
  stock: 10
});

// 4. Desactivar producto
const statusResult = await toggleProductStatusAction(productId, false);
```

---

**¡El módulo de productos está completamente funcional!** 🎉

Ahora tienes:
1. ✅ Gestión completa de productos
2. ✅ Búsqueda y filtros
3. ✅ Estadísticas en tiempo real
4. ✅ UI moderna y responsive
5. ✅ Validación de formularios
