// Colores (clases de badge de Bootstrap) para los estados de una orden.
// Están aparte para que la tabla de órdenes y la boleta usen los mismos.
const CLASES_ESTADO = {
  recibido: "text-bg-secondary",
  preparando: "text-bg-info",
  "en camino": "text-bg-warning",
  entregado: "text-bg-success",
};

export function claseEstado(estado) {
  return CLASES_ESTADO[estado] ?? "text-bg-light";
}

export function clasePago(estadoPago) {
  return estadoPago === "pagado" ? "text-bg-success" : "text-bg-danger";
}
