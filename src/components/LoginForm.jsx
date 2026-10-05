// Formulario de inicio de sesión (controlado).
// Recibe onLogin(correo, password) -> boolean y muestra un error solo si falla.
// Validaciones de campo (formato) vienen de utils/validaciones.js; el error de
// "credenciales incorrectas" lo decide onLogin (AuthContext), no este componente.
import { useState } from "react";
import { validarCorreo, validarPassword } from "../utils/validaciones.js";

export default function LoginForm({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [erroresCampo, setErroresCampo] = useState({ correo: "", password: "" });

  function cambiarCorreo(e) {
    const valor = e.target.value;
    setCorreo(valor);
    setErroresCampo((prev) => ({ ...prev, correo: validarCorreo(valor) }));
  }

  function cambiarPassword(e) {
    const valor = e.target.value;
    setPassword(valor);
    setErroresCampo((prev) => ({ ...prev, password: validarPassword(valor) }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const errores = {
      correo: validarCorreo(correo),
      password: validarPassword(password),
    };
    setErroresCampo(errores);

    if (errores.correo || errores.password) {
      setError("Revisa los datos ingresados.");
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
          className={`form-control${erroresCampo.correo ? " is-invalid" : ""}`}
          value={correo}
          onChange={cambiarCorreo}
          autoComplete="email"
          maxLength={100}
        />
        <div className="invalid-feedback">{erroresCampo.correo}</div>
      </div>
      <div className="mb-3">
        <label htmlFor="login-password" className="form-label">
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          className={`form-control${erroresCampo.password ? " is-invalid" : ""}`}
          value={password}
          onChange={cambiarPassword}
          autoComplete="current-password"
          maxLength={20}
        />
        <div className="invalid-feedback">{erroresCampo.password}</div>
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
