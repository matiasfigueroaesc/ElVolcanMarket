import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import { CARRITO_STORAGE_KEY } from "../../src/data/carrito.js";
import CategoriaDetalle from "../../src/pages/store/CategoriaDetalle.jsx";
import { instalarApiFalsa } from "../helpers/apiFalsa.js";

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
  beforeEach(() => {
    localStorage.clear();
    instalarApiFalsa();
  });

  it("muestra el título de la categoría indicada en la URL", async () => {
    mostrar("/categorias/reguladores");
    expect(await screen.findByRole("heading", { level: 1, name: "Reguladores" })).toBeTruthy();
  });

  it("muestra solo los productos de esa categoría", async () => {
    mostrar("/categorias/reguladores");
    expect(await screen.findByText("Regulador doméstico estándar")).toBeTruthy();
    expect(screen.queryByText("Cilindro GLP 11 kg")).toBeNull();
    expect(screen.getAllByRole("button", { name: /agregar/i }).length).toBe(3);
  });

  it("muestra un mensaje si la categoría no existe (404)", async () => {
    mostrar("/categorias/zzz");
    expect(await screen.findByText("Categoría no encontrada.")).toBeTruthy();
  });

  it("agrega un producto al carrito al hacer clic", async () => {
    mostrar("/categorias/reguladores");
    fireEvent.click((await screen.findAllByRole("button", { name: /agregar/i }))[0]);
    expect(JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY)).length).toBe(1);
  });
});