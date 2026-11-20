import { useState } from "react";
import { Link } from "react-router-dom";
import EstadoCarga from "../../components/EstadoCarga.jsx";
import ProductTable from "../../components/ProductTable.jsx";
import { buscarProductos, eliminarProducto, listarProductos } from "../../data/productos.js";
import { useCarga } from "../../hooks/useCarga.js";

export default function Productos() {
  // Datos: la lista de productos viene del backend. recargar() la vuelve a pedir
  // (por ejemplo, después de eliminar).
  const { datos: productos, cargando, error, recargar } = useCarga(() => listarProductos());

  // Estado: lo que el usuario escribió en el buscador.
  const [busqueda, setBusqueda] = useState("");

  // Estado: mensaje de resultado { tipo: "success" | "danger", texto }.
  const [aviso, setAviso] = useState(null);

  // Se recalcula en cada render a partir de la búsqueda (no necesita su propio estado).
  const filtrados = buscarProductos(busqueda, productos ?? []);

  // La tabla llama a esta función con el producto clickeado.
  async function handleEliminar(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    try {
      await eliminarProducto(producto.id); // 1) lo borra en el backend
      recargar(); // 2) se vuelve a pedir la lista -> React vuelve a dibujar
      setAviso({ tipo: "success", texto: `Producto "${producto.nombre}" eliminado.` });
    } catch (e) {
      setAviso({ tipo: "danger", texto: e.message });
    }
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

      {aviso && (
        <div className={`alert alert-${aviso.tipo}`} role="status">
          {aviso.texto}
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

      {productos === null ? (
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      ) : (
        <ProductTable productos={filtrados} onEliminar={handleEliminar} />
      )}
    </div>
  );
}
