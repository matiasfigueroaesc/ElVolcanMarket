// Layout del panel: solo entra un usuario logueado con tipo "administrador".
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AdminSidebar from "../components/AdminSidebar.jsx";

export default function AdminLayout() {
  const { usuario, esAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!esAdmin) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  function handleLogout() {
    logout();
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
