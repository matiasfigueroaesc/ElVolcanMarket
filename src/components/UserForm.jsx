// Formulario de usuario del panel admin (crear, editar y perfil).
// Migrado de legacy-eval1/admin/new-user.html y edit-user.html.
//
// Mismo patrón que RegistroForm:
//  - formulario controlado: estado `valores` con useState y `cambiar(campo)` para cada input.
//  - estado `errores` calculado con utils/validaciones.js en cada cambio (tiempo real),
//    visible solo en campos "tocados" o después de intentar guardar.
//  - markup de Bootstrap "is-invalid" + <div className="invalid-feedback">.
//  - no guarda nada: si no hay errores llama a onSubmit(datos) y la PÁGINA decide si crea
//    o actualiza (así el formulario se prueba sin router ni datos).
//
// Props:
//   inicial     -> usuario a editar (o nada para uno nuevo)
//   onSubmit    -> recibe los datos limpios, listos para guardar
//   editando    -> true: el Run no se cambia y la contraseña es opcional
//   ocultarTipo -> true: no muestra el tipo de usuario (Perfil: el admin no cambia su propio tipo)
//   textoBoton  -> texto del botón de enviar
import { useState } from "react";
import {
  validarApellidos,
  validarCorreo,
  validarFechaNacimiento,
  validarNombre,
  validarPassword,
  validarRun,
  validarSeleccion,
  validarTelefono,
  validarTextoObligatorio,
} from "../utils/validaciones.js";
import { REGIONES, comunasDe } from "../data/regiones.js";
import { TIPOS_USUARIO } from "../data/usuarios.js";
import { nombreTipo } from "../utils/tiposUsuario.js";

const VACIO = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  password: "",
  telefono: "",
  fechaNacimiento: "",
  tipo: "",
  region: "",
  comuna: "",
  direccion: "",
};
const TODOS_LOS_CAMPOS = Object.keys(VACIO);

// Convierte un usuario guardado (con null en campos opcionales) a valores de formulario (texto).
// La contraseña nunca se precarga: se deja vacía y solo cambia si se escribe una nueva.
function aValores(usuario) {
  const valores = Object.fromEntries(TODOS_LOS_CAMPOS.map((campo) => [campo, usuario?.[campo] ?? ""]));
  return { ...valores, password: "" };
}

// Devuelve { campo: "mensaje" | "" } usando las mismas reglas que el Registro.
function validar(v, { editando, ocultarTipo }) {
  return {
    run: validarRun(v.run),
    nombre: validarNombre(v.nombre),
    apellidos: validarApellidos(v.apellidos),
    correo: validarCorreo(v.correo),
    // Al editar, contraseña en blanco = se mantiene la actual.
    password: validarPassword(v.password, { requerido: !editando }),
    telefono: validarTelefono(v.telefono),
    fechaNacimiento: validarFechaNacimiento(v.fechaNacimiento),
    tipo: ocultarTipo ? "" : validarSeleccion(v.tipo, "Debes seleccionar un tipo de usuario."),
    region: validarSeleccion(v.region, "Debes seleccionar una región."),
    comuna: validarSeleccion(v.comuna, "Debes seleccionar una comuna."),
    direccion: validarTextoObligatorio(v.direccion, "La dirección es obligatoria."),
  };
}

const hayErrores = (errores) => Object.values(errores).some((mensaje) => mensaje !== "");

