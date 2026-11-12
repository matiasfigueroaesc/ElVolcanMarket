import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UsuarioForm from "../../src/pages/admin/UsuarioForm.jsx";
import { USUARIOS_SEED, conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";

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
  let api;
  beforeEach(() => {
    api = instalarApiFalsa();
    conToken("admin");
  });

  // Tipo: eventos
  it("crea un usuario nuevo en el backend y navega a su detalle", async () => {
    mostrar("/admin/usuarios/nuevo");
    expect(await screen.findByRole("heading", { name: "Nuevo usuario" })).toBeTruthy();
    llenarNuevo("ana.perez@gmail.com");
    fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));

    expect(await screen.findByText("Detalle mostrado")).toBeTruthy();
    expect(api.db.usuarios.length).toBe(USUARIOS_SEED.length + 1);
    expect(api.db.usuarios.find((u) => u.id === 4).tipo).toBe("vendedor");
  });

  // Tipo: render (condicional)
  it("muestra el error del backend si el correo ya existe (409) y no crea nada", async () => {
    mostrar("/admin/usuarios/nuevo");
    await screen.findByRole("heading", { name: "Nuevo usuario" });
    llenarNuevo("camila.toro@gmail.com");
    fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));
    expect((await screen.findByRole("alert")).textContent).toContain("Ya existe un usuario con ese correo.");
    expect(api.db.usuarios.length).toBe(USUARIOS_SEED.length);
  });

  // Tipo: eventos + props
  it("al editar carga el usuario y guarda los cambios sin enviar contraseña", async () => {
    mostrar("/admin/usuarios/3/editar");
    expect(await screen.findByRole("heading", { name: "Editar Camila Toro Pizarro" })).toBeTruthy();
    expect(screen.getByLabelText("Correo").value).toBe("camila.toro@gmail.com");
    escribir("Dirección", "Av. Collín 200");
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(await screen.findByText("Detalle mostrado")).toBeTruthy();
    const camila = api.db.usuarios.find((u) => u.id === 3);
    expect(camila.direccion).toBe("Av. Collín 200");
    expect(api.db.usuarios.length).toBe(USUARIOS_SEED.length); // no se creó uno nuevo
    expect(camila.password).toBe("cliente1234"); // misma contraseña
    expect(api.db.peticiones.find((p) => p.metodo === "PUT").cuerpo.password).toBeUndefined();
  });

  // Tipo: render (condicional)
  it("al editar no permite usar el correo de otro usuario (409)", async () => {
    mostrar("/admin/usuarios/3/editar");
    await screen.findByRole("heading", { name: "Editar Camila Toro Pizarro" });
    escribir("Correo", "pedro.salinas@duoc.cl");
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect((await screen.findByRole("alert")).textContent).toContain("Ya existe un usuario con ese correo.");
    expect(api.db.usuarios.find((u) => u.id === 3).correo).toBe("camila.toro@gmail.com");
  });

  // Tipo: render (condicional)
  it("muestra un aviso si el usuario a editar no existe", async () => {
    mostrar("/admin/usuarios/999/editar");
    expect(await screen.findByText(/Usuario no encontrado/)).toBeTruthy();
  });
});
