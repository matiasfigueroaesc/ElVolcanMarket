import ProductCard from "./ProductCard.jsx";

export default function ProductList({ productos, onAgregar }) {
  if (productos.length === 0) {
    return <p className="alert alert-info">No hay productos para mostrar.</p>;
  }
  return (
    <div className="row g-4">
      {productos.map((p) => (
        <div key={p.id} className="col-sm-6 col-lg-4">
          <ProductCard producto={p} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}