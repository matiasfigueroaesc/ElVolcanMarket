// ============================================
// El Volcán Market — ordenes.js
// Órdenes de compra (boletas). Desde la Eval 3 vienen del backend, a través del Gateway:
//   - servicio ventas:   /api/v1/boletas            (checkout, listado, detalle)
//   - servicio despacho: /api/v1/despachos          (estado del despacho y seguimiento)
//
// Forma de una orden (BoletaResponse del servicio ventas, igual que en la Eval 2):
// {
//   id, numero: "ORD-000001", fecha: ISO,
//   usuarioId: number | null,
//   cliente:   { nombre, apellidos, correo },
//   direccion: { calle, departamento, region, comuna, indicaciones },
//   entrega:   "normal" | "express"   (ver src/utils/entrega.js),
//   items:     [{ id, codigo, nombre, precio, cantidad, subtotal, imagen }],
//   total,
//   estadoPago: "pagado" | "rechazado",
//   estado:     "recibido" | "preparando" | "en camino" | "entregado" | null
// }
// estado es null si el pago fue rechazado (no se despacha) o si despacho no respondió.
//
// Reglas que ahora aplica el backend (y no el navegador):
//   - el precio y el total los fija el catálogo (con la oferta vigente);
//   - el stock se descuenta al aprobar el pago, todo o nada (409 si no alcanza);
//   - un cliente solo puede ver sus propias boletas; el admin y el vendedor, todas;
//   - el despacho solo avanza hacia adelante y solo lo cambia el admin.
// ============================================
import { api, nuloSi404 } from "../api/cliente.js";

export const ESTADOS_ORDEN = ["recibido", "preparando", "en camino", "entregado"];

// ---------- Ventas ----------

/**
 * Checkout. Devuelve la boleta creada (201), también si el pago fue rechazado
 * (estadoPago "rechazado"). Solo se envían id y cantidad de cada producto:
 * el backend ignora el precio que venga del navegador.
 * El usuario no va en el cuerpo: si hay sesión, el backend lo toma del token.
 */
export function crearOrden({ cliente, direccion, entrega, items, simularRechazo = false }) {
  return api.post("/boletas", {
    cliente,
    direccion,
    entrega,
    items: items.map(({ id, cantidad }) => ({ id, cantidad })),
    simularRechazo,
  });
}

// ADMIN y VENDEDOR. filtros opcionales: { texto, estadoPago, usuarioId }. Más nuevas primero.
export const listarOrdenes = (filtros) => api.get("/boletas", filtros);

// Compras de un usuario (para el panel admin).
export const listarPorUsuario = (usuarioId) => listarOrdenes({ usuarioId: Number(usuarioId) });

// Compras del usuario con sesión.
export const listarMisOrdenes = () => api.get("/boletas/mias");

// null si no existe o si no es del usuario con sesión.
export const obtenerOrden = (id) => nuloSi404(api.get(`/boletas/${Number(id)}`));

// ---------- Despacho ----------

/**
 * Avanza el despacho de una boleta (solo ADMIN, solo hacia adelante).
 * Devuelve el despacho actualizado: { boletaId, numero, estado, historial, ... }.
 */
export function actualizarEstado(boletaId, estado) {
  if (!ESTADOS_ORDEN.includes(estado)) throw new Error(`Estado inválido: ${estado}`);
  return api.patch(`/despachos/${Number(boletaId)}/estado`, { estado });
}

/**
 * Seguimiento público por número de pedido (no muestra datos personales).
 * { numero, estado, entrega, zona, tiempo, etapas, historial: [{ estado, fecha }] }
 * o null si no existe (o si el pago fue rechazado: esos pedidos no se despachan).
 */
export const seguimientoPedido = (numero) =>
  nuloSi404(api.get(`/despachos/seguimiento/${encodeURIComponent(numero)}`));

// Etapas a las que puede pasar un despacho: solo las siguientes a la actual.
export function estadosSiguientes(estado) {
  const i = ESTADOS_ORDEN.indexOf(estado);
  return i < 0 ? [] : ESTADOS_ORDEN.slice(i + 1);
}

export function calcularTotal(items) {
  return items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}
