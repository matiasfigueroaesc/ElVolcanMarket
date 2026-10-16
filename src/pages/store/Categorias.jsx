import { Link } from "react-router-dom";
import { listarCategorias } from "../../data/categorias.js";

export default function Categorias() {
  const categorias = listarCategorias();

  return (
    <section className="container py-5">
      <h1 className="h3 mb-4">Categorías</h1>
      <div className="row g-4">
        {categorias.map((c) => (
          <div key={c.id} className="col-6 col-lg-3">
            <Link to={`/categorias/${c.slug}`} className="text-decoration-none">
              <div className="card h-100 shadow-sm text-center">
                <img src={c.imagen} className="card-img-top p-3" alt={c.nombre} />
                <div className="card-body">
                  <h2 className="h6">{c.nombre}</h2>
                  <p className="card-text small text-muted mb-0">{c.descripcion}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}