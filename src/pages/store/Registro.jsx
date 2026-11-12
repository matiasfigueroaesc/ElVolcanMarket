import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { textoError } from "../../api/cliente.js";
import { useAuth } from "../../context/AuthContext.jsx";
import RegistroForm from "../../components/RegistroForm.jsx";

export default function Registro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [errorRegistro, setErrorRegistro] = useState("");

  // registrar() viene de AuthContext: llama al backend, que responde 409 si el correo
  // o el RUN ya existen (o 400 con el error de cada campo). El resto de la validación
  // de campos ya la hizo RegistroForm antes de llamar a onSubmit.
  async function handleSubmit(valores) {
    setErrorRegistro("");
    // passwordConfirm es solo del formulario: no se envía al backend.
    const { passwordConfirm: _passwordConfirm, ...datos } = valores;
    try {
      await registrar(datos);
      navigate("/");
    } catch (error) {
      // Si el backend devolvió errores por campo, se muestran junto al mensaje.
      setErrorRegistro(textoError(error));
    }
  }

  return (
    <section className="container py-5">
      <h1 className="h3 mb-4">Crear una cuenta</h1>
      <div style={{ maxWidth: 640 }}>
        {errorRegistro && (
          <div className="alert alert-danger" role="alert">
            {errorRegistro}
          </div>
        )}
        <RegistroForm onSubmit={handleSubmit} />
        <p className="mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}
