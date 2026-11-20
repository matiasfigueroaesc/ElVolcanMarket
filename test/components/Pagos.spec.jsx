import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import PagoError from "../../src/pages/store/PagoError.jsx";
import PagoExitoso from "../../src/pages/store/PagoExitoso.jsx";
import { BOLETAS_SEED, instalarApiFalsa } from "../helpers/apiFalsa.js";
import { esperarCarga } from "../helpers/esperar.js";

// Boleta como la devuelve POST /boletas (el checkout la manda en el state de la navegación).
const boleta = (estadoPago) => ({
  ...BOLETAS_SEED[0],
  id: 7,
  numero: "ORD-000007",
  usuarioId: null,
  estadoPago,
  estado: estadoPago === "pagado" ? "recibido" : null,
});

const mostrar = (ruta, orden) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: ruta, state: orden ? { orden } : undefined }]}>
      <AuthProvider>
        <Routes>
          <Route path="/pago/exito/:ordenId" element={<PagoExitoso />} />
          <Route path="/pago/error/:ordenId" element={<PagoError />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

describe("Pantallas de pago", () => {
  let api;
  beforeEach(() => {
    api = instalarApiFalsa();
  });

  it("PagoExitoso muestra la boleta recibida del checkout sin volver a pedirla", async () => {
    mostrar("/pago/exito/7", boleta("pagado"));
    expect(await screen.findByText(/pago realizado con éxito/i)).toBeTruthy();
    expect(screen.getByText(/ORD-000007/)).toBeTruthy();
    expect(api.db.peticiones.some((p) => p.ruta.startsWith("/boletas"))).toBeFalse();
  });

  it("PagoExitoso imprime al pulsar el botón", async () => {
    spyOn(window, "print");
    mostrar("/pago/exito/7", boleta("pagado"));
    fireEvent.click(await screen.findByRole("button", { name: "Imprimir" }));
    expect(window.print).toHaveBeenCalled();
  });

  it("al recargar con sesión pide la boleta al backend", async () => {
    instalarApiFalsa({ sesion: "cliente" }); // Camila es dueña de la boleta 1
    mostrar("/pago/exito/1");
    expect(await screen.findByText(/ORD-000001/)).toBeTruthy();
  });

  it("PagoExitoso avisa si la orden no existe (o es de un invitado y se recargó)", async () => {
    mostrar("/pago/exito/9999");
    await esperarCarga();
    expect(screen.getByText("Orden no encontrada.")).toBeTruthy();
  });

  it("PagoError muestra el mensaje y el enlace para reintentar", async () => {
    mostrar("/pago/error/7", boleta("rechazado"));
    expect(await screen.findByText(/no pudimos procesar tu pago/i)).toBeTruthy();
    const enlace = screen.getByRole("link", { name: /volver a realizar el pago/i });
    expect(enlace.getAttribute("href")).toBe("/checkout");
  });
});
