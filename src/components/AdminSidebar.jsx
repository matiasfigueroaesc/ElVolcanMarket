import { Link, NavLink } from "react-router-dom";
import { ADMIN_NAV_ITEMS } from "../utils/permisos.js";

// En escritorio es una barra lateral fija; en celular el menú se pliega bajo un botón.
// items: opciones del menú según el rol (por defecto, las del administrador).
export default function AdminSidebar({ usuario, onLogout, items = ADMIN_NAV_ITEMS }) {
  return (
    <aside className="admin-sidebar bg-dark text-white p-3 d-print-none">
      <div className="d-flex align-items-center justify-content-between mb-md-4">
        <Link to="/admin">
          <img src="/img/EVG_Horizontal.svg" alt="El Volcán Market" height="32" className="admin-logo" />
        </Link>
        <button
          className="btn btn-outline-light btn-sm d-md-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminMenu"
          aria-controls="adminMenu"
          aria-expanded="false"
        >
          ☰ Menú
        </button>
      </div>
      <div className="collapse d-md-flex flex-column admin-menu" id="adminMenu">
        <nav aria-label="Menú administrador" className="mt-3 mt-md-0">
          <ul className="nav nav-pills flex-column gap-1">
            {items.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink to={item.to} end={item.to === "/admin"} className="nav-link text-white">
                  <span aria-hidden="true">{item.icono}</span> {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-4 d-grid gap-2">
          {usuario && <small className="text-white-50 text-truncate">{usuario.correo}</small>}
          <Link to="/" className="btn btn-outline-light btn-sm">
            Ver tienda
          </Link>
          <button type="button" className="btn btn-danger btn-sm" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
