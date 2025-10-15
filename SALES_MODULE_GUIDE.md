# 🛒 Módulo de Ventas - Guía Completa

## ✅ Implementación Completada

He desarrollado el **módulo completo de ventas (Sales)** con todas las funcionalidades solicitadas.

---

## 🎯 Funcionalidades Implementadas

### **1. Gestión de Ventas** ✅
- **Listar ventas** por usuario autenticado
- **Ver detalles** de cada venta
- **Filtrar** por estado y rango de fechas
- **Paginación** de resultados
- **Actualizar estado** (Pendiente → Completada)

### **2. Exportación a Excel** ✅
- Exportar ventas a archivo Excel (.xlsx)
- Filtrar por rango de fechas
- Incluye: Fecha, Hora, Productos, Unidades, Total, Estado

### **3. Dashboard con Métricas** ✅
- Total de ventas
- Ingresos totales
- Ventas completadas
- Ventas pendientes
- Tasa de completación
- Promedio por venta
- Acciones rápidas

---

## 🏗️ Arquitectura

### **Esquemas del Backend**

#### **Sales Schema**
```typescript
@Schema({ timestamps: true })
export class Sales {
  products: mongoose.Types.Array<{ 
    product_id: mongoose.Types.ObjectId, 
    price: number,
    quantity: number 
  }>;
  total: number;
  status: SalesStatus; // 'pending' | 'completed'
}
```

#### **UserSales Schema** (Tabla Intermedia)
```typescript
@Schema({ timestamps: true })
export class UserSales {
  user_id: mongoose.Types.ObjectId; // Relación con User
  sales_id: mongoose.Types.ObjectId; // Relación con Sales
  createdAt: Date;
  updatedAt: Date;
}
```

**Relación:**
```
User (usuarios)
  ↓
UserSales (tabla intermedia)
  ↓
Sales (ventas)
  ↓
Product (productos en la venta)
```

---

## 📡 Endpoints del Backend

### **POST** `/sales`
Crear una nueva venta

**Roles:** `admin`, `seller`

**Body:**
```json
{
  "products": [
    {
      "product_id": "507f1f77bcf86cd799439011",
      "price": 50000,
      "quantity": 2
    },
    {
      "product_id": "507f1f77bcf86cd799439012",
      "price": 30000,
      "quantity": 1
    }
  ],
  "total": 130000
}
```

