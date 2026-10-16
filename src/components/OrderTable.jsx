// Tabla de órdenes del panel admin. Solo dibuja lo que recibe por props.
import { Link } from "react-router-dom";
import { formatearCLP, formatearFecha } from "../utils/formato.js";
import { claseEstado, clasePago } from "../utils/estadosOrden.js";

export default function OrderTable({ ordenes }) {
  if (ordenes.length === 0) {
    return (
      <p className="alert alert-info" role="status">
        No hay órdenes que mostrar.
      </p>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>N° orden</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th className="text-end">Total</th>
            <th>Pago</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.id}>
              <td>{o.numero}</td>
              <td>{formatearFecha(o.fecha)}</td>
              <td>
                {o.cliente.nombre} {o.cliente.apellidos}
              </td>
              <td className="text-end">{formatearCLP(o.total)}</td>
              <td>
                <span className={`badge ${clasePago(o.estadoPago)}`}>{o.estadoPago}</span>
              </td>
              <td>
                <span className={`badge ${claseEstado(o.estado)}`}>{o.estado}</span>
              </td>
              <td>
                <Link
                  to={`/admin/ordenes/${o.id}`}
                  className="btn btn-sm btn-outline-primary text-nowrap"
                  aria-label={`Ver boleta ${o.numero}`}
                >
                  Ver boleta
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
