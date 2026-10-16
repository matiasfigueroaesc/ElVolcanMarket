import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { crearOrden } from "../../src/data/ordenes.js";
import PagoError from "../../src/pages/store/PagoError.jsx";
import PagoExitoso from "../../src/pages/store/PagoExitoso.jsx";

function nuevaOrden(estadoPago) {
  return crearOrden({
    usuarioId: null,
    cliente: { nombre: "Ana", apellidos: "Pérez", correo: "ana@correo.cl" },
    direccion: { calle: "Av. Libertad 100", departamento: "", region: "nuble", comuna: "chillan", indicaciones: "" },
    items: [{ id: 2, nombre: "Cilindro GLP 11 kg", precio: 12000, cantidad: 1, imagen: "" }],
    estadoPago,
  });
}

const mostrar = (ruta) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/pago/exito/:ordenId" element={<PagoExitoso />} />
        <Route path="/pago/error/:ordenId" element={<PagoError />} />
      </Routes>
    </MemoryRouter>
  );

describe("Pantallas de pago", () => {
  beforeEach(() => localStorage.clear());

  it("PagoExitoso muestra el resumen de la orden", () => {
    const orden = nuevaOrden("pagado");
    mostrar(`/pago/exito/${orden.id}`);
    expect(screen.getByText(/pago realizado con éxito/i)).toBeTruthy();
    expect(screen.getByText(new RegExp(orden.numero))).toBeTruthy();
  });

  it("PagoExitoso imprime al pulsar el botón", () => {
    spyOn(window, "print");
    const orden = nuevaOrden("pagado");
    mostrar(`/pago/exito/${orden.id}`);
    fireEvent.click(screen.getByRole("button", { name: "Imprimir" }));
    expect(window.print).toHaveBeenCalled();
  });

  it("PagoExitoso avisa si la orden no existe", () => {
    mostrar("/pago/exito/9999");
    expect(screen.getByText("Orden no encontrada.")).toBeTruthy();
  });

  it("PagoError muestra el mensaje y el enlace para reintentar", () => {
    const orden = nuevaOrden("rechazado");
    mostrar(`/pago/error/${orden.id}`);
    expect(screen.getByText(/no pudimos procesar tu pago/i)).toBeTruthy();
    const enlace = screen.getByRole("link", { name: /volver a realizar el pago/i });
    expect(enlace.getAttribute("href")).toBe("/checkout");
  });
});