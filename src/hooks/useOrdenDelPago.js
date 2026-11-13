// Orden que muestran /pago/exito/:ordenId y /pago/error/:ordenId.
// - Recién pagada: el checkout la manda en el "state" de la navegación (no hay que pedirla).
// - Si se recarga la página, el state se pierde: se pide al backend, que solo la entrega
//   si hay sesión y la orden es del usuario. Una compra como invitado no se puede volver
//   a pedir (devuelve null y la página muestra "no encontrada").
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { obtenerOrden } from "../data/ordenes.js";
import { useCarga } from "./useCarga.js";

export function useOrdenDelPago() {
  const { ordenId } = useParams();
  const { state } = useLocation();
  const { usuario, cargandoSesion } = useAuth();
  const recibida = state?.orden?.id === Number(ordenId) ? state.orden : null;

  const carga = useCarga(async () => {
    if (recibida) return recibida;
    if (cargandoSesion || !usuario) return null;
    return obtenerOrden(ordenId);
  }, [ordenId, recibida, cargandoSesion, usuario?.id]);

  // Mientras se recupera la sesión (al recargar) todavía no se sabe si hay que pedirla.
  return !recibida && cargandoSesion ? { ...carga, cargando: true } : carga;
}
