import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UsuarioForm from "../../src/pages/admin/UsuarioForm.jsx";
import { USUARIOS_SEED, autenticar, listarUsuarios, obtenerUsuario } from "../../src/data/usuarios.js";

// Mismas rutas que App.jsx; el detalle se reemplaza por un texto para ver a dónde navega.
const mostrar = (ruta) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/usuarios/nuevo" element={<UsuarioForm />} />
        <Route path="/admin/usuarios/:id/editar" element={<UsuarioForm />} />
        <Route path="/admin/usuarios/:id" element={<p>Detalle mostrado</p>} />
      </Routes>
    </MemoryRouter>
  );

const escribir = (label, valor) => fireEvent.change(screen.getByLabelText(label), { target: { value: valor } });

function llenarNuevo(correo) {
  escribir("Run", "111111111");
  escribir("Nombre", "Ana");
  escribir("Apellidos", "Pérez");
  escribir("Correo", correo);
  escribir("Contraseña", "clave123");
  escribir("Tipo de usuario", "vendedor");
  escribir("Región", "nuble");
  escribir("Comuna", "chillan");
  escribir("Dirección", "Libertad 100");
}

describe("pages/admin/UsuarioForm", () => {
  beforeEach(() => localStorage.clear());

  // Tipo: eventos
  it("crea un usuario nuevo y navega a su detalle", () => {
    mostrar("/admin/usuarios/nuevo");
    expect(screen.getByRole("heading", { name: "Nuevo usuario" })).toBeTruthy();
    llenarNuevo("ana.perez@gmail.com");
    fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));

    expect(screen.getByText("Detalle mostrado")).toBeTruthy();
    expect(listarUsuarios().length).toBe(USUARIOS_SEED.length + 1);
    expect(obtenerUsuario(4).tipo).toBe("vendedor");
  });

  // Tipo: render (condicional)
  it("muestra un error si el correo ya existe y no crea nada", () => {
    mostrar("/admin/usuarios/nuevo");
    llenarNuevo("camila.toro@gmail.com");
    fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));
    expect(screen.getByRole("alert").textContent).toContain("Ya existe un usuario con ese correo.");
    expect(listarUsuarios().length).toBe(USUARIOS_SEED.length);
  });

  // Tipo: eventos + props
  it("al editar carga el usuario y guarda los cambios sin tocar la contraseña", () => {
    mostrar("/admin/usuarios/3/editar");
    expect(screen.getByRole("heading", { name: "Editar Camila Toro Pizarro" })).toBeTruthy();
    expect(screen.getByLabelText("Correo").value).toBe("camila.toro@gmail.com");
    escribir("Dirección", "Av. Collín 200");
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(screen.getByText("Detalle mostrado")).toBeTruthy();
    expect(obtenerUsuario(3).direccion).toBe("Av. Collín 200");
    expect(listarUsuarios().length).toBe(USUARIOS_SEED.length); // no se creó uno nuevo
    expect(autenticar("camila.toro@gmail.com", "cliente1234")).not.toBeNull(); // misma contraseña
  });

  // Tipo: render (condicional)
  it("al editar no permite usar el correo de otro usuario", () => {
    mostrar("/admin/usuarios/3/editar");
    escribir("Correo", "pedro.salinas@duoc.cl");
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(screen.getByRole("alert").textContent).toContain("Ya existe un usuario con ese correo.");
    expect(obtenerUsuario(3).correo).toBe("camila.toro@gmail.com");
  });

  // Tipo: render (condicional)
  it("muestra un aviso si el usuario a editar no existe", () => {
    mostrar("/admin/usuarios/999/editar");
    expect(screen.getByText(/Usuario no encontrado/)).toBeTruthy();
  });
});
