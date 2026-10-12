import { fireEvent, render, screen } from "@testing-library/react";
import ContactoForm from "../../src/components/ContactoForm.jsx";

function llenarValido() {
  fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "Ana Pérez" } });
  fireEvent.change(screen.getByLabelText("Comentario"), { target: { value: "Necesito 3 cilindros de 15 kg." } });
}

describe("<ContactoForm />", () => {
  // Tipo: render
  it("renderiza los tres campos y el botón de envío", () => {
    render(<ContactoForm onSubmit={() => {}} />);
    expect(screen.getByLabelText("Nombre completo")).toBeTruthy();
    expect(screen.getByLabelText(/correo/i)).toBeTruthy();
    expect(screen.getByLabelText("Comentario")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Enviar mensaje" })).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("no muestra errores al renderizar", () => {
    render(<ContactoForm onSubmit={() => {}} />);
    expect(screen.queryByText(/obligatorio/i)).toBeNull();
  });

  // Tipo: props
  it("precarga los valores recibidos por props", () => {
    render(<ContactoForm inicial={{ nombre: "Camila Toro" }} onSubmit={() => {}} />);
    expect(screen.getByLabelText("Nombre completo").value).toBe("Camila Toro");
  });

  // Tipo: estado
  it("actualiza el estado de los campos al escribir", () => {
    render(<ContactoForm onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText("Comentario"), { target: { value: "Hola" } });
    expect(screen.getByLabelText("Comentario").value).toBe("Hola");
  });

  // Tipo: eventos (error en tiempo real)
  it("muestra el error del correo mientras se escribe, sin enviar", () => {
    render(<ContactoForm onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "ana@hotmail.com" } });
    expect(screen.getByText(/dominio válido/i)).toBeTruthy();
    expect(screen.getByLabelText(/correo/i).className).toContain("is-invalid");
  });

  // Tipo: eventos (error en tiempo real)
  it("muestra error de nombre al vaciar el campo después de escribir", () => {
    render(<ContactoForm onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "" } });
    expect(screen.getByText("El nombre es obligatorio")).toBeTruthy();
  });

  // Tipo: eventos
  it("no envía y muestra errores si faltan nombre y comentario", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<ContactoForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(screen.getByText("El nombre es obligatorio")).toBeTruthy();
    expect(screen.getByText("El comentario es obligatorio.")).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // Tipo: eventos
  it("el correo es opcional: envía sin correo si lo demás es válido", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<ContactoForm onSubmit={onSubmit} />);
    llenarValido();
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.calls.mostRecent().args[0].nombre).toBe("Ana Pérez");
  });

  // Tipo: eventos
  it("no envía si el correo indicado tiene un dominio no permitido", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<ContactoForm onSubmit={onSubmit} />);
    llenarValido();
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "ana@hotmail.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // Tipo: eventos
  it("envía los datos cuando se indica un correo permitido", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<ContactoForm onSubmit={onSubmit} />);
    llenarValido();
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "ana@gmail.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(onSubmit.calls.mostRecent().args[0].correo).toBe("ana@gmail.com");
  });
});
