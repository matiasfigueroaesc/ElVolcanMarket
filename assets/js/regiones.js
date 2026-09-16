// Regiones y comunas de Chile (uso por validations.js para poblar selects)
const REGIONES = [
  { value: "arica-parinacota", label: "Arica y Parinacota", comunas: [{ value: "arica", label: "Arica" }] },
  { value: "tarapaca", label: "Tarapacá", comunas: [{ value: "iqq", label: "Iquique" }] },
  { value: "antofagasta", label: "Antofagasta", comunas: [{ value: "antofagasta", label: "Antofagasta" }] },
  { value: "atacama", label: "Atacama", comunas: [{ value: "copiapo", label: "Copiapó" }] },
  { value: "coquimbo", label: "Coquimbo", comunas: [{ value: "la-serena", label: "La Serena" }] },
  { value: "valparaiso", label: "Valparaíso", comunas: [{ value: "valparaiso", label: "Valparaíso" }] },
  { value: "metropolitana", label: "Región Metropolitana de Santiago", comunas: [{ value: "santiago", label: "Santiago" }] },
  { value: "ohiggins", label: "Región del Libertador O'Higgins", comunas: [{ value: "rancagua", label: "Rancagua" }] },
  { value: "maule", label: "Región del Maule", comunas: [{ value: "talca", label: "Talca" }] },
  { value: "nuble", label: "Región de Ñuble", comunas: [
    { value: "chillan", label: "Chillán" },
    { value: "chillan-viejo", label: "Chillán Viejo" }
  ] },
  { value: "biobio", label: "Región del Biobío", comunas: [{ value: "concepcion", label: "Concepción" }] },
  { value: "araucania", label: "Región de La Araucanía", comunas: [{ value: "temuco", label: "Temuco" }] },
  { value: "los-rios", label: "Región de Los Ríos", comunas: [{ value: "valdivia", label: "Valdivia" }] },
  { value: "los-lagos", label: "Región de Los Lagos", comunas: [{ value: "puerto-montt", label: "Puerto Montt" }] },
  { value: "aisen", label: "Región de Aysén", comunas: [{ value: "coihaique", label: "Coihaique" }] },
  { value: "magallanes", label: "Región de Magallanes", comunas: [{ value: "punta-arenas", label: "Punta Arenas" }] }
];

function poblarSelectRegiones(selectId, selectedValue = "") {
  const sel = document.getElementById(selectId);
  if (!sel) return;

  sel.innerHTML = '<option value="" selected disabled>-- Seleccione región --</option>';
  REGIONES.forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r.value;
    opt.textContent = r.label;
    sel.appendChild(opt);
  });

  if (selectedValue) sel.value = selectedValue;
}

function poblarComunasPorRegion(regionValue, comunaSelectId, selectedComuna = "") {
  const sel = document.getElementById(comunaSelectId);
  if (!sel) return;

  const regionObj = REGIONES.find((r) => r.value === regionValue) || { comunas: [] };
  const opciones = regionObj.comunas || [];

  sel.innerHTML = '<option value="" selected disabled>-- Seleccione comuna --</option>';
  opciones.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.value;
    opt.textContent = c.label;
    sel.appendChild(opt);
  });

  if (selectedComuna && opciones.some((c) => c.value === selectedComuna)) sel.value = selectedComuna;
  else sel.value = "";

  sel.disabled = !regionValue;
}

// Exponer funciones para compatibilidad con validations.js
window.REGIONES = REGIONES;
window.poblarSelectRegiones = poblarSelectRegiones;
window.poblarComunasPorRegion = poblarComunasPorRegion;
