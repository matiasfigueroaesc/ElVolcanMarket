import { fireEvent, render, screen } from "@testing-library/react";
import RegistroForm from "../../src/components/RegistroForm.jsx";

describe("<RegistroForm />", () => {
  function llenarDatosValidos() {
    fireEvent.change(screen.getByLabelText(/run/i), { target: { value: "111111111" } });
    fireEvent.change(screen.getByLabelText(/^nombre$/i), { target: { value: "Ana" } });
    fireEvent.change(screen.getByLabelText(/apellidos/i), { target: { value: "Pérez" } });
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "ana@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: "cliente1234" } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: "cliente1234" } });
    fireEvent.change(screen.getByLabelText(/región/i), { target: { value: "nuble" } });
    fireEvent.change(screen.getByLabelText(/comuna/i), { target: { value: "chillan" } });
    fireEvent.change(screen.getByLabelText(/dirección/i), { target: { value: "Calle Falsa 123" } });
  }

  it("renderiza todos los campos del formulario", () => {
    render(<RegistroForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/run/i)).toBeTruthy();
    expect(screen.getByLabelText(/^nombre$/i)).toBeTruthy();
    expect(screen.getByLabelText(/apellidos/i)).toBeTruthy();
    expect(screen.getByLabelText(/correo/i)).toBeTruthy();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeTruthy();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeTruthy();
    expect(screen.getByLabelText(/teléfono/i)).toBeTruthy();
    expect(screen.getByLabelText(/región/i)).toBeTruthy();
    expect(screen.getByLabelText(/comuna/i)).toBeTruthy();
    expect(screen.getByLabelText(/dirección/i)).toBeTruthy();
  });

  it("la comuna empieza deshabilitada hasta elegir una región", () => {
    render(<RegistroForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/comuna/i).disabled).toBeTrue();
    fireEvent.change(screen.getByLabelText(/región/i), { target: { value: "nuble" } });
    expect(screen.getByLabelText(/comuna/i).disabled).toBeFalse();
  });

  it("actualiza el estado de los inputs al escribir", () => {
    render(<RegistroForm onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText(/^nombre$/i), { target: { value: "Camila" } });
    expect(screen.getByLabelText(/^nombre$/i).value).toBe("Camila");
  });

  it("no llama a onSubmit si el formulario está vacío, y muestra errores", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<RegistroForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/^nombre$/i).className).toContain("is-invalid");
  });

  it("muestra error si las contraseñas no coinciden", () => {
    render(<RegistroForm onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: "cliente1234" } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: "otraClave" } });
    expect(screen.getByLabelText(/confirmar contraseña/i).className).toContain("is-invalid");
  });

  it("rechaza un RUN con dígito verificador inválido", () => {
    render(<RegistroForm onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText(/run/i), { target: { value: "111111119" } });
    expect(screen.getByLabelText(/run/i).className).toContain("is-invalid");
  });

  it("no exige teléfono (es opcional)", () => {
    render(<RegistroForm onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: "" } });
    fireEvent.blur(screen.getByLabelText(/teléfono/i));
    expect(screen.getByLabelText(/teléfono/i).className).not.toContain("is-invalid");
  });

  it("llama a onSubmit con todos los valores cuando el formulario es válido", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<RegistroForm onSubmit={onSubmit} />);
    llenarDatosValidos();
    fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

    expect(onSubmit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        run: "111111111",
        nombre: "Ana",
        apellidos: "Pérez",
        correo: "ana@gmail.com",
        password: "cliente1234",
        passwordConfirm: "cliente1234",
        region: "nuble",
        comuna: "chillan",
        direccion: "Calle Falsa 123",
      })
    );
  });
});
