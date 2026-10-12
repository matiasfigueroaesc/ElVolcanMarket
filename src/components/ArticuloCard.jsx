import { Link } from "react-router-dom";

// Tarjeta de un artículo en el listado del blog. Recibe el artículo por props.
export default function ArticuloCard({ articulo }) {
  return (
    <div className="card h-100">
      <img src={articulo.imagen} className="card-img-top" alt={articulo.alt} />
      <div className="card-body">
        <span className="text-muted small">{articulo.fecha}</span>
        <h2 className="h5 mt-2">{articulo.titulo}</h2>
        <p className="card-text text-muted">{articulo.resumen}</p>
        <Link to={`/blog/${articulo.id}`} className="btn btn-primary btn-sm">
          Leer artículo
        </Link>
      </div>
    </div>
  );
}
