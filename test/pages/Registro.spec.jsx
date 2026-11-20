import { fireEvent, render, screen } from "@testing-library/react";
import { esperarQue } from "../helpers/esperar.js";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import Registro from "../../src/pages/store/Registro.jsx";
import { instalarApiFalsa } from "../helpers/apiFalsa.js";

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
  let api;
  beforeEach(() => {
    localStorage.clear();
    api = instalarApiFalsa();
  });

  it("muestra el formulario de registro", () => {
    renderizar();
    expect(screen.getByRole("heading", { name: "Crear una cuenta" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Registrarse" })).toBeTruthy();
  });

  it("muestra el error del backend si el correo ya está registrado (409)", async () => {
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

    expect((await screen.findByRole("alert")).textContent).toContain("Ya existe un usuario con ese correo.");
  });

  it("muestra el error del backend si el RUN ya está registrado, aunque tenga puntos y guion", async () => {
    renderizar();

    // RUN de Camila en el seed, escrito con puntos y guion
    fireEvent.change(screen.getByLabelText(/run/i), { target: { value: "20.567.112-9" } });
    fireEvent.change(screen.getByLabelText(/^nombre$/i), { target: { value: "Otra" } });
    fireEvent.change(screen.getByLabelText(/apellidos/i), { target: { value: "Persona" } });
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "otra.persona@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: "nueva1234" } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: "nueva1234" } });
    fireEvent.change(screen.getByLabelText(/región/i), { target: { value: "nuble" } });
    fireEvent.change(screen.getByLabelText(/comuna/i), { target: { value: "chillan" } });
    fireEvent.change(screen.getByLabelText(/dirección/i), { target: { value: "Calle Falsa 123" } });

    fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

    expect((await screen.findByRole("alert")).textContent).toContain("RUN");
  });

  it("registra al cliente en el backend sin enviar passwordConfirm y deja la sesión iniciada", async () => {
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

    await esperarQue(() => api.db.cookieRefresh === 4); // registro + login automático
    const registro = api.db.peticiones.find((p) => p.ruta === "/auth/registro");
    expect(registro.cuerpo.correo).toBe("ana.nueva@gmail.com");
    expect("passwordConfirm" in registro.cuerpo).toBeFalse();
    expect(api.db.usuarios.find((u) => u.id === 4).tipo).toBe("cliente");
    // Nada del usuario queda en localStorage (ni la contraseña).
    expect(Object.values({ ...localStorage }).join("|")).not.toContain("nueva1234");
  });
});
