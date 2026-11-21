import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useOutletContext } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import AdminLayout from "../../src/layouts/AdminLayout.jsx";
import { instalarApiFalsa } from "../helpers/apiFalsa.js";

// Página de prueba: muestra su nombre y si el layout la marcó como solo lectura.
function Pagina({ nombre }) {
  const { soloLectura } = useOutletContext();
  return <p>{`Página de ${nombre}${soloLectura ? " (solo lectura)" : ""}`}</p>;
}

function mostrar(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Pagina nombre="dashboard" />} />
            <Route path="ordenes" element={<Pagina nombre="órdenes" />} />
            <Route path="productos" element={<Pagina nombre="productos" />} />
            <Route path="usuarios" element={<Pagina nombre="usuarios" />} />
          </Route>
          <Route path="/login" element={<p>Pantalla de login</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("layouts/AdminLayout (acceso por rol)", () => {
  it("el administrador ve el panel completo y puede editar", async () => {
    instalarApiFalsa({ sesion: "admin" });
    mostrar("/admin");
    expect(await screen.findByText("Página de dashboard")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Usuarios" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Reportes" })).toBeTruthy();
  });

  it("el vendedor entra a Órdenes, en solo lectura y con un menú de dos opciones", async () => {
    instalarApiFalsa({ sesion: "vendedor" });
    mostrar("/admin");
    expect(await screen.findByText("Página de órdenes (solo lectura)")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Órdenes" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Productos" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Dashboard" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Usuarios" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Categorías" })).toBeNull();
  });

  it("el vendedor puede ver los productos en solo lectura", async () => {
    instalarApiFalsa({ sesion: "vendedor" });
    mostrar("/admin/productos");
    expect(await screen.findByText("Página de productos (solo lectura)")).toBeTruthy();
  });

  it("si el vendedor escribe una URL que no le corresponde, vuelve a Órdenes", async () => {
    instalarApiFalsa({ sesion: "vendedor" });
    mostrar("/admin/usuarios");
    expect(await screen.findByText("Página de órdenes (solo lectura)")).toBeTruthy();
    expect(screen.queryByText(/Página de usuarios/)).toBeNull();
  });

  it("un cliente no entra al panel: va al login", async () => {
    instalarApiFalsa({ sesion: "cliente" });
    mostrar("/admin/ordenes");
    expect(await screen.findByText("Pantalla de login")).toBeTruthy();
  });

  it("sin sesión va al login", async () => {
    instalarApiFalsa();
    mostrar("/admin");
    expect(await screen.findByText("Pantalla de login")).toBeTruthy();
  });
});
