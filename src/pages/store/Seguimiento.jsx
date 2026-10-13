// Seguimiento de pedido: /seguimiento
// Migrado de legacy-eval1/store/tracking.html + assets/js/tracking.js.
//
// El cliente escribe el número de su pedido (ej: ORD-000001) y ve en qué
// etapa del despacho va, junto con el resumen de la compra.
// - Las órdenes se leen con listarOrdenes() de src/data/ (nunca localStorage directo).
// - El resumen reutiliza OrderSummary (el mismo que se ve al pagar y en la boleta).
// - La Eval 1 mostraba además un mapa con Leaflet; no se agregó para no sumar
//   librerías externas al proyecto.
import { useState } from "react";
import { Link } from "react-router-dom";
import OrderSummary from "../../components/OrderSummary.jsx";
import { ESTADOS_ORDEN, listarOrdenes } from "../../data/ordenes.js";
import { formatearFecha } from "../../utils/formato.js";

// "en camino" -> "En camino" (para mostrar las etapas con mayúscula inicial).
const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

export default function Seguimiento() {
  // Estado: lo que el usuario escribe en el buscador (input controlado).
  const [numero, setNumero] = useState("");
  // Estado: la orden encontrada (null mientras no se encuentre ninguna).
  const [orden, setOrden] = useState(null);
  // Estado: mensaje de error de la búsqueda ("" = sin error).
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Se normaliza para que " ord-000001 " también funcione.
    const buscado = numero.trim().toUpperCase();

    if (!buscado) {
      setOrden(null);
      setError("Ingresa el número de tu pedido.");
      return;
    }

    const encontrada = listarOrdenes().find((o) => o.numero === buscado) ?? null;
    setOrden(encontrada);
    setError(encontrada ? "" : `Pedido no encontrado. Verifica el número (ej: ORD-000001).`);
  }

  // Posición de la etapa actual en la lista de estados (0 = recibido ... 3 = entregado).
  const etapaActual = orden ? ESTADOS_ORDEN.indexOf(orden.estado) : -1;
  const rechazada = orden?.estadoPago === "rechazado";

  return (
    <section className="container py-5" style={{ maxWidth: 760 }}>
      <h1 className="mb-3">Seguimiento de pedido</h1>
      <p className="text-muted">
        Ingresa el número de pedido que aparece en tu comprobante de compra para ver en qué etapa va tu
        despacho.
      </p>

      <form className="row g-2 mb-4" onSubmit={handleSubmit} noValidate>
        <div className="col-sm-8">
          <label htmlFor="seguimiento-numero" className="visually-hidden">
            Número de pedido
          </label>
          <input
            id="seguimiento-numero"
            className="form-control"
            placeholder="Ej: ORD-000001"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </div>
        <div className="col-sm-4">
          <button type="submit" className="btn btn-primary w-100">
            Buscar
          </button>
        </div>
      </form>

      {/* Renderizado condicional: el error solo aparece si la búsqueda falló. */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {orden && (
        <div className="card shadow-sm">
          <div className="card-body">
            <p className="text-muted small mb-3">Fecha de compra: {formatearFecha(orden.fecha)}</p>

            {rechazada ? (
              // Un pago rechazado también crea una orden, pero esa orden no se despacha.
              <div className="alert alert-danger" role="alert">
                El pago de este pedido fue rechazado, por lo que no será despachado.{" "}
                <Link to="/contacto">Contáctanos</Link> si necesitas ayuda.
              </div>
            ) : (
              // Línea de tiempo: se pintan en azul las etapas ya alcanzadas (igual que en la Eval 1).
              <ol className="list-unstyled d-flex flex-wrap gap-2 mb-4" aria-label="Estado del pedido">
                {ESTADOS_ORDEN.map((estado, i) => (
                  <li key={estado}>
                    <span
                      className={`badge p-2 ${i <= etapaActual ? "text-bg-primary" : "text-bg-secondary"}`}
                      aria-current={i === etapaActual ? "step" : undefined}
                    >
                      {capitalizar(estado)}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            <OrderSummary orden={orden} />
          </div>
        </div>
      )}
    </section>
  );
}
