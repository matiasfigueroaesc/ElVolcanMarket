import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import UsuarioDetalle from "../../src/pages/admin/UsuarioDetalle.jsx";
import { conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";
import { esperarCarga } from "../helpers/esperar.js";

// La página usa useParams (ruta con :id), useAuth y useLocation (mensaje).
// Monta la página y espera la sesión y los datos del backend.
const mostrar = async (entrada) => {
  render(
    <MemoryRouter initialEntries={[entrada]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin/usuarios/:id" element={<UsuarioDetalle />} />
          <Route path="/admin/usuarios" element={<p>Listado mostrado</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
  await esperarCarga();
};

describe("pages/admin/UsuarioDetalle", () => {
  let api;
  beforeEach(() => {
    localStorage.clear(); // órdenes de fábrica (siguen en el navegador)
    api = instalarApiFalsa({ sesion: "admin" }); // Javiera, administradora
    // En la app, AdminLayout espera la sesión antes de mostrar la página; aquí se monta sola.
    conToken("admin");
  });

  // Tipo: render
  it("muestra los datos del usuario de la URL con su tipo y su comuna", async () => {
    await mostrar("/admin/usuarios/3");
    expect(screen.getByRole("heading", { name: "Camila Toro Pizarro" })).toBeTruthy();
    expect(screen.getByText("Cliente").className).toContain("badge");
    expect(screen.getByText("205671129")).toBeTruthy();
    expect(screen.getByText(/Chillán Viejo, Región de Ñuble/)).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("indica cuando no hay teléfono ni fecha de nacimiento", async () => {
    await mostrar("/admin/usuarios/3");
    expect(screen.getByText("No registrado")).toBeTruthy();
    expect(screen.getByText("No registrada")).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("muestra la fecha de nacimiento sin correrse de día", async () => {
    Object.assign(api.db.usuarios[2], { telefono: "912345678", fechaNacimiento: "1999-03-01" });
    await mostrar("/admin/usuarios/3");
    expect(screen.getByText("912345678")).toBeTruthy();
    expect(screen.getByText("01/03/1999")).toBeTruthy();
  });

  // Tipo: render
  it("resume las compras pagadas del usuario", async () => {
    await mostrar("/admin/usuarios/3"); // Camila tiene ORD-000001 ($24.000) y ORD-000002 ($24.990)
    expect(screen.getByText("$48.990")).toBeTruthy();
  });

  // Tipo: props / navegación
  it("los enlaces llevan a editar y al historial de compras", async () => {
    await mostrar("/admin/usuarios/3");
    expect(screen.getByRole("link", { name: "Editar" }).getAttribute("href")).toBe("/admin/usuarios/3/editar");
    expect(screen.getByRole("link", { name: "Historial de compras" }).getAttribute("href")).toBe(
      "/admin/usuarios/3/compras"
    );
  });

  // Tipo: render (condicional)
  it("muestra el mensaje que llega desde el formulario", async () => {
    await mostrar({ pathname: "/admin/usuarios/3", state: { mensaje: "Usuario actualizado." } });
    expect(screen.getByText("Usuario actualizado.")).toBeTruthy();
  });

  // Tipo: eventos
  it("elimina y vuelve al listado si se confirma", async () => {
    spyOn(window, "confirm").and.returnValue(true);
    await mostrar("/admin/usuarios/2");
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(await screen.findByText("Listado mostrado")).toBeTruthy();
    expect(api.db.usuarios.find((u) => u.id === 2)).toBeUndefined();
  });

  // Tipo: render (condicional)
  it("el admin conectado no puede eliminarse desde su detalle", async () => {
    await mostrar("/admin/usuarios/1");
    expect(screen.getByRole("button", { name: "Eliminar" }).disabled).toBeTrue();
    expect(screen.getByText("No puedes eliminar tu propia cuenta.")).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("si el backend rechaza la eliminación muestra su mensaje", async () => {
    spyOn(window, "confirm").and.returnValue(true);
    await mostrar("/admin/usuarios/2");
    api.db.caido = true;
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect((await screen.findByRole("alert")).textContent).toContain("No se pudo conectar");
  });

  // Tipo: render (condicional)
  it("muestra un aviso si el usuario no existe", async () => {
    await mostrar("/admin/usuarios/999");
    expect(screen.getByText(/Usuario no encontrado/)).toBeTruthy();
  });
});
