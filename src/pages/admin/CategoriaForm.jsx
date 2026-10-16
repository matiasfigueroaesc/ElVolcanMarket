// Crear y editar categoría:
//   /admin/categorias/nueva        -> crear
//   /admin/categorias/:id/editar   -> editar
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  actualizarCategoria,
  crearCategoria,
  listarCategorias,
  obtenerCategoria,
  slugify,
} from "../../data/categorias.js";
import { hayErrores, validarCategoria } from "../../utils/validacionesAdmin.js";

export default function CategoriaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = id !== undefined;
  const categoria = editando ? obtenerCategoria(id) : null;

  // Estado del formulario controlado. Si se edita, parte con los datos guardados.
  const [valores, setValores] = useState({
    nombre: categoria?.nombre ?? "",
    descripcion: categoria?.descripcion ?? "",
    imagen: categoria?.imagen ?? "",
  });
  const [errores, setErrores] = useState({});

  if (editando && !categoria) {
    return (
      <div className="alert alert-warning" role="status">
        Categoría no encontrada. <Link to="/admin/categorias">Volver al listado</Link>
      </div>
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Para revisar nombres repetidos se compara con las otras categorías (no consigo misma).
    const otras = listarCategorias().filter((c) => c.id !== categoria?.id);
    const nuevosErrores = validarCategoria(valores, otras);
    setErrores(nuevosErrores);
    if (hayErrores(nuevosErrores)) return;

    const datos = {
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      imagen: valores.imagen.trim(),
      slug: slugify(valores.nombre), // la URL de la tienda: /categorias/<slug>
    };
    if (editando) actualizarCategoria(id, datos);
    else crearCategoria(datos);
    navigate("/admin/categorias");
  }

  return (
    <>
      <h1 className="h3">{editando ? `Editar ${categoria.nombre}` : "Nueva categoría"}</h1>
      <p>
        <Link to="/admin/categorias">← Volver a categorías</Link>
      </p>

      <div className="card shadow-sm">
        <form className="card-body" onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="categoria-nombre" className="form-label">
              Nombre
            </label>
            <input
              id="categoria-nombre"
              name="nombre"
              className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
              value={valores.nombre}
              onChange={handleChange}
            />
            {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
            {valores.nombre.trim() && (
              <div className="form-text">URL en la tienda: /categorias/{slugify(valores.nombre)}</div>
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
              className={`form-control ${errores.descripcion ? "is-invalid" : ""}`}
              value={valores.descripcion}
              onChange={handleChange}
            />
            {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
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

          <button type="submit" className="btn btn-primary">
            {editando ? "Guardar cambios" : "Crear categoría"}
          </button>
        </form>
      </div>
    </>
  );
}
