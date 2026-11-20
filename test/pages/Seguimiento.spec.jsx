import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Seguimiento from "../../src/pages/store/Seguimiento.jsx";
import { instalarApiFalsa } from "../helpers/apiFalsa.js";

const mostrar = () =>
  render(
    <MemoryRouter>
      <Seguimiento />
    </MemoryRouter>
  );

// Escribe un número en el buscador y presiona "Buscar".
function buscar(numero) {
  fireEvent.change(screen.getByLabelText("Número de pedido"), { target: { value: numero } });
  fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
}

describe("pages/store/Seguimiento", () => {
  // Cada prueba parte con los despachos de fábrica (ORD-000001 entregado, ORD-000002 en camino).
  let api;
  beforeEach(() => {
    api = instalarApiFalsa();
  });

  // Tipo: render
  it("muestra el buscador y todavía no muestra ningún pedido", () => {
    mostrar();
    expect(screen.getByRole("heading", { name: "Seguimiento de pedido" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Buscar" })).toBeTruthy();
    expect(screen.queryByLabelText("Estado del pedido")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  // Tipo: estado (el input es controlado)
  it("el input guarda lo que escribe el usuario", () => {
    mostrar();
    const input = screen.getByLabelText("Número de pedido");
    fireEvent.change(input, { target: { value: "ORD-000002" } });
    expect(input.value).toBe("ORD-000002");
  });

  // Tipo: eventos
  it("al buscar un pedido existente lo consulta al servicio despacho", async () => {
    mostrar();
    buscar("ORD-000002");
    expect(await screen.findByRole("heading", { name: "Pedido ORD-000002" })).toBeTruthy();
    expect(api.db.peticiones.some((p) => p.ruta === "/despachos/seguimiento/ORD-000002")).toBeTrue();
    expect(screen.getByText(/Despacho express · Zona Oriente/)).toBeTruthy();
  });

  // Tipo: render (sin datos personales: el seguimiento es público)
  it("no muestra los datos del comprador ni los productos", async () => {
    mostrar();
    buscar("ORD-000002");
    await screen.findByRole("heading", { name: "Pedido ORD-000002" });
    expect(screen.queryByText(/Camila/)).toBeNull();
    expect(screen.queryByText("Regulador doméstico estándar")).toBeNull();
  });

  // Tipo: eventos
  it("encuentra el pedido aunque se escriba en minúsculas y con espacios", async () => {
    mostrar();
    buscar("  ord-000001 ");
    expect(await screen.findByRole("heading", { name: "Pedido ORD-000001" })).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("marca la etapa actual del despacho y muestra el historial", async () => {
    mostrar();
    buscar("ORD-000002"); // está "en camino"
    const actual = await screen.findByText("En camino", { selector: "span" });
    expect(actual.getAttribute("aria-current")).toBe("step");
    expect(screen.getByText("Recibido", { selector: "span" }).className).toContain("text-bg-primary");
    expect(screen.getByText("Entregado", { selector: "span" }).className).toContain("text-bg-secondary");
    expect(screen.getByRole("heading", { name: "Historial" })).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("muestra un error si el pedido no existe (o su pago fue rechazado)", async () => {
    mostrar();
    buscar("ORD-999999");
    expect((await screen.findByRole("alert")).textContent).toContain("Pedido no encontrado");
    expect(screen.queryByLabelText("Estado del pedido")).toBeNull();
  });

  // Tipo: render (condicional)
  it("pide el número si se busca con el campo vacío, sin llamar al backend", () => {
    mostrar();
    buscar("   ");
    expect(screen.getByRole("alert").textContent).toBe("Ingresa el número de tu pedido.");
    expect(api.db.peticiones.length).toBe(0);
  });

  // Tipo: render (condicional)
  it("avisa si el backend no responde", async () => {
    api.db.caido = true;
    mostrar();
    buscar("ORD-000001");
    expect(await screen.findByRole("alert")).toBeTruthy();
  });

  // Tipo: estado
  it("una búsqueda fallida borra el pedido que se mostraba antes", async () => {
    mostrar();
    buscar("ORD-000001");
    expect(await screen.findByRole("heading", { name: "Pedido ORD-000001" })).toBeTruthy();
    buscar("ORD-123456");
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Pedido ORD-000001" })).toBeNull();
  });
});
