import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatearCLP } from "../utils/formato.js";

export const STORE_NAV_ITEMS = [
  { label: "Inicio", to: "/" },
  { label: "Productos", to: "/productos" },
  { label: "Categorías", to: "/categorias" },
  { label: "Ofertas", to: "/ofertas" },
  { label: "Nosotros", to: "/nosotros" },
  { label: "Blog", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
];

export default function StoreNavbar() {
  const { usuario, esAdmin, logout } = useAuth();
  const { unidades, total } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav id="store-navbar" className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/img/EVG_Horizontal.svg" alt="El Volcán Market" height="36" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#storeNavCollapse"
          aria-controls="storeNavCollapse"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="storeNavCollapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {STORE_NAV_ITEMS.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink className="nav-link text-nowrap" to={item.to} end={item.to === "/"}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex flex-wrap flex-xl-nowrap align-items-center gap-2">
            {usuario ? (
              <>
                <span className="navbar-text text-nowrap d-lg-none d-xxl-inline">Hola, {usuario.nombre}</span>
                {esAdmin && (
                  <Link to="/admin" className="btn btn-dark btn-sm text-nowrap">
                    Panel admin
                  </Link>
                )}
                <button type="button" className="btn btn-outline-secondary btn-sm text-nowrap" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-secondary btn-sm text-nowrap">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="btn btn-outline-primary btn-sm text-nowrap">
                  Crear cuenta
                </Link>
              </>
            )}
            <Link to="/carrito" className="btn btn-primary btn-sm text-nowrap">
              🛒 Carrito {formatearCLP(total)}{" "}
              <span className="badge text-bg-light" data-testid="cart-count">
                {unidades}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
