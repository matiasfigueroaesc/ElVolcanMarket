import { Link } from "react-router-dom";

export default function NoEncontrado() {
  return (
    <section className="container py-5 text-center">
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe o fue movida.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </section>
  );
}
