// Una sola página para crear y editar usuario (mismo esquema que ProductoForm):
//   /admin/usuarios/nuevo       -> no hay :id -> crear
//   /admin/usuarios/:id/editar  -> hay :id    -> editar
// Migrado de legacy-eval1/admin/new-user.html y edit-user.html.
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserForm from "../../components/UserForm.jsx";
import { actualizarUsuario, buscarPorCorreo, crearUsuario, obtenerUsuario } from "../../data/usuarios.js";

export default function UsuarioForm() {
  const { id } = useParams(); // llega como string: obtenerUsuario lo convierte con Number()
  const navigate = useNavigate();
  // Estado: error al guardar (correo o RUN repetido). Los hooks van antes de cualquier return.
  const [error, setError] = useState("");

  const editando = id !== undefined;
  const usuario = editando ? obtenerUsuario(id) : null;

  if (editando && !usuario) {
    return (
      <div className="alert alert-warning" role="status">
        Usuario no encontrado. <Link to="/admin/usuarios">Volver al listado</Link>
      </div>
    );
  }

  function handleGuardar(datos) {
    setError("");
    try {
      let guardado;
      if (editando) {
        // crearUsuario() ya rechaza correos repetidos, pero actualizarUsuario() no,
        // así que al editar se revisa aquí que el correo no sea de OTRO usuario.
        const duenoCorreo = buscarPorCorreo(datos.correo);
        if (duenoCorreo && duenoCorreo.id !== usuario.id) {
          throw new Error("Ya existe un usuario con ese correo.");
        }
        guardado = actualizarUsuario(usuario.id, datos);
      } else {
        guardado = crearUsuario(datos); // lanza Error si el correo o el RUN ya existen
      }
      // Al terminar se muestra el detalle del usuario recién guardado.
      navigate(`/admin/usuarios/${guardado.id}`, {
        state: { mensaje: editando ? "Usuario actualizado." : "Usuario creado." },
      });
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <h1 className="h3">{editando ? `Editar ${usuario.nombre} ${usuario.apellidos}` : "Nuevo usuario"}</h1>
      <p>
        <Link to="/admin/usuarios">← Volver a usuarios</Link>
      </p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow-sm" style={{ maxWidth: 720 }}>
        <div className="card-body">
          {/* key: si cambia el usuario, React crea el formulario de nuevo con sus valores. */}
          <UserForm
            key={id ?? "nuevo"}
            inicial={usuario}
            editando={editando}
            onSubmit={handleGuardar}
            textoBoton={editando ? "Guardar cambios" : "Crear usuario"}
          />
        </div>
      </div>
    </>
  );
}
