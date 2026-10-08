// Listado de productos con stock crítico: /admin/productos/criticos
// Reutiliza ProductTable: la tabla es la misma, solo cambia la lista que se le pasa.
import { useState } from "react";
import { Link } from "react-router-dom";
import ProductTable from "../../components/ProductTable.jsx";
import { eliminarProducto, listarCriticos } from "../../data/productos.js";

export default function ProductosCriticos() {
  const [criticos, setCriticos] = useState(() => listarCriticos());
  const [mensaje, setMensaje] = useState("");

  function handleEliminar(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    eliminarProducto(producto.id);
    setCriticos(listarCriticos());
    setMensaje(`Producto "${producto.nombre}" eliminado.`);
  }

  return (
    <div>
      <h1>Productos críticos</h1>
      <p className="text-muted">
        Productos con stock igual o menor a su stock crítico. Hay que reponerlos pronto.
      </p>
      <p>
        <Link to="/admin/productos">← Volver a productos</Link>
      </p>

      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}

      {criticos.length > 0 && (
        <p>
          <span className="badge text-bg-danger">{criticos.length}</span> producto(s) por reponer
        </p>
      )}

      <ProductTable productos={criticos} onEliminar={handleEliminar} />
    </div>
  );
}
