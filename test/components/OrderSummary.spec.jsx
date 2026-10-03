import { render, screen } from "@testing-library/react";
import OrderSummary from "../../src/components/OrderSummary.jsx";

const orden = {
  numero: "ORD-000007",
  cliente: { nombre: "Ana", apellidos: "Pérez", correo: "ana@correo.cl" },
  direccion: { calle: "Av. Libertad 100", departamento: "", region: "nuble", comuna: "chillan", indicaciones: "" },
  items: [
    { id: 2, nombre: "Cilindro GLP 11 kg", precio: 12000, cantidad: 2, imagen: "" },
    { id: 5, nombre: "Regulador doméstico estándar", precio: 8990, cantidad: 1, imagen: "" },
  ],
  total: 32990,
};

describe("<OrderSummary />", () => {
  it("muestra el número de orden, el cliente y el total", () => {
    render(<OrderSummary orden={orden} />);
    expect(screen.getByText(/ORD-000007/)).toBeTruthy();
    expect(screen.getByText(/ana@correo.cl/)).toBeTruthy();
    expect(screen.getByText("$32.990")).toBeTruthy();
  });

  it("muestra una fila por producto y la comuna con su nombre", () => {
    render(<OrderSummary orden={orden} />);
    expect(screen.getByText("Cilindro GLP 11 kg")).toBeTruthy();
    expect(screen.getByText("Regulador doméstico estándar")).toBeTruthy();
    expect(screen.getByText(/Chillán/)).toBeTruthy();
  });
});