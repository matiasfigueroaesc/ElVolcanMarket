import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductosCriticos from "../../src/pages/admin/ProductosCriticos.jsx";
import { actualizarProducto, obtenerProducto } from "../../src/data/productos.js";

const mostrar = () =>
  render(
    <MemoryRouter>
      <ProductosCriticos />
    </MemoryRouter>
  );

describe("pages/admin/ProductosCriticos", () => {
  beforeEach(() => localStorage.clear());

  it("lista solo los productos con stock crítico", () => {
    mostrar();
    // En los datos de fábrica solo el detector (stock 4, crítico 5) está crítico.
    expect(screen.getByText("Detector de gas a batería")).toBeTruthy();
    expect(screen.queryByText("Cilindro GLP 11 kg")).toBeNull();
  });

  it("incluye un producto apenas su stock baja al crítico", () => {
    actualizarProducto(2, { stock: 10 }); // crítico del 11 kg = 10
    mostrar();
    expect(screen.getByText("Cilindro GLP 11 kg")).toBeTruthy();
  });

  it("muestra el aviso de tabla vacía si no hay críticos", () => {
    actualizarProducto(14, { stock: 50 });
    mostrar();
    expect(screen.getByText("No hay productos que mostrar.")).toBeTruthy();
  });

  it("elimina desde la lista y la actualiza", () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrar();
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Detector de gas a batería" }));
    expect(obtenerProducto(14)).toBeNull();
    expect(screen.getByText("No hay productos que mostrar.")).toBeTruthy();
  });
});
