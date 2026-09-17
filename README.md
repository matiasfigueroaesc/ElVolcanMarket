# Distribuidora de Gas El Volcán — Tienda Online (Evaluación 1)

Proyecto del curso **DSY1104 – Desarrollo FullStack II** (Duoc UC).
Caso asignado: **Forma C — Distribuidora de Gas El Volcán** (empresa familiar en Chillán que distribuye
cilindros de gas licuado a domicilio, 5/11/15 kg).

> ⚠️ **Importante sobre el alcance de esta entrega:** la Evaluación 1 (30%) solo pide una
> tienda online básica en **HTML + CSS + JavaScript puro**, sin frameworks ni backend real.
> El stack obligatorio del documento del caso (React, Spring Boot, MySQL, AWS, etc.) es para
> **evaluaciones futuras**, no para esta entrega. No hay que adelantarse a eso todavía.

## 1. Objetivo de esta entrega

Construir el frontend estático de la tienda + un panel de administración simple, cumpliendo:

- Estructura HTML semántica (secciones, encabezados, listas, etc.)
- Navegación completa entre páginas (menú, enlaces, botones)
- Hoja de estilos CSS externa, responsiva y consistente en todas las páginas
- Validaciones de formularios con JavaScript (mensajes de error/sugerencias en tiempo real)
- Repositorio GitHub público, con commits claros y trabajo repartido entre el equipo

## 2. Estructura del repositorio

```
ElVolcanMarket/
├── assets/
│   ├── css/        → custom.css (personalización sobre Bootstrap, opcional por sección)
│   ├── js/         → validaciones, navegación y lógica de la tienda/admin
  │   └── img/         → imágenes/logos
├── store/           → vistas públicas (la tienda)
├── admin/           → vistas del panel administrativo
└── docs/            → ERS y planilla de requerimientos (versión de trabajo)
```

> **Decisión de equipo (actualizada):** todo el sitio usa **Bootstrap 5.3** (vía CDN), tanto
> `admin/` como `store/`. No se mantiene un sistema de clases propio en paralelo. Ver
> convenciones de código en la sección 4.

## 3. Mapeo página → requisito (Anexo 1 instrucciones)

### Tienda (pública)
| Archivo | Vista (mockup) | Notas del caso |
|---|---|---|
| `store/index.html` | Página principal (Home) | Adaptar catálogo genérico a cilindros de gas (5, 11, 15 kg) |
| `store/products.html` | Listado de productos | Catálogo de cilindros disponibles |
| `store/product-detail.html` | Detalle de producto | Detalle de un tipo de cilindro + botón "agregar al pedido" |
| `store/cart.html` | Carrito de compras | Aquí representa el "pedido" del cliente (dirección, tipo de cilindro) |
| `store/register.html` | Registro de usuario | Con validaciones (RUN, correo, etc. — ver Anexo 1 sección validaciones) |
| `store/login.html` | Inicio de sesión | Correo + contraseña |
| `store/about.html` | Nosotros | Presentación de la empresa (usar contexto del caso, sección 1 del Forma C) |
| `store/blog.html` | Blogs / noticias | 2 casos/noticias de ejemplo |
| `store/blog-detail-1.html` | Detalle blog 1 | Libre elección de contenido |
| `store/blog-detail-2.html` | Detalle blog 2 | Libre elección de contenido |
| `store/contact.html` | Contacto | Formulario con validaciones |

### Administrador
| Archivo | Vista (mockup) |
|---|---|
| `admin/home.html` | Home admin (menú vertical) |
| `admin/products.html` | Listado de productos (cilindros) |
| `admin/new-product.html` | Nuevo producto |
| `admin/edit-product.html` | Editar producto |
| `admin/users.html` | Listado de usuarios |
| `admin/new-user.html` | Nuevo usuario |
| `admin/edit-user.html` | Editar usuario |

> Las reglas de validación de cada campo (Run, correo, precio, stock, etc.) están detalladas
> en el Anexo 1 de instrucciones, sección "Utilización y validación de JavaScript".

## 4. Convenciones de código

