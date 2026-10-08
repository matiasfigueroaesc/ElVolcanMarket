import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import RegistroForm from "../../components/RegistroForm.jsx";

export default function Registro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [errorRegistro, setErrorRegistro] = useState("");

  // registrar() viene de AuthContext y lanza Error si el correo ya existe
  // (ver src/data/usuarios.js -> crearUsuario). El resto de la validación de
  // campos ya la hizo RegistroForm antes de llamar a onSubmit.
  function handleSubmit(valores) {
    setErrorRegistro("");
    // passwordConfirm es solo del formulario: no debe guardarse en el usuario ni en la sesión.
    const { passwordConfirm: _passwordConfirm, ...datos } = valores;
    try {
      registrar(datos);
      navigate("/");
    } catch (error) {
      setErrorRegistro(error.message);
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
