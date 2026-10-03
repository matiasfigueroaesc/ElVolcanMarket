import { Link, useParams } from "react-router-dom";
import { obtenerOrden } from "../../data/ordenes.js";
import OrderSummary from "../../components/OrderSummary.jsx";

export default function PagoExitoso() {
  const { ordenId } = useParams();
  const orden = obtenerOrden(Number(ordenId));

  if (!orden) {
    return (
      <section className="container py-5">
        <div className="alert alert-warning">Orden no encontrada.</div>
        <Link to="/productos" className="btn btn-primary">Ir a productos</Link>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="alert alert-success">
        <h1 className="h4 mb-1">¡Pago realizado con éxito!</h1>
        <p className="mb-0">
          Gracias por tu compra. Tu pedido será despachado a la dirección indicada.
        </p>
      </div>

      <OrderSummary orden={orden} />

      <div className="d-flex gap-2 mt-3 d-print-none">
        <button type="button" className="btn btn-outline-secondary" onClick={() => window.print()}>
          Imprimir
        </button>
        <Link to="/productos" className="btn btn-primary">Seguir comprando</Link>
      </div>
    </section>
  );
}