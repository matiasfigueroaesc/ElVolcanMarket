import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import UsuarioDetalle from "../../src/pages/admin/UsuarioDetalle.jsx";
import { actualizarUsuario, guardarSesion, obtenerUsuario } from "../../src/data/usuarios.js";

// La página usa useParams (ruta con :id), useAuth y useLocation (mensaje).
const mostrar = (entrada) =>
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

describe("pages/admin/UsuarioDetalle", () => {
  beforeEach(() => {
    localStorage.clear();
    guardarSesion(obtenerUsuario(1)); // Javiera, administradora
  });

  // Tipo: render
  it("muestra los datos del usuario de la URL con su tipo y su comuna", () => {
    mostrar("/admin/usuarios/3");
    expect(screen.getByRole("heading", { name: "Camila Toro Pizarro" })).toBeTruthy();
    expect(screen.getByText("Cliente").className).toContain("badge");
    expect(screen.getByText("205671129")).toBeTruthy();
    expect(screen.getByText(/Chillán Viejo, Región de Ñuble/)).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("indica cuando no hay teléfono ni fecha de nacimiento", () => {
    mostrar("/admin/usuarios/3");
    expect(screen.getByText("No registrado")).toBeTruthy();
    expect(screen.getByText("No registrada")).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("muestra la fecha de nacimiento sin correrse de día", () => {
    actualizarUsuario(3, { telefono: "912345678", fechaNacimiento: "1999-03-01" });
    mostrar("/admin/usuarios/3");
    expect(screen.getByText("912345678")).toBeTruthy();
    expect(screen.getByText("01/03/1999")).toBeTruthy();
  });

  // Tipo: render
  it("resume las compras pagadas del usuario", () => {
    mostrar("/admin/usuarios/3"); // Camila tiene ORD-000001 ($24.000) y ORD-000002 ($24.990)
    expect(screen.getByText("$48.990")).toBeTruthy();
  });

  // Tipo: props / navegación
  it("los enlaces llevan a editar y al historial de compras", () => {
    mostrar("/admin/usuarios/3");
    expect(screen.getByRole("link", { name: "Editar" }).getAttribute("href")).toBe("/admin/usuarios/3/editar");
    expect(screen.getByRole("link", { name: "Historial de compras" }).getAttribute("href")).toBe(
      "/admin/usuarios/3/compras"
    );
  });

  // Tipo: render (condicional)
  it("muestra el mensaje que llega desde el formulario", () => {
    mostrar({ pathname: "/admin/usuarios/3", state: { mensaje: "Usuario actualizado." } });
    expect(screen.getByText("Usuario actualizado.")).toBeTruthy();
  });

  // Tipo: eventos
  it("elimina y vuelve al listado si se confirma", () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrar("/admin/usuarios/2");
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(obtenerUsuario(2)).toBeNull();
    expect(screen.getByText("Listado mostrado")).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("el admin conectado no puede eliminarse desde su detalle", () => {
    mostrar("/admin/usuarios/1");
    expect(screen.getByRole("button", { name: "Eliminar" }).disabled).toBeTrue();
    expect(screen.getByText("No puedes eliminar tu propia cuenta.")).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("muestra un aviso si el usuario no existe", () => {
    mostrar("/admin/usuarios/999");
    expect(screen.getByText(/Usuario no encontrado/)).toBeTruthy();
  });
});
