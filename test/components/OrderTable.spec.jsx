import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OrderTable from "../../src/components/OrderTable.jsx";

const ORDENES = [
  {
    id: 1,
    numero: "ORD-000001",
    fecha: "2026-09-02T14:10:00.000Z",
    cliente: { nombre: "Camila", apellidos: "Toro", correo: "c@gmail.com" },
    total: 24000,
    estadoPago: "pagado",
    estado: "entregado",
  },
  {
    id: 5,
    numero: "ORD-000005",
    fecha: "2026-10-01T10:00:00.000Z",
    cliente: { nombre: "Ana", apellidos: "Soto", correo: "a@gmail.com" },
    total: 6500,
    estadoPago: "rechazado",
    estado: "recibido",
  },
];

const mostrar = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("<OrderTable />", () => {
  it("muestra una fila por orden con número, cliente y total", () => {
    mostrar(<OrderTable ordenes={ORDENES} />);
    expect(screen.getAllByRole("row").length).toBe(3);
    const fila = screen.getByText("ORD-000001").closest("tr");
    expect(within(fila).getByText("Camila Toro")).toBeTruthy();
    expect(within(fila).getByText("$24.000")).toBeTruthy();
  });

  it("pinta el pago rechazado en rojo y el entregado en verde", () => {
    mostrar(<OrderTable ordenes={ORDENES} />);
    expect(screen.getByText("rechazado").classList).toContain("text-bg-danger");
    expect(screen.getByText("entregado").classList).toContain("text-bg-success");
  });

  it("el enlace Ver boleta lleva a la orden", () => {
    mostrar(<OrderTable ordenes={ORDENES} />);
    expect(screen.getByRole("link", { name: "Ver boleta ORD-000005" }).getAttribute("href")).toBe("/admin/ordenes/5");
  });

  it("muestra un aviso si no hay órdenes", () => {
    mostrar(<OrderTable ordenes={[]} />);
    expect(screen.getByText("No hay órdenes que mostrar.")).toBeTruthy();
  });
});
