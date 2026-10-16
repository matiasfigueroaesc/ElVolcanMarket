import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import { CARRITO_STORAGE_KEY } from "../../src/data/carrito.js";
import CategoriaDetalle from "../../src/pages/store/CategoriaDetalle.jsx";

const mostrar = (ruta) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/categorias/:slug" element={<CategoriaDetalle />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe("<CategoriaDetalle />", () => {
  beforeEach(() => localStorage.clear());

  it("muestra el título de la categoría indicada en la URL", () => {
    mostrar("/categorias/reguladores");
    expect(screen.getByRole("heading", { level: 1, name: "Reguladores" })).toBeTruthy();
  });

  it("muestra solo los productos de esa categoría", () => {
    mostrar("/categorias/reguladores");
    expect(screen.getByText("Regulador doméstico estándar")).toBeTruthy();
    expect(screen.queryByText("Cilindro GLP 11 kg")).toBeNull();
    expect(screen.getAllByRole("button", { name: /agregar/i }).length).toBe(3);
  });

  it("muestra un mensaje si la categoría no existe", () => {
    mostrar("/categorias/zzz");
    expect(screen.getByText("Categoría no encontrada.")).toBeTruthy();
  });

  it("agrega un producto al carrito al hacer clic", () => {
    mostrar("/categorias/reguladores");
    fireEvent.click(screen.getAllByRole("button", { name: /agregar/i })[0]);
    expect(JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY)).length).toBe(1);
  });
});