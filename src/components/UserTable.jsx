// Tabla de usuarios del panel admin (antes legacy-eval1/admin/users.html + admin-users.js).
// Igual que ProductTable y CategoryTable: solo dibuja lo que recibe por props
// y avisa a la página qué usuario se quiere eliminar. No lee ni borra datos.
//
// Props:
//   usuarios   -> lista a mostrar
//   onEliminar -> función que recibe el usuario clickeado
//   idActual   -> id del admin con sesión iniciada (no puede eliminarse a sí mismo)
import { Link } from "react-router-dom";
import { claseTipo, nombreTipo } from "../utils/tiposUsuario.js";

export default function UserTable({ usuarios, onEliminar, idActual = null }) {
  // Renderizado condicional: aviso en vez de una tabla vacía.
  if (usuarios.length === 0) {
    return (
      <p className="alert alert-info" role="status">
        No hay usuarios que mostrar.
      </p>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Run</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => {
            const esActual = u.id === idActual;
            return (
              <tr key={u.id}>
                <td>{u.run}</td>
                <td>{u.nombre}</td>
                <td>{u.apellidos}</td>
                <td>{u.correo}</td>
                <td>
                  <span className={`badge ${claseTipo(u.tipo)}`}>{nombreTipo(u.tipo)}</span>
                </td>
                <td className="text-nowrap">
                  <Link to={`/admin/usuarios/${u.id}`} className="btn btn-sm btn-outline-secondary me-1">
                    Ver
                  </Link>
                  <Link to={`/admin/usuarios/${u.id}/editar`} className="btn btn-sm btn-outline-primary me-1">
                    Editar
                  </Link>
                  {/* El admin conectado no puede borrar su propia cuenta (se quedaría sin acceso). */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    aria-label={`Eliminar ${u.nombre} ${u.apellidos}`}
                    disabled={esActual}
                    title={esActual ? "No puedes eliminar tu propia cuenta" : undefined}
                    onClick={() => onEliminar(u)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
