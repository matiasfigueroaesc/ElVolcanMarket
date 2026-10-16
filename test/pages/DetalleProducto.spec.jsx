import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import { CARRITO_STORAGE_KEY } from "../../src/data/carrito.js";
import DetalleProducto from "../../src/pages/store/DetalleProducto.jsx";

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
  beforeEach(() => localStorage.clear());

  it("muestra el producto que indica la URL", () => {
    mostrar("/productos/2");
    expect(screen.getByRole("heading", { name: "Cilindro GLP 11 kg" })).toBeTruthy();
  });

  it("muestra un mensaje si el producto no existe", () => {
    mostrar("/productos/999");
    expect(screen.getByText("Producto no encontrado.")).toBeTruthy();
  });

  it("cambia la cantidad en el selector", () => {
    mostrar("/productos/2");
    fireEvent.change(screen.getByLabelText("Cantidad"), { target: { value: "3" } });
    expect(screen.getByLabelText("Cantidad").value).toBe("3");
  });

  it("agrega la cantidad elegida al carrito", () => {
    mostrar("/productos/2");
    fireEvent.change(screen.getByLabelText("Cantidad"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: /añadir al carrito/i }));

    expect(screen.getByText(/producto agregado/i)).toBeTruthy();
    const guardado = JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY));
    expect(guardado[0].cantidad).toBe(3);
  });
});