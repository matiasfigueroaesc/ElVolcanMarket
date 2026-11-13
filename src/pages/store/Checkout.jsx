import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { textoError } from "../../api/cliente.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { crearOrden } from "../../data/ordenes.js";
import CheckoutForm from "../../components/CheckoutForm.jsx";
import { formatearCLP } from "../../utils/formato.js";

export default function Checkout() {
  const { items, total, vaciar } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <section className="container py-5">
        <div className="alert alert-info">Tu carrito está vacío.</div>
        <Link to="/productos" className="btn btn-primary">Ver productos</Link>
      </section>
    );
  }

  async function pagar(datos) {
    setError("");
    setEnviando(true);
    try {
      // El backend (servicio ventas) crea la boleta, cobra con el precio real del catálogo
      // y descuenta el stock. Si hay sesión, la boleta queda a nombre del usuario.
      const orden = await crearOrden({
        cliente: {
          nombre: datos.nombre.trim(),
          apellidos: datos.apellidos.trim(),
          correo: datos.correo.trim(),
        },
        direccion: {
          calle: datos.calle.trim(),
          departamento: datos.departamento.trim(),
          region: datos.region,
          comuna: datos.comuna,
          indicaciones: datos.indicaciones.trim(),
        },
        entrega: datos.entrega,
        items,
        simularRechazo: datos.simularRechazo,
      });
      // La boleta viaja en el "state" de la navegación: así la página de resultado la
      // muestra aunque la compra sea como invitado (sin sesión no se puede volver a pedir).
      if (orden.estadoPago === "pagado") {
        navigate("/pago/exito/" + orden.id, { state: { orden } });
        vaciar();
      } else {
        navigate("/pago/error/" + orden.id, { state: { orden } }); // el carrito NO se vacía
      }
    } catch (e) {
      // Ej.: 409 "Stock insuficiente para Cilindro GLP 15 kg." o el backend apagado.
      setError(textoError(e));
      setEnviando(false);
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
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <CheckoutForm key={usuario?.id ?? "invitado"} inicial={inicial} onSubmit={pagar} enviando={enviando} />
        </div>
        <div className="col-lg-5">
          <h2 className="h5">Resumen de tu compra</h2>
          <p className="small text-muted">El total final se confirma con el precio vigente al pagar.</p>
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