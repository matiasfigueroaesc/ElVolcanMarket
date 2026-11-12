// Layout del panel: solo entra un usuario logueado con tipo "administrador".
// Mientras se recupera la sesión al recargar (cookie del refresh) se muestra
// "Cargando..." en vez de mandar al login antes de tiempo.
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AdminSidebar from "../components/AdminSidebar.jsx";
import EstadoCarga from "../components/EstadoCarga.jsx";

export default function AdminLayout() {
  const { usuario, esAdmin, cargandoSesion, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (cargandoSesion) {
    return (
      <main className="container py-5">
        <EstadoCarga cargando />
      </main>
    );
  }

  if (!esAdmin) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="admin-layout d-flex flex-column flex-md-row min-vh-100">
      <AdminSidebar usuario={usuario} onLogout={handleLogout} />
      <main className="flex-grow-1 bg-light p-3 p-md-4">
        <Outlet />
      </main>
    </div>
  );
}
