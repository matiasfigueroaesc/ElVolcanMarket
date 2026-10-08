import { useState } from "react";
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
      <h1>Productos</h1>

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
