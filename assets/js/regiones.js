// Regiones y comunas de Chile (uso por validations.js para poblar selects)
// Cada región incluye varias comunas representativas para facilitar pruebas.
const REGIONES = [
  { value: "arica-parinacota", label: "Arica y Parinacota", comunas: [
    { value: "arica", label: "Arica" },
    { value: "putre", label: "Putre" },
    { value: "camarones", label: "Camarones" },
    { value: "general-lagos", label: "General Lagos" },
    { value: "codpa", label: "Codpa" }
  ] },
  { value: "tarapaca", label: "Tarapacá", comunas: [
    { value: "iquique", label: "Iquique" },
    { value: "alto-hospicio", label: "Alto Hospicio" },
    { value: "pozo-almonte", label: "Pozo Almonte" },
    { value: "pica", label: "Pica" },
    { value: "huara", label: "Huara" }
  ] },
  { value: "antofagasta", label: "Antofagasta", comunas: [
    { value: "antofagasta", label: "Antofagasta" },
    { value: "calama", label: "Calama" },
    { value: "tocopilla", label: "Tocopilla" },
    { value: "mejillones", label: "Mejillones" },
    { value: "san-pedro-de-atacama", label: "San Pedro de Atacama" }
  ] },
  { value: "atacama", label: "Atacama", comunas: [
    { value: "copiapo", label: "Copiapó" },
    { value: "vallenar", label: "Vallenar" },
    { value: "chuiquicamata", label: "Chuquicamata" },
    { value: "caldera", label: "Caldera" },
    { value: "tiajuana", label: "Tierra Amarilla" }
  ] },
  { value: "coquimbo", label: "Coquimbo", comunas: [
    { value: "la-serena", label: "La Serena" },
    { value: "coquimbo", label: "Coquimbo" },
    { value: "ovalle", label: "Ovalle" },
    { value: "illapel", label: "Illapel" },
    { value: "andacollo", label: "Andacollo" }
  ] },
  { value: "valparaiso", label: "Valparaíso", comunas: [
    { value: "valparaiso", label: "Valparaíso" },
    { value: "viña-del-mar", label: "Viña del Mar" },
    { value: "quilpue", label: "Quilpué" },
    { value: "villa-alemana", label: "Villa Alemana" },
    { value: "san-antonio", label: "San Antonio" }
  ] },
  { value: "metropolitana", label: "Región Metropolitana de Santiago", comunas: [
    { value: "santiago", label: "Santiago" },
    { value: "providencia", label: "Providencia" },
    { value: "las-condes", label: "Las Condes" },
    { value: "ñuñoa", label: "Ñuñoa" },
    { value: "maipu", label: "Maipú" },
    { value: "puente-alto", label: "Puente Alto" }
  ] },
  { value: "ohiggins", label: "Región del Libertador O'Higgins", comunas: [
    { value: "rancagua", label: "Rancagua" },
    { value: "san-fernando", label: "San Fernando" },
    { value: "roscute", label: "Rengo" },
    { value: "machali", label: "Machalí" },
    { value: "quinta-de-lavera", label: "Pichilemu" }
  ] },
  { value: "maule", label: "Región del Maule", comunas: [
    { value: "talca", label: "Talca" },
    { value: "curico", label: "Curicó" },
    { value: "linares", label: "Linares" },
    { value: "chetumal", label: "Chillán" },
    { value: "san-clemente", label: "San Clemente" }
  ] },
  { value: "nuble", label: "Región de Ñuble", comunas: [
    { value: "chillan", label: "Chillán" },
    { value: "chillan-viejo", label: "Chillán Viejo" },
    { value: "bulnes", label: "Bulnes" },
    { value: "san-ignacio", label: "San Ignacio" },
    { value: "yungay", label: "Yungay" }
  ] },
  { value: "biobio", label: "Región del Biobío", comunas: [
    { value: "concepcion", label: "Concepción" },
    { value: "talcahuano", label: "Talcahuano" },
    { value: "chiguayante", label: "Chiguayante" },
    { value: "coronel", label: "Coronel" },
    { value: "los-angeles", label: "Los Ángeles" }
  ] },
  { value: "araucania", label: "Región de La Araucanía", comunas: [
    { value: "temuco", label: "Temuco" },
    { value: "angol", label: "Angol" },
    { value: "villarrica", label: "Villarrica" },
    { value: "lautaro", label: "Lautaro" },
    { value: "carahue", label: "Carahue" }
  ] },
  { value: "los-rios", label: "Región de Los Ríos", comunas: [
    { value: "valdivia", label: "Valdivia" },
    { value: "la-union", label: "La Unión" },
    { value: "mariquina", label: "Mariquina" },
    { value: "panguipulli", label: "Panguipulli" },
    { value: "rios", label: "Rios" }
  ] },
  { value: "los-lagos", label: "Región de Los Lagos", comunas: [
    { value: "puerto-montt", label: "Puerto Montt" },
    { value: "castro", label: "Castro" },
    { value: "osorno", label: "Osorno" },
    { value: "calbuco", label: "Calbuco" },
    { value: "chiloe", label: "Chiloé" }
  ] },
  { value: "aisen", label: "Región de Aysén", comunas: [
    { value: "coihaique", label: "Coihaique" },
    { value: "aysen", label: "Aysén" },
    { value: "cisnes", label: "Cisnes" },
    { value: "guaitecas", label: "Guaitecas" },
    { value: "rio-ibanez", label: "Río Ibáñez" }
  ] },
  { value: "magallanes", label: "Región de Magallanes", comunas: [
    { value: "punta-arenas", label: "Punta Arenas" },
    { value: "timaukel", label: "Timaukel" },
    { value: "natales", label: "Puerto Natales" },
    { value: "porvenir", label: "Porvenir" },
    { value: "lagos-ultima", label: "Lago Verde" }
  ] }
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
