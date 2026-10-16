import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import LoginForm from "../../components/LoginForm.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogin(correo, password) {
    const ok = login(correo, password);
    if (ok) navigate(location.state?.desde ?? "/");
    return ok;
  }

  return (
    <section className="container py-5" style={{ maxWidth: 480 }}>
      <h1 className="h2 mb-4">Iniciar sesión</h1>
      <div className="card shadow-sm login-card">
        <div className="card-body">
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
      <p className="mt-3 text-center">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </section>
  );
}
