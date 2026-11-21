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
