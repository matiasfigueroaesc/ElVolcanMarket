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
gas-el-volcan-store/
├── assets/
│   ├── css/        → estilos.css (una sola hoja externa, compartida por todas las páginas)
│   ├── js/          → validations.js (validaciones de formularios, carrito, etc.)
│   └── img/         → imágenes/logos
├── store/           → vistas públicas (la tienda)
├── admin/           → vistas del panel administrativo
└── docs/            → ERS y planilla de requerimientos (versión de trabajo)
```

Cada página HTML ya está creada como esqueleto vacío con un comentario `<!-- TODO -->`
indicando qué contenido/mockup de las instrucciones (Anexo 1) le corresponde. Así cada
integrante puede tomar una página y empezar a trabajar sin pisarse con otros.

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

## 4. Flujo de trabajo en Git sugerido

- `main` → siempre debe quedar funcionando (no se sube trabajo a medio hacer).
- Cada integrante trabaja en su propia rama: `feature/<nombre>-<pagina>` (ej: `feature/matias-home`).
- Commits pequeños y descriptivos (ej: `feat: estructura HTML de home`, `fix: validación correo registro`).
- Pull Request hacia `main` antes de fusionar, aunque sea autoevaluado por falta de tiempo.
- Evitar editar el mismo archivo en paralelo sin avisar (sobre todo `styles.css` y `validations.js`).

## 5. Próximos pasos (pendientes de definir en equipo)

- [ ] Repartir páginas entre los integrantes
- [ ] Definir paleta de colores / estilo visual de la marca
- [ ] Completar el documento ERS (versión 1) — plantilla en `docs/`
- [ ] Completar la planilla de requerimientos (Anexo 2)
- [ ] Definir reglas del carrito de pedido (cantidades, tipos de cilindro, etc.)
- [ ] Preparar la presentación de 15 minutos + ronda de preguntas

## 6. Cómo subir este repo a GitHub

```bash
# 1. Crear un repositorio vacío y PÚBLICO en github.com (sin README, sin licencia)
# 2. Desde esta carpeta:
git remote add origin https://github.com/<tu-usuario>/gas-el-volcan-store.git
git branch -M main
git push -u origin main
```
