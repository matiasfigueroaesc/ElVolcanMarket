# Documento de cobertura de testing — El Volcán Market (Evaluación 2)

Responsable del documento: Renato Figueroa (Integrante 3).
Curso: DSY1104 Desarrollo FullStack II — Duoc UC.

> Estado: incluye las pruebas que ya están en `eval2` **y** las de los PR de Renato #27 a #34 (Seguimiento, Zonas de despacho y módulo de usuarios/reportes/perfil del admin). Cuando estén fusionados, correr `npm test` y completar la sección 4 con el resumen real.

---

## 1. Herramientas y cómo se ejecutan las pruebas

| Herramienta | Para qué se usa |
| --- | --- |
| **Jasmine** (`jasmine-core`) | Framework de pruebas exigido por el curso: `describe`, `it`, `expect`, `beforeEach`, `jasmine.createSpy()`, `spyOn()`. |
| **Karma** (`karma`, `karma-jasmine`, `karma-chrome-launcher`) | Ejecuta las pruebas en un navegador real (Chrome Headless). |
| **karma-webpack + Babel** | Karma no se integra con Vite, por eso las pruebas se compilan con webpack + Babel (solo en `karma.conf.cjs`). |
| **@testing-library/react** | Renderiza componentes y los consulta como lo haría un usuario (`getByRole`, `getByLabelText`, `fireEvent`). |
| **karma-coverage** (istanbul) | Mide la cobertura del código de `src/` (se excluyen `test/` y `src/main.jsx`). |

Comandos:

```powershell
npm test
npm run test:watch
```

- `npm test` corre todas las pruebas una vez y deja el reporte en `coverage/html/index.html` (abrir en el navegador) y un resumen en la consola.
- Todas las pruebas están en `test/**/*.spec.js(x)`, separadas en `components/`, `pages/`, `data/` y `utils/`.

### Convenciones del equipo en las pruebas
- Sin Jest ni `jest-dom`: se usa `jasmine.createSpy()` (no `jest.fn()`), `toBeTrue()`, `toBeNull()` y `toBeTruthy()` (no `toBeInTheDocument()`).
- Si el componente usa `<Link>`, `useAuth()` o `useCart()` se envuelve en `MemoryRouter`, `AuthProvider` y `CartProvider`. Las rutas con parámetros (`/admin/usuarios/:id`) se prueban con `MemoryRouter initialEntries` + `Routes`.
- Las pruebas que leen o guardan datos parten con `beforeEach(() => localStorage.clear())`: la capa `src/data/` vuelve a los datos de fábrica (seed), así cada prueba es independiente.
- `window.confirm` y `window.print` se reemplazan con `spyOn(window, "confirm").and.returnValue(true)`.
- Las pruebas nuevas indican su tipo con un comentario `// Tipo: ...` sobre cada `it(...)`.

---

## 2. Tipos de prueba exigidos

| Tipo | Qué se comprueba | Ejemplo en el proyecto |
| --- | --- | --- |
| **Render** | El componente se dibuja bien: listas con todos sus elementos y **renderizado condicional** (un error o aviso aparece solo cuando corresponde). | `UserTable`: "muestra una fila por usuario" y "muestra un aviso si no hay usuarios". |
| **Props** | El componente usa lo que recibe por props (textos, enlaces, funciones, opciones). | `UserForm`: "al editar carga los datos, deja el Run de solo lectura…"; `UserTable` deshabilita Eliminar con `idActual`. |
| **Estado** | El estado interno cambia al interactuar (inputs controlados, filtros, errores en tiempo real). | `Usuarios`: "filtra al escribir en el buscador"; `Reportes`: "filtra por período al cambiar la fecha Desde". |
| **Eventos** | Un clic o envío llama a la función correcta o cambia lo que se ve. | `UserTable`: "llama a onEliminar con el usuario clickeado" (`jasmine.createSpy`). |

