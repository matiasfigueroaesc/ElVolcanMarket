import { Link } from "react-router-dom";
import EstadoCarga from "../../components/EstadoCarga.jsx";
import { useOrdenDelPago } from "../../hooks/useOrdenDelPago.js";
import OrderSummary from "../../components/OrderSummary.jsx";

export default function PagoError() {
  const { datos: orden, cargando, error, recargar } = useOrdenDelPago();

  if (cargando || error) {
    return (
      <section className="container py-5">
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      </section>
    );
  }

  if (!orden) {
    return (
      <section className="container py-5">
        <div className="alert alert-warning">Orden no encontrada.</div>
        <Link to="/carrito" className="btn btn-primary">Volver al carrito</Link>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="alert alert-danger">
        <h1 className="h4 mb-1">No pudimos procesar tu pago</h1>
        <p className="mb-0">
          Tu pago fue rechazado. Tu carrito se mantiene para que puedas intentarlo de nuevo.
        </p>
      </div>

      <OrderSummary orden={orden} />

      <div className="d-flex gap-2 mt-3">
        <Link to="/checkout" className="btn btn-primary">Volver a realizar el pago</Link>
        <Link to="/carrito" className="btn btn-outline-secondary">Ver carrito</Link>
      </div>
    </section>
  );
}