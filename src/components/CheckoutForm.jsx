import { useState } from "react";
import { REGIONES, comunasDe } from "../data/regiones.js";
import { OPCIONES_ENTREGA } from "../utils/entrega.js";

const VACIO = {
  nombre: "",
  apellidos: "",
  correo: "",
  calle: "",
  departamento: "",
  region: "",
  comuna: "",
  entrega: "",
  indicaciones: "",
  simularRechazo: false,
};

// Provisoria: cuando validaciones.js llegue a eval2, el nombre y el correo pasan a
// validarNombre(v.nombre) y validarCorreo(v.correo, { restringirDominio: false }).
function validar(v) {
  const e = {};
  if (!v.nombre.trim()) e.nombre = "El nombre es obligatorio";
  if (!v.apellidos.trim()) e.apellidos = "Los apellidos son obligatorios";
  if (!/^\S+@\S+\.\S+$/.test(v.correo.trim())) e.correo = "Ingresa un correo válido";
  if (!v.calle.trim()) e.calle = "La calle es obligatoria";
  if (!v.region) e.region = "Selecciona una región";
  if (!v.comuna) e.comuna = "Selecciona una comuna";
  if (!v.entrega) e.entrega = "Selecciona una opción de entrega";
  return e;
}

export default function CheckoutForm({ inicial = {}, onSubmit }) {
  const [valores, setValores] = useState({ ...VACIO, ...inicial });
  const [errores, setErrores] = useState({});

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValores((v) => ({
      ...v,
      [campo]: valor,
      ...(campo === "region" ? { comuna: "" } : {}),
    }));
  };

  function enviar(e) {
    e.preventDefault();
    const errs = validar(valores);
    setErrores(errs);
    if (Object.keys(errs).length === 0) onSubmit(valores);
  }

  const campo = (name, label, props = {}) => (
    <div className="col-md-6">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input
        id={name}
        className={`form-control ${errores[name] ? "is-invalid" : ""}`}
        value={valores[name]}
        onChange={cambiar(name)}
        {...props}
      />
      {errores[name] && <div className="invalid-feedback">{errores[name]}</div>}
    </div>
  );

  return (
    <form className="row g-3" onSubmit={enviar} noValidate>
      {campo("nombre", "Nombre")}
      {campo("apellidos", "Apellidos")}
      {campo("correo", "Correo", { type: "email" })}
      {campo("calle", "Calle y número")}
      {campo("departamento", "Departamento (opcional)")}

      <div className="col-md-6">
        <label className="form-label" htmlFor="region">Región</label>
        <select
          id="region"
          className={`form-select ${errores.region ? "is-invalid" : ""}`}
          value={valores.region}
          onChange={cambiar("region")}
        >
          <option value="">Selecciona...</option>
          {REGIONES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        {errores.region && <div className="invalid-feedback">{errores.region}</div>}
      </div>

      <div className="col-md-6">
        <label className="form-label" htmlFor="comuna">Comuna</label>
        <select
          id="comuna"
          className={`form-select ${errores.comuna ? "is-invalid" : ""}`}
          value={valores.comuna}
          onChange={cambiar("comuna")}
          disabled={!valores.region}
        >
          <option value="">Selecciona...</option>
          {comunasDe(valores.region).map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
      </div>

      <div className="col-md-6">
        <label className="form-label" htmlFor="entrega">Opción de entrega</label>
        <select
          id="entrega"
          className={`form-select ${errores.entrega ? "is-invalid" : ""}`}
          value={valores.entrega}
          onChange={cambiar("entrega")}
        >
          <option value="">Selecciona...</option>
          {OPCIONES_ENTREGA.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {errores.entrega && <div className="invalid-feedback">{errores.entrega}</div>}
      </div>

      <div className="col-12">
        <label className="form-label" htmlFor="indicaciones">Indicaciones</label>
        <textarea
          id="indicaciones"
          className="form-control"
          value={valores.indicaciones}
          onChange={cambiar("indicaciones")}
        />
      </div>

      <div className="col-12">
        <div className="form-check">
          <input
            id="simular"
            type="checkbox"
            className="form-check-input"
            checked={valores.simularRechazo}
            onChange={cambiar("simularRechazo")}
          />
          <label htmlFor="simular" className="form-check-label">
            Simular pago rechazado
          </label>
        </div>
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-success">Pagar</button>
      </div>
    </form>
  );
}