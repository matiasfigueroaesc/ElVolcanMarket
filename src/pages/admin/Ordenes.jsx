// Listado de órdenes: /admin/ordenes
import { useState } from "react";
import OrderTable from "../../components/OrderTable.jsx";
import { ESTADOS_ORDEN, listarOrdenes } from "../../data/ordenes.js";
import { formatearCLP } from "../../utils/formato.js";

export default function Ordenes() {
  // Las órdenes solo se leen aquí (no se eliminan), así que basta con leerlas una vez.
  const [ordenes] = useState(() => listarOrdenes());
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");
  // Los pagos rechazados también crean una orden (el checkout la guarda para poder reintentar).
  // Por defecto se ocultan para que no se confundan con pedidos reales.
  const [verRechazadas, setVerRechazadas] = useState(false);

  // Valor derivado: se recalcula en cada render a partir de los filtros.
  const texto = busqueda.trim().toLowerCase();
  const filtradas = ordenes
    .filter((o) => verRechazadas || o.estadoPago === "pagado")
    .filter((o) => estado === "" || o.estado === estado)
    .filter((o) =>
      `${o.numero} ${o.cliente.nombre} ${o.cliente.apellidos} ${o.cliente.correo}`.toLowerCase().includes(texto)
    )
    // Las más nuevas primero.
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const totalVendido = filtradas.filter((o) => o.estadoPago === "pagado").reduce((acc, o) => acc + o.total, 0);

  return (
    <div>
      <h1>Órdenes</h1>
      <p className="text-muted">Compras realizadas en la tienda y su estado de despacho.</p>

      <div className="row g-2 mb-3">
        <div className="col-md-5">
          <label htmlFor="buscar-orden" className="visually-hidden">
            Buscar orden
          </label>
          <input
            id="buscar-orden"
            type="search"
            className="form-control"
            placeholder="Buscar por N° de orden, cliente o correo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="filtro-estado" className="visually-hidden">
            Filtrar por estado
          </label>
          <select id="filtro-estado" className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {ESTADOS_ORDEN.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3 d-flex align-items-center">
          <div className="form-check">
            <input
              id="ver-rechazadas"
              type="checkbox"
              className="form-check-input"
              checked={verRechazadas}
              onChange={(e) => setVerRechazadas(e.target.checked)}
            />
            <label htmlFor="ver-rechazadas" className="form-check-label">
              Ver pagos rechazados
            </label>
          </div>
        </div>
      </div>

      <p className="small">
        Mostrando {filtradas.length} orden(es) · Total vendido: <strong>{formatearCLP(totalVendido)}</strong>
      </p>

      <OrderTable ordenes={filtradas} />
    </div>
  );
}
