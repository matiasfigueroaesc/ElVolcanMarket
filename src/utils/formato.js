// $12.990 (formato peso chileno)
export function formatearCLP(valor = 0) {
  return `$${Number(valor).toLocaleString("es-CL")}`;
}

export function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}
