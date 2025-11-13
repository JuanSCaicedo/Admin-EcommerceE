# 🛒 juanscaicedo-admin-ecommerce

## 📝 Descripción del Proyecto

**juanscaicedo-admin-ecommerce** es el panel de administración (o *backend*) de una plataforma de comercio electrónico. Esta aplicación está desarrollada con **Angular** (versión 13.x.x) y proporciona una interfaz robusta y completa para gestionar todos los aspectos esenciales de una tienda en línea.

El proyecto está diseñado de forma modular, con cada funcionalidad principal (Productos, Categorías, Marcas, etc.) actuando como un módulo de *feature* que implementa directamente las operaciones de gestión de datos a través de una API.

Utiliza la plantilla **Metronic** para un diseño moderno, responsive y profesional.

### 🎯 Arquitectura y Dependencia de API

La aplicación se estructura en módulos dedicados que se comunican con el backend mediante servicios:

* **Servicios de Datos:** Cada módulo de negocio contiene servicios (`*.service.ts`) encargados de la lógica de negocio y la comunicación directa con los *endpoints* de la API (operaciones CRUD).
* **API Falsa (Simulada):** Durante el desarrollo, el proyecto soporta una API simulada (`_fake/fake-api.service.ts`) usando `angular-in-memory-web-api` para desacoplar el desarrollo del frontend de la disponibilidad del backend.
* **Rutas Protegidas:** La autenticación se maneja a través del módulo `auth` con un `AuthGuard` para asegurar las rutas principales del panel.

---

## ⚙️ Funcionalidades Principales del Panel de Administración (CRUD)

El panel permite la gestión completa de los siguientes recursos:

| Módulo | Descripción de la Gestión (CRUD) |
| :--- | :--- |
| **`products`** | Gestión completa de productos, incluyendo imágenes, precios, y la creación de **Variaciones y Especificaciones Anidadas**. |
| **`attributes`** | Definición y administración de atributos base (e.g., color, talla) y sus sub-atributos, esenciales para las variaciones de productos. |
| **`categories`** | Creación, listado, edición y eliminación de las categorías que estructuran el catálogo. |
| **`brands`** | Mantenimiento de las marcas disponibles para asociar a los productos. |
| **`cupones`** | Creación y administración de códigos de cupón y sus reglas de aplicación. |
| **`discount`** | Gestión de promociones, ofertas y reglas de descuento. |
| **`sliders`** | Administración de los elementos visuales del carrusel de la página principal. |
| **`home-view`** | Módulo dedicado a la configuración y edición del contenido de la página de inicio. |

---

## 🚀 Instalación y Uso

### 1. Requisitos Previos

* [**Node.js**](https://nodejs.org/)
* [**Angular CLI**](https://angular.io/cli) (versión 13.x.x o superior)

### 2. Puesta en Marcha

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/juanscaicedo/juanscaicedo-admin-ecommerce.git](https://github.com/juanscaicedo/juanscaicedo-admin-ecommerce.git)
    cd juanscaicedo-admin-ecommerce
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```

### 3. Servidor de Desarrollo

Ejecuta `ng serve` para iniciar el servidor de desarrollo. La aplicación usará por defecto la API simulada.
* Navega a: `http://localhost:4200/`.
* La aplicación se recargará automáticamente si cambias cualquier archivo fuente.

### 4. Configuración de la API Real

Para conectar el panel a una API de backend real, debes modificar la variable de entorno en los archivos correspondientes (generalmente `src/environments/environment.ts` y `src/environments/environment.prod.ts`):

```typescript
// Ejemplo: src/environments/environment.ts
export const environment = {
  production: false,
  // MODIFICA esta URL para apuntar al servidor de tu API
  apiUrl: 'URL_DE_TU_API_REAL', 
};


🏗️ Comandos Estándar de Angular CLI
Code scaffolding
Ejecuta ng generate component component-name para generar un nuevo componente. También puedes usar ng generate directive|pipe|service|class|guard|interface|enum|module.

Build
Ejecuta ng build para construir el proyecto. Los artefactos de construcción se almacenarán en el directorio dist/. Utiliza --configuration=production para un build optimizado.

Running unit tests
Ejecuta ng test para ejecutar los tests unitarios a través de Karma.

Running end-to-end tests
Ejecuta ng e2e para ejecutar los tests end-to-end.

Further help
Para obtener más ayuda sobre Angular CLI, usa ng help o consulta la Angular CLI Overview and Command Reference page.

👤 Autor
Juan S. Caicedo

📄 Licencia
Este proyecto está bajo la Licencia JuanDevops.
