// ============================================
// El Volcán Market — zonas.js
// Zonas de despacho. Desde la Eval 3 vienen del servicio despacho
// (GET /api/v1/zonas, público). Forma de una zona:
// { id: "centro", nombre, cobertura: [{ comuna, sector? }], detalle?, dias, horario, tiempo }
// Los cálculos (texto de cobertura, zonas de una comuna) siguen en utils/zonasDespacho.js.
// ============================================
import { api } from "../api/cliente.js";

export const listarZonas = () => api.get("/zonas");
