import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import { listarOfertas } from "../../src/data/productos.js";
import Ofertas from "../../src/pages/store/Ofertas.jsx";

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
  beforeEach(() => localStorage.clear());

  it("muestra un producto por cada oferta", () => {
    mostrar();
    expect(screen.getAllByRole("button", { name: /agregar/i }).length).toBe(listarOfertas().length);
  });

  it("muestra el precio normal tachado en cada oferta", () => {
    mostrar();
    expect(document.querySelectorAll("del").length).toBe(listarOfertas().length);
  });

  it("no muestra productos que no están en oferta", () => {
    mostrar();
    expect(screen.queryByText("Cilindro GLP 11 kg")).toBeNull();
  });
});