import { fireEvent, render, screen, within } from "@testing-library/react";
import Reportes from "../../src/pages/admin/Reportes.jsx";
import { crearOrden } from "../../src/data/ordenes.js";
import { eliminarProducto } from "../../src/data/productos.js";

// Valores de las 4 tarjetas: [ventas totales, órdenes, ticket promedio, unidades].
const tarjetas = () => screen.getAllByTestId("stat-valor").map((p) => p.textContent);
const escribir = (label, valor) => fireEvent.change(screen.getByLabelText(label), { target: { value: valor } });

describe("pages/admin/Reportes", () => {
  // Datos de fábrica: ORD-000001 (2 x Cilindro 11 kg) y ORD-000002 (Cilindro 15 kg + Regulador).
  beforeEach(() => localStorage.clear());

  // Tipo: render
  it("muestra el resumen de ventas pagadas", () => {
    render(<Reportes />);
    expect(screen.getByRole("heading", { level: 1, name: "Reportes" })).toBeTruthy();
    expect(tarjetas()).toEqual(["$48.990", "2", "$24.495", "4"]);
  });

  // Tipo: render (lista)
  it("lista los más vendidos empezando por el de más unidades", () => {
    render(<Reportes />);
    const items = within(screen.getByRole("region", { name: "Más vendidos" })).getAllByRole("listitem");
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain("Cilindro GLP 11 kg");
    expect(items[0].textContent).toContain("2 u.");
  });

  // Tipo: render
  it("agrupa las ventas por categoría con su porcentaje", () => {
    render(<Reportes />);
    const tabla = within(screen.getByRole("region", { name: "Ventas por categoría" }));
    const fila = tabla.getByText("Cilindros de Gas").closest("tr");
    expect(fila.textContent).toContain("$40.000");
    expect(fila.textContent).toContain("81,6 %"); // 40.000 / 48.990
    expect(tabla.getByText("Reguladores")).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("no cuenta las órdenes con pago rechazado", () => {
    crearOrden({
      usuarioId: 3,
      cliente: { nombre: "Camila", apellidos: "Toro", correo: "camila.toro@gmail.com" },
      direccion: { calle: "Libertad 100", departamento: "", region: "nuble", comuna: "chillan", indicaciones: "" },
      items: [{ id: 4, nombre: "Cilindro GLP 45 kg", precio: 39990, cantidad: 1, imagen: "" }],
      estadoPago: "rechazado",
    });
    render(<Reportes />);
    expect(tarjetas()[0]).toBe("$48.990");
    expect(screen.queryByText("Cilindro GLP 45 kg")).toBeNull();
  });

  // Tipo: render (condicional, producto eliminado)
  it("si el producto vendido ya no existe lo agrupa en 'Sin categoría'", () => {
    eliminarProducto(5); // Regulador doméstico estándar
    render(<Reportes />);
    const tabla = within(screen.getByRole("region", { name: "Ventas por categoría" }));
    expect(tabla.getByText("Sin categoría")).toBeTruthy();
    // En la tabla por producto sigue apareciendo con el nombre guardado en la orden.
    const porProducto = within(screen.getByRole("region", { name: "Ventas por producto" }));
    expect(porProducto.getByText("Regulador doméstico estándar")).toBeTruthy();
  });

  // Tipo: estado + eventos
  it("filtra por período al cambiar la fecha Desde", () => {
    render(<Reportes />);
    escribir("Desde", "2026-09-10");
    expect(tarjetas()).toEqual(["$24.990", "1", "$24.990", "2"]);
  });

  // Tipo: render (condicional)
  it("avisa si no hay ventas en el período", () => {
    render(<Reportes />);
    escribir("Desde", "2030-01-01");
    expect(screen.getByText("No hay ventas pagadas en el período seleccionado.")).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });

  // Tipo: render (condicional)
  it("avisa si la fecha Desde es posterior a Hasta", () => {
    render(<Reportes />);
    escribir("Desde", "2026-09-20");
    escribir("Hasta", "2026-09-01");
    expect(screen.getByRole("alert").textContent).toContain("no puede ser posterior");
    expect(tarjetas()[0]).toBe("$0");
  });

  // Tipo: eventos
  it("el botón Limpiar filtros vuelve a mostrar todo", () => {
    render(<Reportes />);
    escribir("Desde", "2026-09-10");
    fireEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));
    expect(screen.getByLabelText("Desde").value).toBe("");
    expect(tarjetas()[0]).toBe("$48.990");
  });
});
