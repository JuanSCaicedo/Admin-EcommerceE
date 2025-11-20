🛒 Admin E-Commerce – Panel de Administración
📝 Descripción General

juanscaicedo-admin-ecommerce es el panel de administración de una plataforma completa de comercio electrónico.
Está desarrollado en Angular 13, estructurado por módulos funcionales, e integra una arquitectura limpia donde cada módulo encapsula su propia lógica, servicios, rutas y modelos.

La plantilla Metronic se utiliza únicamente para aspectos visuales (UI/UX), mientras que toda la lógica del negocio se encuentra completamente dentro de los módulos del directorio src/app/.

Este proyecto se comunica con una API REST externa y permite gestionar todos los elementos necesarios para operar una tienda en línea.

🧠 Arquitectura del Proyecto

El sistema se organiza bajo una arquitectura modular:

src/
└── app/
    ├── modules/     # Lógica del negocio (core funcional)
    ├── pages/       # Páginas que integran módulos y procesos
    ├── config/      # Configuraciones globales del panel
    ├── _metronic/   # Plantilla y componentes UI (sin lógica)
    ├── shared/      # Componentes reutilizables UI
    ├── app.module.ts
    ├── app-routing.module.ts
    └── app.component.ts

✔️ Toda la lógica del negocio está en:

src/app/modules/**

src/app/pages/**

src/app/config/**

app-routing.module.ts

app.module.ts

app.component.ts

❌ Metronic NO contiene lógica del negocio:

src/app/_metronic/**

src/assets/**

Archivos .scss, .css, .html, imágenes, etc.

🧩 Módulos Funcionales (Core del Negocio)

Cada carpeta dentro de src/app/modules/ representa un dominio funcional del negocio y contiene:

Componentes Angular (*.component.ts)

Servicios de negocio (*.service.ts)

Modelos (*.model.ts)

Rutas (*-routing.module.ts)

Validaciones y formularios Reactivos

Lógica específica del proceso asignado

Módulos incluidos:
Módulo	Función Principal
products/	CRUD de productos, imágenes, variaciones, especificaciones.
categories/	Gestión completa de categorías.
attributes/	Administración de atributos base y sub-atributos.
brands/	CRUD de marcas.
cupones/	Creación y validación de cupones de descuento.
discount/	Administración de campañas, reglas y promociones.
sliders/	Gestión de slides para el home principal.
home-view/	Configuración completa de la vista del home.
auth/	Autenticación, guardias y expiración de sesión.

👉 Cada servicio (*.service.ts) es la fuente principal de flujos CRUD y comunicación real con la API.

⚠️ Guía para Herramientas de Documentación (DeepWiki / AI / Indexadores)

Este apartado está incluido específicamente para herramientas de documentación basadas en IA.

📌 1. Ubicación exacta de la lógica del negocio

Las herramientas deben interpretar que la lógica real está en:

src/app/modules/**          # Módulos de negocio
src/app/pages/**            # Páginas funcionales
src/app/config/**           # Configuraciones
src/app/app-routing.module.ts
src/app/app.module.ts
src/app/app.component.ts

📌 2. Carpetas que deben ignorarse (solo plantilla)

Las siguientes carpetas NO contienen lógica funcional:

src/app/_metronic/**
src/app/shared/**
src/assets/**
node_modules/**
*.scss
*.css
*.html
*.svg
*.png
*.jpg

📌 3. Archivos prioritarios para interpretar el sistema

Las herramientas deben priorizar:

Servicios: *.service.ts

Modelos: *.model.ts

Componentes TS: *.component.ts

Rutas: *-routing.module.ts

Guards: AuthGuard

Lógica de sesión: app.component.ts

📌 4. Indicadores de lógica funcional dentro del código

Buscar funciones como:

create*()

update*()

delete*()

get*()

submit()

buildForm()

validate*()

process*()

load*()

AuthGuard

Todas estas representan función comercial, no lógica de UI.

🔌 Dependencia de la API

El panel consume una API externa a través de servicios Angular:

Cada módulo implementa su propio servicio con endpoints dedicados.

Durante el desarrollo, puede usarse la API simulada (angular-in-memory-web-api) incluida en /src/app/_fake/.

Para producción, la API real se configura en:

src/environments/environment.ts
src/environments/environment.prod.ts

🚀 Instalación
git clone https://github.com/juanscaicedo/juanscaicedo-admin-ecommerce.git
cd juanscaicedo-admin-ecommerce
npm install
ng serve


URL de desarrollo: http://localhost:4200/

📐 Comandos Angular CLI
ng generate component nombre
ng generate service nombre
ng build
ng test
ng e2e

👤 Autor

Juan S. Caicedo – JuanDevops

📄 Licencia
Este proyecto está bajo la Licencia JuanDevops.
