import { Link, useParams } from "react-router-dom";
import { obtenerOrden } from "../../data/ordenes.js";
import OrderSummary from "../../components/OrderSummary.jsx";

export default function PagoError() {
  const { ordenId } = useParams();
  const orden = obtenerOrden(Number(ordenId));

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