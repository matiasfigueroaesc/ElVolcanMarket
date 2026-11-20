// Crear y editar categoría:
//   /admin/categorias/nueva        -> crear
//   /admin/categorias/:id/editar   -> editar
// La página carga los datos del backend y luego muestra el formulario
// (FormularioCategoria), que parte con los valores de la categoría ya cargada.
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EstadoCarga from "../../components/EstadoCarga.jsx";
import {
  actualizarCategoria,
  crearCategoria,
  listarCategorias,
  obtenerCategoria,
  slugify,
} from "../../data/categorias.js";
import { useCarga } from "../../hooks/useCarga.js";
import { hayErrores, validarCategoria } from "../../utils/validacionesAdmin.js";

export default function CategoriaForm() {
  const { id } = useParams();
  const editando = id !== undefined;
  // Todas las categorías (para revisar nombres repetidos) y, si se edita, la categoría.
  const { datos, cargando, error, recargar } = useCarga(
    () => Promise.all([listarCategorias(), editando ? obtenerCategoria(id) : null]),
    [id]
  );

  if (cargando || error) return <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />;

  const [todas, categoria] = datos;

  if (editando && !categoria) {
    return (
      <div className="alert alert-warning" role="status">
        Categoría no encontrada. <Link to="/admin/categorias">Volver al listado</Link>
      </div>
    );
  }

  // Para revisar nombres repetidos se compara con las otras categorías (no consigo misma).
  const otras = todas.filter((c) => c.id !== categoria?.id);
  return <FormularioCategoria key={id ?? "nueva"} categoria={categoria} otras={otras} />;
}

function FormularioCategoria({ categoria, otras }) {
  const navigate = useNavigate();
  const editando = categoria !== null;

  // Estado del formulario controlado. Si se edita, parte con los datos guardados.
  const [valores, setValores] = useState({
    nombre: categoria?.nombre ?? "",
    descripcion: categoria?.descripcion ?? "",
    imagen: categoria?.imagen ?? "",
  });
  const [errores, setErrores] = useState({});
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Si el nombre no cambió, el backend conserva el slug actual (no se rompen los enlaces).
  const slugVisible =
    editando && valores.nombre.trim() === categoria.nombre ? categoria.slug : slugify(valores.nombre);

  function handleChange(e) {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nuevosErrores = validarCategoria(valores, otras);
    setErrores(nuevosErrores);
    if (hayErrores(nuevosErrores)) return;

    // El slug no se envía: lo calcula el backend a partir del nombre.
    const datos = {
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      imagen: valores.imagen.trim(),
    };
    setErrorGuardar(null);
    setGuardando(true);
    try {
      if (editando) await actualizarCategoria(categoria.id, datos);
      else await crearCategoria(datos);
      navigate("/admin/categorias");
    } catch (error) {
      setErrorGuardar(error);
      setGuardando(false);
    }
  }

  const errorDe = (campo) => errores[campo] || errorGuardar?.campos?.[campo] || "";

  return (
    <>
      <h1 className="h3">{editando ? `Editar ${categoria.nombre}` : "Nueva categoría"}</h1>
      <p>
        <Link to="/admin/categorias">← Volver a categorías</Link>
      </p>

      {errorGuardar && (
        <div className="alert alert-danger" role="alert">
          {errorGuardar.message}
        </div>
      )}

      <div className="card shadow-sm">
        <form className="card-body" onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="categoria-nombre" className="form-label">
              Nombre
            </label>
            <input
              id="categoria-nombre"
              name="nombre"
              className={`form-control ${errorDe("nombre") ? "is-invalid" : ""}`}
              value={valores.nombre}
              onChange={handleChange}
            />
            {errorDe("nombre") && <div className="invalid-feedback">{errorDe("nombre")}</div>}
            {valores.nombre.trim() && (
              <div className="form-text">URL en la tienda: /categorias/{slugVisible}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="categoria-descripcion" className="form-label">
              Descripción (opcional)
            </label>
            <textarea
              id="categoria-descripcion"
              name="descripcion"
              rows="3"
              className={`form-control ${errorDe("descripcion") ? "is-invalid" : ""}`}
              value={valores.descripcion}
              onChange={handleChange}
            />
            {errorDe("descripcion") && <div className="invalid-feedback">{errorDe("descripcion")}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="categoria-imagen" className="form-label">
              Ruta de la imagen (opcional)
            </label>
            <input
              id="categoria-imagen"
              name="imagen"
              className="form-control"
              placeholder="/img/cilindro-11kg.png"
              value={valores.imagen}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear categoría"}
          </button>
        </form>
      </div>
    </>
  );
}
