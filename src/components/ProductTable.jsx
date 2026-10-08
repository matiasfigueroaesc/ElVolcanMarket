// Tabla de productos del panel admin.
// Solo dibuja: recibe la lista por props y no lee datos por su cuenta.
import { formatearCLP } from "../utils/formato.js";

export default function ProductTable({ productos, onEliminar }) {
  return (
    <table className="table">
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
              <td>
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
  );
}
