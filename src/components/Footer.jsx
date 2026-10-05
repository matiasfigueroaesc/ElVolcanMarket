import { Link } from "react-router-dom";

const ANIO_ACTUAL = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between gap-3">
        <div>
          <p className="mb-1">© {ANIO_ACTUAL} Distribuidora de Gas El Volcán — Chillán</p>
          <p className="mb-0 text-white-50">Despacho a domicilio en la Región de Ñuble</p>
        </div>
        <nav aria-label="Enlaces del pie de página">
          <ul className="list-unstyled mb-0 d-flex flex-column flex-sm-row gap-2 gap-sm-4">
            <li>
              <Link to="/zonas-despacho" className="link-light">
                Zonas de despacho
              </Link>
            </li>
            <li>
              <Link to="/seguimiento" className="link-light">
                Seguimiento de pedido
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="link-light">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
