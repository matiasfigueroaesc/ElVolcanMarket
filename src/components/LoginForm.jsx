// Formulario de inicio de sesión (controlado).
// Recibe onLogin(correo, password) -> boolean y muestra un error solo si falla.
// TODO (I3): sumar las validaciones de la Eval 1 (utils/validaciones.js).
import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!correo.trim() || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    const ok = onLogin(correo, password);
    setError(ok ? "" : "Correo o contraseña incorrectos.");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="login-correo" className="form-label">
          Correo
        </label>
        <input
          id="login-correo"
          type="email"
          className="form-control"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="login-password" className="form-label">
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}
      <button type="submit" className="btn btn-primary w-100">
        Iniciar sesión
      </button>
    </form>
  );
}
