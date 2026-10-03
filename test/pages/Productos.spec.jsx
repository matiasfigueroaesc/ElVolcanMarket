import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import Productos from "../../src/pages/store/Productos.jsx";

const mostrar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Productos />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe("<Productos />", () => {
  beforeEach(() => localStorage.clear());

  it("filtra la lista al escribir en el buscador", () => {
  mostrar();
  expect(screen.getByText("Cilindro GLP 11 kg")).toBeTruthy();

  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "detector" } });

  expect(screen.queryByText("Cilindro GLP 11 kg")).toBeNull();
  expect(screen.getByText("Detector de gas a batería")).toBeTruthy();
});

  it("filtra la lista al elegir una categoría", () => {
    mostrar();

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });

    expect(screen.queryByText("Cilindro GLP 11 kg")).toBeNull();
    expect(screen.getByText("Regulador doméstico estándar")).toBeTruthy();
  });

  it("muestra un mensaje si la búsqueda no encuentra nada", () => {
    mostrar();

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "zzzz" } });

    expect(screen.getByText(/no hay productos/i)).toBeTruthy();
  });
});