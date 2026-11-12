import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import { CARRITO_STORAGE_KEY } from "../../src/data/carrito.js";
import DetalleProducto from "../../src/pages/store/DetalleProducto.jsx";
import { instalarApiFalsa } from "../helpers/apiFalsa.js";

const mostrar = (ruta) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/productos/:id" element={<DetalleProducto />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe("<DetalleProducto />", () => {
  beforeEach(() => {
    localStorage.clear();
    instalarApiFalsa();
  });

  it("muestra el producto que indica la URL con su categoría", async () => {
    mostrar("/productos/2");
    expect(await screen.findByRole("heading", { name: "Cilindro GLP 11 kg" })).toBeTruthy();
    expect(screen.getByText("Cilindros de Gas")).toBeTruthy();
  });

  it("muestra un mensaje si el producto no existe (404)", async () => {
    mostrar("/productos/999");
    expect(await screen.findByText("Producto no encontrado.")).toBeTruthy();
  });

  it("cambia la cantidad en el selector", async () => {
    mostrar("/productos/2");
    fireEvent.change(await screen.findByLabelText("Cantidad"), { target: { value: "3" } });
    expect(screen.getByLabelText("Cantidad").value).toBe("3");
  });

  it("agrega la cantidad elegida al carrito", async () => {
    mostrar("/productos/2");
    fireEvent.change(await screen.findByLabelText("Cantidad"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: /añadir al carrito/i }));

    expect(screen.getByText(/producto agregado/i)).toBeTruthy();
    const guardado = JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY));
    expect(guardado[0].cantidad).toBe(3);
  });
});