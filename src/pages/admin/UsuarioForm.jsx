// Una sola página para crear y editar usuario (mismo esquema que ProductoForm):
//   /admin/usuarios/nuevo       -> no hay :id -> crear
//   /admin/usuarios/:id/editar  -> hay :id    -> editar
// Los datos se leen y se guardan en el backend (servicio usuarios, solo ADMIN).
// El backend rechaza correos y RUN repetidos (409) y valida cada campo (400).
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { textoError } from "../../api/cliente.js";
import EstadoCarga from "../../components/EstadoCarga.jsx";
import UserForm from "../../components/UserForm.jsx";
import { actualizarUsuario, crearUsuario, obtenerUsuario } from "../../data/usuarios.js";
import { useCarga } from "../../hooks/useCarga.js";

export default function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Estado: error al guardar (correo o RUN repetido, campo inválido). Los hooks van antes de cualquier return.
  const [error, setError] = useState("");
  const editando = id !== undefined;
  const carga = useCarga(() => (editando ? obtenerUsuario(id) : Promise.resolve(null)), [id]);

  if (carga.cargando || carga.error) {
    return <EstadoCarga cargando={carga.cargando} error={carga.error} onReintentar={carga.recargar} />;
  }

  const usuario = carga.datos;

  if (editando && !usuario) {
    return (
      <div className="alert alert-warning" role="status">
        Usuario no encontrado. <Link to="/admin/usuarios">Volver al listado</Link>
      </div>
    );
  }

  async function handleGuardar(datos) {
    setError("");
    try {
      const guardado = editando ? await actualizarUsuario(usuario.id, datos) : await crearUsuario(datos);
      // Al terminar se muestra el detalle del usuario recién guardado.
      navigate(`/admin/usuarios/${guardado.id}`, {
        state: { mensaje: editando ? "Usuario actualizado." : "Usuario creado." },
      });
    } catch (e) {
      setError(textoError(e));
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
