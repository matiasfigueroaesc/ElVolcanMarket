import { fireEvent, render, screen } from "@testing-library/react";
import { esperarQue } from "../helpers/esperar.js";
import { MemoryRouter } from "react-router-dom";
import Productos from "../../src/pages/admin/Productos.jsx";
import { PRODUCTOS_SEED, conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";

// Filas de datos (sin contar el encabezado de la tabla).
const filasDeDatos = () => screen.getAllByRole("row").length - 1;
const mostrar = () => render(<MemoryRouter><Productos /></MemoryRouter>);

describe("pages/admin/Productos", () => {
  let api;
  // Cada prueba parte con el catálogo original del backend falso.
  beforeEach(() => {
    api = instalarApiFalsa();
    conToken("admin");
  });

  it("lista todo el catálogo al entrar", async () => {
    mostrar();
    expect(screen.getByRole("heading", { name: "Productos" })).toBeTruthy();
    await screen.findByText("Cilindro GLP 11 kg");
    expect(filasDeDatos()).toBe(PRODUCTOS_SEED.length);
  });

  it("filtra la tabla al escribir en el buscador (estado)", async () => {
    mostrar();
    await screen.findByText("Cilindro GLP 11 kg");
    // "rg0" coincide solo con los códigos RG001, RG002 y RG003.
    fireEvent.change(screen.getByLabelText("Buscar producto"), { target: { value: "rg0" } });
    expect(filasDeDatos()).toBe(3);
  });

  it("elimina el producto en el backend si se confirma", async () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrar();
    fireEvent.click(await screen.findByRole("button", { name: "Eliminar Abrazadera metálica" }));
    expect(await screen.findByText('Producto "Abrazadera metálica" eliminado.')).toBeTruthy();
    await esperarQue(() => filasDeDatos() === PRODUCTOS_SEED.length - 1);
    expect(api.db.productos.find((p) => p.id === 10)).toBeUndefined();
  });

  it("no elimina nada si se cancela", async () => {
    spyOn(window, "confirm").and.returnValue(false);
    mostrar();
    fireEvent.click(await screen.findByRole("button", { name: "Eliminar Abrazadera metálica" }));
    expect(filasDeDatos()).toBe(PRODUCTOS_SEED.length);
    expect(api.db.peticiones.some((p) => p.metodo === "DELETE")).toBeFalse();
  });

  it("muestra el error si el backend no responde", async () => {
    api.db.caido = true;
    mostrar();
    expect((await screen.findByRole("alert")).textContent).toContain("No se pudo conectar");
  });
});
