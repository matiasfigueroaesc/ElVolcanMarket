// Formulario de registro de cliente (controlado).
// Sigue el mismo patrón acordado con I2 para CheckoutForm:
//  - estado `valores` con useState, `cambiar(campo)` para actualizar cada input.
//  - estado `errores` calculado con utils/validaciones.js, en tiempo real (en cada cambio,
//    no solo al enviar, porque el enunciado pide errores en tiempo real en Registro).
//  - markup de error de Bootstrap: "form-control is-invalid" + <div class="invalid-feedback">.
//  - el componente recibe `inicial` y `onSubmit` por props; la página (Registro.jsx) hace el
//    trabajo de datos (useAuth().registrar) y navegación. Así se puede probar sin router.
import { useState } from "react";
import {
  validarRun,
  validarNombre,
  validarApellidos,
  validarCorreo,
  validarPassword,
  validarConfirmacionPassword,
  validarTelefono,
  validarSeleccion,
  validarTextoObligatorio,
} from "../utils/validaciones.js";
import { REGIONES, comunasDe } from "../data/regiones.js";

const VACIO = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  password: "",
  passwordConfirm: "",
  telefono: "",
  region: "",
  comuna: "",
  direccion: "",
};

function validar(valores) {
  return {
    run: validarRun(valores.run),
    nombre: validarNombre(valores.nombre),
    apellidos: validarApellidos(valores.apellidos),
    correo: validarCorreo(valores.correo),
    password: validarPassword(valores.password),
    passwordConfirm: validarConfirmacionPassword(valores.passwordConfirm, valores.password),
    telefono: validarTelefono(valores.telefono),
    region: validarSeleccion(valores.region, "Debes seleccionar una región."),
    comuna: validarSeleccion(valores.comuna, "Debes seleccionar una comuna."),
    direccion: validarTextoObligatorio(valores.direccion, "La dirección es obligatoria."),
  };
}

const hayErrores = (errores) => Object.values(errores).some((mensaje) => mensaje !== "");
const TODOS_LOS_CAMPOS = Object.keys(VACIO);

