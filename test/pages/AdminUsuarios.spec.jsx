import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import Usuarios from "../../src/pages/admin/Usuarios.jsx";
import { USUARIOS_SEED, guardarSesion, obtenerUsuario } from "../../src/data/usuarios.js";

// La página usa useAuth() (admin conectado) y <Link>.
const mostrar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <Usuarios />
      </AuthProvider>
    </MemoryRouter>
  );

const filasDeDatos = () => screen.getAllByRole("row").length - 1;

describe("pages/admin/Usuarios", () => {
  beforeEach(() => {
    localStorage.clear();
    // Sesión de Javiera (id 1, administradora) usando la capa de datos.
    guardarSesion(obtenerUsuario(1));
  });

  // Tipo: render (lista)
  it("lista todos los usuarios al entrar", () => {
    mostrar();
    expect(screen.getByRole("heading", { name: "Usuarios" })).toBeTruthy();
    expect(filasDeDatos()).toBe(USUARIOS_SEED.length);
    expect(screen.getByRole("link", { name: "Nuevo usuario" }).getAttribute("href")).toBe("/admin/usuarios/nuevo");
  });

  // Tipo: estado + eventos
  it("filtra al escribir en el buscador", () => {
    mostrar();
    fireEvent.change(screen.getByLabelText("Buscar usuario"), { target: { value: "camila" } });
    expect(filasDeDatos()).toBe(1);
    expect(screen.getByText("camila.toro@gmail.com")).toBeTruthy();
  });

  // Tipo: estado + eventos
  it("filtra por tipo de usuario", () => {
    mostrar();
    fireEvent.change(screen.getByLabelText("Filtrar por tipo"), { target: { value: "vendedor" } });
    expect(filasDeDatos()).toBe(1);
    expect(screen.getByText("pedro.salinas@duoc.cl")).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("muestra un aviso si ningún usuario coincide", () => {
    mostrar();
    fireEvent.change(screen.getByLabelText("Buscar usuario"), { target: { value: "nadie" } });
    expect(screen.getByText("No hay usuarios que mostrar.")).toBeTruthy();
  });

  // Tipo: eventos
  it("elimina el usuario si se confirma", () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrar();
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Pedro Salinas Rojas" }));
    expect(filasDeDatos()).toBe(USUARIOS_SEED.length - 1);
    expect(obtenerUsuario(2)).toBeNull(); // también se borró de los datos guardados
    expect(screen.getByText('Usuario "Pedro Salinas Rojas" eliminado.')).toBeTruthy();
  });

  // Tipo: eventos
  it("no elimina nada si se cancela", () => {
    spyOn(window, "confirm").and.returnValue(false);
    mostrar();
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Pedro Salinas Rojas" }));
    expect(filasDeDatos()).toBe(USUARIOS_SEED.length);
    expect(obtenerUsuario(2)).not.toBeNull();
  });

  // Tipo: props (la página le pasa idActual a la tabla)
  it("el admin conectado no puede eliminarse a sí mismo", () => {
    mostrar();
    expect(screen.getByRole("button", { name: "Eliminar Javiera Muñoz Soto" }).disabled).toBeTrue();
  });
});
