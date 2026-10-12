import ArticuloCard from "../../components/ArticuloCard.jsx";
import { ARTICULOS } from "../../utils/blog.js";

export default function Blog() {
  return (
    <section className="container py-5">
      <h1 className="mb-3">Blog de noticias y consejos</h1>
      <p className="text-muted mb-4">
        Descubre consejos de seguridad, uso eficiente de cilindros de gas licuado y novedades de
        Distribuidora El Volcán.
      </p>

      <div className="row g-4">
        {ARTICULOS.map((a) => (
          <div className="col-md-6" key={a.id}>
            <ArticuloCard articulo={a} />
          </div>
        ))}
      </div>
    </section>
  );
}
