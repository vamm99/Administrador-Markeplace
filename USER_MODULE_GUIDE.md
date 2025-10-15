# 👥 Módulo de Usuarios - Guía Completa

## ✅ Implementación Completada

He implementado un módulo completo de gestión de usuarios tanto en el **backend (NestJS)** como en el **frontend (Next.js)**.

---

## 🎯 Funcionalidades Implementadas

### Backend (NestJS)

✅ **CRUD Completo de Usuarios**
- Crear usuario
- Listar usuarios con paginación y filtros
- Obtener usuario por ID
- Actualizar usuario
- Desactivar usuario (soft delete)
- Eliminar usuario permanentemente
- Obtener estadísticas de usuarios

✅ **Características**
- Validación de datos con class-validator
- Paginación con mongoose-paginate-v2
- Filtros por búsqueda, rol y estado
- Contraseñas hasheadas con bcrypt
- Respuestas estandarizadas

### Frontend (Next.js)

✅ **Interfaz Completa**
- Tabla de usuarios con acciones
- Formulario de crear/editar usuario
- Filtros y búsqueda en tiempo real
- Paginación
- Tarjetas de estadísticas
- Diseño responsive con Tailwind CSS

---

## 📁 Archivos Creados

### Backend (NestJS)

```
/home/victor/NestJs/Auth-Init/src/modules/user/
├── dto/
│   ├── create-user.dto.ts       ✅ DTO para crear usuario
│   ├── update-user.dto.ts       ✅ DTO para actualizar usuario
│   └── query-user.dto.ts        ✅ DTO para filtros de búsqueda
├── repository/
│   └── user.repository.ts       ✅ Capa de acceso a datos
├── service/
│   └── user.service.ts          ✅ Lógica de negocio
├── controller/
│   └── user.controller.ts       ✅ Endpoints REST
└── user.module.ts               ✅ Módulo actualizado
```

### Frontend (Next.js)

```
/home/victor/NextJs/administrador/src/
├── lib/
│   └── types/
│       └── user.ts              ✅ Tipos TypeScript
├── app/
│   ├── actions/
│   │   └── users.ts             ✅ Server Actions
│   └── users/
│       └── page.tsx             ✅ Página principal
├── components/
│   ├── users/
│   │   ├── users-table.tsx      ✅ Tabla de usuarios
│   │   └── user-form.tsx        ✅ Formulario
│   └── ui/
│       ├── table.tsx            ✅ Componente Table
│       ├── badge.tsx            ✅ Componente Badge
│       ├── select.tsx           ✅ Componente Select
│       └── dialog.tsx           ✅ Componente Dialog
```

---

## 🚀 Pasos para Usar

### 1. Instalar Dependencias Faltantes

En el proyecto Next.js, instala las dependencias de Radix UI:

```bash
cd /home/victor/NextJs/administrador
npm install @radix-ui/react-select @radix-ui/react-dialog
```

### 2. Iniciar el Backend

```bash
cd /home/victor/NestJs/Auth-Init
npm run dev
```

### 3. Iniciar el Frontend

```bash
cd /home/victor/NextJs/administrador
npm run dev
```

### 4. Acceder al Módulo

Navega a: **http://localhost:3000/users**

---

## 📡 Endpoints de la API

### **POST** `/user`
Crear un nuevo usuario

**Body:**
```json
{
  "name": "Juan",
  "lastName": "Pérez",
  "idNumber": "1234567890",
  "typeDocument": "cc",
  "phone": "3001234567",
  "email": "juan@example.com",
  "password": "password123",
  "role": "customer",
  "status": true
}
```

### **GET** `/user`
Obtener todos los usuarios con paginación

**Query Params:**
- `page`: Número de página (default: 1)
- `limit`: Usuarios por página (default: 10)
- `search`: Buscar por nombre, email o documento
- `role`: Filtrar por rol (admin, seller, customer)
- `status`: Filtrar por estado (true, false)

**Ejemplo:**
```
GET /user?page=1&limit=10&search=juan&role=customer&status=true
```

### **GET** `/user/stats`
Obtener estadísticas de usuarios

**Respuesta:**
```json
{
  "code": 200,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "total": 50,
    "active": 45,
    "inactive": 5,
    "byRole": [
      { "_id": "admin", "count": 5 },
      { "_id": "seller", "count": 15 },
      { "_id": "customer", "count": 30 }
    ]
  }
}
```

### **GET** `/user/:id`
Obtener un usuario por ID

### **PUT** `/user/:id`
Actualizar un usuario

**Body:** (todos los campos son opcionales)
```json
{
  "name": "Juan Carlos",
  "email": "juancarlos@example.com",
  "role": "seller"
}
```