export default function RegistroForm({ inicial = {}, onSubmit }) {
  const [valores, setValores] = useState({ ...VACIO, ...inicial });
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});

  function cambiar(campo) {
    return (e) => {
      const valor = e.target.value;
      // Si cambia la región, la comuna elegida deja de ser válida: se resetea.
      const nuevosValores = {
        ...valores,
        [campo]: valor,
        ...(campo === "region" ? { comuna: "" } : {}),
      };
      setValores(nuevosValores);
      setErrores(validar(nuevosValores));
      setTocados((prev) => ({ ...prev, [campo]: true }));
    };
  }

  function marcarTocado(campo) {
    return () => setTocados((prev) => ({ ...prev, [campo]: true }));
  }

  function enviar(e) {
    e.preventDefault();
    const erroresCalculados = validar(valores);
    setErrores(erroresCalculados);
    setTocados(Object.fromEntries(TODOS_LOS_CAMPOS.map((campo) => [campo, true])));

    if (!hayErrores(erroresCalculados)) {
      onSubmit(valores);
    }
  }

  // Solo se muestra el mensaje si el campo ya fue tocado (evita que el formulario
  // aparezca "lleno de rojo" antes de que el usuario escriba algo).
  const mensajeError = (campo) => (tocados[campo] ? errores[campo] || "" : "");
  const claseInput = (campo) => `form-control${mensajeError(campo) ? " is-invalid" : ""}`;
  const claseSelect = (campo) => `form-select${mensajeError(campo) ? " is-invalid" : ""}`;

  const comunasDisponibles = comunasDe(valores.region);

  return (
    <form onSubmit={enviar} noValidate>
      <div className="mb-3">
        <label htmlFor="reg-run" className="form-label">
          Run (sin puntos ni guión, ej: 111111111)
        </label>
        <input
          id="reg-run"
          className={claseInput("run")}
          value={valores.run}
          onChange={cambiar("run")}
          onBlur={marcarTocado("run")}
          maxLength={9}
        />
        <div className="invalid-feedback">{mensajeError("run")}</div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="reg-name" className="form-label">
            Nombre
          </label>
          <input
            id="reg-name"
            className={claseInput("nombre")}
            value={valores.nombre}
            onChange={cambiar("nombre")}
            onBlur={marcarTocado("nombre")}
            maxLength={50}
          />
          <div className="invalid-feedback">{mensajeError("nombre")}</div>
        </div>
        <div className="col-sm-6">
          <label htmlFor="reg-lastname" className="form-label">
            Apellidos
          </label>
          <input
            id="reg-lastname"
            className={claseInput("apellidos")}
            value={valores.apellidos}
            onChange={cambiar("apellidos")}
            onBlur={marcarTocado("apellidos")}
            maxLength={100}
          />
          <div className="invalid-feedback">{mensajeError("apellidos")}</div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="reg-email" className="form-label">
          Correo
        </label>
        <input
          id="reg-email"
          type="email"
          className={claseInput("correo")}
          value={valores.correo}
          onChange={cambiar("correo")}
          onBlur={marcarTocado("correo")}
          maxLength={100}
        />
        <div className="form-text">Solo correos @duoc.cl, @profesor.duoc.cl o @gmail.com</div>
        <div className="invalid-feedback">{mensajeError("correo")}</div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="reg-password" className="form-label">
            Contraseña
          </label>
          <input
            id="reg-password"
            type="password"
            className={claseInput("password")}
            value={valores.password}
            onChange={cambiar("password")}
            onBlur={marcarTocado("password")}
            maxLength={20}
          />
          <div className="invalid-feedback">{mensajeError("password")}</div>
        </div>
        <div className="col-sm-6">
          <label htmlFor="reg-password-confirm" className="form-label">
            Confirmar contraseña
          </label>
          <input
            id="reg-password-confirm"
            type="password"
            className={claseInput("passwordConfirm")}
            value={valores.passwordConfirm}
            onChange={cambiar("passwordConfirm")}
            onBlur={marcarTocado("passwordConfirm")}
            maxLength={20}
          />
          <div className="invalid-feedback">{mensajeError("passwordConfirm")}</div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="reg-phone" className="form-label">
          Teléfono (opcional)
        </label>
        <input
          id="reg-phone"
          type="tel"
          className={claseInput("telefono")}
          value={valores.telefono}
          onChange={cambiar("telefono")}
          onBlur={marcarTocado("telefono")}
          placeholder="Ej: 912345678"
        />
        <div className="invalid-feedback">{mensajeError("telefono")}</div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="reg-region" className="form-label">
            Región
          </label>
          <select
            id="reg-region"
            className={claseSelect("region")}
            value={valores.region}
            onChange={cambiar("region")}
            onBlur={marcarTocado("region")}
          >
            <option value="" disabled>-- Seleccione región --</option>
            {REGIONES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <div className="invalid-feedback">{mensajeError("region")}</div>
        </div>
        <div className="col-sm-6">
          <label htmlFor="reg-comuna" className="form-label">
            Comuna
          </label>
          <select
            id="reg-comuna"
            className={claseSelect("comuna")}
            value={valores.comuna}
            onChange={cambiar("comuna")}
            onBlur={marcarTocado("comuna")}
            disabled={!valores.region}
          >
            <option value="" disabled>-- Seleccione comuna --</option>
            {comunasDisponibles.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <div className="invalid-feedback">{mensajeError("comuna")}</div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="reg-address" className="form-label">
          Dirección
        </label>
        <input
          id="reg-address"
          className={claseInput("direccion")}
          value={valores.direccion}
          onChange={cambiar("direccion")}
          onBlur={marcarTocado("direccion")}
          maxLength={300}
        />
        <div className="invalid-feedback">{mensajeError("direccion")}</div>
      </div>

      <button type="submit" className="btn btn-primary">
        Registrarse
      </button>
    </form>
  );
}
