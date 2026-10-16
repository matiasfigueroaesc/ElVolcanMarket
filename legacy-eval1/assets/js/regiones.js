// Regiones y comunas de cobertura real de la tienda.
const REGIONES = [
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
      { value: "quillon", label: "Quillón" }
    ]
  }
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
