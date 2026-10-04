import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { crearOrden } from "../../data/ordenes.js";
import { descontarStock } from "../../data/productos.js";
import CheckoutForm from "../../components/CheckoutForm.jsx";
import { formatearCLP } from "../../utils/formato.js";

export default function Checkout() {
  const { items, total, vaciar } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section className="container py-5">
        <div className="alert alert-info">Tu carrito está vacío.</div>
        <Link to="/productos" className="btn btn-primary">Ver productos</Link>
      </section>
    );
  }

  function pagar(datos) {
    const aprobado = !datos.simularRechazo;

    const orden = crearOrden({
      usuarioId: usuario?.id ?? null,
      cliente: {
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        correo: datos.correo.trim(),
      },
      direccion: {
        calle: datos.calle,
        departamento: datos.departamento,
        region: datos.region,
        comuna: datos.comuna,
        indicaciones: datos.indicaciones,
        // Atajo: crearOrden guarda "direccion" tal cual. Lo ideal es un campo "entrega"
        // propio en la orden (requiere cambiar src/data/ordenes.js, que es de Mati).
        entrega: datos.entrega,
      },
      items,
      estadoPago: aprobado ? "pagado" : "rechazado",
    });

    if (aprobado) {
      descontarStock(items);
      vaciar();
      navigate("/pago/exito/" + orden.id);
    } else {
      navigate("/pago/error/" + orden.id); // el carrito NO se vacía
    }
  }

  // Si hay sesión, se autocompleta. usuario.direccion es un solo texto: va a "calle".
  const inicial = usuario
    ? {
        nombre: usuario.nombre ?? "",
        apellidos: usuario.apellidos ?? "",
        correo: usuario.correo ?? "",
        calle: usuario.direccion ?? "",
        region: usuario.region ?? "",
        comuna: usuario.comuna ?? "",
      }
    : {};

  return (
    <section className="container py-5">
      <h1 className="h3 mb-4">Checkout</h1>
      <div className="row g-4">
        <div className="col-lg-7">
          {/* key: useState solo lee "inicial" al montar; así se reinicia si cambia la sesión */}
          <CheckoutForm key={usuario?.id ?? "invitado"} inicial={inicial} onSubmit={pagar} />
        </div>
        <div className="col-lg-5">
          <h2 className="h5">Resumen de tu compra</h2>
          <ul className="list-group mb-3">
            {items.map((i) => (
              <li key={i.id} className="list-group-item d-flex justify-content-between">
                <span>{i.nombre} x{i.cantidad}</span>
                <span>{formatearCLP(i.precio * i.cantidad)}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>{formatearCLP(total)}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}