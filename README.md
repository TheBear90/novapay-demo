# NovaPay — Financial Platform

NovaPay es una aplicación web demo de una plataforma financiera orientada a la gestión, monitoreo y operación de pagos digitales.

El proyecto está desarrollado como una aplicación frontend estática en **HTML, CSS y JavaScript vanilla**, sin dependencias de backend ni frameworks adicionales. Su objetivo es representar una consola operativa moderna para equipos financieros, de producto, soporte, operaciones y desarrollo.

## Descripción general

La aplicación simula un dashboard de pagos con múltiples vistas funcionales:

- Dashboard ejecutivo con métricas principales.
- Análisis de volumen transaccional.
- Gestión y búsqueda de transacciones.
- Seguimiento de payouts.
- Administración de disputas.
- Referencia de API para desarrolladores.
- Configuración de webhooks.
- Gestión de usuarios.
- Configuración general, seguridad, API keys y billing.
- Centro de notificaciones y alertas.

La interfaz está diseñada con una estética dark mode, componentes tipo card, navegación lateral, tablas interactivas, filtros, modales y visualizaciones simples embebidas en SVG/CSS.

## Objetivo del proyecto

El objetivo de NovaPay es servir como base visual y funcional para demostrar cómo podría verse una plataforma financiera moderna, incluyendo capacidades operativas y técnicas relevantes para un entorno de pagos.

Puede utilizarse como:

- Demo frontend para un proyecto de GitHub.
- Prototipo de UI/UX para una plataforma fintech.
- Base para evolucionar hacia una aplicación con backend real.
- Ejemplo de dashboard administrativo en HTML, CSS y JavaScript puro.

## Funcionalidades principales

### Dashboard

Muestra indicadores ejecutivos como volumen total, cantidad de transacciones, tasa de éxito y disputas abiertas. También incluye gráficos de volumen mensual, distribución por tipo de pago, últimas transacciones y alertas operativas.

### Transactions

Permite visualizar transacciones simuladas, filtrarlas por estado y buscar por merchant, ID o cliente.

Estados disponibles:

- Completed
- Pending
- Failed
- Flagged

### Analytics

Incluye métricas analíticas como ticket promedio, chargeback rate, refund rate y revenue neto. También muestra información por país, merchants principales y volumen horario.

### Payouts

Presenta el historial de payouts, estado de pagos programados, montos pendientes y batches en procesamiento.

### Disputes

Centraliza disputas abiertas, montos en riesgo, motivos, deadlines y estado de revisión.

### API Reference

Incluye una sección orientada a desarrolladores con endpoints simulados para:

- Authentication
- Transactions
- Payouts
- Customers
- Webhooks

### Webhooks

Muestra endpoints configurados, eventos asociados y actividad reciente.

### Users

Permite visualizar usuarios de la organización, roles, estado y métricas asociadas.

### Settings

Incluye secciones de configuración general, seguridad, API keys y billing.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript vanilla
- SVG inline para visualizaciones simples
- Google Fonts

No requiere instalación de paquetes ni ejecución de build.

## Estructura recomendada del repositorio

```text
novapay-financial-platform/
├── index.html
├── README.md
└── assets/
    └── screenshots/
```

Actualmente, la aplicación puede ejecutarse directamente desde el archivo `index.html`.

## Cómo ejecutar el proyecto localmente

### Opción 1: abrir el archivo directamente

Clonar el repositorio y abrir `index.html` en el navegador.

```bash
git clone https://github.com/usuario/novapay-financial-platform.git
cd novapay-financial-platform
open index.html
```

En Windows, también puede abrirse haciendo doble clic sobre el archivo `index.html`.

### Opción 2: usar un servidor local simple

Con Python:

```bash
python3 -m http.server 8080
```

Luego abrir:

```text
http://localhost:8080
```

Con Node.js:

```bash
npx serve .
```

## Publicación en GitHub Pages

Para publicar la aplicación en GitHub Pages:

1. Subir el proyecto a un repositorio de GitHub.
2. Ir a **Settings**.
3. Entrar en **Pages**.
4. En **Build and deployment**, seleccionar:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guardar los cambios.
6. GitHub generará una URL pública para acceder a la app.

## Datos simulados

Toda la información visible en la aplicación es mock data definida dentro del archivo `index.html`.

Esto incluye:

- Transacciones.
- Usuarios.
- Payouts.
- Disputas.
- Notificaciones.
- Webhooks.
- Métricas y gráficos.

No se conecta a una API real ni procesa datos sensibles.

## Consideraciones técnicas

La aplicación está implementada como una single-page app simple usando funciones JavaScript para cambiar entre paneles, renderizar tablas y abrir modales.

Características relevantes:

- Navegación lateral basada en estados visuales.
- Renderizado dinámico de tablas mediante JavaScript.
- Filtros de transacciones por estado.
- Búsqueda simple en memoria.
- Componentes visuales reutilizados mediante clases CSS.
- Diseño responsive básico para pantallas menores a 900px.

## Mejoras futuras

Algunas mejoras sugeridas para evolucionar el proyecto:

- Separar HTML, CSS y JavaScript en archivos independientes.
- Migrar la app a React, Vue o Svelte.
- Incorporar un backend real con Node.js, Python o Go.
- Persistir datos en una base de datos.
- Implementar autenticación y autorización.
- Agregar tests unitarios y de integración.
- Incorporar gráficos con una librería dedicada.
- Mejorar accesibilidad y navegación por teclado.
- Agregar pipeline CI/CD para despliegue automático.
- Conectar la aplicación con APIs reales de pagos o eventos.

## Roadmap Cambios

### Fase 1 — Organización del frontend

- Separar archivos estáticos.
- Crear carpeta `assets`.
- Documentar componentes visuales.
- Agregar capturas de pantalla al README.

### Fase 2 — Modularización

- Separar datos mock en archivos JSON.
- Crear módulos JavaScript por funcionalidad.
- Normalizar funciones de renderizado.

### Fase 3 — Backend/API

- Crear endpoints reales para transacciones, usuarios, payouts y disputas.
- Implementar autenticación.
- Reemplazar mock data por datos persistentes.

### Fase 4 — Producción

- Agregar monitoreo.
- Implementar manejo de errores.
- Optimizar performance.
- Publicar mediante GitHub Pages, Vercel, Netlify o similar.

## Licencia

Este proyecto puede utilizarse como base demo, prototipo o material educativo. Se recomienda agregar una licencia formal al repositorio, por ejemplo MIT License, antes de publicarlo como proyecto open source.

## Autor

Proyecto generado como demo frontend para una plataforma financiera llamada **NovaPay**.
