// Seguimiento de pedido: /seguimiento
// Migrado de legacy-eval1/store/tracking.html + assets/js/tracking.js.
//
// El cliente escribe el número de su pedido (ej: ORD-000001) y ve en qué
// etapa del despacho va. Desde la Eval 3 lo responde el servicio despacho
// (GET /api/v1/despachos/seguimiento/{numero}), que es público: por eso solo
// entrega el estado, la zona y el historial, nunca los datos del comprador
// ni los productos (cualquiera que adivine un número podría verlos).
// - La Eval 1 mostraba además un mapa con Leaflet; no se agregó para no sumar
//   librerías externas al proyecto.
import { useState } from "react";
import { Link } from "react-router-dom";
import { textoError } from "../../api/cliente.js";
import { ESTADOS_ORDEN, seguimientoPedido } from "../../data/ordenes.js";
import { nombreEntrega } from "../../utils/entrega.js";
import { formatearFecha } from "../../utils/formato.js";

// "en camino" -> "En camino" (para mostrar las etapas con mayúscula inicial).
const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

export default function Seguimiento() {
  // Estado: lo que el usuario escribe en el buscador (input controlado).
  const [numero, setNumero] = useState("");
  // Estado: el seguimiento encontrado (null mientras no se encuentre ninguno).
  const [pedido, setPedido] = useState(null);
  // Estado: mensaje de error de la búsqueda ("" = sin error).
  const [error, setError] = useState("");
  const [buscando, setBuscando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    // Se normaliza para que " ord-000001 " también funcione.
    const buscado = numero.trim().toUpperCase();

    if (!buscado) {
      setPedido(null);
      setError("Ingresa el número de tu pedido.");
      return;
    }

    setBuscando(true);
    try {
      const encontrado = await seguimientoPedido(buscado);
      setPedido(encontrado);
      // Un pago rechazado no se despacha, así que tampoco aparece aquí.
      setError(encontrado ? "" : "Pedido no encontrado. Verifica el número (ej: ORD-000001).");
    } catch (err) {
      setPedido(null);
      setError(textoError(err));
    } finally {
      setBuscando(false);
    }
  }

  // Posición de la etapa actual en la lista de estados (0 = recibido ... 3 = entregado).
  const etapas = pedido?.etapas?.length ? pedido.etapas : ESTADOS_ORDEN;
  const etapaActual = pedido ? etapas.indexOf(pedido.estado) : -1;

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
          <button type="submit" className="btn btn-primary w-100" disabled={buscando}>
            {buscando ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </form>

      {/* Renderizado condicional: el error solo aparece si la búsqueda falló. */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {pedido && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h5">Pedido {pedido.numero}</h2>
            <p className="text-muted small mb-3">
              {[
                nombreEntrega(pedido.entrega),
                pedido.zona,
                pedido.tiempo && `tiempo estimado: ${pedido.tiempo}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>

            {/* Línea de tiempo: se pintan en azul las etapas ya alcanzadas (igual que en la Eval 1). */}
            <ol className="list-unstyled d-flex flex-wrap gap-2 mb-4" aria-label="Estado del pedido">
              {etapas.map((estado, i) => (
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

            {pedido.historial?.length > 0 && (
              <>
                <h3 className="h6">Historial</h3>
                <ul className="list-unstyled small mb-0">
                  {pedido.historial.map((h) => (
                    <li key={`${h.estado}-${h.fecha}`}>
                      <strong>{capitalizar(h.estado)}</strong>: {formatearFecha(h.fecha)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      <p className="mt-4 small text-muted">
        ¿El pago de tu pedido fue rechazado? Esos pedidos no se despachan: puedes{" "}
        <Link to="/carrito">volver a intentarlo</Link> o <Link to="/contacto">contactarnos</Link>.
      </p>
    </section>
  );
}
