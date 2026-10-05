import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import CartTable from "../../components/CartTable.jsx";
import { formatearCLP } from "../../utils/formato.js";

export default function Carrito() {
  const { items, total, cambiarCantidad, quitar, vaciar } = useCart();

  if (items.length === 0) {
    return (
      <section className="container py-5">
        <h1 className="h3 mb-4">Tu carrito de pedidos</h1>
        <div className="alert alert-info">Tu carrito está vacío.</div>
        <Link to="/productos" className="btn btn-primary">Ver productos</Link>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <h1 className="h3 mb-4">Tu carrito de pedidos</h1>

      <div className="table-responsive">
        <CartTable items={items} onCambiar={cambiarCantidad} onQuitar={quitar} />
      </div>

      <p className="text-end fs-5">
        Total: <strong>{formatearCLP(total)}</strong>
      </p>

      <div className="d-flex flex-wrap gap-2 justify-content-end">
        <Link to="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
        <button type="button" className="btn btn-outline-danger" onClick={vaciar}>
          Limpiar carrito
        </button>
        <Link to="/checkout" className="btn btn-primary">Comprar ahora</Link>
      </div>
    </section>
  );
}