// Cálculos de la página Zonas de despacho, como funciones PURAS. Desde la Eval 3 las
// zonas vienen del servicio despacho (src/data/zonas.js), así que se reciben por parámetro.
//
// Las comunas se guardan con su `value` de src/data/regiones.js ("chillan-viejo")
// y se muestran con nombreComuna(), igual que en el resto del sitio. Así, si algún
// día cambia el nombre de una comuna, se corrige en un solo lugar.
import { nombreComuna } from "../data/regiones.js";

// Hoy la cobertura es solo la Región de Ñuble.
export const REGION_DESPACHO = "nuble";

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
export function zonasDeComuna(zonas, comuna) {
  return zonas.filter((z) => z.cobertura.some((c) => c.comuna === comuna));
}
