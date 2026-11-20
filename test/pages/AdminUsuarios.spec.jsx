import { fireEvent, render, screen } from "@testing-library/react";
import { esperarQue } from "../helpers/esperar.js";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import Usuarios from "../../src/pages/admin/Usuarios.jsx";
import { USUARIOS_SEED, conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";

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
// Espera a que AuthProvider recupere la sesión y lleguen los usuarios del backend.
const mostrarYEsperar = async () => {
  mostrar();
  await screen.findByText("camila.toro@gmail.com");
};

describe("pages/admin/Usuarios", () => {
  let api;
  beforeEach(() => {
    // Sesión de Javiera (id 1, administradora): AuthProvider la recupera con la "cookie".
    api = instalarApiFalsa({ sesion: "admin" });
    // En la app, AdminLayout espera la sesión antes de mostrar la página; aquí se monta sola.
    conToken("admin");
  });

  // Tipo: render (lista)
  it("lista todos los usuarios al entrar", async () => {
    await mostrarYEsperar();
    expect(screen.getByRole("heading", { name: "Usuarios" })).toBeTruthy();
    expect(filasDeDatos()).toBe(USUARIOS_SEED.length);
    expect(screen.getByRole("link", { name: "Nuevo usuario" }).getAttribute("href")).toBe("/admin/usuarios/nuevo");
  });

  // Tipo: estado + eventos
  it("filtra al escribir en el buscador", async () => {
    await mostrarYEsperar();
    fireEvent.change(screen.getByLabelText("Buscar usuario"), { target: { value: "camila" } });
    expect(filasDeDatos()).toBe(1);
    expect(screen.getByText("camila.toro@gmail.com")).toBeTruthy();
  });

  // Tipo: estado + eventos
  it("filtra por tipo de usuario", async () => {
    await mostrarYEsperar();
    fireEvent.change(screen.getByLabelText("Filtrar por tipo"), { target: { value: "vendedor" } });
    expect(filasDeDatos()).toBe(1);
    expect(screen.getByText("pedro.salinas@duoc.cl")).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("muestra un aviso si ningún usuario coincide", async () => {
    await mostrarYEsperar();
    fireEvent.change(screen.getByLabelText("Buscar usuario"), { target: { value: "nadie" } });
    expect(screen.getByText("No hay usuarios que mostrar.")).toBeTruthy();
  });

  // Tipo: eventos
  it("elimina el usuario en el backend si se confirma", async () => {
    spyOn(window, "confirm").and.returnValue(true);
    await mostrarYEsperar();
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Pedro Salinas Rojas" }));
    expect(await screen.findByText('Usuario "Pedro Salinas Rojas" eliminado.')).toBeTruthy();
    await esperarQue(() => filasDeDatos() === USUARIOS_SEED.length - 1);
    expect(api.db.usuarios.find((u) => u.id === 2)).toBeUndefined();
  });

  // Tipo: eventos
  it("no elimina nada si se cancela", async () => {
    spyOn(window, "confirm").and.returnValue(false);
    await mostrarYEsperar();
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Pedro Salinas Rojas" }));
    expect(filasDeDatos()).toBe(USUARIOS_SEED.length);
    expect(api.db.peticiones.some((p) => p.metodo === "DELETE")).toBeFalse();
  });

  // Tipo: props (la página le pasa idActual a la tabla)
  it("el admin conectado no puede eliminarse a sí mismo", async () => {
    await mostrarYEsperar();
    // idActual llega cuando AuthProvider termina de recuperar la sesión.
    await esperarQue(() => screen.getByRole("button", { name: "Eliminar Javiera Muñoz Soto" }).disabled);
  });
});
