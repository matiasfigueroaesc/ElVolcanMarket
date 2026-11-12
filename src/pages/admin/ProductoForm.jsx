// Una sola página para crear y editar producto:
//   /admin/productos/nuevo       -> no hay :id  -> crear
//   /admin/productos/:id/editar  -> hay :id     -> editar
// Los datos se leen y se guardan en el backend (servicio catalogo).
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EstadoCarga from "../../components/EstadoCarga.jsx";
import ProductForm from "../../components/ProductForm.jsx";
import { listarCategorias } from "../../data/categorias.js";
import { actualizarProducto, crearProducto, obtenerProducto } from "../../data/productos.js";
import { useCarga } from "../../hooks/useCarga.js";

export default function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = id !== undefined;
  // Estado: error al guardar (mensaje general + errores por campo que manda el backend).
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Las categorías (para el select) y, si se edita, el producto.
  const { datos, cargando, error, recargar } = useCarga(
    () => Promise.all([listarCategorias(), editando ? obtenerProducto(id) : null]),
    [id]
  );

  if (cargando || error) return <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />;

  const [categorias, producto] = datos;

  if (editando && !producto) {
    return (
      <div className="alert alert-warning" role="status">
        Producto no encontrado. <Link to="/admin/productos">Volver al listado</Link>
      </div>
    );
  }

  async function handleGuardar(datosProducto) {
    setErrorGuardar(null);
    setGuardando(true);
    try {
      const guardado = editando
        ? await actualizarProducto(id, datosProducto)
        : await crearProducto(datosProducto);
      // Al terminar se muestra el detalle del producto recién guardado.
      navigate(`/admin/productos/${guardado.id}`, {
        state: { mensaje: editando ? "Producto actualizado." : "Producto creado." },
      });
    } catch (e) {
      // Ej.: 409 "Ya existe un producto con el código CL001."
      setErrorGuardar(e);
      setGuardando(false);
    }
  }

  return (
    <>
      <h1 className="h3">{editando ? `Editar ${producto.nombre}` : "Nuevo producto"}</h1>
      <p>
        <Link to="/admin/productos">← Volver a productos</Link>
      </p>
      {errorGuardar && (
        <div className="alert alert-danger" role="alert">
          {errorGuardar.message}
        </div>
      )}
      <div className="card shadow-sm">
        <div className="card-body">
          {/* key: si cambia el producto, React crea el formulario de nuevo con sus valores. */}
          <ProductForm
            key={id ?? "nuevo"}
            producto={producto}
            categorias={categorias}
            onGuardar={handleGuardar}
            erroresServidor={errorGuardar?.campos}
            guardando={guardando}
            textoBoton={editando ? "Guardar cambios" : "Crear producto"}
          />
        </div>
      </div>
    </>
  );
}
