import { useCart } from "../../context/CartContext.jsx";
import { listarOfertas } from "../../data/productos.js";
import ProductList from "../../components/ProductList.jsx";

export default function Ofertas() {
  const { agregar } = useCart();
  const ofertas = listarOfertas();

  return (
    <section className="container py-5">
      <h1 className="h3 mb-2">Ofertas</h1>
      <p className="text-muted mb-4">Aprovecha estos precios especiales mientras duren.</p>

      {ofertas.length === 0 ? (
        <div className="alert alert-info">No hay ofertas disponibles por ahora.</div>
      ) : (
        <ProductList productos={ofertas} onAgregar={(p) => agregar(p, 1)} />
      )}
    </section>
  );
}