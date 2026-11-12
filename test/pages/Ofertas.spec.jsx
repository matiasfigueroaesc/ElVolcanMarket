import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import Ofertas from "../../src/pages/store/Ofertas.jsx";
import { instalarApiFalsa } from "../helpers/apiFalsa.js";

// En los datos de fábrica hay 3 productos en oferta (CL004, MG004 y AC003).
const OFERTAS = 3;

const mostrar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Ofertas />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe("<Ofertas />", () => {
  let api;
  beforeEach(() => {
    localStorage.clear();
    api = instalarApiFalsa();
  });

  it("pide solo las ofertas al backend (?oferta=true)", async () => {
    mostrar();
    await screen.findAllByRole("button", { name: /agregar/i });
    expect(api.db.peticiones.some((p) => p.ruta === "/productos")).toBeTrue();
    const [url] = window.fetch.calls.all().map((c) => c.args[0]).filter((u) => u.startsWith("/api/v1/productos"));
    expect(url).toBe("/api/v1/productos?oferta=true");
  });

  it("muestra un producto por cada oferta", async () => {
    mostrar();
    expect((await screen.findAllByRole("button", { name: /agregar/i })).length).toBe(OFERTAS);
  });

  it("muestra el precio normal tachado en cada oferta", async () => {
    mostrar();
    await screen.findAllByRole("button", { name: /agregar/i });
    expect(document.querySelectorAll("del").length).toBe(OFERTAS);
  });

  it("no muestra productos que no están en oferta", async () => {
    mostrar();
    await screen.findAllByRole("button", { name: /agregar/i });
    expect(screen.queryByText("Cilindro GLP 11 kg")).toBeNull();
  });
});