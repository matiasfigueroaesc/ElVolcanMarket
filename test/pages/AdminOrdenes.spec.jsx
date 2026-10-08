import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Ordenes from "../../src/pages/admin/Ordenes.jsx";
import Boleta from "../../src/pages/admin/Boleta.jsx";
import { crearOrden, obtenerOrden } from "../../src/data/ordenes.js";

const mostrar = (ruta) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/ordenes" element={<Ordenes />} />
        <Route path="/admin/ordenes/:id" element={<Boleta />} />
      </Routes>
    </MemoryRouter>
  );

const filasDeDatos = () => screen.getAllByRole("row").length - 1;

// Orden con pago rechazado, como la que crea el checkout al simular un rechazo.
function crearRechazada() {
  return crearOrden({
    cliente: { nombre: "Ana", apellidos: "Soto", correo: "ana@gmail.com" },
    direccion: { calle: "Libertad 100", departamento: "", region: "nuble", comuna: "chillan", indicaciones: "" },
    items: [{ id: 1, nombre: "Cilindro GLP 5 kg", precio: 6500, cantidad: 1, imagen: "" }],
    estadoPago: "rechazado",
  });
}

describe("pages/admin/Ordenes", () => {
  beforeEach(() => localStorage.clear());

  it("lista las órdenes pagadas y suma el total vendido", () => {
    mostrar("/admin/ordenes");
    expect(filasDeDatos()).toBe(2);
    expect(screen.getByText(/Total vendido/).textContent).toContain("$48.990");
  });

  it("oculta los pagos rechazados hasta marcar la casilla (estado)", () => {
    crearRechazada();
    mostrar("/admin/ordenes");
    expect(filasDeDatos()).toBe(2);
    fireEvent.click(screen.getByLabelText("Ver pagos rechazados"));
    expect(filasDeDatos()).toBe(3);
    expect(screen.getByText("ORD-000003")).toBeTruthy();
  });

  it("filtra por estado y por texto", () => {
    mostrar("/admin/ordenes");
    fireEvent.change(screen.getByLabelText("Filtrar por estado"), { target: { value: "en camino" } });
    expect(filasDeDatos()).toBe(1);
    expect(screen.getByText("ORD-000002")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Filtrar por estado"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Buscar orden"), { target: { value: "000001" } });
    expect(filasDeDatos()).toBe(1);

    fireEvent.change(screen.getByLabelText("Buscar orden"), { target: { value: "nadie" } });
    expect(screen.getByText("No hay órdenes que mostrar.")).toBeTruthy();
  });
});

describe("pages/admin/Boleta", () => {
  beforeEach(() => localStorage.clear());

  it("muestra la boleta de la orden de la URL", () => {
    mostrar("/admin/ordenes/2");
    expect(screen.getByRole("heading", { name: "Boleta ORD-000002" })).toBeTruthy();
    expect(screen.getByText("Regulador doméstico estándar")).toBeTruthy();
    expect(screen.getByText("$24.990")).toBeTruthy();
  });

  it("cambia el estado del despacho y lo guarda", () => {
    mostrar("/admin/ordenes/2");
    fireEvent.change(screen.getByLabelText("Estado del despacho"), { target: { value: "entregado" } });
    expect(screen.getByText('Estado actualizado a "entregado".')).toBeTruthy();
    expect(obtenerOrden(2).estado).toBe("entregado");
  });

  it("en un pago rechazado avisa y bloquea el cambio de estado", () => {
    const orden = crearRechazada();
    mostrar(`/admin/ordenes/${orden.id}`);
    expect(screen.getByRole("alert").textContent).toContain("rechazado");
    expect(screen.getByLabelText("Estado del despacho").disabled).toBeTrue();
  });

  it("el botón imprimir llama a window.print", () => {
    spyOn(window, "print");
    mostrar("/admin/ordenes/1");
    fireEvent.click(screen.getByRole("button", { name: "Imprimir boleta" }));
    expect(window.print).toHaveBeenCalled();
  });

  it("muestra un aviso si la orden no existe", () => {
    mostrar("/admin/ordenes/999");
    expect(screen.getByText(/Orden no encontrada/)).toBeTruthy();
  });
});
