import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { obtenerCategoriaPorSlug } from "../../data/categorias.js";
import { listarPorCategoria } from "../../data/productos.js";
import ProductList from "../../components/ProductList.jsx";

export default function CategoriaDetalle() {
  const { slug } = useParams();
  const categoria = obtenerCategoriaPorSlug(slug);
  const { agregar } = useCart();

  if (!categoria) {
    return (
      <section className="container py-5">
        <div className="alert alert-warning">Categoría no encontrada.</div>
        <Link to="/categorias" className="btn btn-primary">Ver categorías</Link>
      </section>
    );
  }

  const productos = listarPorCategoria(categoria.id);

  return (
    <section className="container py-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/categorias">Categorías</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{categoria.nombre}</li>
        </ol>
      </nav>

      <h1 className="h3">{categoria.nombre}</h1>
      <p className="text-muted mb-4">{categoria.descripcion}</p>

      <ProductList productos={productos} onAgregar={(p) => agregar(p, 1)} />
    </section>
  );
}