import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import Registro from "../../src/pages/store/Registro.jsx";

function renderizar() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Registro />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("<Registro />", () => {
  beforeEach(() => localStorage.clear());

  it("muestra el formulario de registro", () => {
    renderizar();
    expect(screen.getByRole("heading", { name: "Crear una cuenta" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Registrarse" })).toBeTruthy();
  });

  it("muestra un error si el correo ya está registrado", () => {
    renderizar();

    fireEvent.change(screen.getByLabelText(/run/i), { target: { value: "111111111" } });
    fireEvent.change(screen.getByLabelText(/^nombre$/i), { target: { value: "Camila" } });
    fireEvent.change(screen.getByLabelText(/apellidos/i), { target: { value: "Toro" } });
    // Correo que ya existe en el seed de usuarios (ver src/data/usuarios.js)
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "camila.toro@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: "nueva1234" } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: "nueva1234" } });
    fireEvent.change(screen.getByLabelText(/región/i), { target: { value: "nuble" } });
    fireEvent.change(screen.getByLabelText(/comuna/i), { target: { value: "chillan" } });
    fireEvent.change(screen.getByLabelText(/dirección/i), { target: { value: "Calle Falsa 123" } });

    fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

    expect(screen.getByRole("alert").textContent).toContain("Ya existe");
  });

  it("no guarda passwordConfirm al registrar un usuario nuevo", () => {
    renderizar();

    fireEvent.change(screen.getByLabelText(/run/i), { target: { value: "111111111" } });
    fireEvent.change(screen.getByLabelText(/^nombre$/i), { target: { value: "Ana" } });
    fireEvent.change(screen.getByLabelText(/apellidos/i), { target: { value: "Pérez" } });
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "ana.nueva@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: "nueva1234" } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: "nueva1234" } });
    fireEvent.change(screen.getByLabelText(/región/i), { target: { value: "nuble" } });
    fireEvent.change(screen.getByLabelText(/comuna/i), { target: { value: "chillan" } });
    fireEvent.change(screen.getByLabelText(/dirección/i), { target: { value: "Calle Falsa 123" } });

    fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

    const guardado = Object.keys(localStorage).map((k) => localStorage.getItem(k)).join("|");
    expect(guardado).toContain("ana.nueva@gmail.com");
    expect(guardado).not.toContain("passwordConfirm");
  });
});
