// Formulario de contacto (controlado). Mismo patrón que RegistroForm / CheckoutForm:
//  - `valores` con useState y `cambiar(campo)`.
//  - `errores` calculados con utils/validaciones.js en cada cambio (tiempo real).
//  - errores visibles solo en campos "tocados" o al enviar.
//  - markup Bootstrap: "form-control is-invalid" + <div className="invalid-feedback">.
//  - recibe `inicial` y `onSubmit`; la página decide qué hacer con el mensaje.
// Reglas migradas de legacy-eval1/store/contact.html: nombre obligatorio (máx. 100),
// correo opcional (si se indica, dominio duoc.cl / profesor.duoc.cl / gmail.com),
// comentario obligatorio (máx. 500).
import { useState } from "react";
import { validarNombre, validarCorreo, validarTextoObligatorio } from "../utils/validaciones.js";

const VACIO = { nombre: "", correo: "", comentario: "" };

function validar(valores) {
  return {
    nombre: validarNombre(valores.nombre),
    correo: validarCorreo(valores.correo, { requerido: false }),
    comentario: validarTextoObligatorio(valores.comentario, "El comentario es obligatorio."),
  };
}

const hayErrores = (errores) => Object.values(errores).some((mensaje) => mensaje !== "");

export default function ContactoForm({ inicial = {}, onSubmit }) {
  const [valores, setValores] = useState({ ...VACIO, ...inicial });
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});

  const cambiar = (campo) => (e) => {
    const nuevos = { ...valores, [campo]: e.target.value };
    setValores(nuevos);
    setErrores(validar(nuevos));
    setTocados((prev) => ({ ...prev, [campo]: true }));
  };

  function enviar(e) {
    e.preventDefault();
    const calculados = validar(valores);
    setErrores(calculados);
    setTocados({ nombre: true, correo: true, comentario: true });
    if (!hayErrores(calculados)) onSubmit(valores);
  }

  const mensajeError = (campo) => (tocados[campo] ? errores[campo] || "" : "");
  const clase = (campo) => `form-control${mensajeError(campo) ? " is-invalid" : ""}`;

  return (
    <form onSubmit={enviar} noValidate>
      <div className="mb-3">
        <label htmlFor="contacto-nombre" className="form-label">Nombre completo</label>
        <input
          id="contacto-nombre"
          type="text"
          className={clase("nombre")}
          value={valores.nombre}
          onChange={cambiar("nombre")}
          maxLength={100}
        />
        {mensajeError("nombre") && <div className="invalid-feedback">{mensajeError("nombre")}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="contacto-correo" className="form-label">Correo (opcional)</label>
        <input
          id="contacto-correo"
          type="email"
          className={clase("correo")}
          value={valores.correo}
          onChange={cambiar("correo")}
          maxLength={100}
        />
        <div className="form-text">Si lo indicas, solo @duoc.cl, @profesor.duoc.cl o @gmail.com</div>
        {mensajeError("correo") && <div className="invalid-feedback">{mensajeError("correo")}</div>}
      </div>

      <div className="mb-4">
        <label htmlFor="contacto-comentario" className="form-label">Comentario</label>
        <textarea
          id="contacto-comentario"
          className={clase("comentario")}
          rows={4}
          value={valores.comentario}
          onChange={cambiar("comentario")}
          maxLength={500}
        />
        {mensajeError("comentario") && (
          <div className="invalid-feedback">{mensajeError("comentario")}</div>
        )}
      </div>

      <button type="submit" className="btn btn-primary">Enviar mensaje</button>
    </form>
  );
}
