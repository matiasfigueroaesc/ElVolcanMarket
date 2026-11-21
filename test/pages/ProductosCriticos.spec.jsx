import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import ProductosCriticos from "../../src/pages/admin/ProductosCriticos.jsx";
import { conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";

const mostrar = () =>
  render(
    <MemoryRouter>
      <ProductosCriticos />
    </MemoryRouter>
  );

// Como la deja AdminLayout para el vendedor: la página recibe soloLectura por el Outlet.
const mostrarSoloLectura = () =>
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={{ soloLectura: true }} />}>
          <Route path="/" element={<ProductosCriticos />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe("pages/admin/ProductosCriticos", () => {
  let api;
  beforeEach(() => {
    api = instalarApiFalsa();
    conToken("admin");
  });

  it("lista solo los productos con stock crítico que calcula el backend", async () => {
    mostrar();
    // En los datos de fábrica solo el detector (stock 4, crítico 5) está crítico.
    expect(await screen.findByText("Detector de gas a batería")).toBeTruthy();
    expect(screen.queryByText("Cilindro GLP 11 kg")).toBeNull();
    expect(api.db.peticiones[0].ruta).toBe("/productos/criticos");
  });

  it("incluye un producto apenas su stock baja al crítico", async () => {
    api.db.productos.find((p) => p.id === 2).stock = 10; // crítico del 11 kg = 10
    mostrar();
    expect(await screen.findByText("Cilindro GLP 11 kg")).toBeTruthy();
  });

  it("muestra el aviso de tabla vacía si no hay críticos", async () => {
    api.db.productos.find((p) => p.id === 14).stock = 50;
    mostrar();
    expect(await screen.findByText("No hay productos que mostrar.")).toBeTruthy();
  });

  it("elimina desde la lista y la vuelve a pedir", async () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrar();
    fireEvent.click(await screen.findByRole("button", { name: "Eliminar Detector de gas a batería" }));
    expect(await screen.findByText("No hay productos que mostrar.")).toBeTruthy();
    expect(api.db.productos.find((p) => p.id === 14)).toBeUndefined();
  });

  it("en solo lectura (vendedor) lista los críticos sin Editar ni Eliminar", async () => {
    conToken("vendedor");
    mostrarSoloLectura();
    expect(await screen.findByText("Detector de gas a batería")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ver" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Editar" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Eliminar/ })).toBeNull();
  });

  it("sin permisos muestra el error del backend (403)", async () => {
    conToken("cliente");
    mostrar();
    expect((await screen.findByRole("alert")).textContent).toContain("No tienes permisos");
  });
});
