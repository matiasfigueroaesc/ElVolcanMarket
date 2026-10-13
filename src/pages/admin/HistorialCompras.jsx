// Historial de compras de un usuario: /admin/usuarios/:id/compras
// Vista nueva de la Eval 2. Reutiliza OrderTable (la tabla de /admin/ordenes),
// así cada compra muestra su estado de pago, su estado de despacho y el enlace a la boleta.
import { Link, useParams } from "react-router-dom";
import OrderTable from "../../components/OrderTable.jsx";
import { listarPorUsuario } from "../../data/ordenes.js";
import { obtenerUsuario } from "../../data/usuarios.js";
import { formatearCLP } from "../../utils/formato.js";

export default function HistorialCompras() {
  const { id } = useParams(); // string: obtenerUsuario y listarPorUsuario lo convierten con Number()
  const usuario = obtenerUsuario(id);

  if (!usuario) {
    return (
      <div className="alert alert-warning" role="status">
        Usuario no encontrado. <Link to="/admin/usuarios">Volver al listado</Link>
      </div>
    );
  }

  // Todas las órdenes del usuario, incluidas las de pago rechazado (la tabla muestra el estado
  // de pago de cada una). Las más nuevas primero. Las compras como invitado (usuarioId null)
  // no quedan asociadas a ninguna cuenta, por eso no aparecen aquí.
  const ordenes = listarPorUsuario(usuario.id).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const pagadas = ordenes.filter((o) => o.estadoPago === "pagado");
  const rechazadas = ordenes.length - pagadas.length;
  const totalComprado = pagadas.reduce((acc, o) => acc + o.total, 0);

  return (
    <div>
      <p>
        <Link to={`/admin/usuarios/${usuario.id}`}>← Volver al detalle del usuario</Link>
      </p>
      <h1 className="h3">Historial de compras</h1>
      <p className="text-muted">
        {usuario.nombre} {usuario.apellidos} · {usuario.correo}
      </p>

      {/* Renderizado condicional: si no hay compras, un aviso en vez de la tabla y el resumen. */}
      {ordenes.length === 0 ? (
        <p className="alert alert-info" role="status">
          Este usuario todavía no tiene compras.
        </p>
      ) : (
        <>
          <p className="small">
            Compras pagadas: <strong>{pagadas.length}</strong> · Total comprado:{" "}
            <strong>{formatearCLP(totalComprado)}</strong> · Pagos rechazados: <strong>{rechazadas}</strong>
          </p>
          <OrderTable ordenes={ordenes} />
        </>
      )}
    </div>
  );
}
