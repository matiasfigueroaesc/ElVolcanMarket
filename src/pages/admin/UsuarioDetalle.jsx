// Detalle de un usuario en el panel: /admin/usuarios/:id
// Vista nueva de la Eval 2 (en la Eval 1 solo existía el listado y el formulario).
// Mismo esquema que ProductoDetalle: datos del registro, mensaje que llega desde el
// formulario y acciones (editar, ver compras, eliminar).
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { listarPorUsuario } from "../../data/ordenes.js";
import { nombreComuna, nombreRegion } from "../../data/regiones.js";
import { eliminarUsuario, obtenerUsuario } from "../../data/usuarios.js";
import { formatearCLP } from "../../utils/formato.js";
import { claseTipo, nombreTipo } from "../../utils/tiposUsuario.js";

// "1990-05-10" -> "10/05/1990". No se usa new Date() porque un "AAAA-MM-DD" se lee
// como hora UTC y en Chile mostraría el día anterior.
const fechaCorta = (valor) => valor.split("-").reverse().join("/");

export default function UsuarioDetalle() {
  const { id } = useParams(); // string: obtenerUsuario lo convierte con Number()
  const navigate = useNavigate();
  const { usuario: actual } = useAuth();
  // Mensaje que manda UsuarioForm al guardar (si se llegó desde ahí).
  const mensaje = useLocation().state?.mensaje;
  const usuario = obtenerUsuario(id);

  if (!usuario) {
    return (
      <div className="alert alert-warning" role="status">
        Usuario no encontrado. <Link to="/admin/usuarios">Volver al listado</Link>
      </div>
    );
  }

  // Resumen de compras: solo cuentan las pagadas (las rechazadas no son ventas).
  const pagadas = listarPorUsuario(usuario.id).filter((o) => o.estadoPago === "pagado");
  const totalComprado = pagadas.reduce((acc, o) => acc + o.total, 0);
  const esActual = usuario.id === actual?.id;

  function handleEliminar() {
    if (!window.confirm(`¿Eliminar a "${usuario.nombre} ${usuario.apellidos}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    eliminarUsuario(usuario.id);
    navigate("/admin/usuarios");
  }

  return (
    <>
      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}
      <p>
        <Link to="/admin/usuarios">← Volver a usuarios</Link>
      </p>

      <div className="card shadow-sm" style={{ maxWidth: 720 }}>
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <h1 className="h3 mb-0">
              {usuario.nombre} {usuario.apellidos}
            </h1>
            <span className={`badge ${claseTipo(usuario.tipo)}`}>{nombreTipo(usuario.tipo)}</span>
          </div>

          <dl className="row mb-0">
            <dt className="col-sm-4">Run</dt>
            <dd className="col-sm-8">{usuario.run}</dd>

            <dt className="col-sm-4">Correo</dt>
            <dd className="col-sm-8">{usuario.correo}</dd>

            <dt className="col-sm-4">Teléfono</dt>
            <dd className="col-sm-8">{usuario.telefono || "No registrado"}</dd>

            <dt className="col-sm-4">Fecha de nacimiento</dt>
            <dd className="col-sm-8">
              {usuario.fechaNacimiento ? fechaCorta(usuario.fechaNacimiento) : "No registrada"}
            </dd>

            <dt className="col-sm-4">Dirección</dt>
            <dd className="col-sm-8">
              {usuario.direccion}, {nombreComuna(usuario.region, usuario.comuna)}, {nombreRegion(usuario.region)}
            </dd>

            <dt className="col-sm-4">Compras pagadas</dt>
            <dd className="col-sm-8">
              {pagadas.length} · Total: <strong>{formatearCLP(totalComprado)}</strong>
            </dd>
          </dl>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <Link to={`/admin/usuarios/${usuario.id}/editar`} className="btn btn-primary">
              Editar
            </Link>
            <Link to={`/admin/usuarios/${usuario.id}/compras`} className="btn btn-outline-primary">
              Historial de compras
            </Link>
            {/* El admin conectado no puede eliminar su propia cuenta. */}
            <button type="button" className="btn btn-outline-danger" onClick={handleEliminar} disabled={esActual}>
              Eliminar
            </button>
          </div>
          {esActual && <p className="small text-muted mt-2 mb-0">No puedes eliminar tu propia cuenta.</p>}
        </div>
      </div>
    </>
  );
}
