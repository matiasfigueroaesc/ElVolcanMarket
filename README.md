# El Volcán Market — Tienda online (Evaluación 3)

Proyecto del curso **DSY1104 – Desarrollo FullStack II** (Duoc UC).
Caso **Forma C — Distribuidora de Gas El Volcán** (Chillán): venta y despacho a domicilio de
cilindros de gas licuado y accesorios.

En la Evaluación 2 el sitio de la Eval 1 (HTML + CSS + JS) se migra a **React**, con
**Bootstrap 5**, persistencia en **localStorage** y pruebas unitarias con **Jasmine + Karma**.
La versión de la Eval 1 queda en el tag `v1-eval1` y, como referencia mientras se migra, en
la carpeta `legacy-eval1/`.

En la Evaluación 3 el frontend se conecta al **backend** (microservicios Spring Boot):
https://github.com/matiasfigueroaesc/elvolcanmarket-backend

| Datos | Dónde viven |
| --- | --- |
| Productos, categorías, stock | Backend — servicio `catalogo` |
| Usuarios, login y sesión (JWT) | Backend — servicio `usuarios` |
| Órdenes / boletas | localStorage (hasta que esté el servicio `ventas`) |
| Carrito | localStorage (es del navegador de cada cliente) |

## Requisitos

- Node.js **20.19 o superior** (`node -v`). Vite 8 no funciona con Node 18.
- Google Chrome (lo usa Karma para correr las pruebas).

## Cómo ejecutar

Primero el backend (ver su README): como mínimo `usuarios`, `catalogo` y `gateway` (puerto 8080).
Después el frontend:

```bash
npm install        # una sola vez
npm run dev        # http://localhost:5173  (el proxy reenvía /api al Gateway :8080)
npm test           # pruebas Jasmine + Karma (Chrome headless) + cobertura
npm run test:watch # pruebas en modo observación (abre Chrome)
npm run build      # build de producción en dist/
```

El reporte de cobertura queda en `coverage/html/index.html`.

### Con Docker (como en la presentación y en AWS)

El frontend se construye y se sirve con nginx (`Dockerfile`, `docker/nginx.conf`), y nginx
reenvía `/api` y Swagger al Gateway. No se levanta desde aquí, sino desde el repo del backend,
que debe estar clonado al lado de este:

```bash
cd ../elvolcanmarket-backend
docker compose --profile web up -d --build     # tienda en http://localhost
```

Guía de despliegue en AWS: `elvolcanmarket-backend/docs/DESPLIEGUE_AWS.md`.

## Credenciales de prueba

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | javiera.munoz@gmail.com | admin1234 |
| Vendedor | pedro.salinas@duoc.cl | vendedor1234 |
| Cliente | camila.toro@gmail.com | cliente1234 |

Los usuarios y sus contraseñas viven en el backend (con BCrypt). Para volver a los datos de
fábrica del catálogo y los usuarios, borra la carpeta `data/` del backend y reinicia los servicios.
Las órdenes y el carrito se reinician borrando las claves `volcan_*` de Local Storage.

## Conexión con el backend

- `src/api/cliente.js` es el **único** archivo que usa `fetch`. Arma la URL (`/api/v1`), agrega el
  JWT en `Authorization: Bearer ...`, convierte los errores del backend en `ApiError`
  (`status`, `message`, `campos`) y, si el token venció (401), lo renueva una vez con la cookie.
- El **JWT vive solo en memoria** (no en localStorage). El refresh token va en una cookie
  `HttpOnly` que JavaScript no puede leer; al recargar la página `AuthContext` recupera la sesión
  con ella (`POST /auth/refresh`).
- `src/data/*.js` mantiene los mismos nombres de funciones de la Eval 2, pero ahora son
  **asíncronas**. Las páginas las usan con el hook `useCarga` (`src/hooks/useCarga.js`), que
  entrega `{ datos, cargando, error, recargar }`, y muestran `<EstadoCarga />` mientras cargan
  o si el backend no responde.
- En desarrollo, `vite.config.js` reenvía `/api` al Gateway (`http://localhost:8080`). Para usar
  otra dirección, copia `.env.example` como `.env.local`.
- Las pruebas no necesitan el backend: `test/helpers/apiFalsa.js` reemplaza `fetch` por un
  backend en memoria con las mismas rutas, respuestas y datos de fábrica.

## Estructura

```
src/
  api/         cliente.js: único punto de contacto con el backend (fetch + JWT + errores)
  data/        Un módulo por entidad con funciones CRUD. productos, categorias y usuarios
               llaman a la API; ordenes y carrito siguen en localStorage (storage.js).
  hooks/       useCarga: carga datos del backend con estados de carga y error
  context/     AuthContext (sesión) y CartContext (carrito) para toda la app
  components/  Componentes reutilizables (StoreNavbar, Footer, AdminSidebar, StatCard, LoginForm...)
  layouts/     StoreLayout (tienda) y AdminLayout (panel, solo rol administrador)
  pages/store/ Vistas de la tienda
  pages/admin/ Vistas del panel administrador
  utils/       Formato de precios/fechas (y validaciones, por migrar)
  styles/      custom.css (identidad visual sobre Bootstrap)
public/img/    Imágenes de productos, banners y logo
test/          Pruebas *.spec.js(x) — Jasmine + Karma (helpers/apiFalsa.js simula el backend)
legacy-eval1/  Código de la Eval 1, solo como referencia (se elimina al terminar la migración)
```

## Reglas del equipo

- **Los componentes nunca usan `localStorage` ni `fetch` directo**: siempre llaman a
  `src/data/*` (`listarProductos()`, `crearOrden()`, etc.), y esos módulos usan `src/api/cliente.js`.
- Un componente = una responsabilidad. Datos y funciones entran por **props**.
- Cada integrante escribe las pruebas de sus propios componentes en `test/`.
- Ramas: `feature/<nombre>-<vista>` → Pull Request hacia `eval2`. Solo Mati edita
  `App.jsx` (rutas) y `src/data/`; los demás piden cambios por PR.
- Las vistas pendientes muestran un aviso con su responsable y el archivo de la Eval 1 que
  sirve de referencia.

## Rutas

Tienda: `/`, `/productos`, `/productos/:id`, `/categorias`, `/categorias/:slug`, `/ofertas`,
`/carrito`, `/checkout`, `/pago/exito/:ordenId`, `/pago/error/:ordenId`, `/login`, `/registro`,
`/nosotros`, `/blog`, `/blog/:id`, `/contacto`, `/seguimiento`, `/zonas-despacho`.

Admin: `/admin`, `/admin/ordenes`, `/admin/ordenes/:id`, `/admin/productos` (+ `/nuevo`,
`/criticos`, `/:id`, `/:id/editar`), `/admin/categorias` (+ `/nueva`, `/:id/editar`),
`/admin/usuarios` (+ `/nuevo`, `/:id`, `/:id/editar`, `/:id/compras`), `/admin/reportes`,
`/admin/perfil`.
