import { useState } from "react";
import ContactoForm from "../../components/ContactoForm.jsx";

// La página maneja lo que pasa después del envío. La capa de datos no tiene una función para
// guardar mensajes (y src/data/ no se modifica), así que solo se confirma el envío en pantalla
// y se reinicia el formulario cambiando su `key`.
export default function Contacto() {
  const [enviado, setEnviado] = useState(false);
  const [envios, setEnvios] = useState(0);

  function recibir() {
    setEnviado(true);
    setEnvios((n) => n + 1);
  }

  return (
    <section className="container py-5">
      <h1 className="h3 mb-4">Contacto</h1>

      <div style={{ maxWidth: 560 }}>
        <p className="text-muted">
          ¿Tienes dudas o necesitas coordinar un pedido especial? Escríbenos y te responderemos a la
          brevedad.
        </p>

        {enviado && (
          <div className="alert alert-success" role="status">
            ¡Gracias! Tu mensaje fue enviado. Te responderemos a la brevedad.
          </div>
        )}

        <ContactoForm key={envios} onSubmit={recibir} />
      </div>
    </section>
  );
}
