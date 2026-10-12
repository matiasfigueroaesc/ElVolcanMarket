// Tabla de categorías del panel admin.
// Igual que ProductTable: solo dibuja lo que recibe por props y avisa los clics.
import { Link } from "react-router-dom";

// conteo = { [categoriaId]: cantidad de productos }
export default function CategoryTable({ categorias, conteo = {}, onEliminar }) {
  if (categorias.length === 0) {
    return (
      <p className="alert alert-info" role="status">
        No hay categorías registradas.
      </p>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td className="small text-muted">{c.descripcion}</td>
              <td>{conteo[c.id] ?? 0}</td>
              <td className="text-nowrap">
                <Link to={`/admin/categorias/${c.id}/editar`} className="btn btn-sm btn-outline-primary me-1">
                  Editar
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  aria-label={`Eliminar ${c.nombre}`}
                  onClick={() => onEliminar(c)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
