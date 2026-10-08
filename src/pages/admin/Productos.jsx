import { useState } from "react";
import { Link } from "react-router-dom";
import ProductTable from "../../components/ProductTable.jsx";
import { buscarProductos, eliminarProducto, listarProductos } from "../../data/productos.js";

export default function Productos() {
  // Estado: la lista de productos. Es estado porque cambia al eliminar.
  // La función dentro de useState se ejecuta solo la primera vez.
  const [productos, setProductos] = useState(() => listarProductos());

  // Estado: lo que el usuario escribió en el buscador.
  const [busqueda, setBusqueda] = useState("");

  // Estado: mensaje de confirmación después de eliminar.
  const [mensaje, setMensaje] = useState("");

  // Se recalcula en cada render a partir de la búsqueda (no necesita su propio estado).
  const filtrados = buscarProductos(busqueda, productos);

  // La tabla llama a esta función con el producto clickeado.
  function handleEliminar(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    eliminarProducto(producto.id); // 1) lo borra de los datos guardados
    setProductos(listarProductos()); // 2) actualiza el estado -> React vuelve a dibujar
    setMensaje(`Producto "${producto.nombre}" eliminado.`);
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="mb-0">Productos</h1>
        <div className="d-flex gap-2">
          <Link to="/admin/productos/criticos" className="btn btn-outline-danger">
            Ver críticos
          </Link>
          <Link to="/admin/productos/nuevo" className="btn btn-primary">
            Nuevo producto
          </Link>
        </div>
      </div>

      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}

      <label htmlFor="buscar-producto" className="visually-hidden">
        Buscar producto
      </label>
      <input
        id="buscar-producto"
        type="search"
        className="form-control mb-3"
        placeholder="Buscar por nombre, código o descripción"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <ProductTable productos={filtrados} onEliminar={handleEliminar} />
    </div>
  );
}
