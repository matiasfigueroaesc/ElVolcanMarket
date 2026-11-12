// Perfil del administrador conectado: /admin/perfil
// Reutiliza UserForm (el mismo formulario y las mismas validaciones de crear/editar
// usuario), pero sin el tipo de usuario: el admin no puede cambiar su propio rol desde aquí.
// Los datos se leen con GET /auth/me y se guardan con PUT /usuarios/{id} en el backend.
import { useState } from "react";
import { textoError } from "../../api/cliente.js";
import EstadoCarga from "../../components/EstadoCarga.jsx";
import UserForm from "../../components/UserForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { actualizarUsuario, obtenerMiUsuario } from "../../data/usuarios.js";
import { useCarga } from "../../hooks/useCarga.js";
import { claseTipo, nombreTipo } from "../../utils/tiposUsuario.js";

export default function Perfil() {
  const { actualizarUsuarioSesion } = useAuth();
  const carga = useCarga(() => obtenerMiUsuario());

  if (carga.cargando || carga.error) {
    return <EstadoCarga cargando={carga.cargando} error={carga.error} onReintentar={carga.recargar} />;
  }

  return <FormularioPerfil inicial={carga.datos} onGuardado={actualizarUsuarioSesion} />;
}

function FormularioPerfil({ inicial, onGuardado }) {
  // Estado: datos del usuario (cambian al guardar, y la tarjeta se vuelve a dibujar).
  const [usuario, setUsuario] = useState(inicial);
  // Estado: resultado del guardado.
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  // Estado: cuántas veces se guardó. Se usa como key para reiniciar el formulario
  // y que el campo de contraseña quede vacío otra vez.
  const [guardados, setGuardados] = useState(0);

  async function handleGuardar(datos) {
    setMensaje("");
    setError("");
    try {
      // El formulario no muestra el tipo, pero el backend lo pide: se envía el actual.
      const actualizado = await actualizarUsuario(usuario.id, { ...datos, tipo: usuario.tipo });
      // Se actualiza también la sesión, para que el menú muestre los datos nuevos.
      onGuardado(actualizado);
      setUsuario(actualizado);
      setGuardados((n) => n + 1);
      setMensaje("Perfil actualizado.");
    } catch (e) {
      // Ej.: 409 "Ya existe un usuario con ese correo."
      setError(textoError(e));
    }
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
