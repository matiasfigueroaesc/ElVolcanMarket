import { fireEvent, render, screen } from "@testing-library/react";
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

  it("llama a onLogin con correo y contraseña al enviar", () => {
    const onLogin = jasmine.createSpy("onLogin").and.returnValue(true);
    render(<LoginForm onLogin={onLogin} />);
    llenar("camila.toro@gmail.com", "cliente1234");
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(onLogin).toHaveBeenCalledWith("camila.toro@gmail.com", "cliente1234");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("muestra error solo cuando las credenciales son inválidas", () => {
    render(<LoginForm onLogin={() => false} />);
    llenar("camila.toro@gmail.com", "mala");
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(screen.getByRole("alert").textContent).toContain("incorrectos");
  });

  it("no llama a onLogin si faltan datos", () => {
    const onLogin = jasmine.createSpy("onLogin");
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(onLogin).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeTruthy();
  });
});
