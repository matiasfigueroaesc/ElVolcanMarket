// Perfil del administrador conectado: /admin/perfil
// Vista nueva de la Eval 2. Reutiliza UserForm (el mismo formulario y las mismas
// validaciones de crear/editar usuario), pero sin el tipo de usuario: el admin no
// puede cambiar su propio rol desde aquí.
import { useState } from "react";
import UserForm from "../../components/UserForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { actualizarUsuario, buscarPorCorreo, guardarSesion, obtenerUsuario } from "../../data/usuarios.js";
import { claseTipo, nombreTipo } from "../../utils/tiposUsuario.js";

export default function Perfil() {
  // La sesión no guarda la contraseña (datosPublicos), por eso se lee el usuario completo.
  const { usuario: sesion } = useAuth();
  // Estado: datos del usuario (cambian al guardar, y la tarjeta se vuelve a dibujar).
  const [usuario, setUsuario] = useState(() => obtenerUsuario(sesion?.id));
  // Estado: resultado del guardado.
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  // Estado: cuántas veces se guardó. Se usa como key para reiniciar el formulario
  // y que el campo de contraseña quede vacío otra vez.
  const [guardados, setGuardados] = useState(0);

  if (!usuario) {
    return (
      <div className="alert alert-warning" role="status">
        No se encontró tu usuario. Cierra sesión y vuelve a ingresar.
      </div>
    );
  }

  function handleGuardar(datos) {
    setMensaje("");
    // Mismo control que en UsuarioForm: el correo no puede ser de otra cuenta.
    const duenoCorreo = buscarPorCorreo(datos.correo);
    if (duenoCorreo && duenoCorreo.id !== usuario.id) {
      setError("Ya existe un usuario con ese correo.");
      return;
    }
    setError("");
    const actualizado = actualizarUsuario(usuario.id, datos);
    // Se actualiza también la sesión guardada (sin contraseña: guardarSesion usa datosPublicos)
    // para que al recargar la página se vean los datos nuevos.
    guardarSesion(actualizado);
    setUsuario(actualizado);
    setGuardados((n) => n + 1);
    setMensaje("Perfil actualizado.");
  }

  return (
    <>
      <h1 className="h3">Mi perfil</h1>
      <p className="text-muted">Revisa y actualiza tus datos de acceso y contacto.</p>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-1">
                {usuario.nombre} {usuario.apellidos}
              </h2>
              <p className="text-muted mb-2">{usuario.correo}</p>
              <span className={`badge ${claseTipo(usuario.tipo)}`}>{nombreTipo(usuario.tipo)}</span>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {mensaje && (
            <div className="alert alert-success" role="status">
              {mensaje}
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="card shadow-sm">
            <div className="card-body">
              <UserForm
                key={guardados}
                inicial={usuario}
                editando
                ocultarTipo
                onSubmit={handleGuardar}
                textoBoton="Guardar cambios"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
