import { fireEvent, render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../src/context/AuthContext.jsx";
import Perfil from "../../src/pages/admin/Perfil.jsx";
import { conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";
import { esperarCarga } from "../helpers/esperar.js";

// Perfil usa useAuth() para saber quién está conectado (no usa <Link>).
// Muestra el nombre de la sesión (para comprobar que se actualiza al guardar).
function NombreSesion() {
  const { usuario } = useAuth();
  return <p data-testid="sesion">{usuario?.nombre}</p>;
}

const mostrar = async () => {
  render(
    <AuthProvider>
      <NombreSesion />
      <Perfil />
    </AuthProvider>
  );
  await esperarCarga();
};

const escribir = (label, valor) => fireEvent.change(screen.getByLabelText(label), { target: { value: valor } });
const guardar = () => fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

describe("pages/admin/Perfil", () => {
  let api;
  const javiera = () => api.db.usuarios.find((u) => u.id === 1);
  beforeEach(() => {
    api = instalarApiFalsa({ sesion: "admin" }); // Javiera, administradora
    // En la app, AdminLayout espera la sesión antes de mostrar la página; aquí se monta sola.
    conToken("admin");
  });

  // Tipo: render
  it("muestra los datos del admin conectado", async () => {
    await mostrar();
    expect(screen.getByRole("heading", { name: "Mi perfil" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Javiera Muñoz Soto" })).toBeTruthy();
    expect(screen.getByLabelText("Correo").value).toBe("javiera.munoz@gmail.com");
  });

  // Tipo: props (Perfil configura UserForm)
  it("no deja cambiar el tipo de usuario ni el Run", async () => {
    await mostrar();
    expect(screen.queryByLabelText("Tipo de usuario")).toBeNull();
    expect(screen.getByLabelText("Run").readOnly).toBeTrue();
  });

  // Tipo: eventos + estado
  it("guarda los cambios, actualiza la tarjeta y la sesión", async () => {
    await mostrar();
    escribir("Nombre", "Javi");
    escribir("Teléfono (opcional)", "912345678");
    guardar();
    expect(await screen.findByText("Perfil actualizado.")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Javi Muñoz Soto" })).toBeTruthy();
    expect(javiera().telefono).toBe("912345678");
    expect(javiera().tipo).toBe("administrador"); // el tipo no cambia
    expect(api.db.peticiones.find((p) => p.metodo === "PUT").cuerpo.tipo).toBe("administrador");
    expect(screen.getByTestId("sesion").textContent).toBe("Javi"); // la sesión también se actualizó
  });

  // Tipo: eventos
  it("permite cambiar la contraseña y luego vacía el campo", async () => {
    await mostrar();
    escribir("Contraseña nueva (opcional)", "nueva1234");
    guardar();
    await screen.findByText("Perfil actualizado.");
    expect(javiera().password).toBe("nueva1234");
    expect(screen.getByLabelText("Contraseña nueva (opcional)").value).toBe("");
  });

  // Tipo: render (condicional)
  it("no guarda si el correo pertenece a otro usuario", async () => {
    await mostrar();
    escribir("Correo", "camila.toro@gmail.com");
    guardar();
    expect((await screen.findByRole("alert")).textContent).toBe("Ya existe un usuario con ese correo.");
    expect(javiera().correo).toBe("javiera.munoz@gmail.com");
  });

  // Tipo: estado (validación en tiempo real)
  it("no guarda si hay errores de validación", async () => {
    await mostrar();
    escribir("Teléfono (opcional)", "12");
    guardar();
    expect(screen.getByText(/Ingresa un teléfono válido/)).toBeTruthy();
    expect(screen.queryByText("Perfil actualizado.")).toBeNull();
    expect(api.db.peticiones.some((p) => p.metodo === "PUT")).toBeFalse();
  });
});
