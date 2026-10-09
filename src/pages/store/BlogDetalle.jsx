import { Link, useParams } from "react-router-dom";
import { obtenerArticulo } from "../../utils/blog.js";

export default function BlogDetalle() {
  const { id } = useParams(); // siempre llega como string
  const articulo = obtenerArticulo(id);

  if (!articulo) {
    return (
      <section className="container py-5" style={{ maxWidth: 760 }}>
        <div className="alert alert-warning" role="alert">
          Artículo no encontrado.
        </div>
        <Link to="/blog" className="btn btn-outline-secondary btn-sm">
          &larr; Volver al blog
        </Link>
      </section>
    );
  }

  return (
    <section className="container py-5" style={{ maxWidth: 760 }}>
      <Link to="/blog" className="btn btn-outline-secondary btn-sm mb-4">
        &larr; Volver al blog
      </Link>

      <h1 className="mb-3">{articulo.titulo}</h1>
      <div className="text-muted small mb-4">
        <span>Publicado el {articulo.fecha}</span> · <span>Por: {articulo.autor}</span>
      </div>

      <img src={articulo.imagen} className="img-fluid rounded mb-4" alt={articulo.alt} />

      <article>
        <p>{articulo.introduccion}</p>
        {articulo.secciones.map((s) => (
          <div key={s.titulo}>
            <h2 className="h5 mt-4">{s.titulo}</h2>
            <p>{s.texto}</p>
          </div>
        ))}
      </article>
    </section>
  );
}
