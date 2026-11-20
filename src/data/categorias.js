// ============================================
// El Volcán Market — categorias.js
// Categorías del catálogo. Desde la Eval 3 vienen del microservicio catalogo:
// /api/v1/categorias. Mismos nombres de funciones que en la Eval 2, ahora
// asíncronas. El backend genera el slug y no permite nombres repetidos ni
// eliminar una categoría con productos.
//
// Categoría: { id, nombre, slug, descripcion, imagen }
// ============================================
import { api, nuloSi404 } from "../api/cliente.js";

export const listarCategorias = () => api.get("/categorias");
export const obtenerCategoria = (id) => nuloSi404(api.get(`/categorias/${Number(id)}`));
export const obtenerCategoriaPorSlug = (slug) =>
  nuloSi404(api.get(`/categorias/slug/${encodeURIComponent(slug)}`));
export const crearCategoria = (datos) => api.post("/categorias", datos);
export const actualizarCategoria = (id, datos) => api.put(`/categorias/${Number(id)}`, datos);
export const eliminarCategoria = (id) => api.delete(`/categorias/${Number(id)}`);

// Busca una categoría en una lista ya cargada (para mostrar su nombre en una tarjeta o tabla).
export function categoriaPorId(categorias = [], id) {
  return categorias.find((c) => c.id === Number(id)) ?? null;
}

// "Mangueras y Conexiones" -> "mangueras-y-conexiones"
// Solo para mostrar la URL en el formulario: el slug real lo calcula el backend.
export function slugify(texto = "") {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
