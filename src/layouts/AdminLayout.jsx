// Layout del panel. Entran el administrador (acceso total) y el vendedor (solo consulta
// de órdenes y productos). Mientras se recupera la sesión al recargar (cookie del
// refresh) se muestra "Cargando..." en vez de mandar al login antes de tiempo.
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AdminSidebar from "../components/AdminSidebar.jsx";
import EstadoCarga from "../components/EstadoCarga.jsx";
import { ADMIN_NAV_ITEMS, INICIO_VENDEDOR, VENDEDOR_NAV_ITEMS, vendedorPuedeVer } from "../utils/permisos.js";

export default function AdminLayout() {
  const { usuario, esAdmin, esVendedor, cargandoSesion, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (cargandoSesion) {
    return (
      <main className="container py-5">
        <EstadoCarga cargando />
      </main>
    );
  }

  // Sin sesión o con sesión de cliente: al login (y después vuelve a esta página).
  if (!esAdmin && !esVendedor) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  // El vendedor solo ve órdenes y productos. Si escribe otra URL del panel a mano
  // (dashboard, usuarios, formularios...), vuelve a Órdenes.
  if (esVendedor && !vendedorPuedeVer(location.pathname)) {
    return <Navigate to={INICIO_VENDEDOR} replace />;
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="admin-layout d-flex flex-column flex-md-row min-vh-100">
      <AdminSidebar
        usuario={usuario}
        onLogout={handleLogout}
        items={esAdmin ? ADMIN_NAV_ITEMS : VENDEDOR_NAV_ITEMS}
      />
      <main className="flex-grow-1 bg-light p-3 p-md-4">
        {/* soloLectura: las páginas ocultan los botones de crear, editar y eliminar. */}
        <Outlet context={{ soloLectura: !esAdmin }} />
      </main>
    </div>
  );
}
