import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Seguimiento from "../../src/pages/store/Seguimiento.jsx";
import { crearOrden } from "../../src/data/ordenes.js";

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
  // Cada prueba parte con las órdenes de fábrica (ORD-000001 y ORD-000002 de Camila).
  beforeEach(() => localStorage.clear());

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
  it("al buscar un pedido existente muestra su resumen", () => {
    mostrar();
    buscar("ORD-000002");
    expect(screen.getByRole("heading", { name: "Orden ORD-000002" })).toBeTruthy();
    expect(screen.getByText("Regulador doméstico estándar")).toBeTruthy();
  });

  // Tipo: eventos
  it("encuentra el pedido aunque se escriba en minúsculas y con espacios", () => {
    mostrar();
    buscar("  ord-000001 ");
    expect(screen.getByRole("heading", { name: "Orden ORD-000001" })).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("marca la etapa actual del despacho en la línea de tiempo", () => {
    mostrar();
    buscar("ORD-000002"); // está "en camino"
    expect(screen.getByText("En camino").getAttribute("aria-current")).toBe("step");
    expect(screen.getByText("Recibido").className).toContain("text-bg-primary");
    expect(screen.getByText("Entregado").className).toContain("text-bg-secondary");
  });

  // Tipo: render (condicional)
  it("muestra un error si el pedido no existe", () => {
    mostrar();
    buscar("ORD-999999");
    expect(screen.getByRole("alert").textContent).toContain("Pedido no encontrado");
    expect(screen.queryByLabelText("Estado del pedido")).toBeNull();
  });

  // Tipo: render (condicional)
  it("pide el número si se busca con el campo vacío", () => {
    mostrar();
    buscar("   ");
    expect(screen.getByRole("alert").textContent).toBe("Ingresa el número de tu pedido.");
  });

  // Tipo: render (condicional)
  it("en un pago rechazado avisa que no se despacha y no muestra la línea de tiempo", () => {
    const orden = crearOrden({
      cliente: { nombre: "Ana", apellidos: "Soto", correo: "ana@gmail.com" },
      direccion: { calle: "Libertad 100", departamento: "", region: "nuble", comuna: "chillan", indicaciones: "" },
      items: [{ id: 1, nombre: "Cilindro GLP 5 kg", precio: 6500, cantidad: 1, imagen: "" }],
      estadoPago: "rechazado",
    });
    mostrar();
    buscar(orden.numero);
    expect(screen.getByRole("alert").textContent).toContain("rechazado");
    expect(screen.queryByLabelText("Estado del pedido")).toBeNull();
  });

  // Tipo: estado
  it("una búsqueda fallida borra el pedido que se mostraba antes", () => {
    mostrar();
    buscar("ORD-000001");
    expect(screen.getByRole("heading", { name: "Orden ORD-000001" })).toBeTruthy();
    buscar("ORD-123456");
    expect(screen.queryByRole("heading", { name: "Orden ORD-000001" })).toBeNull();
    expect(screen.getByRole("alert")).toBeTruthy();
  });
});
