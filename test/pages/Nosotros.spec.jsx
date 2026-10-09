import { render, screen } from "@testing-library/react";
import Nosotros from "../../src/pages/store/Nosotros.jsx";

describe("<Nosotros />", () => {
  // Tipo: render
  it("muestra el título principal y las secciones de contenido", () => {
    render(<Nosotros />);
    expect(screen.getByRole("heading", { level: 1, name: "Quiénes somos" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Nuestra historia" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Compromiso de suministro" })).toBeTruthy();
  });

  // Tipo: render (lista)
  it("renderiza las 3 tarjetas del equipo e infraestructura", () => {
    render(<Nosotros />);
    expect(screen.getByText("Logística y distribución")).toBeTruthy();
    expect(screen.getByText("Atención telefónica")).toBeTruthy();
    expect(screen.getByText("Administración y control")).toBeTruthy();
  });

  // Tipo: render (lista)
  it("renderiza a los 3 integrantes del equipo de desarrollo con su rol", () => {
    render(<Nosotros />);
    expect(screen.getByText("Matias Figueroa")).toBeTruthy();
    expect(screen.getByText("Fabian Rubio")).toBeTruthy();
    expect(screen.getByText("Renato Figueroa")).toBeTruthy();
    expect(screen.getByText("Documentación y QA")).toBeTruthy();
  });

  // Tipo: render
  it("menciona los formatos de cilindro disponibles", () => {
    render(<Nosotros />);
    expect(screen.getByText("5 kg, 11 kg y 15 kg")).toBeTruthy();
  });
});
