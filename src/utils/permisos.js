// Qué rutas del panel puede abrir cada rol.
// El administrador entra a todo. El vendedor solo consulta: la lista y el detalle
// de órdenes y de productos (incluidos los críticos). No ve dashboard, categorías,
// usuarios, reportes, perfil ni los formularios de crear o editar.
// El backend aplica las mismas reglas: esto solo ordena la interfaz.

const RUTAS_VENDEDOR = [
  /^\/admin\/ordenes\/?$/,
  /^\/admin\/ordenes\/\d+\/?$/,
  /^\/admin\/productos\/?$/,
  /^\/admin\/productos\/criticos\/?$/,
  /^\/admin\/productos\/\d+\/?$/,
];

// Página a la que llega el vendedor al entrar al panel.
export const INICIO_VENDEDOR = "/admin/ordenes";

export function vendedorPuedeVer(ruta) {
  return RUTAS_VENDEDOR.some((patron) => patron.test(ruta));
}

// Opciones del menú lateral del panel (el administrador las ve todas).
export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", icono: "📊" },
  { label: "Órdenes", to: "/admin/ordenes", icono: "🧾" },
  { label: "Productos", to: "/admin/productos", icono: "📦" },
  { label: "Categorías", to: "/admin/categorias", icono: "🏷️" },
  { label: "Usuarios", to: "/admin/usuarios", icono: "👥" },
  { label: "Reportes", to: "/admin/reportes", icono: "📈" },
  { label: "Perfil", to: "/admin/perfil", icono: "👤" },
];

// El menú del vendedor sale de las mismas reglas de rutas: si cambia lo que puede ver,
// el menú cambia solo.
export const VENDEDOR_NAV_ITEMS = ADMIN_NAV_ITEMS.filter((item) => vendedorPuedeVer(item.to));
