# 📦 Módulo de Inventario (Kardex) - Guía Completa

## ✅ Implementación Completada

He desarrollado el **módulo completo de inventario con sistema Kardex** para el control de movimientos de stock.

---

## 🎯 Funcionalidades Implementadas

### **1. Gestión de Inventario** ✅
- **Listar inventario** completo del usuario
- **Ver stock actual** de cada producto
- **Estado visual** (Sin Stock / Stock Bajo / Stock OK)
- **Último movimiento** registrado

### **2. Sistema Kardex** ✅
- **Historial de movimientos** por producto
- **Registro de entradas y salidas**
- **Stock resultante** en cada movimiento
- **Comentarios** descriptivos
- **Paginación** de movimientos

### **3. Exportación a Excel** ✅
- Exportar movimientos de inventario
- Filtrar por rango de fechas
- Incluye: Producto, Categoría, Fecha, Hora, Comentario, Cantidad, Stock

### **4. Estadísticas** ✅
- Total de productos
- Stock total (unidades)
- Productos con stock bajo (<10)
- Productos sin stock (0)

---

## 🏗️ Arquitectura

### **Esquemas del Backend**

#### **Kardex Schema**
```typescript
@Schema({ timestamps: true })
export class Kardex {
  comment: string;      // Descripción del movimiento
  quantity: number;     // Cantidad (+entrada / -salida)
  stock: number;        // Stock resultante después del movimiento
}
```

#### **ProductKardex Schema** (Tabla Intermedia)
```typescript
@Schema({ timestamps: true })
export class ProductKardex {
  product_id: mongoose.Types.ObjectId;  // Relación con Product
  kardex_id: mongoose.Types.ObjectId;   // Relación con Kardex
}
```

**Relación:**
```
User (usuarios)
  ↓
UserProduct (productos del usuario)
  ↓
Product (producto)
  ↓
ProductKardex (movimientos del producto)
  ↓
Kardex (detalle del movimiento)
```

---

## 📡 Endpoints del Backend

### **POST** `/kardex`
Crear un movimiento de kardex

**Roles:** `admin`, `seller`

**Body:**
```json
{
  "product_id": "507f1f77bcf86cd799439011",
  "comment": "Compra de mercancía",
  "quantity": 50,
  "stock": 150
}
```

