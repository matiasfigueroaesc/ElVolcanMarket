// Listado de productos con stock crítico: /admin/productos/criticos
// Reutiliza ProductTable: la tabla es la misma, solo cambia la lista que se le pasa.
// El backend calcula cuáles son críticos (GET /productos/criticos, ADMIN y VENDEDOR).
import { useState } from "react";
import { Link } from "react-router-dom";
import EstadoCarga from "../../components/EstadoCarga.jsx";
import ProductTable from "../../components/ProductTable.jsx";
import { eliminarProducto, listarCriticos } from "../../data/productos.js";
import { useCarga } from "../../hooks/useCarga.js";

export default function ProductosCriticos() {
  const { datos: criticos, cargando, error, recargar } = useCarga(() => listarCriticos());
  const [aviso, setAviso] = useState(null);

  async function handleEliminar(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    try {
      await eliminarProducto(producto.id);
      recargar();
      setAviso({ tipo: "success", texto: `Producto "${producto.nombre}" eliminado.` });
    } catch (e) {
      setAviso({ tipo: "danger", texto: e.message });
    }
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

      {aviso && (
        <div className={`alert alert-${aviso.tipo}`} role="status">
          {aviso.texto}
        </div>
      )}

      {criticos === null ? (
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      ) : (
        <>
          {criticos.length > 0 && (
            <p>
              <span className="badge text-bg-danger">{criticos.length}</span> producto(s) por reponer
            </p>
          )}
          <ProductTable productos={criticos} onEliminar={handleEliminar} />
        </>
      )}
    </div>
  );
}
