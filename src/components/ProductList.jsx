import { categoriaPorId } from "../data/categorias.js";
import ProductCard from "./ProductCard.jsx";

// categorias (opcional): lista ya cargada, para mostrar el nombre de la categoría en cada tarjeta.
export default function ProductList({ productos, categorias = [], onAgregar, encabezado }) {
  if (productos.length === 0) {
    return <p className="alert alert-info">No hay productos para mostrar.</p>;
  }
  return (
    <div className="row g-4">
      {productos.map((p) => (
        <div key={p.id} className="col-sm-6 col-lg-4">
          <ProductCard
            producto={p}
            categoria={categoriaPorId(categorias, p.categoriaId)}
            onAgregar={onAgregar}
            encabezado={encabezado}
          />
        </div>
      ))}
    </div>
  );
}
