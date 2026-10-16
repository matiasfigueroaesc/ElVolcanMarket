import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ZonasDespacho from "../../src/pages/store/ZonasDespacho.jsx";
import { ZONAS_DESPACHO } from "../../src/utils/zonasDespacho.js";

const mostrar = () =>
  render(
    <MemoryRouter>
      <ZonasDespacho />
    </MemoryRouter>
  );

// Filas de datos de la tabla (sin contar el encabezado).
const filasDeDatos = () => within(screen.getByRole("table")).getAllByRole("row").length - 1;

describe("pages/store/ZonasDespacho", () => {
  // Tipo: render (lista)
  it("renderiza una fila por cada zona de despacho", () => {
    mostrar();
    expect(screen.getByRole("heading", { level: 1, name: "Zonas de despacho" })).toBeTruthy();
    expect(filasDeDatos()).toBe(ZONAS_DESPACHO.length);
  });

  // Tipo: render
  it("muestra las comunas con su nombre y no con el value guardado", () => {
    mostrar();
    const fila = screen.getByText("Zona Oriente").closest("tr");
    expect(within(fila).getByText("Chillán (sector oriente), Chillán Viejo")).toBeTruthy();
    expect(screen.queryByText(/chillan-viejo/)).toBeNull();
  });

  // Tipo: render (condicional)
  it("no muestra resultado hasta que se elige una comuna", () => {
    mostrar();
    expect(screen.queryByRole("status")).toBeNull();
  });

  // Tipo: eventos + estado
  it("al elegir una comuna muestra las zonas que llegan a ella", () => {
    mostrar();
    fireEvent.change(screen.getByLabelText("Comuna"), { target: { value: "bulnes" } });
    const resultado = screen.getByRole("status");
    expect(resultado.textContent).toContain("Bulnes");
    expect(within(resultado).getAllByRole("listitem").length).toBe(1);
    expect(resultado.textContent).toContain("Zona Sur");
  });

  // Tipo: eventos + estado
  it("Chillán aparece en dos zonas", () => {
    mostrar();
    fireEvent.change(screen.getByLabelText("Comuna"), { target: { value: "chillan" } });
    expect(within(screen.getByRole("status")).getAllByRole("listitem").length).toBe(2);
  });

  // Tipo: props / navegación
  it("enlaza al seguimiento de pedidos", () => {
    mostrar();
    expect(screen.getByRole("link", { name: "Revisa en qué etapa va" }).getAttribute("href")).toBe("/seguimiento");
  });
});