export default function UserForm({
  inicial = null,
  onSubmit,
  editando = false,
  ocultarTipo = false,
  textoBoton = "Guardar usuario",
}) {
  const [valores, setValores] = useState(() => aValores(inicial));
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const opciones = { editando, ocultarTipo };

  function cambiar(campo) {
    return (e) => {
      // Si cambia la región, la comuna elegida deja de ser válida: se resetea.
      const nuevosValores = {
        ...valores,
        [campo]: e.target.value,
        ...(campo === "region" ? { comuna: "" } : {}),
      };
      setValores(nuevosValores);
      setErrores(validar(nuevosValores, opciones));
      setTocados((prev) => ({ ...prev, [campo]: true }));
    };
  }

  function marcarTocado(campo) {
    return () => setTocados((prev) => ({ ...prev, [campo]: true }));
  }

  function enviar(e) {
    e.preventDefault();
    const erroresCalculados = validar(valores, opciones);
    setErrores(erroresCalculados);
    setTocados(Object.fromEntries(TODOS_LOS_CAMPOS.map((campo) => [campo, true])));
    if (hayErrores(erroresCalculados)) return;

    // Datos limpios: sin espacios sobrantes y con null en los opcionales vacíos.
    const datos = {
      run: valores.run.trim().toUpperCase(),
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim(),
      telefono: valores.telefono.trim() || null,
      fechaNacimiento: valores.fechaNacimiento || null,
      region: valores.region,
      comuna: valores.comuna,
      direccion: valores.direccion.trim(),
    };
    if (!ocultarTipo) datos.tipo = valores.tipo;
    // La contraseña solo viaja si se escribió una (al editar, vacía = no cambiarla).
    if (valores.password) datos.password = valores.password;
    onSubmit(datos);
  }

  const mensajeError = (campo) => (tocados[campo] ? errores[campo] || "" : "");
  const claseInput = (campo) => `form-control${mensajeError(campo) ? " is-invalid" : ""}`;
  const claseSelect = (campo) => `form-select${mensajeError(campo) ? " is-invalid" : ""}`;

  return (
    <form onSubmit={enviar} noValidate>
      <div className="mb-3">
        <label htmlFor="user-run" className="form-label">
          Run
        </label>
        {/* El Run identifica al usuario: no se edita una vez creado (igual que en la Eval 1). */}
        <input
          id="user-run"
          className={claseInput("run")}
          value={valores.run}
          onChange={cambiar("run")}
          onBlur={marcarTocado("run")}
          maxLength={9}
          readOnly={editando}
        />
        <div className="form-text">Sin puntos ni guión, ej: 111111111</div>
        <div className="invalid-feedback">{mensajeError("run")}</div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="user-nombre" className="form-label">
            Nombre
          </label>
          <input
            id="user-nombre"
            className={claseInput("nombre")}
            value={valores.nombre}
            onChange={cambiar("nombre")}
            onBlur={marcarTocado("nombre")}
            maxLength={50}
          />
          <div className="invalid-feedback">{mensajeError("nombre")}</div>
        </div>
        <div className="col-sm-6">
          <label htmlFor="user-apellidos" className="form-label">
            Apellidos
          </label>
          <input
            id="user-apellidos"
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
        <label htmlFor="user-correo" className="form-label">
          Correo
        </label>
        <input
          id="user-correo"
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

      <div className="mb-3">
        <label htmlFor="user-password" className="form-label">
          {editando ? "Contraseña nueva (opcional)" : "Contraseña"}
        </label>
        <input
          id="user-password"
          type="password"
          className={claseInput("password")}
          value={valores.password}
          onChange={cambiar("password")}
          onBlur={marcarTocado("password")}
          maxLength={20}
          autoComplete="new-password"
        />
        <div className="form-text">
          {editando ? "Déjala en blanco para mantener la contraseña actual." : "Entre 4 y 20 caracteres."}
        </div>
        <div className="invalid-feedback">{mensajeError("password")}</div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="user-telefono" className="form-label">
            Teléfono (opcional)
          </label>
          <input
            id="user-telefono"
            type="tel"
            className={claseInput("telefono")}
            value={valores.telefono}
            onChange={cambiar("telefono")}
            onBlur={marcarTocado("telefono")}
            placeholder="Ej: 912345678"
          />
          <div className="invalid-feedback">{mensajeError("telefono")}</div>
        </div>
        <div className="col-sm-6">
          <label htmlFor="user-fecha" className="form-label">
            Fecha de nacimiento (opcional)
          </label>
          <input
            id="user-fecha"
            type="date"
            className={claseInput("fechaNacimiento")}
            value={valores.fechaNacimiento}
            onChange={cambiar("fechaNacimiento")}
            onBlur={marcarTocado("fechaNacimiento")}
          />
          <div className="invalid-feedback">{mensajeError("fechaNacimiento")}</div>
        </div>
      </div>

      {/* Renderizado condicional: el Perfil no muestra el tipo de usuario. */}
      {!ocultarTipo && (
        <div className="mb-3">
          <label htmlFor="user-tipo" className="form-label">
            Tipo de usuario
          </label>
          <select
            id="user-tipo"
            className={claseSelect("tipo")}
            value={valores.tipo}
            onChange={cambiar("tipo")}
            onBlur={marcarTocado("tipo")}
          >
            <option value="" disabled>
              -- Seleccione --
            </option>
            {TIPOS_USUARIO.map((t) => (
              <option key={t} value={t}>
                {nombreTipo(t)}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{mensajeError("tipo")}</div>
        </div>
      )}

      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="user-region" className="form-label">
            Región
          </label>
          <select
            id="user-region"
            className={claseSelect("region")}
            value={valores.region}
            onChange={cambiar("region")}
            onBlur={marcarTocado("region")}
          >
            <option value="" disabled>
              -- Seleccione región --
            </option>
            {REGIONES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{mensajeError("region")}</div>
        </div>
        <div className="col-sm-6">
          <label htmlFor="user-comuna" className="form-label">
            Comuna
          </label>
          <select
            id="user-comuna"
            className={claseSelect("comuna")}
            value={valores.comuna}
            onChange={cambiar("comuna")}
            onBlur={marcarTocado("comuna")}
            disabled={!valores.region}
          >
            <option value="" disabled>
              -- Seleccione comuna --
            </option>
            {comunasDe(valores.region).map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{mensajeError("comuna")}</div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="user-direccion" className="form-label">
          Dirección
        </label>
        <input
          id="user-direccion"
          className={claseInput("direccion")}
          value={valores.direccion}
          onChange={cambiar("direccion")}
          onBlur={marcarTocado("direccion")}
          maxLength={300}
        />
        <div className="invalid-feedback">{mensajeError("direccion")}</div>
      </div>

      <button type="submit" className="btn btn-primary">
        {textoBoton}
      </button>
    </form>
  );
}
