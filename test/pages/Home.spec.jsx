import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import Home from "../../src/pages/store/Home.jsx";
import { CATEGORIAS_SEED, instalarApiFalsa } from "../helpers/apiFalsa.js";

const mostrar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Home />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe("<Home />", () => {
  let api;
  beforeEach(() => {
    localStorage.clear();
    api = instalarApiFalsa();
  });

  it("muestra los tres banners del carrusel", () => {
    mostrar();
    expect(screen.getByText("Gas licuado a domicilio en Chillán")).toBeTruthy();
    expect(screen.getByText("Entrega rápida y segura")).toBeTruthy();
    expect(screen.getByText("Más de 25 años de experiencia")).toBeTruthy();
  });

  it("muestra una tarjeta enlazada por cada categoría", async () => {
    mostrar();
    await screen.findAllByText("Cilindros de Gas");
    const enlaces = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href").startsWith("/categorias/"));
    expect(enlaces.length).toBe(CATEGORIAS_SEED.length);
  });

  it("muestra 6 productos destacados con el nombre de su categoría", async () => {
    mostrar();
    expect((await screen.findAllByRole("button", { name: /agregar/i })).length).toBe(6);
    expect(screen.getAllByText("Cilindros de Gas", { selector: ".badge" }).length).toBe(4);
  });

  it("si el backend no responde muestra el error y un botón para reintentar", async () => {
    api.db.caido = true;
    mostrar();
    expect((await screen.findByRole("alert")).textContent).toContain("No se pudo conectar con el servidor");
    api.db.caido = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect((await screen.findAllByRole("button", { name: /agregar/i })).length).toBe(6);
  });
});