Además hay pruebas de **lógica** (funciones puras de `src/data/` y `src/utils/`), que validan reglas de negocio sin interfaz: validaciones del RUN, carrito, cálculos de reportes, etc.

---

## 3. Inventario de pruebas por archivo

Total: **329 pruebas en 55 archivos** (245 ya en `eval2` + 84 de los PR #27–#34).
Leyenda: ✔ = el archivo tiene al menos una prueba de ese tipo.

### 3.1 Componentes (`test/components/`)

| Archivo | Componente | N° | Render | Props | Estado | Eventos | Responsable |
| --- | --- | ---: | :---: | :---: | :---: | :---: | --- |
| ArticuloCard.spec.jsx | Tarjeta de artículo del blog | 3 | ✔ | ✔ |  |  | Renato |
| CategoryFilter.spec.jsx | Filtro de categorías | 2 | ✔ | ✔ |  | ✔ | Fabián |
| CategoryTable.spec.jsx | Tabla de categorías (admin) | 4 | ✔ | ✔ |  | ✔ | Mati |
| Checkout.spec.jsx | Página de checkout | 4 | ✔ |  | ✔ | ✔ | Fabián |
| CheckoutForm.spec.jsx | Formulario de checkout | 10 | ✔ | ✔ | ✔ | ✔ | Fabián |
| ContactoForm.spec.jsx | Formulario de contacto | 10 | ✔ | ✔ | ✔ | ✔ | Renato |
| LoginForm.spec.jsx | Formulario de login | 7 | ✔ |  | ✔ | ✔ | Mati / Renato |
| OrderSummary.spec.jsx | Resumen de orden | 5 | ✔ | ✔ |  |  | Fabián |
| OrderTable.spec.jsx | Tabla de órdenes (admin) | 4 | ✔ | ✔ |  |  | Mati |
| Pagos.spec.jsx | Pago exitoso / error | 4 | ✔ |  |  | ✔ | Fabián |
| ProductCard.spec.jsx | Tarjeta de producto | 3 | ✔ | ✔ |  | ✔ | Fabián |
| ProductForm.spec.jsx | Formulario de producto | 5 | ✔ | ✔ | ✔ | ✔ | Mati |
| ProductList.spec.jsx | Lista de productos | 2 | ✔ |  |  |  | Fabián |
| ProductTable.spec.jsx | Tabla de productos (admin) | 5 | ✔ | ✔ |  | ✔ | Mati |
| RegistroForm.spec.jsx | Formulario de registro | 8 | ✔ |  | ✔ | ✔ | Renato |
| StatCard.spec.jsx | Tarjeta de métrica | 2 | ✔ | ✔ |  |  | Mati |
| StoreNavbar.spec.jsx | Barra de navegación | 3 | ✔ |  | ✔ |  | Mati |
| UserForm.spec.jsx | Formulario de usuario (admin) | 8 | ✔ | ✔ | ✔ | ✔ | Renato |
| **UserTable.spec.jsx** | **Tabla de usuarios (admin) — obligatoria** | 6 | ✔ | ✔ |  | ✔ | Renato |

### 3.2 Páginas (`test/pages/`)

| Archivo | Vista / ruta | N° | Render | Props | Estado | Eventos | Responsable |
| --- | --- | ---: | :---: | :---: | :---: | :---: | --- |
| Home.spec.jsx | `/` | 3 | ✔ |  |  |  | Fabián |
| Productos.spec.jsx | `/productos` | 3 | ✔ |  | ✔ | ✔ | Fabián |
| DetalleProducto.spec.jsx | `/productos/:id` | 4 | ✔ |  | ✔ | ✔ | Fabián |
| Categorias.spec.jsx | `/categorias` | 2 | ✔ |  |  |  | Fabián |
| CategoriaDetalle.spec.jsx | `/categorias/:slug` | 4 | ✔ |  |  | ✔ | Fabián |
| Ofertas.spec.jsx | `/ofertas` | 3 | ✔ |  |  |  | Fabián |
| Carrito.spec.jsx | `/carrito` | 5 | ✔ |  | ✔ | ✔ | Fabián |
| CartTable.spec.jsx | Tabla del carrito | 4 | ✔ | ✔ |  | ✔ | Fabián |
| Registro.spec.jsx | `/registro` | 4 | ✔ |  |  | ✔ | Renato |
| Nosotros.spec.jsx | `/nosotros` | 4 | ✔ |  |  |  | Renato |
| Blog.spec.jsx | `/blog` | 3 | ✔ | ✔ |  |  | Renato |
| BlogDetalle.spec.jsx | `/blog/:id` | 6 | ✔ | ✔ |  |  | Renato |
| Contacto.spec.jsx | `/contacto` | 4 | ✔ |  | ✔ | ✔ | Renato |
| Seguimiento.spec.jsx | `/seguimiento` | 9 | ✔ |  | ✔ | ✔ | Renato |
| ZonasDespacho.spec.jsx | `/zonas-despacho` | 6 | ✔ | ✔ | ✔ | ✔ | Renato |
| AdminProductos.spec.jsx | `/admin/productos` | 4 | ✔ |  | ✔ | ✔ | Mati |
| AdminProductoForm.spec.jsx | `/admin/productos/nuevo` y `/:id/editar` | 4 | ✔ |  |  | ✔ | Mati |
| AdminProductoDetalle.spec.jsx | `/admin/productos/:id` | 6 | ✔ |  |  | ✔ | Mati |
| ProductosCriticos.spec.jsx | `/admin/productos/criticos` | 4 | ✔ |  |  | ✔ | Mati |
| AdminCategorias.spec.jsx | `/admin/categorias` y formulario | 7 | ✔ |  |  | ✔ | Mati |
| AdminOrdenes.spec.jsx | `/admin/ordenes` y boleta | 8 | ✔ |  | ✔ | ✔ | Mati |
| AdminUsuarios.spec.jsx | `/admin/usuarios` | 7 | ✔ | ✔ | ✔ | ✔ | Renato |
| AdminUsuarioForm.spec.jsx | `/admin/usuarios/nuevo` y `/:id/editar` | 5 | ✔ | ✔ |  | ✔ | Renato |
| AdminUsuarioDetalle.spec.jsx | `/admin/usuarios/:id` | 9 | ✔ | ✔ |  | ✔ | Renato |
| AdminHistorialCompras.spec.jsx | `/admin/usuarios/:id/compras` | 7 | ✔ | ✔ |  |  | Renato |
| AdminReportes.spec.jsx | `/admin/reportes` | 9 | ✔ |  | ✔ | ✔ | Renato |
| AdminPerfil.spec.jsx | `/admin/perfil` | 6 | ✔ | ✔ | ✔ | ✔ | Renato |

### 3.3 Lógica: datos y utilidades (`test/data/`, `test/utils/`)

| Archivo | Qué valida | N° | Responsable |
| --- | --- | ---: | --- |
| data/carrito.spec.js | Agregar, cambiar cantidad, no pasar el stock, total y unidades (funciones puras). | 7 | Mati |
| data/ordenes.spec.js | Crear orden con número y total, entrega, filtrar por usuario, estados válidos. | 4 | Mati |
| data/productos.spec.js | CRUD, ofertas, críticos, búsqueda sin tildes, descuento de stock. | 9 | Mati |
| data/usuarios.spec.js | Autenticación sin exponer contraseña, correo y RUN únicos, sesión. | 8 | Mati |
| utils/validaciones.spec.js | Todas las validaciones del sitio: nombre, correo y dominios, contraseña, teléfono, RUN (módulo 11), fecha, selección. | 39 | Renato |
| utils/validacionesAdmin.spec.js | Validaciones de producto y categoría. | 12 | Mati |
| utils/blog.spec.js | Artículos del blog y búsqueda por id. | 3 | Renato |
| utils/zonasDespacho.spec.js | Zonas, texto de cobertura y zonas por comuna. | 5 | Renato |
| utils/reportes.spec.js | Solo pagadas, filtro por período, resumen, ventas por producto y por categoría. | 7 | Renato |

### 3.4 Resumen por integrante

| Integrante | Archivos | Pruebas |
| --- | ---: | ---: |
| Mati (base, datos y admin de productos/categorías/órdenes) | 18 | 103 |
| Fabián (tienda y flujo de compra) | 15 | 58 |
| Renato (validaciones, login/registro, contenido, seguimiento, zonas y admin de usuarios/reportes/perfil) | 22 | 168 |
| **Total** | **55** | **329** |

> `LoginForm.spec.jsx` (7) se cuenta en Mati porque él creó el archivo; Renato le agregó las pruebas de validación en tiempo real.

---

## 4. Resultado de cobertura

Completar después de fusionar los PR, con el resumen que imprime `npm test` al final ("Coverage summary"):

| Métrica | Resultado |
| --- | --- |
| Pruebas ejecutadas | ___ / ___ SUCCESS |
| Statements | ___ % |
| Branches | ___ % |
| Functions | ___ % |
| Lines | ___ % |

Referencia anterior: con solo las vistas de Mati y Fabián el equipo tenía 70/70 pruebas y una cobertura de ~87–90 %.
Captura sugerida para el informe: `coverage/html/index.html` abierto en el navegador.

---

## 5. Reglas de negocio cubiertas por las pruebas

- **Validaciones** (RUN con dígito verificador, dominios de correo permitidos, contraseña 4–20, teléfono 8–9 dígitos, fecha no futura) son funciones puras compartidas por Registro, Checkout, Contacto, `UserForm` y Perfil, y se prueban una vez en `validaciones.spec.js` y otra vez dentro de cada formulario (errores en tiempo real).
- **Correo y RUN únicos**: al registrar (`Registro`), al crear y al editar usuarios desde el admin (`AdminUsuarioForm`) y en el Perfil.
- **Contraseñas**: la sesión nunca guarda la contraseña (`usuarios.spec.js`, `AdminPerfil`); `passwordConfirm` no se guarda (`Registro`); al editar, contraseña en blanco = no cambia (`UserForm`, `AdminUsuarioForm`).
- **Pagos rechazados**: crean orden pero no descuentan stock ni vacían el carrito (`Checkout`), no se suman a las ventas (`AdminOrdenes`, `AdminReportes`, `reportes.spec.js`), se muestran con su estado de pago en el historial (`AdminHistorialCompras`) y en el seguimiento se avisa que no se despachan (`Seguimiento`).
- **Ids de la URL como string** (`useParams`): detalle de producto, de usuario, historial, blog; con "no encontrado" si el id no existe o no es numérico.
- **Datos que cambian después de una venta**: si un producto vendido se elimina, los reportes lo agrupan en "Sin categoría" sin romperse (`AdminReportes`).
- **Seguridad del admin**: el administrador conectado no puede eliminar su propia cuenta (`UserTable`, `AdminUsuarios`, `AdminUsuarioDetalle`) ni cambiar su propio tipo desde el Perfil.

---

## 6. Limitaciones conocidas

- Son pruebas **unitarias y de componentes**; no hay pruebas end-to-end que recorran el sitio completo en un navegador.
- El menú plegable de Bootstrap (`data-bs-toggle`) y la impresión real (`window.print`) no se prueban: dependen del JavaScript de Bootstrap y del navegador (en la boleta y el pago exitoso solo se comprueba que se llama a `window.print`).
- `src/main.jsx` se excluye de la cobertura porque solo monta la aplicación.
- El mapa del seguimiento de la Eval 1 (Leaflet) no se migró, por lo que no tiene pruebas.
