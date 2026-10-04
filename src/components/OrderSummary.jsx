import { nombreComuna, nombreRegion } from "../data/regiones.js";
import { formatearCLP } from "../utils/formato.js";
import { nombreEntrega } from "../utils/entrega.js";

export default function OrderSummary({ orden }) {
  const { cliente, direccion } = orden;
  return (
    <div>
      <h2 className="h5">Orden {orden.numero}</h2>
      <p className="mb-1">
        {cliente.nombre} {cliente.apellidos} · {cliente.correo}
      </p>
      <p className="mb-1">
        {direccion.calle}
        {direccion.departamento && `, depto ${direccion.departamento}`},{" "}
        {nombreComuna(direccion.region, direccion.comuna)}, {nombreRegion(direccion.region)}
      </p>
      {direccion.entrega && <p>Entrega: {nombreEntrega(direccion.entrega)}</p>}
      <table className="table">
        <tbody>
          {orden.items.map((i) => (
            <tr key={i.id}>
              <td>{i.nombre}</td>
              <td>x{i.cantidad}</td>
              <td className="text-end">{formatearCLP(i.precio * i.cantidad)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="2">Total</th>
            <th className="text-end">{formatearCLP(orden.total)}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}