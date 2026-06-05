# Admin-EcommerceE

Panel administrativo del ecommerce construido con Angular 16. Es el entorno de trabajo del propietario del negocio: gestiona el catálogo, procesa órdenes, controla inventario y configura el contenido de la tienda. Consume los servicios de [Api-Ecommerce](https://github.com/JuanSCaicedo/Api-Ecommerce).

> 📄 Documentación técnica completa: [deepwiki.com/JuanSCaicedo/Admin-EcommerceE](https://deepwiki.com/JuanSCaicedo/Admin-EcommerceE)  
> 🌐 Proyecto en producción: [ecommerce.juandevops.com](https://ecommerce.juandevops.com)

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 16 |
| Lenguaje | TypeScript |
| Estilos | Bootstrap + SASS |
| HTTP | Angular HttpClient (consumo de API REST) |
| Autenticación | JWT con Guards de rol administrador |
| Build | Node.js v18 |
| Deploy | VPS Oracle Cloud Infrastructure |

---

## Arquitectura

El panel sigue la misma arquitectura modular por características que la tienda cliente, con lazy loading por sección y acceso restringido exclusivamente a usuarios con rol administrador.

```
src/app/
├── core/
│   ├── interceptors/      # Adjunta JWT de admin en cada petición
│   ├── guards/            # Protección de rutas: solo rol admin
│   └── services/          # Servicios compartidos (auth, notificaciones)
├── shared/                # Sidebar, navbar admin, componentes de tabla
├── modules/
│   ├── dashboard/         # Métricas básicas del negocio
│   ├── products/          # CRUD de productos con imágenes e inventario
│   ├── categories/        # Gestión de categorías del catálogo
│   ├── brands/            # Gestión de marcas
│   ├── orders/            # Listado y actualización de estado de órdenes
│   ├── users/             # Gestión de clientes y usuarios internos
│   ├── promotions/        # Creación y control de descuentos
│   └── settings/          # Configuración dinámica del sitio
```

---

## Funcionalidades

### Gestión del catálogo
- CRUD completo de productos: nombre, descripción, precio, stock, imágenes y categoría
- Gestión de categorías y marcas usadas para organizar y filtrar el catálogo
- Control de inventario básico por producto

### Gestión de órdenes
- Listado de todas las órdenes recibidas con filtro por estado
- Vista detallada de cada orden: productos, cantidades, cliente y monto total
- Actualización del estado del pedido (pendiente → procesando → enviado → entregado)

### Gestión de usuarios
- Listado de clientes registrados
- Administración de usuarios internos con asignación de roles y permisos

### Promociones y descuentos
- Creación de códigos o reglas de descuento aplicables en el checkout
- Activación y desactivación de promociones vigentes

### Configuración del sitio
- Edición de sliders y banners de la página de inicio
- Gestión de contenido dinámico visible en la tienda
- Control de estados del sistema (mantenimiento, disponibilidad)

---

## Comunicación con la API

El panel admin se comunica exclusivamente con la API REST mediante HTTPS. El token JWT de administrador es requerido en todos los endpoints del módulo `/api/admin/*`.

```
Admin Angular  →  GET /api/admin/orders?status=pending  + JWT Admin Header
               ←  { success: true, data: [...órdenes] }

Admin Angular  →  PUT /api/admin/orders/42  + { status: "shipped" }
               ←  { success: true, message: "Orden actualizada" }
```

---

## Requisitos

- Node.js >= 18
- Angular CLI >= 16
- La [Api-Ecommerce](https://github.com/JuanSCaicedo/Api-Ecommerce) corriendo localmente o apuntando al entorno de producción
- Credenciales de usuario con rol administrador

---

## Instalación local

```bash
git clone https://github.com/JuanSCaicedo/Admin-EcommerceE.git
cd Admin-EcommerceE
npm install
# Configurar la URL base de la API en src/environments/environment.ts
ng serve
```

El panel estará disponible en `http://localhost:4200`.

---

## Build para producción

```bash
ng build --configuration production
```

Los archivos compilados quedan en `/dist` y se sirven como contenido estático desde el servidor.

---

## Repositorios relacionados

| Repositorio | Descripción |
|-------------|-------------|
| [Api-Ecommerce](https://github.com/JuanSCaicedo/Api-Ecommerce) | Backend Laravel 10 (fuente de datos) |
| [Front-Ecomerce](https://github.com/JuanSCaicedo/Front-Ecomerce) | Tienda online Angular 17 |

