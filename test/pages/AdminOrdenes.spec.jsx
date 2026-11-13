import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import Ordenes from "../../src/pages/admin/Ordenes.jsx";
import Boleta from "../../src/pages/admin/Boleta.jsx";
import { BOLETAS_SEED, conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";
import { esperarCarga, esperarQue } from "../helpers/esperar.js";

// sesion: "admin" o "vendedor". conToken deja el token listo antes de montar,
// como pasa en la app real (AdminLayout espera la sesión antes de mostrar la página).
// preparar(db): cambia los datos del backend falso ANTES de montar (la página pide al montar).
function mostrar(ruta, { sesion = "admin", preparar } = {}) {
  const api = instalarApiFalsa({ sesion });
  preparar?.(api.db);
  conToken(sesion);
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin/ordenes" element={<Ordenes />} />
          <Route path="/admin/ordenes/:id" element={<Boleta />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
  return api;
}

const filasDeDatos = () => screen.getAllByRole("row").length - 1;

// Boleta con pago rechazado, como la que crea el backend al simular un rechazo (sin despacho).
const RECHAZADA = { ...BOLETAS_SEED[0], id: 3, numero: "ORD-000003", usuarioId: null, estadoPago: "rechazado" };

describe("pages/admin/Ordenes", () => {
  it("lista las órdenes pagadas y suma el total vendido", async () => {
    mostrar("/admin/ordenes");
    await esperarCarga();
    expect(filasDeDatos()).toBe(2);
    expect(screen.getByText(/Total vendido/).textContent).toContain("$48.990");
  });

  it("oculta los pagos rechazados hasta marcar la casilla (estado)", async () => {
    mostrar("/admin/ordenes", { preparar: (db) => db.boletas.push(structuredClone(RECHAZADA)) });
    await esperarCarga();
    expect(filasDeDatos()).toBe(2);
    fireEvent.click(screen.getByLabelText("Ver pagos rechazados"));
    expect(filasDeDatos()).toBe(3);
    expect(screen.getByText("ORD-000003")).toBeTruthy();
  });

  it("filtra por estado y por texto", async () => {
    mostrar("/admin/ordenes");
    await esperarCarga();
    fireEvent.change(screen.getByLabelText("Filtrar por estado"), { target: { value: "en camino" } });
    expect(filasDeDatos()).toBe(1);
    expect(screen.getByText("ORD-000002")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Filtrar por estado"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Buscar orden"), { target: { value: "000001" } });
    expect(filasDeDatos()).toBe(1);

    fireEvent.change(screen.getByLabelText("Buscar orden"), { target: { value: "nadie" } });
    expect(screen.getByText("No hay órdenes que mostrar.")).toBeTruthy();
  });

  it("el vendedor también puede ver las órdenes", async () => {
    mostrar("/admin/ordenes", { sesion: "vendedor" });
    await esperarCarga();
    expect(filasDeDatos()).toBe(2);
  });

  it("muestra el error si el backend no responde", async () => {
    mostrar("/admin/ordenes", { preparar: (db) => (db.caido = true) });
    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeTruthy();
  });
});

describe("pages/admin/Boleta", () => {
  it("muestra la boleta de la orden de la URL", async () => {
    mostrar("/admin/ordenes/2");
    expect(await screen.findByRole("heading", { name: "Boleta ORD-000002" })).toBeTruthy();
    expect(screen.getByText("Regulador doméstico estándar")).toBeTruthy();
    expect(screen.getByText("$24.990")).toBeTruthy();
  });

  it("avanza el estado del despacho en el backend", async () => {
    const api = mostrar("/admin/ordenes/2");
    await screen.findByRole("heading", { name: "Boleta ORD-000002" });
    const select = screen.getByLabelText("Estado del despacho");
    await esperarQue(() => !select.disabled, "que se habilite el selector (sesión de admin)");
    // Solo se ofrecen las etapas siguientes a "en camino".
    expect([...select.options].map((o) => o.value)).toEqual(["", "entregado"]);

    fireEvent.change(select, { target: { value: "entregado" } });
    expect(await screen.findByText('Estado actualizado a "entregado".')).toBeTruthy();
    expect(api.db.despachos.find((d) => d.boletaId === 2).estado).toBe("entregado");
    expect(api.db.peticiones.some((p) => p.metodo === "PATCH" && p.ruta === "/despachos/2/estado")).toBeTrue();
    // Ya entregado: no queda a dónde avanzar.
    expect(screen.getByLabelText("Estado del despacho").disabled).toBeTrue();
  });

  it("si el backend rechaza el cambio muestra el motivo", async () => {
    const api = mostrar("/admin/ordenes/2");
    await screen.findByRole("heading", { name: "Boleta ORD-000002" });
    const select = screen.getByLabelText("Estado del despacho");
    await esperarQue(() => !select.disabled, "que se habilite el selector");
    api.db.despachos.find((d) => d.boletaId === 2).estado = "entregado"; // otro admin lo entregó
    fireEvent.change(select, { target: { value: "entregado" } });
    expect((await screen.findByRole("alert")).textContent).toContain("ya fue entregado");
  });

  it("el vendedor ve la boleta pero no puede cambiar el estado", async () => {
    mostrar("/admin/ordenes/2", { sesion: "vendedor" });
    await screen.findByRole("heading", { name: "Boleta ORD-000002" });
    await screen.findByText("Solo un administrador puede cambiar el estado.");
    expect(screen.getByLabelText("Estado del despacho").disabled).toBeTrue();
  });

  it("en un pago rechazado avisa y bloquea el cambio de estado", async () => {
    mostrar("/admin/ordenes/3", { preparar: (db) => db.boletas.push(structuredClone(RECHAZADA)) });
    expect((await screen.findByRole("alert")).textContent).toContain("rechazado");
    expect(screen.getByLabelText("Estado del despacho").disabled).toBeTrue();
  });

  it("el botón imprimir llama a window.print", async () => {
    spyOn(window, "print");
    mostrar("/admin/ordenes/1");
    fireEvent.click(await screen.findByRole("button", { name: "Imprimir boleta" }));
    expect(window.print).toHaveBeenCalled();
  });

  it("muestra un aviso si la orden no existe", async () => {
    mostrar("/admin/ordenes/999");
    expect(await screen.findByText(/Orden no encontrada/)).toBeTruthy();
  });
});
