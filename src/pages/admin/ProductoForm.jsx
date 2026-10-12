// Una sola página para crear y editar producto:
//   /admin/productos/nuevo       -> no hay :id  -> crear
//   /admin/productos/:id/editar  -> hay :id     -> editar
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/ProductForm.jsx";
import { listarCategorias } from "../../data/categorias.js";
import { actualizarProducto, crearProducto, obtenerProducto } from "../../data/productos.js";

export default function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = id !== undefined;
  const producto = editando ? obtenerProducto(id) : null;

  if (editando && !producto) {
    return (
      <div className="alert alert-warning" role="status">
        Producto no encontrado. <Link to="/admin/productos">Volver al listado</Link>
      </div>
    );
  }

  function handleGuardar(datos) {
    const guardado = editando ? actualizarProducto(id, datos) : crearProducto(datos);
    // Al terminar se muestra el detalle del producto recién guardado.
    navigate(`/admin/productos/${guardado.id}`, {
      state: { mensaje: editando ? "Producto actualizado." : "Producto creado." },
    });
  }

  return (
    <>
      <h1 className="h3">{editando ? `Editar ${producto.nombre}` : "Nuevo producto"}</h1>
      <p>
        <Link to="/admin/productos">← Volver a productos</Link>
      </p>
      <div className="card shadow-sm">
        <div className="card-body">
          {/* key: si cambia el producto, React crea el formulario de nuevo con sus valores. */}
          <ProductForm
            key={id ?? "nuevo"}
            producto={producto}
            categorias={listarCategorias()}
            onGuardar={handleGuardar}
            textoBoton={editando ? "Guardar cambios" : "Crear producto"}
          />
        </div>
      </div>
    </>
  );
}
