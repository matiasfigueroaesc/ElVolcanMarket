import { fireEvent, render, screen } from "@testing-library/react";
import Contacto from "../../src/pages/store/Contacto.jsx";

describe("<Contacto />", () => {
  // Tipo: render
  it("muestra el título y el formulario", () => {
    render(<Contacto />);
    expect(screen.getByRole("heading", { level: 1, name: "Contacto" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Enviar mensaje" })).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("no muestra la confirmación antes de enviar", () => {
    render(<Contacto />);
    expect(screen.queryByText(/mensaje fue enviado/i)).toBeNull();
  });

  // Tipo: eventos / estado
  it("al enviar un mensaje válido confirma el envío y limpia el formulario", () => {
    render(<Contacto />);
    fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "Ana Pérez" } });
    fireEvent.change(screen.getByLabelText("Comentario"), { target: { value: "Consulta por despacho" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(screen.getByText(/mensaje fue enviado/i)).toBeTruthy();
    expect(screen.getByLabelText("Nombre completo").value).toBe("");
  });

  // Tipo: eventos (renderizado condicional)
  it("no confirma el envío si el formulario tiene errores", () => {
    render(<Contacto />);
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(screen.queryByText(/mensaje fue enviado/i)).toBeNull();
  });
});
