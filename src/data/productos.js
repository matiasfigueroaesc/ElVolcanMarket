// ============================================
// El Volcán Market — productos.js
// Catálogo de productos (antes assets/js/products.js).
// Fuente de datos COMPARTIDA entre la tienda y el panel admin:
// ambos leen y escriben la misma clave de localStorage.
//
// Cambios respecto a la Eval 1:
//   - "categoria" (texto) pasa a "categoriaId" -> ver categorias.js
//   - nuevo campo "precioOferta" (null si no está en oferta)
//   - imágenes servidas desde /public/img
// ============================================
import { crearRepositorio } from "./storage.js";

export const PRODUCTOS_STORAGE_KEY = "volcan_products_catalog_v3";

export const PRODUCTOS_SEED = [
  {
    id: 1,
    codigo: "CL001",
    nombre: "Cilindro GLP 5 kg",
    precio: 6500,
    stock: 80,
    stockCritico: 10,
    imagen: "/img/cilindro-5kg.png",
    descripcion: "Cilindro de gas licuado de petróleo 5 kg. Para uso residencial (cocina, calefacción pequeña).",
    unidad: "Unidad",
    categoriaId: 1,
    precioOferta: null
  },
  {
    id: 2,
    codigo: "CL002",
    nombre: "Cilindro GLP 11 kg",
    precio: 12000,
    stock: 200,
    stockCritico: 10,
    imagen: "/img/cilindro-11kg.png",
    descripcion: "Cilindro estándar doméstico. El más utilizado en hogares chilenos. Compatible con reguladores estándar.",
    unidad: "Unidad",
    categoriaId: 1,
    precioOferta: null
  },
  {
    id: 3,
    codigo: "CL003",
    nombre: "Cilindro GLP 15 kg",
    precio: 16000,
    stock: 90,
    stockCritico: 10,
    imagen: "/img/cilindro-15kg.png",
    descripcion: "Cilindro de mayor capacidad para hogares de alto consumo o locales pequeños.",
    unidad: "Unidad",
    categoriaId: 1,
    precioOferta: null
  },
  {
    id: 4,
    codigo: "CL004",
    nombre: "Cilindro GLP 45 kg",
    precio: 45000,
    stock: 30,
    stockCritico: 10,
    imagen: "/img/cilindro-45kg.png",
    descripcion: "Cilindro industrial. Uso comercial: restaurantes, talleres, calefacción de locales.",
    unidad: "Unidad",
    categoriaId: 1,
    precioOferta: 39990
  },
  {
    id: 5,
    codigo: "RG001",
    nombre: "Regulador doméstico estándar",
    precio: 8990,
    stock: 45,
    stockCritico: 10,
    imagen: "/img/regulador-estandar.png",
    descripcion: "Regulador de 1 etapa para cilindros 5, 11 y 15 kg. Presión de salida 28 mbar.",
    unidad: "Unidad",
    categoriaId: 2,
    precioOferta: null
  },
  {
    id: 6,
    codigo: "RG002",
    nombre: "Regulador de alta presión",
    precio: 18990,
    stock: 12,
    stockCritico: 5,
    imagen: "/img/regulador-alta-presion.png",
    descripcion: "Regulador para cocinas industriales o equipos de mayor consumo. Presión regulable.",
    unidad: "Unidad",
    categoriaId: 2,
    precioOferta: null
  },
  {
    id: 7,
    codigo: "RG003",
    nombre: "Regulador dual (2 salidas)",
    precio: 14990,
    stock: 18,
    stockCritico: 5,
    imagen: "/img/regulador-dual.png",
    descripcion: "Permite conectar dos artefactos simultáneamente al mismo cilindro.",
    unidad: "Unidad",
    categoriaId: 2,
    precioOferta: null
  },
  {
    id: 8,
    codigo: "MG001",
    nombre: "Manguera gas 1.5 m",
    precio: 3990,
    stock: 80,
    stockCritico: 10,
    imagen: "/img/manguera-1.5m.png",
    descripcion: "Manguera flexible homologada. Diámetro interior 9mm. Compatible con reguladores estándar.",
    unidad: "Unidad",
    categoriaId: 3,
    precioOferta: null
  },
  {
    id: 9,
    codigo: "MG002",
    nombre: "Manguera gas 3 m",
    precio: 6990,
    stock: 50,
    stockCritico: 10,
    imagen: "/img/manguera-3m.png",
    descripcion: "Manguera larga para instalaciones donde el artefacto está alejado del cilindro.",
    unidad: "Unidad",
    categoriaId: 3,
    precioOferta: null
  },
  {
    id: 10,
    codigo: "MG003",
    nombre: "Abrazadera metálica",
    precio: 990,
    stock: 200,
    stockCritico: 10,
    imagen: "/img/abrazadera.png",
    descripcion: "Abrazadera de acero para asegurar la conexión manguera-regulador y manguera-artefacto.",
    unidad: "Unidad",
    categoriaId: 3,
    precioOferta: null
  },
  {
    id: 11,
    codigo: "MG004",
    nombre: "Kit conexión completo (regulador + manguera 1.5m + abrazaderas)",
    precio: 12990,
    stock: 25,
    stockCritico: 10,
    imagen: "/img/kit-conexion.png",
    descripcion: "Todo lo necesario para instalar un cilindro nuevo.",
    unidad: "Kit",
    categoriaId: 3,
    precioOferta: 10990
  },
  {
    id: 12,
    codigo: "AC001",
    nombre: "Carro porta cilindro 11/15 kg",
    precio: 12990,
    stock: 20,
    stockCritico: 5,
    imagen: "/img/carro-porta-cilindro.png",
    descripcion: "Carro metálico con ruedas para transportar cilindros dentro del hogar con seguridad.",
    unidad: "Unidad",
    categoriaId: 4,
    precioOferta: null
  },
  {
    id: 13,
    codigo: "AC002",
    nombre: "Tapa protectora para válvula",
    precio: 1490,
    stock: 60,
    stockCritico: 10,
    imagen: "/img/tapa-protectora.png",
    descripcion: "Tapa de plástico ABS para proteger la válvula del cilindro durante el transporte.",
    unidad: "Unidad",
    categoriaId: 4,
    precioOferta: null
  },
  {
    id: 14,
    codigo: "AC003",
    nombre: "Detector de gas a batería",
    precio: 19990,
    stock: 4,
    stockCritico: 5,
    imagen: "/img/detector-gas.png",
    descripcion: "Sensor electroquímico. Alarma sonora y visual ante fuga de gas GLP o metano.",
    unidad: "Unidad",
    categoriaId: 4,
    precioOferta: 16990
  }
];