- **Framework CSS:** Bootstrap 5.3 (CDN) en **todas** las páginas, `store/` y `admin/` por
  igual. Usar siempre las clases nativas de Bootstrap (`btn btn-primary`, `card`,
  `form-control`, `form-select`, `table table-striped`, `navbar`, etc.) en vez de crear
  clases propias equivalentes.
- **CSS personalizado:** cada sección puede tener un `custom.css` pequeño, cargado
  *después* del CDN de Bootstrap, para ajustar la identidad visual de la marca
  (colores, tipografía) sobrescribiendo variables de Bootstrap (`--bs-primary`, etc.)
  en vez de escribir reglas nuevas desde cero. **No** reemplaza a Bootstrap, lo
  complementa.
 - El proyecto usa `assets/css/custom.css` para personalizaciones por sección.
- Un solo `<h1>` por página; `<section>` para bloques de contenido semánticamente
  distintos.
- Formularios: cada `<input>`/`<select>`/`<textarea>` con `<label for="...">` asociado,
  su propio `id`/`name`, y un `<div class="invalid-feedback">` listo para la validación JS.
- Rutas relativas a `assets/` siempre `../assets/...` (todas las páginas están un nivel
  bajo la raíz, dentro de `store/` o `admin/`).

## 5. Flujo de trabajo en Git sugerido

- `main` → siempre debe quedar funcionando (no se sube trabajo a medio hacer).
- Cada integrante trabaja en su propia rama: `feature/<nombre>-<pagina>` (ej: `feature/matias-home`).
- Commits pequeños y descriptivos (ej: `feat: estructura HTML de home`, `fix: validación correo registro`).
- Pull Request hacia `main` antes de fusionar, aunque sea autoevaluado por falta de tiempo.
- Evitar editar el mismo archivo en paralelo sin avisar (sobre todo `custom.css` y `validations.js`).


## 6. Cómo subir este repo a GitHub

```bash
# 1. Crear un repositorio vacío y PÚBLICO en github.com (sin README, sin licencia)
# 2. Desde esta carpeta:
git remote add origin https://github.com/<tu-usuario>/ElVolcanMarket.git
git branch -M main
git push -u origin main
```

## Cómo probar el sitio localmente

Opciones rápidas para ejecutar y revisar la interfaz estática:

- Abrir `store/index.html` directamente en el navegador (modo desarrollo rápido).
- Usar un servidor estático local (recomendado):

```bash
# desde la raíz del proyecto
npx http-server -c-1 .
# abrir http://127.0.0.1:8080/store/index.html
```

## Credenciales de prueba (seed)

Estas cuentas ya vienen precargadas en el catálogo de ejemplo (localStorage inicial):

- Administrador: `javiera.munoz@gmail.com` / `admin1234`
- Vendedor: `pedro.salinas@duoc.cl` / `vendedor1234`
- Cliente: `camila.toro@gmail.com` / `cliente1234`

## Estado de cumplimiento

Mapeo de requisitos (Anexo 1) → ubicación de implementación

- **Estructura HTML semántica:** archivos `store/*.html` y `admin/*.html` (secciones, encabezados y roles semánticos).
- **Navegación completa:** `assets/js/store-nav.js` y `assets/js/admin-nav.js` (barras y enlaces entre páginas).
- **CSS externo responsivo:** `assets/css/custom.css` (sobrescribe variables de Bootstrap) + uso de Bootstrap CDN en los `<head>`.
- **Validaciones JS en tiempo real:** `assets/js/validations.js` (RUN, correo, precios, stock, formularios de registro/login/contacto/producto/usuario).
- **Carrito con persistencia (localStorage):** `assets/js/cart.js` y `assets/js/orders.js` (persistencia bajo `volcan_cart` y `volcan_orders`).
- **Panel administrador y control de roles:** `admin/` vistas junto a `assets/js/admin-users.js`, `assets/js/admin-products.js`, `assets/js/admin-nav.js` y `assets/js/admin-guard.js`.
- **Repositorio y control de versiones:** este repositorio (página raíz) contiene el historial y ramas usadas durante el desarrollo.

## Pendientes importantes

- Completar ERS (documentación de requisitos) en `docs/`.
- Rellenar la planilla de requerimientos (Anexo 2) con trazabilidad.
- Preparar la presentación de entrega (diapositivas y demo).