**Respuesta:**
```json
{
  "code": 201,
  "message": "Kardex entry created successfully",
  "data": {
    "_id": "...",
    "comment": "Compra de mercancía",
    "quantity": 50,
    "stock": 150,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### **GET** `/kardex/inventory`
Obtener inventario completo del usuario

**Roles:** `admin`, `seller`

**Respuesta:**
```json
{
  "code": 200,
  "message": "Inventory fetched successfully",
  "data": [
    {
      "product": {
        "_id": "...",
        "name": "Laptop HP",
        "category_id": { "name": "Electrónica" },
        "price": 2500000
      },
      "currentStock": 15,
      "lastMovement": {
        "_id": "...",
        "comment": "Venta",
        "quantity": -2,
        "stock": 15,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    }
  ]
}
```

---

### **GET** `/kardex/stats`
Obtener estadísticas de inventario

**Roles:** `admin`, `seller`

**Respuesta:**
```json
{
  "code": 200,
  "message": "Inventory stats fetched successfully",
  "data": {
    "totalProducts": 25,
    "totalStock": 450,
    "lowStock": 3,
    "outOfStock": 1
  }
}
```

---

### **GET** `/kardex/product/:id`
Obtener movimientos de kardex por producto

**Roles:** `admin`, `seller`

**Query Params:**
- `page` (opcional): Número de página
- `limit` (opcional): Movimientos por página
- `startDate` (opcional): Fecha inicio
- `endDate` (opcional): Fecha fin

**Ejemplo:**
```
GET /kardex/product/507f1f77bcf86cd799439011?page=1&limit=10
```

**Respuesta:**
```json
{
  "code": 200,
  "message": "Kardex fetched successfully",
  "data": [
    {
      "_id": "...",
      "comment": "Venta",
      "quantity": -2,
      "stock": 15,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "...",
      "comment": "Compra",
      "quantity": 10,
      "stock": 17,
      "createdAt": "2024-01-14T09:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### **GET** `/kardex/export`
Obtener movimientos para exportar

**Roles:** `admin`, `seller`

**Query Params:**
- `startDate` (opcional): Fecha inicio
- `endDate` (opcional): Fecha fin

---

## 📁 Archivos Creados

### **Backend (NestJS)**
```
✅ src/modules/kardex/dto/create-kardex.dto.ts
✅ src/modules/kardex/dto/query-kardex.dto.ts
✅ src/modules/kardex/repository/kardex.repository.ts
✅ src/modules/kardex/service/kardex.service.ts (actualizado)
✅ src/modules/kardex/controller/kardex.controller.ts (actualizado)
✅ src/modules/kardex/kardex.module.ts (actualizado)
```

### **Frontend (Next.js)**
```
✅ src/lib/types/kardex.ts
✅ src/app/actions/kardex.ts
✅ src/components/inventory/inventory-table.tsx
✅ src/components/inventory/movements-dialog.tsx
✅ src/app/(dashboard)/inventory/page.tsx
✅ src/components/app-sidebar.tsx (actualizado)
```

---

## 🎨 Interfaz de Usuario

### **Página de Inventario** (`/inventory`)

#### **Tarjetas de Estadísticas**
- 📦 **Total Productos**: Cantidad de productos
- 📊 **Stock Total**: Unidades totales
- ⚠️ **Stock Bajo**: Productos con <10 unidades
- ❌ **Sin Stock**: Productos agotados

#### **Tabla de Inventario**
| Producto | Categoría | Stock Actual | Estado | Último Movimiento | Acciones |
|----------|-----------|--------------|--------|-------------------|----------|
| Laptop HP | Electrónica | 15 unidades | Stock OK | 15/01/2024 | Ver Movimientos |

#### **Estados Visuales**
- 🟢 **Stock OK**: ≥10 unidades (verde)
- 🟡 **Stock Bajo**: 1-9 unidades (amarillo)
- 🔴 **Sin Stock**: 0 unidades (rojo)

---

### **Diálogo de Movimientos**

Al hacer clic en "Ver Movimientos":

#### **Info del Producto**
- Stock Actual
- Último Movimiento

#### **Tabla de Movimientos**
| Fecha | Comentario | Cantidad | Stock Resultante |
|-------|------------|----------|------------------|
| 15/01/2024 10:30 | Venta | -2 | 15 unidades |
| 14/01/2024 09:00 | Compra | +10 | 17 unidades |

**Cantidad:**
- Verde (+): Entrada de stock
- Rojo (-): Salida de stock

---

## 📊 Exportación a Excel

### **Funcionalidad**
1. Seleccionar rango de fechas (opcional)
2. Click en "Exportar Excel"
3. Se genera archivo `.xlsx` con:
   - Producto
   - Categoría
   - Fecha
   - Hora
   - Comentario
   - Cantidad
   - Stock Resultante

### **Nombre del Archivo**
```
inventario_2024-01-01_2024-01-31.xlsx
inventario_todos_hasta_hoy.xlsx
```

---

## 🔐 Seguridad

### **Aislamiento por Usuario**
- Cada usuario solo ve **sus propios productos**
- Los movimientos están asociados a productos del usuario
- El `user_id` se extrae del **token JWT**

### **Roles Permitidos**
- ✅ **Admin**: Acceso completo
- ✅ **Seller**: Acceso completo
- ❌ **Customer**: Sin acceso

---

## 🔄 Flujo de Uso

### **1. Ver Inventario**
```
1. Usuario entra a /inventory
   ↓
2. GET /kardex/inventory
   ↓
3. Backend obtiene productos del usuario (UserProduct)
   ↓
4. Para cada producto, obtiene último movimiento
   ↓
5. Calcula stock actual
   ↓
6. Retorna inventario completo
```

### **2. Ver Movimientos de un Producto**
```
1. Usuario click en "Ver Movimientos"
   ↓
2. GET /kardex/product/:id
   ↓
3. Backend busca en ProductKardex
   ↓
4. Hace populate de kardex_id
   ↓
5. Retorna historial de movimientos
   ↓
6. Muestra en diálogo con paginación
```

### **3. Exportar a Excel**
```
1. Usuario selecciona fechas (opcional)
   ↓
2. Click en "Exportar Excel"
   ↓
3. GET /kardex/export
   ↓
4. Backend retorna todos los movimientos
   ↓
5. Frontend genera archivo Excel
   ↓
6. Descarga automática
```

---

## 🧪 Cómo Probar

### **Test 1: Ver Inventario**
```
1. Inicia sesión como seller
2. Ve a /inventory
3. Verás tabla con tus productos
4. Stock actual y estado visual
```

### **Test 2: Ver Movimientos**
```
1. Click en "Ver Movimientos" de un producto
2. Se abre diálogo
3. Muestra historial de movimientos
4. Paginación si hay muchos
```

### **Test 3: Filtrar por Fechas**
```
1. Selecciona rango de fechas
2. Click en "Ver Movimientos"
3. Solo verás movimientos en ese período
```

### **Test 4: Exportar a Excel**
```
1. Selecciona fechas (opcional)
2. Click en "Exportar Excel"
3. Archivo se descarga
4. Abre y verifica datos
```

### **Test 5: Verificar Estados**
```
1. Producto con stock ≥10: Badge verde "Stock OK"
2. Producto con stock 1-9: Badge amarillo "Stock Bajo"
3. Producto con stock 0: Badge rojo "Sin Stock"
```

---

## 💡 Concepto de Kardex

### **¿Qué es Kardex?**
Sistema de control de inventario que registra **cada movimiento** de entrada y salida de productos.

### **Información que Registra**
- **Fecha y hora** del movimiento
- **Comentario**: Descripción (ej: "Compra", "Venta", "Devolución")
- **Cantidad**: +entrada / -salida
- **Stock resultante**: Stock después del movimiento

### **Ejemplo de Movimientos**

| Fecha | Comentario | Cantidad | Stock |
|-------|------------|----------|-------|
| 01/01 | Stock inicial | +100 | 100 |
| 05/01 | Venta | -10 | 90 |
| 10/01 | Compra | +50 | 140 |
| 15/01 | Venta | -5 | 135 |
| 20/01 | Devolución | +2 | 137 |

---

## 📊 Estadísticas Calculadas

| Métrica | Cálculo |
|---------|---------|
| **Total Productos** | Count de productos del usuario |
| **Stock Total** | Sum de stock actual de todos los productos |
| **Stock Bajo** | Count donde stock < 10 |
| **Sin Stock** | Count donde stock === 0 |

---

## ✨ Características Destacadas

### **1. Control Total de Inventario**
- Stock actual de cada producto
- Historial completo de movimientos
- Estados visuales intuitivos

### **2. Sistema Kardex Completo**
- Registro de entradas y salidas
- Comentarios descriptivos
- Stock resultante en cada movimiento

### **3. Exportación Flexible**
- Exportar todos los movimientos
- Filtrar por rango de fechas
- Formato Excel estándar

### **4. UI Informativa**
- Badges de estado con colores
- Diálogo de movimientos con paginación
- Estadísticas en tiempo real

---

## 🎯 Casos de Uso

### **Seller (Vendedor)**
```
✅ Ve inventario de sus productos
✅ Revisa stock actual
✅ Consulta historial de movimientos
✅ Exporta reportes de inventario
✅ Identifica productos con stock bajo
```

### **Admin (Administrador)**
```
✅ Gestiona su propio inventario
✅ Exporta movimientos
✅ Revisa estadísticas
```

---

## 🔍 Diferencias con Otros Módulos

| Aspecto | Productos | Inventario (Kardex) |
|---------|-----------|---------------------|
| **Enfoque** | Catálogo de productos | Control de stock |
| **Datos** | Info del producto | Movimientos de stock |
| **Historial** | No | Sí (cada movimiento) |
| **Stock** | Valor actual | Historial completo |

---

## 🎉 Resumen

**¡Módulo de inventario completado!**

- ✅ **5 endpoints** en el backend
- ✅ **Sistema Kardex** completo
- ✅ **Página de inventario** con tabla
- ✅ **Diálogo de movimientos** con paginación
- ✅ **Exportación a Excel**
- ✅ **Estadísticas** en tiempo real
- ✅ **Estados visuales** (OK/Bajo/Sin Stock)
- ✅ **Aislamiento por usuario**
- ✅ **Sidebar actualizado**

**El módulo está 100% funcional y listo para usar!** 🚀

---

## 📝 Notas Técnicas

### **Cálculo de Stock Actual**
El stock actual se obtiene del **último movimiento** registrado en el Kardex. Si no hay movimientos, se usa el stock del producto.

### **Movimientos Positivos y Negativos**
- **Positivo (+)**: Entrada de stock (compras, devoluciones)
- **Negativo (-)**: Salida de stock (ventas, mermas)

### **Paginación**
Los movimientos se paginan de 10 en 10 para mejor rendimiento.

---

**¡El sistema de inventario con Kardex está completo y funcional!** 📦✨
