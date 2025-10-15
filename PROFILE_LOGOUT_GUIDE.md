# 👤 Perfil de Usuario y Logout - Implementación Completa

## ✅ Funcionalidades Implementadas

### 1. **Cierre de Sesión (Logout)**
- ✅ Botón de logout en el header con dropdown
- ✅ Confirmación antes de cerrar sesión
- ✅ Limpieza de cookies (token y datos de usuario)
- ✅ Redirección automática a `/login`
- ✅ Estados de carga durante el proceso

### 2. **Perfil de Usuario**
- ✅ Página completa de perfil en `/profile`
- ✅ Visualización de información del usuario
- ✅ Edición de datos personales
- ✅ Cambio de contraseña
- ✅ Avatar con iniciales generadas
- ✅ Información de rol y estado
- ✅ Fecha de creación de cuenta

### 3. **Header Mejorado**
- ✅ Dropdown con información del usuario
- ✅ Avatar dinámico con iniciales
- ✅ Muestra nombre, email y rol
- ✅ Links a perfil y configuración
- ✅ Carga datos reales desde cookies

---

## 📁 Archivos Creados/Modificados

### **Nuevos Archivos**

```
src/
├── app/
│   ├── actions/
│   │   └── profile.ts                    ✅ Server Actions de perfil
│   └── (dashboard)/
│       └── profile/
│           └── page.tsx                  ✅ Página de perfil
└── components/
    └── main-header.tsx                   ✅ Actualizado con logout y datos reales
```

### **Archivos Modificados**

- `src/components/app-sidebar.tsx` - Agregado link "Mi Perfil"
- `src/lib/types/api.ts` - Corregidos tipos de User

---

## 🎯 Funcionalidades Detalladas

### **1. Header con Dropdown**

El header ahora muestra:
- **Avatar** con iniciales del usuario
- **Nombre completo** del usuario
- **Email** del usuario
- **Rol** (admin, seller, customer)
- **Links** a:
  - Mi Perfil
  - Configuración
  - Cerrar Sesión

### **2. Página de Perfil (`/profile`)**

#### **Sección de Información**
- Avatar grande con iniciales
- Nombre completo
- Email
- Rol y estado (activo/inactivo)
- Tipo y número de documento
- Teléfono
- Fecha de registro

#### **Formulario de Edición**
Permite editar:
- Nombre
- Apellido
- Email
- Teléfono
- Tipo de documento
- Número de documento

#### **Cambio de Contraseña**
- Formulario colapsable
- Validación de contraseñas
- Confirmación de nueva contraseña
- Mínimo 6 caracteres

---

## 🔐 Server Actions Creadas

### **`getUserDataAction()`**
Obtiene los datos del usuario desde las cookies (rápido, sin llamada a API).

```typescript
const result = await getUserDataAction();
if (result.success) {
  console.log(result.data); // User object
}
```

### **`getProfileAction()`**
Obtiene el perfil completo desde la API (datos actualizados).

```typescript
const result = await getProfileAction();
if (result.success) {
  console.log(result.data); // Full profile from API
}
```

### **`updateProfileAction(userId, userData)`**
Actualiza el perfil del usuario.

```typescript
const result = await updateProfileAction(user._id, {
  name: "Nuevo Nombre",
  phone: "3001234567"
});
```

### **`changePasswordAction(userId, currentPassword, newPassword)`**
Cambia la contraseña del usuario.

```typescript
const result = await changePasswordAction(
  user._id,
  "oldPassword123",
  "newPassword456"
);
```

### **`logoutAction()`**
Cierra la sesión del usuario.

```typescript
await logoutAction();
// Automáticamente redirige a /login
```

---

## 🎨 Componentes UI

### **MainHeader**
- Carga datos del usuario al montar
- Muestra avatar con iniciales
- Dropdown con opciones
- Maneja logout con confirmación

### **ProfilePage**
- Layout responsive (3 columnas en desktop)
- Cards organizadas por sección
- Formularios con validación
- Estados de carga
- Mensajes de éxito/error

---

## 🚀 Cómo Usar

