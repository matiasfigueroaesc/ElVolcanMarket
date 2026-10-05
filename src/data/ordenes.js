// ============================================
// El Volcán Market — ordenes.js
// Órdenes de compra (antes assets/js/orders.js). Las crea el
// checkout de la tienda y las lee el panel admin (órdenes,
// boleta, reportes, historial de compras de un usuario).
//
// Forma de una orden:
// {
//   id, numero: "ORD-000001", fecha: ISO,
//   usuarioId: number | null,
//   cliente:   { nombre, apellidos, correo },
//   direccion: { calle, departamento, region, comuna, indicaciones },
//   items:     [{ id, nombre, precio, cantidad, imagen }],
//   total,
//   estadoPago: "pagado" | "rechazado",
//   estado:     "recibido" | "preparando" | "en camino" | "entregado"
// }
// ============================================
import { crearRepositorio } from "./storage.js";

export const ORDENES_STORAGE_KEY = "volcan_orders_v2";

export const ESTADOS_ORDEN = ["recibido", "preparando", "en camino", "entregado"];

const camila = { nombre: "Camila", apellidos: "Toro Pizarro", correo: "camila.toro@gmail.com" };
const direccionCamila = {
  calle: "Camino a Chillán Viejo 789",
  departamento: "",
  region: "nuble",
  comuna: "chillan-viejo",
  indicaciones: "",
};

export const ORDENES_SEED = [
  {
    id: 1,
    numero: "ORD-000001",
    fecha: "2026-09-02T14:10:00.000Z",
    usuarioId: 3,
    cliente: camila,
    direccion: direccionCamila,
    items: [{ id: 2, nombre: "Cilindro GLP 11 kg", precio: 12000, cantidad: 2, imagen: "/img/cilindro-11kg.png" }],
    total: 24000,
    estadoPago: "pagado",
    estado: "entregado",
  },
  {
    id: 2,
    numero: "ORD-000002",
    fecha: "2026-09-15T19:45:00.000Z",
    usuarioId: 3,
    cliente: camila,
    direccion: direccionCamila,
    items: [
      { id: 3, nombre: "Cilindro GLP 15 kg", precio: 16000, cantidad: 1, imagen: "/img/cilindro-15kg.png" },
      { id: 5, nombre: "Regulador doméstico estándar", precio: 8990, cantidad: 1, imagen: "/img/regulador-estandar.png" },
    ],
    total: 24990,
    estadoPago: "pagado",
    estado: "en camino",
  },
];

const repo = crearRepositorio(ORDENES_STORAGE_KEY, ORDENES_SEED);

// ---------- CRUD ----------
export const listarOrdenes = () => repo.listar();
export const obtenerOrden = (id) => repo.obtenerPorId(id);
export const actualizarOrden = (id, cambios) => repo.actualizar(id, cambios);
export const eliminarOrden = (id) => repo.eliminar(id);
export const reiniciarOrdenes = () => repo.reiniciar();

export function calcularTotal(items) {
  return items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

// Crea la orden a partir de los datos del checkout.
export function crearOrden({ usuarioId = null, cliente, direccion, items, estadoPago = "pagado" }) {
  const orden = repo.crear({
    numero: "",
    fecha: new Date().toISOString(),
    usuarioId,
    cliente,
    direccion,
    items: items.map(({ id, nombre, precio, cantidad, imagen }) => ({ id, nombre, precio, cantidad, imagen })),
    total: calcularTotal(items),
    estadoPago,
    estado: "recibido",
  });
  return repo.actualizar(orden.id, { numero: `ORD-${String(orden.id).padStart(6, "0")}` });
}

export function actualizarEstado(id, estado) {
  if (!ESTADOS_ORDEN.includes(estado)) throw new Error(`Estado inválido: ${estado}`);
  return actualizarOrden(id, { estado });
}

export function listarPorUsuario(usuarioId) {
  return listarOrdenes().filter((o) => o.usuarioId === Number(usuarioId));
}
