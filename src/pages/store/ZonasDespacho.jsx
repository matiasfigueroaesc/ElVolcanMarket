// Zonas de despacho: /zonas-despacho
// Migrado de legacy-eval1/store/delivery-zones.html.
// La tabla se arma desde el arreglo ZONAS_DESPACHO (utils/zonasDespacho.js) con .map(),
// y se agrega un selector para que el cliente revise si llegamos a su comuna.
import { useState } from "react";
import { Link } from "react-router-dom";
import { comunasDe, nombreComuna, nombreRegion } from "../../data/regiones.js";
import { REGION_DESPACHO, ZONAS_DESPACHO, textoCobertura, zonasDeComuna } from "../../utils/zonasDespacho.js";

export default function ZonasDespacho() {
  // Estado: comuna elegida en el selector ("" = todavía no elige).
  const [comuna, setComuna] = useState("");

  // Valor derivado: se recalcula en cada render a partir de la comuna elegida.
  const zonasDeLaComuna = comuna ? zonasDeComuna(comuna) : [];

  return (
    <section className="container py-5">
      <h1 className="mb-3">Zonas de despacho</h1>
      <p className="text-muted mb-4">
        Estas son las comunas y sectores de la {nombreRegion(REGION_DESPACHO)} que actualmente están dentro de
        nuestra cobertura real de reparto.
      </p>

      <div className="card shadow-sm mb-4" style={{ maxWidth: 560 }}>
        <div className="card-body">
          <h2 className="h5">¿Llegamos a tu comuna?</h2>
          <label htmlFor="zona-comuna" className="form-label">
            Comuna
          </label>
          <select id="zona-comuna" className="form-select" value={comuna} onChange={(e) => setComuna(e.target.value)}>
            <option value="">-- Selecciona tu comuna --</option>
            {comunasDe(REGION_DESPACHO).map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Renderizado condicional: el resultado aparece solo después de elegir una comuna. */}
          {comuna && (
            <div className="alert alert-success mt-3 mb-0" role="status">
              <p className="mb-1">
                Sí, despachamos a <strong>{nombreComuna(REGION_DESPACHO, comuna)}</strong>:
              </p>
              <ul className="mb-0">
                {zonasDeLaComuna.map((z) => (
                  <li key={z.id}>
                    {z.nombre}: {z.dias}, {z.horario} (entrega en {z.tiempo})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">Zona</th>
              <th scope="col">Comunas cubiertas</th>
              <th scope="col">Días de despacho</th>
              <th scope="col">Horario</th>
              <th scope="col">Tiempo estimado de entrega</th>
            </tr>
          </thead>
          <tbody>
            {ZONAS_DESPACHO.map((z) => (
              <tr key={z.id}>
                <td className="fw-semibold">{z.nombre}</td>
                <td>{textoCobertura(z)}</td>
                <td>{z.dias}</td>
                <td>{z.horario}</td>
                <td>{z.tiempo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3">
        ¿Ya hiciste un pedido? <Link to="/seguimiento">Revisa en qué etapa va</Link> o{" "}
        <Link to="/productos">sigue comprando</Link>.
      </p>
    </section>
  );
}
