// Tabla de productos del panel admin.
// Solo dibuja: recibe la lista por props y no lee datos por su cuenta.
import { Link } from "react-router-dom";
import { formatearCLP } from "../utils/formato.js";

export default function ProductTable({ productos, onEliminar }) {
  // Renderizado condicional: si no hay nada que mostrar, un aviso en vez de una tabla vacía.
  if (productos.length === 0) {
    return (
      <p className="alert alert-info" role="status">
        No hay productos que mostrar.
      </p>
    );
  }

  return (
    // table-responsive: en celular la tabla se desplaza dentro de su caja y no rompe la página.
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => {
            // Stock crítico: quedan igual o menos unidades que el mínimo definido.
            const critico = p.stock <= p.stockCritico;
            return (
              <tr key={p.id} className={critico ? "table-warning" : undefined}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{formatearCLP(p.precio)}</td>
                <td>
                  {p.stock}
                  {critico && <span className="badge text-bg-danger ms-2">Crítico</span>}
                </td>
                <td className="text-nowrap">
                  <Link to={`/admin/productos/${p.id}`} className="btn btn-sm btn-outline-secondary me-1">
                    Ver
                  </Link>
                  <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-primary me-1">
                    Editar
                  </Link>
                  {/* La tabla no elimina: solo avisa a la página qué producto se clickeó. */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    aria-label={`Eliminar ${p.nombre}`}
                    onClick={() => onEliminar(p)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
