import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Productos from "../../src/pages/admin/Productos.jsx";
import { PRODUCTOS_SEED, obtenerProducto } from "../../src/data/productos.js";

// Filas de datos (sin contar el encabezado de la tabla).
const filasDeDatos = () => screen.getAllByRole("row").length - 1;

describe("pages/admin/Productos", () => {
  // Cada prueba parte con el catálogo original.
  beforeEach(() => localStorage.clear());

  it("lista todo el catálogo al entrar", () => {
    render(<MemoryRouter><Productos /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Productos" })).toBeTruthy();
    expect(filasDeDatos()).toBe(PRODUCTOS_SEED.length);
  });

  it("filtra la tabla al escribir en el buscador (estado)", () => {
    render(<MemoryRouter><Productos /></MemoryRouter>);
    // "rg0" coincide solo con los códigos RG001, RG002 y RG003.
    fireEvent.change(screen.getByLabelText("Buscar producto"), { target: { value: "rg0" } });
    expect(filasDeDatos()).toBe(3);
  });

  it("elimina el producto si se confirma", () => {
    spyOn(window, "confirm").and.returnValue(true);
    render(<MemoryRouter><Productos /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Abrazadera metálica" }));
    expect(filasDeDatos()).toBe(PRODUCTOS_SEED.length - 1);
    expect(obtenerProducto(10)).toBeNull(); // también se borró de los datos guardados
    expect(screen.getByText('Producto "Abrazadera metálica" eliminado.')).toBeTruthy();
  });

  it("no elimina nada si se cancela", () => {
    spyOn(window, "confirm").and.returnValue(false);
    render(<MemoryRouter><Productos /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Abrazadera metálica" }));
    expect(filasDeDatos()).toBe(PRODUCTOS_SEED.length);
    expect(obtenerProducto(10)).not.toBeNull();
  });
});