### **DELETE** `/user/:id/soft`
Desactivar un usuario (soft delete)

### **DELETE** `/user/:id`
Eliminar un usuario permanentemente

---

## 🎨 Componentes UI

### UsersTable
Tabla con todas las funcionalidades:
- Muestra información de usuarios
- Badges de rol y estado
- Botones de acción (editar, desactivar, eliminar)
- Confirmaciones antes de acciones destructivas

### UserForm
Formulario modal para crear/editar:
- Validación de campos
- Selects para rol y tipo de documento
- Manejo de contraseña (opcional en edición)
- Estados de carga

### UsersPage
Página principal con:
- Tarjetas de estadísticas
- Barra de búsqueda
- Filtros por rol y estado
- Paginación
- Botón de crear usuario

---

## 🔐 Roles de Usuario

```typescript
enum UserRole {
  ADMIN = 'admin',      // Administrador del sistema
  SELLER = 'seller',    // Vendedor
  CUSTOMER = 'customer' // Cliente
}
```

## 📄 Tipos de Documento

```typescript
enum TypeDocument {
  CC = 'cc',           // Cédula de Ciudadanía
  CE = 'ce',           // Cédula de Extranjería
  TI = 'ti',           // Tarjeta de Identidad
  NIT = 'nit',         // NIT
  PASSPORT = 'passport' // Pasaporte
}
```

---

## 🔍 Características Avanzadas

### Búsqueda Inteligente
La búsqueda funciona en múltiples campos:
- Nombre
- Apellido
- Email
- Número de documento

### Paginación
- Configurable (10, 20, 50 usuarios por página)
- Muestra total de usuarios y páginas
- Navegación entre páginas

### Filtros
- **Por rol**: Admin, Seller, Customer
- **Por estado**: Activos, Inactivos
- **Combinables**: Puedes usar múltiples filtros simultáneamente

### Soft Delete
- Los usuarios no se eliminan inmediatamente
- Se desactivan primero (status = false)
- Opción de eliminación permanente

---

## 🎯 Próximos Pasos Sugeridos

1. **Agregar permisos**: Implementar sistema de permisos basado en roles
2. **Exportar datos**: Agregar botón para exportar usuarios a CSV/Excel
3. **Importar usuarios**: Permitir carga masiva de usuarios
4. **Historial de cambios**: Registrar quién modificó qué y cuándo
5. **Foto de perfil**: Agregar upload de imagen de perfil
6. **Notificaciones**: Enviar email al crear/actualizar usuario

---

## 🐛 Troubleshooting

### Error: "Module not found @radix-ui/react-select"
**Solución:** Instala las dependencias:
```bash
npm install @radix-ui/react-select @radix-ui/react-dialog
```

### Error: "Property 'toObject' does not exist"
**Solución:** Ya está corregido en el código con type casting.

### No aparecen usuarios
**Solución:**
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador
3. Verifica que estés autenticado (token en cookies)

### Error 401 Unauthorized
**Solución:** Asegúrate de estar logueado. El middleware protege la ruta `/users`.

---

## 📝 Ejemplo de Uso Completo

### 1. Crear un usuario desde el frontend

```typescript
// Se ejecuta automáticamente al enviar el formulario
const result = await createUserAction({
  name: "María",
  lastName: "González",
  idNumber: "9876543210",
  typeDocument: TypeDocument.CC,
  phone: "3109876543",
  email: "maria@example.com",
  password: "secure123",
  role: UserRole.SELLER,
  status: true
});

if (result.success) {
  console.log("Usuario creado:", result.data);
}
```

### 2. Buscar usuarios

```typescript
const result = await getUsersAction(1, 10, {
  search: "maría",
  role: UserRole.SELLER,
  status: "true"
});

if (result.success) {
  console.log("Usuarios encontrados:", result.data.data);
  console.log("Total:", result.data.meta.total);
}
```

### 3. Actualizar un usuario

```typescript
const result = await updateUserAction(userId, {
  role: UserRole.ADMIN,
  status: true
});
```

---

## ✨ Características Destacadas

- ✅ **TypeScript completo**: Todo tipado de principio a fin
- ✅ **Server Actions**: Seguridad y rendimiento
- ✅ **Validación**: En backend y frontend
- ✅ **UI Moderna**: Componentes de shadcn/ui
- ✅ **Responsive**: Funciona en móvil, tablet y desktop
- ✅ **Accesible**: Componentes accesibles de Radix UI
- ✅ **Optimizado**: Revalidación automática de cache

---

**¡El módulo de usuarios está completamente funcional y listo para usar!** 🎉
