// Boleta de una orden: /admin/ordenes/:id
// Reutiliza OrderSummary (el mismo resumen que ve el cliente al pagar)
// y agrega lo propio del admin: cambiar el estado del despacho e imprimir.
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import OrderSummary from "../../components/OrderSummary.jsx";
import { ESTADOS_ORDEN, actualizarEstado, obtenerOrden } from "../../data/ordenes.js";
import { formatearFecha } from "../../utils/formato.js";
import { claseEstado, clasePago } from "../../utils/estadosOrden.js";

export default function Boleta() {
  const { id } = useParams();
  // La orden es estado porque cambia cuando el admin actualiza su estado.
  const [orden, setOrden] = useState(() => obtenerOrden(id));
  const [mensaje, setMensaje] = useState("");

  if (!orden) {
    return (
      <div className="alert alert-warning" role="status">
        Orden no encontrada. <Link to="/admin/ordenes">Volver a órdenes</Link>
      </div>
    );
  }

  function handleEstado(e) {
    const actualizada = actualizarEstado(orden.id, e.target.value); // 1) guarda
    setOrden(actualizada); // 2) re-render con el nuevo estado
    setMensaje(`Estado actualizado a "${actualizada.estado}".`);
  }

  const rechazada = orden.estadoPago !== "pagado";

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

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
            <div>
              <h1 className="h4 mb-1">Boleta {orden.numero}</h1>
              <p className="text-muted mb-0">Fecha: {formatearFecha(orden.fecha)}</p>
            </div>
            <div className="text-md-end">
              <span className={`badge ${clasePago(orden.estadoPago)} me-1`}>Pago {orden.estadoPago}</span>
              <span className={`badge ${claseEstado(orden.estado)}`}>{orden.estado}</span>
            </div>
          </div>

          {rechazada && (
            <div className="alert alert-danger" role="alert">
              El pago de esta orden fue rechazado: no corresponde despacharla.
            </div>
          )}

          <OrderSummary orden={orden} />

          <div className="row g-2 align-items-end d-print-none">
            <div className="col-sm-6 col-lg-4">
              <label htmlFor="estado-orden" className="form-label">
                Estado del despacho
              </label>
              <select
                id="estado-orden"
                className="form-select"
                value={orden.estado}
                onChange={handleEstado}
                disabled={rechazada}
              >
                {ESTADOS_ORDEN.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
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