const repo = crearRepositorio(PRODUCTOS_STORAGE_KEY, PRODUCTOS_SEED);

// ---------- CRUD ----------
export const listarProductos = () => repo.listar();
export const obtenerProducto = (id) => repo.obtenerPorId(id);
export const crearProducto = (datos) => repo.crear(datos);
export const actualizarProducto = (id, cambios) => repo.actualizar(id, cambios);
export const eliminarProducto = (id) => repo.eliminar(id);
export const reiniciarProductos = () => repo.reiniciar();

// ---------- Consultas para las vistas ----------
export function estaEnOferta(producto) {
  return producto.precioOferta != null && producto.precioOferta < producto.precio;
}

// Precio que efectivamente paga el cliente.
export function precioFinal(producto) {
  return estaEnOferta(producto) ? producto.precioOferta : producto.precio;
}

export function listarPorCategoria(categoriaId) {
  return listarProductos().filter((p) => p.categoriaId === Number(categoriaId));
}

export function listarOfertas() {
  return listarProductos().filter(estaEnOferta);
}

// Productos con stock igual o bajo su stock crítico (vista admin "productos críticos").
export function listarCriticos() {
  return listarProductos().filter((p) => p.stock <= p.stockCritico);
}

// Búsqueda por nombre, código o descripción (sin distinguir mayúsculas ni tildes).
export function buscarProductos(texto = "", lista = listarProductos()) {
  const normalizar = (s = "") => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const q = normalizar(texto.trim());
  if (!q) return lista;
  return lista.filter((p) =>
    [p.nombre, p.codigo, p.descripcion].some((campo) => normalizar(campo).includes(q))
  );
}

// Descuenta stock tras una compra. items = [{ id, cantidad }]
export function descontarStock(items) {
  items.forEach(({ id, cantidad }) => {
    const producto = obtenerProducto(id);
    if (producto) actualizarProducto(id, { stock: Math.max(0, producto.stock - cantidad) });
  });
}
