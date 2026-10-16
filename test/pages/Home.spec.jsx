import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import { listarCategorias } from "../../src/data/categorias.js";
import Home from "../../src/pages/store/Home.jsx";

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
  beforeEach(() => localStorage.clear());

  it("muestra los tres banners del carrusel", () => {
    mostrar();
    expect(screen.getByText("Gas licuado a domicilio en Chillán")).toBeTruthy();
    expect(screen.getByText("Entrega rápida y segura")).toBeTruthy();
    expect(screen.getByText("Más de 25 años de experiencia")).toBeTruthy();
  });

  it("muestra una tarjeta enlazada por cada categoría", () => {
    mostrar();
    const enlaces = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href").startsWith("/categorias/"));
    expect(enlaces.length).toBe(listarCategorias().length);
  });

  it("muestra 6 productos destacados", () => {
    mostrar();
    expect(screen.getAllByRole("button", { name: /agregar/i }).length).toBe(6);
  });
});