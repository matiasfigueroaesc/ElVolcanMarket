import { formatearCLP } from "../utils/formato.js";

export default function CartTable({ items, onCambiar, onQuitar }) {
  return (
    <table className="table table-striped align-middle">
      <thead>
        <tr>
          <th></th>
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
          <th className="text-end">Acción</th>
        </tr>
      </thead>
      <tbody>
        {items.map((i) => (
          <tr key={i.id}>
            <td><img src={i.imagen} alt={i.nombre} width="60" /></td>
            <td>{i.nombre}</td>
            <td>{formatearCLP(i.precio)}</td>
            <td>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                aria-label="menos"
                onClick={() => onCambiar(i.id, i.cantidad - 1)}
              >
                −
              </button>
              <span className="mx-2">{i.cantidad}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                aria-label="más"
                disabled={i.cantidad >= i.stock}
                onClick={() => onCambiar(i.id, i.cantidad + 1)}
              >
                +
              </button>
            </td>
            <td>{formatearCLP(i.precio * i.cantidad)}</td>
            <td className="text-end">
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => onQuitar(i.id)}
              >
                Quitar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}