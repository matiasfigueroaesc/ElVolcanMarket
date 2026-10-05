// ============================================
// El Volcán Market — regiones.js
// Regiones y comunas con cobertura de despacho.
// ============================================
export const REGIONES = [
  {
    value: "nuble",
    label: "Región de Ñuble",
    comunas: [
      { value: "chillan", label: "Chillán" },
      { value: "chillan-viejo", label: "Chillán Viejo" },
      { value: "el-carmen", label: "El Carmen" },
      { value: "pinto", label: "Pinto" },
      { value: "san-ignacio", label: "San Ignacio" },
      { value: "bulnes", label: "Bulnes" },
      { value: "quillon", label: "Quillón" },
    ],
  },
];

export function comunasDe(regionValue) {
  return REGIONES.find((r) => r.value === regionValue)?.comunas ?? [];
}

export function nombreRegion(value) {
  return REGIONES.find((r) => r.value === value)?.label ?? value;
}

export function nombreComuna(regionValue, comunaValue) {
  return comunasDe(regionValue).find((c) => c.value === comunaValue)?.label ?? comunaValue;
}
