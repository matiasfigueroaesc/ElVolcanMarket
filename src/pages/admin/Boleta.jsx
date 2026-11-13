// Boleta de una orden: /admin/ordenes/:id
// Reutiliza OrderSummary (el mismo resumen que ve el cliente al pagar)
// y agrega lo propio del admin: avanzar el estado del despacho e imprimir.
// - La boleta viene del servicio ventas (GET /api/v1/boletas/{id}).
// - El estado se cambia en el servicio despacho (PATCH /api/v1/despachos/{id}/estado):
//   solo el administrador puede hacerlo y solo hacia adelante (recibido → preparando →
//   en camino → entregado), por eso el selector ofrece únicamente las etapas siguientes.
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import EstadoCarga from "../../components/EstadoCarga.jsx";
import OrderSummary from "../../components/OrderSummary.jsx";
import { textoError } from "../../api/cliente.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { actualizarEstado, estadosSiguientes, obtenerOrden } from "../../data/ordenes.js";
import { useCarga } from "../../hooks/useCarga.js";
import { formatearFecha } from "../../utils/formato.js";
import { claseEstado, clasePago } from "../../utils/estadosOrden.js";

export default function Boleta() {
  const { id } = useParams();
  const { esAdmin } = useAuth();
  const { datos, cargando, error, recargar } = useCarga(() => obtenerOrden(id), [id]);
  // Estado del despacho después de cambiarlo aquí (null = el que trajo la boleta).
  const [estadoNuevo, setEstadoNuevo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [errorEstado, setErrorEstado] = useState("");
  const [guardando, setGuardando] = useState(false);

  if (cargando || error) return <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />;

  if (!datos) {
    return (
      <div className="alert alert-warning" role="status">
        Orden no encontrada. <Link to="/admin/ordenes">Volver a órdenes</Link>
      </div>
    );
  }

  const orden = estadoNuevo ? { ...datos, estado: estadoNuevo } : datos;
  const rechazada = orden.estadoPago !== "pagado";
  const siguientes = estadosSiguientes(orden.estado);

  async function handleEstado(e) {
    const elegido = e.target.value;
    if (!elegido) return;
    setMensaje("");
    setErrorEstado("");
    setGuardando(true);
    try {
      const despacho = await actualizarEstado(orden.id, elegido); // 1) guarda en el backend
      setEstadoNuevo(despacho.estado); // 2) re-render con el nuevo estado
      setMensaje(`Estado actualizado a "${despacho.estado}".`);
    } catch (err) {
      // Ej.: 409 "El pedido ya fue entregado." o 403 si no es administrador.
      setErrorEstado(textoError(err));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      <p className="d-print-none">
        <Link to="/admin/ordenes">← Volver a órdenes</Link>
      </p>

      {mensaje && (
        <div className="alert alert-success d-print-none" role="status">
          {mensaje}
        </div>
      )}
      {errorEstado && (
        <div className="alert alert-danger d-print-none" role="alert">
          {errorEstado}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
            <div>
              <h1 className="h4 mb-1">Boleta {orden.numero}</h1>
              <p className="text-muted mb-0">Fecha: {formatearFecha(orden.fecha)}</p>
            </div>
            <div className="text-md-end">
              <span className={`badge ${clasePago(orden.estadoPago)} me-1`}>
                {orden.estadoPago === "pagado" ? "Pagado" : "Pago rechazado"}
              </span>
              {orden.estado && <span className={`badge ${claseEstado(orden.estado)}`}>{orden.estado}</span>}
            </div>
          </div>

          {rechazada && (
            <div className="alert alert-danger" role="alert">
              El pago de esta orden fue rechazado: no corresponde despacharla.
            </div>
          )}
          {!rechazada && !orden.estado && (
            <div className="alert alert-warning" role="status">
              No pudimos consultar el estado del despacho. Intenta recargar en unos minutos.
            </div>
          )}

          <OrderSummary orden={orden} />

          <div className="row g-2 align-items-end d-print-none">
            <div className="col-sm-6 col-lg-4">
              <label htmlFor="estado-orden" className="form-label">
                Estado del despacho
              </label>
              {/* key: al cambiar de estado el select vuelve a "Avanzar a..." */}
              <select
                key={orden.estado ?? "sin-estado"}
                id="estado-orden"
                className="form-select"
                defaultValue=""
                onChange={handleEstado}
                disabled={rechazada || !esAdmin || siguientes.length === 0 || guardando}
              >
                <option value="">
                  {orden.estado === "entregado" ? "Entregado (final)" : `Actual: ${orden.estado ?? "—"}`}
                </option>
                {siguientes.map((e) => (
                  <option key={e} value={e}>
                    Avanzar a: {e}
                  </option>
                ))}
              </select>
              {!esAdmin && <p className="form-text mb-0">Solo un administrador puede cambiar el estado.</p>}
            </div>
            <div className="col-sm-6 col-lg-8 text-sm-end">
              <button type="button" className="btn btn-outline-secondary" onClick={() => window.print()}>
                Imprimir boleta
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
