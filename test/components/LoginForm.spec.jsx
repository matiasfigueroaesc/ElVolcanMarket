import { fireEvent, render, screen } from "@testing-library/react";
import { esperarQue } from "../helpers/esperar.js";
import LoginForm from "../../src/components/LoginForm.jsx";

describe("<LoginForm />", () => {
  function llenar(correo, password) {
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: correo } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: password } });
  }

  it("no muestra error al renderizar", () => {
    render(<LoginForm onLogin={() => true} />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("actualiza el estado de los inputs al escribir", () => {
    render(<LoginForm onLogin={() => true} />);
    llenar("camila.toro@gmail.com", "cliente1234");
    expect(screen.getByLabelText("Correo").value).toBe("camila.toro@gmail.com");
    expect(screen.getByLabelText("Contraseña").value).toBe("cliente1234");
  });

  it("llama a onLogin con correo y contraseña al enviar", async () => {
    const onLogin = jasmine.createSpy("onLogin").and.resolveTo(true);
    render(<LoginForm onLogin={onLogin} />);
    llenar("camila.toro@gmail.com", "cliente1234");
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(onLogin).toHaveBeenCalledWith("camila.toro@gmail.com", "cliente1234");
    await esperarQue(() => !screen.getByRole("button").disabled);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("muestra error solo cuando las credenciales son inválidas", async () => {
    render(<LoginForm onLogin={async () => false} />);
    llenar("camila.toro@gmail.com", "mala");
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect((await screen.findByRole("alert")).textContent).toContain("incorrectos");
  });

  it("deshabilita el botón mientras espera al backend", async () => {
    let responder;
    render(<LoginForm onLogin={() => new Promise((r) => (responder = r))} />);
    llenar("camila.toro@gmail.com", "cliente1234");
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(screen.getByRole("button", { name: "Ingresando..." }).disabled).toBeTrue();
    responder(true);
    await esperarQue(() => screen.queryByRole("button", { name: "Iniciar sesión" })?.disabled === false);
  });

  it("si el backend no responde muestra el mensaje del error", async () => {
    render(<LoginForm onLogin={() => Promise.reject(new Error("No se pudo conectar con el servidor."))} />);
    llenar("camila.toro@gmail.com", "cliente1234");
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect((await screen.findByRole("alert")).textContent).toBe("No se pudo conectar con el servidor.");
  });

  it("no llama a onLogin si faltan datos", () => {
    const onLogin = jasmine.createSpy("onLogin");
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(onLogin).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("muestra el error de formato de correo en tiempo real, sin llamar a onLogin", () => {
    const onLogin = jasmine.createSpy("onLogin");
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "alguien@hotmail.com" } });
    expect(screen.getByLabelText("Correo").className).toContain("is-invalid");

    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "cliente1234" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(onLogin).not.toHaveBeenCalled();
  });

  it("no marca error de contraseña mientras cumple el largo permitido (4-20)", () => {
    render(<LoginForm onLogin={() => true} />);
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "abcd" } });
    expect(screen.getByLabelText("Contraseña").className).not.toContain("is-invalid");
  });
});
