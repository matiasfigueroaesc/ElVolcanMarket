import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import { CARRITO_STORAGE_KEY } from "../../src/data/carrito.js";
import Carrito from "../../src/pages/store/Carrito.jsx";
import { instalarApiFalsa } from "../helpers/apiFalsa.js";

const item = { id: 2, nombre: "Cilindro GLP 11 kg", precio: 12000, imagen: "", cantidad: 2, stock: 10 };

const mostrar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Carrito />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe("<Carrito />", () => {
  // El carrito sigue en localStorage; AuthProvider consulta la sesión al backend falso.
  beforeEach(() => {
    localStorage.clear();
    instalarApiFalsa();
  });

  it("muestra un mensaje si el carrito está vacío", () => {
    mostrar();
    expect(screen.getByText(/carrito está vacío/i)).toBeTruthy();
  });

  it("muestra el producto y el total", () => {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify([item]));
    mostrar();
    expect(screen.getByText("Cilindro GLP 11 kg")).toBeTruthy();
    expect(screen.getAllByText("$24.000").length).toBeGreaterThan(0);
  });

  it("aumenta la cantidad con el botón más", () => {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify([item]));
    mostrar();
    fireEvent.click(screen.getByRole("button", { name: "más" }));
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("quita el producto con el botón Quitar", () => {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify([item]));
    mostrar();
    fireEvent.click(screen.getByRole("button", { name: "Quitar" }));
    expect(screen.getByText(/carrito está vacío/i)).toBeTruthy();
  });

  it("vacía el carrito con Limpiar carrito", () => {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify([item]));
    mostrar();
    fireEvent.click(screen.getByRole("button", { name: /limpiar carrito/i }));
    expect(screen.getByText(/carrito está vacío/i)).toBeTruthy();
  });
});