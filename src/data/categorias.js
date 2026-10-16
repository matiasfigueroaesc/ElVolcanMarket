// ============================================
// El Volcán Market — categorias.js
// Categorías del catálogo. Antes (Eval 1) eran solo un texto
// dentro de cada producto; ahora son una entidad propia para
// poder administrarlas (CRUD en /admin/categorias) y navegar
// la tienda por categoría (/categorias/:slug).
// ============================================
import { crearRepositorio } from "./storage.js";

export const CATEGORIAS_STORAGE_KEY = "volcan_categories";

export const CATEGORIAS_SEED = [
  {
    id: 1,
    nombre: "Cilindros de Gas",
    slug: "cilindros",
    descripcion: "Cilindros de gas licuado de 5, 11, 15 y 45 kg.",
    imagen: "/img/cilindro-11kg.png",
  },
  {
    id: 2,
    nombre: "Reguladores",
    slug: "reguladores",
    descripcion: "Reguladores de presión para uso doméstico e industrial.",
    imagen: "/img/regulador-estandar.png",
  },
  {
    id: 3,
    nombre: "Mangueras y Conexiones",
    slug: "mangueras-conexiones",
    descripcion: "Mangueras homologadas, abrazaderas y kits de conexión.",
    imagen: "/img/kit-conexion.png",
  },
  {
    id: 4,
    nombre: "Accesorios",
    slug: "accesorios",
    descripcion: "Carros, tapas protectoras y detectores de gas.",
    imagen: "/img/detector-gas.png",
  },
];

const repo = crearRepositorio(CATEGORIAS_STORAGE_KEY, CATEGORIAS_SEED);

export const listarCategorias = () => repo.listar();
export const obtenerCategoria = (id) => repo.obtenerPorId(id);
export const crearCategoria = (datos) => repo.crear({ ...datos, slug: datos.slug || slugify(datos.nombre) });
export const actualizarCategoria = (id, cambios) => repo.actualizar(id, cambios);
export const eliminarCategoria = (id) => repo.eliminar(id);
export const reiniciarCategorias = () => repo.reiniciar();

export function obtenerCategoriaPorSlug(slug) {
  return listarCategorias().find((c) => c.slug === slug) ?? null;
}

// "Mangueras y Conexiones" -> "mangueras-y-conexiones"
export function slugify(texto = "") {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
