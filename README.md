# El Volcán Market — Tienda online (Evaluación 2)

Proyecto del curso **DSY1104 – Desarrollo FullStack II** (Duoc UC).
Caso **Forma C — Distribuidora de Gas El Volcán** (Chillán): venta y despacho a domicilio de
cilindros de gas licuado y accesorios.

En la Evaluación 2 el sitio de la Eval 1 (HTML + CSS + JS) se migra a **React**, con
**Bootstrap 5**, persistencia en **localStorage** y pruebas unitarias con **Jasmine + Karma**.
La versión de la Eval 1 queda en el tag `v1-eval1` y, como referencia mientras se migra, en
la carpeta `legacy-eval1/`.

## Requisitos

- Node.js **20.19 o superior** (`node -v`). Vite 8 no funciona con Node 18.
- Google Chrome (lo usa Karma para correr las pruebas).

## Cómo ejecutar

```bash
npm install        # una sola vez
npm run dev        # http://localhost:5173
npm test           # pruebas Jasmine + Karma (Chrome headless) + cobertura
npm run test:watch # pruebas en modo observación (abre Chrome)
npm run build      # build de producción en dist/
```

El reporte de cobertura queda en `coverage/html/index.html`.

## Credenciales de prueba

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | javiera.munoz@gmail.com | admin1234 |
| Vendedor | pedro.salinas@duoc.cl | vendedor1234 |
| Cliente | camila.toro@gmail.com | cliente1234 |

Para volver a los datos de fábrica: en el navegador, DevTools → Application → Local Storage →
borrar las claves `volcan_*`.

## Estructura

```
src/
  data/        "Base de datos" en JS: un módulo por entidad con funciones CRUD
               (storage.js, productos.js, categorias.js, usuarios.js, ordenes.js,
               carrito.js, regiones.js). Persisten en localStorage.
  context/     AuthContext (sesión) y CartContext (carrito) para toda la app
  components/  Componentes reutilizables (StoreNavbar, Footer, AdminSidebar, StatCard, LoginForm...)
  layouts/     StoreLayout (tienda) y AdminLayout (panel, solo rol administrador)
  pages/store/ Vistas de la tienda
  pages/admin/ Vistas del panel administrador
  utils/       Formato de precios/fechas (y validaciones, por migrar)
  styles/      custom.css (identidad visual sobre Bootstrap)
public/img/    Imágenes de productos, banners y logo
test/          Pruebas *.spec.js(x) — Jasmine + Karma
legacy-eval1/  Código de la Eval 1, solo como referencia (se elimina al terminar la migración)
```

## Reglas del equipo

- **Los componentes nunca usan `localStorage` directo**: siempre llaman a `src/data/*`
  (`listarProductos()`, `crearOrden()`, etc.). Así, en la Eval 3 solo cambia el interior de esas
  funciones por llamadas al backend.
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
