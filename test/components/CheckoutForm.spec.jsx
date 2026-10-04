import { fireEvent, render, screen } from "@testing-library/react";
import CheckoutForm from "../../src/components/CheckoutForm.jsx";

function llenar() {
  fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
  fireEvent.change(screen.getByLabelText("Apellidos"), { target: { value: "Pérez Soto" } });
  fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "ana@gmail.com" } });
  fireEvent.change(screen.getByLabelText("Calle y número"), { target: { value: "Av. Libertad 100" } });
  fireEvent.change(screen.getByLabelText("Región"), { target: { value: "nuble" } });
  fireEvent.change(screen.getByLabelText("Comuna"), { target: { value: "chillan" } });
  fireEvent.change(screen.getByLabelText("Opción de entrega"), { target: { value: "normal" } });
}

describe("<CheckoutForm />", () => {
  it("no muestra errores al renderizar", () => {
    render(<CheckoutForm onSubmit={() => {}} />);
    expect(screen.queryByText(/obligatori/i)).toBeNull();
  });

  it("muestra errores y no envía si faltan campos obligatorios", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<CheckoutForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));
    expect(screen.getByText("El nombre es obligatorio")).toBeTruthy();
    expect(screen.getByText("La calle es obligatoria")).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("actualiza el estado al escribir", () => {
    render(<CheckoutForm onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
    expect(screen.getByLabelText("Nombre").value).toBe("Ana");
  });

  it("precarga los campos recibidos por props", () => {
    render(<CheckoutForm inicial={{ nombre: "Camila" }} onSubmit={() => {}} />);
    expect(screen.getByLabelText("Nombre").value).toBe("Camila");
  });

  it("llama a onSubmit con los datos cuando el formulario es válido", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<CheckoutForm onSubmit={onSubmit} />);
    llenar();
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const datos = onSubmit.calls.mostRecent().args[0];
    expect(datos.nombre).toBe("Ana");
    expect(datos.entrega).toBe("normal");
    expect(datos.simularRechazo).toBeFalse();
  });

  it("envía simularRechazo en true al marcar la casilla", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<CheckoutForm onSubmit={onSubmit} />);
    llenar();
    fireEvent.click(screen.getByLabelText("Simular pago rechazado"));
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));
    expect(onSubmit.calls.mostRecent().args[0].simularRechazo).toBeTrue();
  });

  it("no envía si no se elige una opción de entrega", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<CheckoutForm onSubmit={onSubmit} />);
    llenar();
    fireEvent.change(screen.getByLabelText("Opción de entrega"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));
    expect(screen.getByText("Selecciona una opción de entrega")).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("acepta correos de cualquier dominio", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<CheckoutForm onSubmit={onSubmit} />);
    llenar();
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "ana@hotmail.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("no envía si el correo tiene un formato inválido", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<CheckoutForm onSubmit={onSubmit} />);
    llenar();
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "ana@" } });
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});