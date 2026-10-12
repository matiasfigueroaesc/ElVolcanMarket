import { fireEvent, render, screen } from "@testing-library/react";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import Perfil from "../../src/pages/admin/Perfil.jsx";
import { autenticar, guardarSesion, obtenerSesion, obtenerUsuario } from "../../src/data/usuarios.js";

// Perfil usa useAuth() para saber quién está conectado (no usa <Link>).
const mostrar = () =>
  render(
    <AuthProvider>
      <Perfil />
    </AuthProvider>
  );

const escribir = (label, valor) => fireEvent.change(screen.getByLabelText(label), { target: { value: valor } });
const guardar = () => fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

describe("pages/admin/Perfil", () => {
  beforeEach(() => {
    localStorage.clear();
    guardarSesion(obtenerUsuario(1)); // Javiera, administradora
  });

  // Tipo: render
  it("muestra los datos del admin conectado", () => {
    mostrar();
    expect(screen.getByRole("heading", { name: "Mi perfil" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Javiera Muñoz Soto" })).toBeTruthy();
    expect(screen.getByLabelText("Correo").value).toBe("javiera.munoz@gmail.com");
  });

  // Tipo: props (Perfil configura UserForm)
  it("no deja cambiar el tipo de usuario ni el Run", () => {
    mostrar();
    expect(screen.queryByLabelText("Tipo de usuario")).toBeNull();
    expect(screen.getByLabelText("Run").readOnly).toBeTrue();
  });

  // Tipo: eventos + estado
  it("guarda los cambios, actualiza la tarjeta y la sesión", () => {
    mostrar();
    escribir("Nombre", "Javi");
    escribir("Teléfono (opcional)", "912345678");
    guardar();
    expect(screen.getByText("Perfil actualizado.")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Javi Muñoz Soto" })).toBeTruthy();
    expect(obtenerUsuario(1).telefono).toBe("912345678");
    expect(obtenerUsuario(1).tipo).toBe("administrador"); // el tipo no cambia
    expect(obtenerSesion().nombre).toBe("Javi");
    expect("password" in obtenerSesion()).toBeFalse(); // la sesión nunca guarda la contraseña
  });

  // Tipo: eventos
  it("permite cambiar la contraseña y luego vacía el campo", () => {
    mostrar();
    escribir("Contraseña nueva (opcional)", "nueva1234");
    guardar();
    expect(autenticar("javiera.munoz@gmail.com", "nueva1234")).not.toBeNull();
    expect(screen.getByLabelText("Contraseña nueva (opcional)").value).toBe("");
  });

  // Tipo: render (condicional)
  it("no guarda si el correo pertenece a otro usuario", () => {
    mostrar();
    escribir("Correo", "camila.toro@gmail.com");
    guardar();
    expect(screen.getByRole("alert").textContent).toBe("Ya existe un usuario con ese correo.");
    expect(obtenerUsuario(1).correo).toBe("javiera.munoz@gmail.com");
  });

  // Tipo: estado (validación en tiempo real)
  it("no guarda si hay errores de validación", () => {
    mostrar();
    escribir("Teléfono (opcional)", "12");
    guardar();
    expect(screen.getByText(/Ingresa un teléfono válido/)).toBeTruthy();
    expect(screen.queryByText("Perfil actualizado.")).toBeNull();
    expect(obtenerUsuario(1).telefono).toBeNull();
  });
});