### **1. Acceder al Perfil**

Desde cualquier página autenticada:
- Click en el avatar en el header
- Seleccionar "Mi Perfil"
- O navegar directamente a `/profile`

### **2. Editar Perfil**

1. Modificar los campos deseados
2. Click en "Guardar Cambios"
3. Esperar confirmación
4. Los cambios se reflejan inmediatamente

### **3. Cambiar Contraseña**

1. Click en "Cambiar Contraseña"
2. Ingresar contraseña actual
3. Ingresar nueva contraseña (mínimo 6 caracteres)
4. Confirmar nueva contraseña
5. Click en "Actualizar Contraseña"

### **4. Cerrar Sesión**

1. Click en el avatar en el header
2. Click en "Cerrar Sesión"
3. Confirmar en el diálogo
4. Serás redirigido a `/login`

---

## 🔄 Flujo de Logout

```
1. Usuario click en "Cerrar Sesión"
   ↓
2. Aparece confirmación
   ↓
3. Usuario confirma
   ↓
4. Se ejecuta logoutAction()
   ↓
5. Se limpian las cookies (auth_token, user_data)
   ↓
6. Se redirige a /login
   ↓
7. Middleware detecta falta de token
   ↓
8. Usuario no puede acceder a rutas protegidas
```

---

## 🔒 Seguridad

### **Cookies HTTP-Only**
- El token se guarda en cookie HTTP-only
- No es accesible desde JavaScript del cliente
- Protección contra XSS

### **Validación en Backend**
- Todas las actualizaciones pasan por el backend
- Validación de datos en NestJS
- Verificación de token en cada request

### **Confirmaciones**
- Logout requiere confirmación
- Cambio de contraseña requiere contraseña actual
- Previene acciones accidentales

---

## 🎯 Características Destacadas

### **Avatar Dinámico**
- Genera iniciales del nombre y apellido
- Usa servicio de avatares (DiceBear)
- Fallback a iniciales si falla la imagen

### **Responsive Design**
- Desktop: 3 columnas
- Tablet: 2 columnas
- Mobile: 1 columna
- Sidebar colapsable en móvil

### **Estados de Carga**
- Spinners mientras carga
- Botones deshabilitados durante operaciones
- Mensajes de "Guardando..." / "Actualizando..."

### **Validación de Formularios**
- Campos requeridos
- Validación de email
- Longitud mínima de contraseña
- Confirmación de contraseña

---

## 📊 Datos Mostrados en el Perfil

| Campo | Descripción | Editable |
|-------|-------------|----------|
| Nombre | Nombre del usuario | ✅ |
| Apellido | Apellido del usuario | ✅ |
| Email | Correo electrónico | ✅ |
| Teléfono | Número de teléfono | ✅ |
| Tipo de Documento | CC, CE, TI, NIT, Pasaporte | ✅ |
| Número de Documento | Identificación | ✅ |
| Rol | admin, seller, customer | ❌ |
| Estado | Activo/Inactivo | ❌ |
| Fecha de Registro | Cuándo se creó la cuenta | ❌ |

---

## 🐛 Troubleshooting

### **No se muestran los datos del usuario**
**Solución:**
1. Verifica que estés autenticado
2. Revisa las cookies en DevTools
3. Asegúrate que `getUserData()` retorna datos

### **Error al actualizar perfil**
**Solución:**
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador
3. Verifica que el token sea válido

### **Logout no funciona**
**Solución:**
1. Verifica que `logoutAction()` se esté llamando
2. Revisa que las cookies se estén eliminando
3. Verifica el middleware

---

## ✨ Próximas Mejoras Sugeridas

1. **Upload de foto de perfil** - Permitir subir imagen personalizada
2. **Historial de cambios** - Registrar modificaciones del perfil
3. **Verificación de email** - Confirmar cambios de email
4. **Autenticación de dos factores** - Mayor seguridad
5. **Preferencias de usuario** - Tema, idioma, notificaciones
6. **Actividad reciente** - Mostrar últimas acciones del usuario

---

**¡El módulo de perfil y logout está completamente funcional!** 🎉
