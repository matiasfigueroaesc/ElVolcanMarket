import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import HistorialCompras from "../../src/pages/admin/HistorialCompras.jsx";
import { crearOrden } from "../../src/data/ordenes.js";

const mostrar = (ruta) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/usuarios/:id/compras" element={<HistorialCompras />} />
      </Routes>
    </MemoryRouter>
  );

const filasDeDatos = () => screen.getAllByRole("row").length - 1;

// Orden de prueba (como las que crea el checkout).
function crear({ usuarioId, estadoPago }) {
  return crearOrden({
    usuarioId,
    cliente: { nombre: "Camila", apellidos: "Toro Pizarro", correo: "camila.toro@gmail.com" },
    direccion: { calle: "Libertad 100", departamento: "", region: "nuble", comuna: "chillan", indicaciones: "" },
    items: [{ id: 1, nombre: "Cilindro GLP 5 kg", precio: 6500, cantidad: 1, imagen: "" }],
    estadoPago,
  });
}

describe("pages/admin/HistorialCompras", () => {
  beforeEach(() => localStorage.clear());

  // Tipo: render (lista)
  it("lista las compras del usuario de la URL con su resumen", () => {
    mostrar("/admin/usuarios/3/compras"); // Camila: ORD-000001 y ORD-000002
    expect(screen.getByRole("heading", { name: "Historial de compras" })).toBeTruthy();
    expect(screen.getByText(/camila\.toro@gmail\.com/)).toBeTruthy(); // encabezado con el usuario
    expect(filasDeDatos()).toBe(2);
    expect(screen.getByText("$48.990")).toBeTruthy(); // total comprado
  });

  // Tipo: render (orden)
  it("muestra primero la compra más reciente", () => {
    mostrar("/admin/usuarios/3/compras");
    const filas = screen.getAllByRole("row");
    expect(filas[1].textContent).toContain("ORD-000002");
    expect(filas[2].textContent).toContain("ORD-000001");
  });

  // Tipo: render (condicional)
  it("incluye las órdenes rechazadas con su estado de pago visible, sin sumarlas al total", () => {
    const rechazada = crear({ usuarioId: 3, estadoPago: "rechazado" });
    mostrar("/admin/usuarios/3/compras");
    expect(filasDeDatos()).toBe(3);
    const fila = screen.getByText(rechazada.numero).closest("tr");
    expect(fila.textContent).toContain("rechazado");
    expect(screen.getByText("$48.990")).toBeTruthy(); // el total no cambia
  });

  // Tipo: render (condicional)
  it("no muestra compras de invitados ni de otros usuarios", () => {
    crear({ usuarioId: null, estadoPago: "pagado" });
    mostrar("/admin/usuarios/3/compras");
    expect(filasDeDatos()).toBe(2);
  });

  // Tipo: render (condicional)
  it("avisa si el usuario no tiene compras", () => {
    mostrar("/admin/usuarios/2/compras"); // Pedro no tiene órdenes
    expect(screen.getByText("Este usuario todavía no tiene compras.")).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });

  // Tipo: props / navegación
  it("cada compra enlaza a su boleta y hay enlace para volver al detalle", () => {
    mostrar("/admin/usuarios/3/compras");
    expect(screen.getByRole("link", { name: "Ver boleta ORD-000001" }).getAttribute("href")).toBe("/admin/ordenes/1");
    expect(screen.getByRole("link", { name: /Volver al detalle/ }).getAttribute("href")).toBe("/admin/usuarios/3");
  });

  // Tipo: render (condicional)
  it("muestra un aviso si el usuario no existe", () => {
    mostrar("/admin/usuarios/999/compras");
    expect(screen.getByText(/Usuario no encontrado/)).toBeTruthy();
  });
});
