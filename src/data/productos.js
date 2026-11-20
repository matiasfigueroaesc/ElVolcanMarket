// ============================================
// El Volcán Market — productos.js
// Catálogo de productos. Desde la Eval 3 los datos vienen del microservicio
// catalogo (a través del Gateway): /api/v1/productos.
//
// Las funciones mantienen los MISMOS nombres de la Eval 2, pero ahora son
// asíncronas (devuelven una Promise): las páginas las usan con useCarga o await.
// Los datos de fábrica viven en el backend (catalogo/config/Seed.java).
//
// Producto: { id, codigo, nombre, precio, precioOferta, stock, stockCritico,
//             imagen, descripcion, unidad, categoriaId }
// ============================================
import { api, nuloSi404 } from "../api/cliente.js";

// ---------- CRUD (API) ----------
// filtros opcionales: { texto, categoriaId, oferta }
export const listarProductos = (filtros) => api.get("/productos", filtros);
export const obtenerProducto = (id) => nuloSi404(api.get(`/productos/${Number(id)}`));
export const crearProducto = (datos) => api.post("/productos", datos);
export const actualizarProducto = (id, datos) => api.put(`/productos/${Number(id)}`, datos);
export const eliminarProducto = (id) => api.delete(`/productos/${Number(id)}`);

export const listarPorCategoria = (categoriaId) => listarProductos({ categoriaId: Number(categoriaId) });
export const listarOfertas = () => listarProductos({ oferta: true });
// Productos con stock igual o bajo su stock crítico (ADMIN y VENDEDOR).
export const listarCriticos = () => api.get("/productos/criticos");

// ---------- Funciones puras para las vistas (no llaman al backend) ----------
export function estaEnOferta(producto) {
  return producto.precioOferta != null && producto.precioOferta < producto.precio;
}

// Precio que efectivamente paga el cliente.
export function precioFinal(producto) {
  return estaEnOferta(producto) ? producto.precioOferta : producto.precio;
}

// Búsqueda por nombre, código o descripción (sin distinguir mayúsculas ni tildes)
// sobre una lista ya cargada: filtra mientras se escribe, sin pedir nada al servidor.
export function buscarProductos(texto = "", lista = []) {
  const normalizar = (s = "") => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const q = normalizar(texto.trim());
  if (!q) return lista;
  return lista.filter((p) =>
    [p.nombre, p.codigo, p.descripcion ?? ""].some((campo) => normalizar(campo).includes(q))
  );
}
