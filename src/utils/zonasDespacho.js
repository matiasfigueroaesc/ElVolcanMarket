// Zonas de despacho (contenido migrado de legacy-eval1/store/delivery-zones.html).
// Es información fija de la empresa: no se guarda en localStorage, por eso vive aquí
// y no en src/data/ (mismo criterio que utils/blog.js).
//
// Las comunas se guardan con su `value` de src/data/regiones.js ("chillan-viejo")
// y se muestran con nombreComuna(), igual que en el resto del sitio. Así, si algún
// día cambia el nombre de una comuna, se corrige en un solo lugar.
import { nombreComuna } from "../data/regiones.js";

// Hoy la cobertura es solo la Región de Ñuble.
export const REGION_DESPACHO = "nuble";

// cobertura: [{ comuna, sector? }]  -> sector precisa qué parte de la comuna cubre la zona.
// detalle:   texto libre para zonas que no se definen por comuna (Zona Comercial).
export const ZONAS_DESPACHO = [
  {
    id: "centro",
    nombre: "Zona Centro",
    cobertura: [{ comuna: "chillan", sector: "sectores centro, norte y sur" }],
    dias: "Lunes a Sábado",
    horario: "08:00 – 20:00",
    tiempo: "1 – 3 horas",
  },
  {
    id: "oriente",
    nombre: "Zona Oriente",
    cobertura: [{ comuna: "chillan", sector: "sector oriente" }, { comuna: "chillan-viejo" }],
    dias: "Lunes a Viernes",
    horario: "08:00 – 18:00",
    tiempo: "2 – 4 horas",
  },
  {
    id: "rural",
    nombre: "Zona Rural",
    cobertura: [{ comuna: "el-carmen" }, { comuna: "pinto" }, { comuna: "san-ignacio" }],
    dias: "Martes y Jueves",
    horario: "08:00 – 16:00",
    tiempo: "3 – 6 horas",
  },
  {
    id: "sur",
    nombre: "Zona Sur",
    cobertura: [{ comuna: "bulnes" }, { comuna: "quillon" }],
    dias: "Miércoles",
    horario: "08:00 – 16:00",
    tiempo: "4 – 6 horas",
  },
  {
    id: "comercial",
    nombre: "Zona Comercial",
    cobertura: [],
    detalle: "Parques industriales y locales comerciales",
    dias: "Lunes a Viernes",
    horario: "07:00 – 17:00",
    tiempo: "Según agenda",
  },
];

/**
 * Texto de la columna "Comunas cubiertas".
 * Ej: "Chillán (sector oriente), Chillán Viejo"
 */
export function textoCobertura(zona) {
  if (zona.detalle) return zona.detalle;
  return zona.cobertura
    .map(({ comuna, sector }) => {
      const nombre = nombreComuna(REGION_DESPACHO, comuna);
      return sector ? `${nombre} (${sector})` : nombre;
    })
    .join(", ");
}

/**
 * Zonas que despachan a una comuna. Puede haber más de una
 * (Chillán está en la Zona Centro y en la Zona Oriente). [] si no hay cobertura.
 */
export function zonasDeComuna(comuna) {
  return ZONAS_DESPACHO.filter((z) => z.cobertura.some((c) => c.comuna === comuna));
}
