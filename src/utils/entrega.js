// Opciones de entrega del checkout. Para cambiarlas se edita solo este arreglo.
export const OPCIONES_ENTREGA = [
  { value: "normal", label: "Despacho normal" },
  { value: "express", label: "Despacho express" },
];

export function nombreEntrega(value) {
  return OPCIONES_ENTREGA.find((o) => o.value === value)?.label ?? "";
}