**Respuesta:**
```json
{
  "code": 201,
  "message": "Sale created successfully",
  "data": {
    "_id": "...",
    "products": [...],
    "total": 130000,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### **GET** `/sales`
Obtener ventas del usuario con filtros

**Roles:** `admin`, `seller`

**Query Params:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Ventas por página (default: 10)
- `status` (opcional): `pending` | `completed`
- `startDate` (opcional): Fecha inicio (YYYY-MM-DD)
- `endDate` (opcional): Fecha fin (YYYY-MM-DD)

**Ejemplo:**
```
GET /sales?page=1&limit=10&status=completed&startDate=2024-01-01&endDate=2024-12-31
```

**Respuesta:**
```json
{
  "code": 200,
  "message": "Sales fetched successfully",
  "data": [
    {
      "_id": "...",
      "products": [
        {
          "product_id": {
            "_id": "...",
            "name": "Laptop HP",
            "price": 2500000
          },
          "price": 2500000,
          "quantity": 1
        }
      ],
      "total": 2500000,
      "status": "completed",
      "createdAt": "2024-01-15T10:30:00.000Z"
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

### **GET** `/sales/stats`
Obtener estadísticas de ventas del usuario

**Roles:** `admin`, `seller`

**Respuesta:**
```json
{
  "code": 200,
  "message": "Sales stats fetched successfully",
  "data": {
    "total": 50,
    "pending": 5,
    "completed": 45,
    "totalRevenue": 12500000
  }
}
```

---

### **GET** `/sales/export`
Obtener ventas para exportar (sin paginación)

**Roles:** `admin`, `seller`

**Query Params:**
- `startDate` (opcional): Fecha inicio
- `endDate` (opcional): Fecha fin

**Ejemplo:**
```
GET /sales/export?startDate=2024-01-01&endDate=2024-01-31
```

---

### **GET** `/sales/:id`
Obtener una venta por ID

**Roles:** `admin`, `seller`

---

### **PUT** `/sales/:id/status`
Actualizar estado de una venta

**Roles:** `admin`, `seller`

**Body:**
```json
{
  "status": "completed"
}
```

---

## 📁 Archivos Creados

### **Backend (NestJS)**

```
✅ src/modules/sales/dto/create-sale.dto.ts          - DTO para crear venta
✅ src/modules/sales/dto/query-sale.dto.ts           - DTO para filtros
✅ src/modules/sales/repository/sales.repository.ts  - Repositorio
✅ src/modules/sales/service/sales.service.ts        - Servicio (actualizado)
✅ src/modules/sales/controller/sales.controller.ts  - Controlador (actualizado)
✅ src/modules/sales/sales.module.ts                 - Módulo (actualizado)
```

### **Frontend (Next.js)**

```
✅ src/lib/types/sale.ts                             - Tipos TypeScript
✅ src/app/actions/sales.ts                          - Server Actions
✅ src/components/sales/sales-table.tsx              - Tabla de ventas
✅ src/components/sales/sale-details-dialog.tsx      - Diálogo de detalles
✅ src/app/(dashboard)/sales/page.tsx                - Página de ventas
✅ src/app/(dashboard)/home/page.tsx                 - Dashboard con métricas
✅ src/components/app-sidebar.tsx                    - Sidebar (actualizado)
```

---

## 🎨 Interfaz de Usuario

### **Página de Ventas** (`/sales`)

#### **Tarjetas de Estadísticas**
- 📊 Total de Ventas
- ⏰ Ventas Pendientes
- ✅ Ventas Completadas
- 💰 Ingresos Totales

#### **Filtros**
- Estado: Todos / Pendientes / Completadas
- Fecha Inicio
- Fecha Fin
- Botón "Exportar Excel"

#### **Tabla de Ventas**
| Fecha | Productos | Cantidad | Total | Estado | Acciones |
|-------|-----------|----------|-------|--------|----------|
| 15/01/2024 10:30 | 2 producto(s) | 3 unidad(es) | $130,000 | Completada | Ver / Completar |

#### **Acciones**
- 👁️ **Ver**: Muestra detalles de la venta
- ✅ **Completar**: Marca venta como completada (solo si está pendiente)

---

### **Dashboard** (`/home`)

#### **Métricas Principales**
- 🛒 Total de Ventas
- 💵 Ingresos Totales
- ✅ Ventas Completadas (con porcentaje)
- ⏰ Ventas Pendientes (con porcentaje)

#### **Resumen de Ventas**
- Tasa de Completación
- Promedio por Venta
- Estado General

#### **Acciones Rápidas**
- Ver Ventas
- Ver Productos

---

## 📊 Exportación a Excel

### **Funcionalidad**

1. Usuario selecciona rango de fechas (opcional)
2. Click en "Exportar Excel"
3. Se genera archivo `.xlsx` con:
   - Fecha
   - Hora
   - Cantidad de Productos
   - Unidades Totales
   - Total
   - Estado

### **Nombre del Archivo**
```
ventas_2024-01-01_2024-01-31.xlsx
ventas_todas_hasta_hoy.xlsx
```

### **Librería Usada**
```bash
npm install xlsx
```

### **Código de Exportación**
```typescript
import * as XLSX from 'xlsx';

const excelData = salesData.map((sale) => ({
  Fecha: new Date(sale.createdAt).toLocaleDateString('es-ES'),
  Hora: new Date(sale.createdAt).toLocaleTimeString('es-ES'),
  'Cantidad de Productos': sale.products.length,
  'Unidades Totales': sale.products.reduce((sum, p) => sum + p.quantity, 0),
  Total: sale.total,
  Estado: sale.status === 'completed' ? 'Completada' : 'Pendiente',
}));

const ws = XLSX.utils.json_to_sheet(excelData);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
XLSX.writeFile(wb, 'ventas.xlsx');
```

---

## 🔐 Permisos

### **Roles Permitidos**
- ✅ **Admin**: Acceso completo
- ✅ **Seller**: Acceso completo
- ❌ **Customer**: Sin acceso

### **Filtrado por Usuario**
Cada usuario (admin o seller) solo ve **sus propias ventas**, gracias a la tabla intermedia `UserSales`.

---

## 🔄 Flujo de Uso

### **1. Crear Venta**
```
1. Usuario (seller) crea venta desde el sistema
   ↓
2. POST /sales con productos y total
   ↓
3. Backend crea registro en Sales
   ↓
4. Backend crea relación en UserSales
   ↓
5. Venta queda asociada al usuario
```

### **2. Listar Ventas**
```
1. Usuario entra a /sales
   ↓
2. Frontend llama a GET /sales
   ↓
3. Backend extrae user_id del token
   ↓
4. Busca en UserSales donde user_id = usuario
   ↓
5. Hace populate de sales_id y products
   ↓
6. Retorna solo ventas del usuario
```

### **3. Exportar a Excel**
```
1. Usuario selecciona rango de fechas
   ↓
2. Click en "Exportar Excel"
   ↓
3. GET /sales/export con fechas
   ↓
4. Backend retorna todas las ventas (sin paginación)
   ↓
5. Frontend genera archivo Excel
   ↓
6. Descarga automática
```

---

## 🧪 Cómo Probar

### **Test 1: Ver Dashboard**
1. Inicia sesión como seller
2. Ve a `/home`
3. Verás métricas de tus ventas

### **Test 2: Listar Ventas**
1. Ve a `/sales`
2. Verás tabla con tus ventas
3. Estadísticas en tarjetas superiores

### **Test 3: Filtrar Ventas**
1. Selecciona "Estado: Pendientes"
2. Solo verás ventas pendientes
3. Selecciona rango de fechas
4. Verás ventas en ese período

### **Test 4: Ver Detalles**
1. Click en botón "Ver" de una venta
2. Se abre diálogo con detalles
3. Muestra productos, cantidades, precios

### **Test 5: Completar Venta**
1. Click en "Completar" en venta pendiente
2. Confirma acción
3. Estado cambia a "Completada"
4. Botón desaparece

### **Test 6: Exportar a Excel**
1. Selecciona rango de fechas (opcional)
2. Click en "Exportar Excel"
3. Archivo se descarga automáticamente
4. Abre archivo y verifica datos

---

## 📊 Métricas del Dashboard

### **Total de Ventas**
- Cuenta todas las ventas del usuario
- Icono: 🛒

### **Ingresos Totales**
- Suma del campo `total` de todas las ventas
- Formato: $12,500,000 COP
- Icono: 💵

### **Ventas Completadas**
- Cuenta ventas con `status === 'completed'`
- Muestra porcentaje del total
- Icono: ✅

### **Ventas Pendientes**
- Cuenta ventas con `status === 'pending'`
- Muestra porcentaje del total
- Icono: ⏰

### **Tasa de Completación**
- `(completadas / total) * 100`
- Ejemplo: 90%

### **Promedio por Venta**
- `ingresos totales / total de ventas`
- Ejemplo: $250,000

---

## ✨ Características Destacadas

### **1. Aislamiento por Usuario**
- Cada usuario solo ve sus propias ventas
- Usa tabla intermedia `UserSales`
- Seguridad garantizada por token JWT

### **2. Exportación Flexible**
- Exportar todas las ventas
- Exportar por rango de fechas
- Formato Excel estándar

### **3. Dashboard Informativo**
- Métricas en tiempo real
- Porcentajes calculados
- Acciones rápidas

### **4. UI Moderna**
- Toasts para notificaciones
- Badges de estado con colores
- Tablas responsivas
- Diálogos modales

---

## 🎉 Resumen

**¡Módulo de ventas completado!**

- ✅ Backend completo con 6 endpoints
- ✅ Frontend con página de ventas
- ✅ Exportación a Excel
- ✅ Dashboard con métricas
- ✅ Filtros por estado y fechas
- ✅ Toasts en lugar de alerts
- ✅ Aislamiento por usuario
- ✅ Sidebar actualizado

**El módulo está 100% funcional y listo para usar!** 🚀
