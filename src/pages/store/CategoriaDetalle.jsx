import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { obtenerCategoriaPorSlug } from "../../data/categorias.js";
import { listarPorCategoria } from "../../data/productos.js";
import { useCarga } from "../../hooks/useCarga.js";
import EstadoCarga from "../../components/EstadoCarga.jsx";
import ProductList from "../../components/ProductList.jsx";

// Primero se busca la categoría por su slug y, si existe, se piden sus productos.
async function cargarCategoria(slug) {
  const categoria = await obtenerCategoriaPorSlug(slug);
  const productos = categoria ? await listarPorCategoria(categoria.id) : [];
  return { categoria, productos };
}

export default function CategoriaDetalle() {
  const { slug } = useParams();
  const { agregar } = useCart();
  const { datos, cargando, error, recargar } = useCarga(() => cargarCategoria(slug), [slug]);

  if (cargando || error) {
    return (
      <section className="container py-5">
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      </section>
    );
  }

  const { categoria, productos } = datos;

  if (!categoria) {
    return (
      <section className="container py-5">
        <div className="alert alert-warning">Categoría no encontrada.</div>
        <Link to="/categorias" className="btn btn-primary">Ver categorías</Link>
      </section>
    );
  }

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

      <ProductList productos={productos} categorias={[categoria]} onAgregar={(p) => agregar(p, 1)} />
    </section>
  );
}
