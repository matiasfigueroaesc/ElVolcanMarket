// Reportes de ventas: /admin/reportes
// Vista nueva de la Eval 2: ventas totales, por producto, por categoría y más vendidos,
// con filtro por período. Los cálculos están en utils/reportes.js (funciones puras);
// esta página solo lee los datos, guarda los filtros en el estado y dibuja.
import { useState } from "react";
import StatCard from "../../components/StatCard.jsx";
import { obtenerCategoria } from "../../data/categorias.js";
import { listarOrdenes } from "../../data/ordenes.js";
import { obtenerProducto } from "../../data/productos.js";
import { formatearCLP } from "../../utils/formato.js";
import { ordenesPagadas, resumenVentas, ventasPorCategoria, ventasPorProducto } from "../../utils/reportes.js";

// Nombre de la categoría de un producto vendido. La orden solo guarda el id del producto,
// así que se busca el producto y luego su categoría. Se usa ?. porque el producto (o la
// categoría) pudo eliminarse después de la venta.
function categoriaDe(idProducto) {
  return obtenerCategoria(obtenerProducto(idProducto)?.categoriaId)?.nombre ?? "Sin categoría";
}

// Porcentaje con un decimal: 0.8166 -> "81,7 %"
const porcentaje = (parte, total) =>
  `${(total ? (parte / total) * 100 : 0).toLocaleString("es-CL", { maximumFractionDigits: 1 })} %`;

export default function Reportes() {
  // Las órdenes solo se leen (no se modifican aquí): basta con leerlas una vez.
  const [ordenes] = useState(() => listarOrdenes());
  // Estado: filtros de período ("" = sin límite).
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const rangoInvalido = desde !== "" && hasta !== "" && desde > hasta;

  // Valores derivados: se recalculan en cada render a partir de los filtros.
  const pagadas = rangoInvalido ? [] : ordenesPagadas(ordenes, { desde, hasta });
  const resumen = resumenVentas(pagadas);
  const porProducto = ventasPorProducto(pagadas);
  const porCategoria = ventasPorCategoria(pagadas, categoriaDe);
  const masVendidos = porProducto.slice(0, 5);

  function limpiarFiltros() {
    setDesde("");
    setHasta("");
  }

  return (
    <div>
      <h1>Reportes</h1>
      <p className="text-muted">Ventas de la tienda (solo órdenes con pago aprobado).</p>

      <div className="row g-2 align-items-end mb-3">
        <div className="col-6 col-md-3">
          <label htmlFor="reporte-desde" className="form-label">
            Desde
          </label>
          <input
            id="reporte-desde"
            type="date"
            className="form-control"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-3">
          <label htmlFor="reporte-hasta" className="form-label">
            Hasta
          </label>
          <input
            id="reporte-hasta"
            type="date"
            className="form-control"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button type="button" className="btn btn-outline-secondary" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      </div>

      {rangoInvalido && (
        <div className="alert alert-warning" role="alert">
          La fecha "Desde" no puede ser posterior a la fecha "Hasta".
        </div>
      )}

      <section className="row g-3 mb-4" aria-label="Resumen de ventas">
        <div className="col-sm-6 col-xl-3">
          <StatCard titulo="Ventas totales" valor={formatearCLP(resumen.total)} color="primary" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard titulo="Órdenes pagadas" valor={resumen.cantidad} color="success" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard titulo="Ticket promedio" valor={formatearCLP(resumen.promedio)} color="warning" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard titulo="Unidades vendidas" valor={resumen.unidades} color="danger" />
        </div>
      </section>

      {/* Renderizado condicional: sin ventas no se muestran tablas vacías. */}
      {pagadas.length === 0 ? (
        !rangoInvalido && (
          <p className="alert alert-info" role="status">
            No hay ventas pagadas en el período seleccionado.
          </p>
        )
      ) : (
        <div className="row g-4">
          <section className="col-lg-4" aria-labelledby="titulo-mas-vendidos">
            <h2 id="titulo-mas-vendidos" className="h5">
              Más vendidos
            </h2>
            <ol className="list-group list-group-numbered">
              {masVendidos.map((p) => (
                <li key={p.id} className="list-group-item d-flex justify-content-between gap-2">
                  <span className="me-auto">{p.nombre}</span>
                  <span className="badge text-bg-primary align-self-center">{p.unidades} u.</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="col-lg-8" aria-labelledby="titulo-por-producto">
            <h2 id="titulo-por-producto" className="h5">
              Ventas por producto
            </h2>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-end">Unidades</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {porProducto.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td className="text-end">{p.unidades}</td>
                      <td className="text-end">{formatearCLP(p.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="col-12" aria-labelledby="titulo-por-categoria">
            <h2 id="titulo-por-categoria" className="h5">
              Ventas por categoría
            </h2>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th className="text-end">Unidades</th>
                    <th className="text-end">Total</th>
                    <th className="text-end">% de las ventas</th>
                  </tr>
                </thead>
                <tbody>
                  {porCategoria.map((c) => (
                    <tr key={c.categoria}>
                      <td>{c.categoria}</td>
                      <td className="text-end">{c.unidades}</td>
                      <td className="text-end">{formatearCLP(c.total)}</td>
                      <td className="text-end">{porcentaje(c.total, resumen.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
