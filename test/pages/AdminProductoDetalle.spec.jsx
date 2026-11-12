import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductoDetalle from "../../src/pages/admin/ProductoDetalle.jsx";
import { conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";

const mostrar = (entrada) =>
  render(
    <MemoryRouter initialEntries={[entrada]}>
      <Routes>
        <Route path="/admin/productos/:id" element={<ProductoDetalle />} />
        <Route path="/admin/productos" element={<p>Listado mostrado</p>} />
      </Routes>
    </MemoryRouter>
  );

describe("pages/admin/ProductoDetalle", () => {
  let api;
  beforeEach(() => {
    api = instalarApiFalsa();
    conToken("admin");
  });

  it("muestra los datos del producto de la URL con su categoría", async () => {
    mostrar("/admin/productos/5");
    expect(await screen.findByRole("heading", { name: "Regulador doméstico estándar" })).toBeTruthy();
    expect(screen.getByText("RG001")).toBeTruthy();
    expect(screen.getByText("Reguladores")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Editar" }).getAttribute("href")).toBe("/admin/productos/5/editar");
  });

  it("marca oferta y stock crítico solo cuando corresponde", async () => {
    mostrar("/admin/productos/14"); // Detector: en oferta y con stock bajo el crítico
    expect(await screen.findByText("Oferta")).toBeTruthy();
    expect(screen.getByText("Stock crítico")).toBeTruthy();
  });

  it("no marca oferta ni stock crítico en un producto normal", async () => {
    mostrar("/admin/productos/2");
    await screen.findByRole("heading", { name: "Cilindro GLP 11 kg" });
    expect(screen.queryByText("Oferta")).toBeNull();
    expect(screen.queryByText("Stock crítico")).toBeNull();
  });

  it("muestra el mensaje que llega desde el formulario", async () => {
    mostrar({ pathname: "/admin/productos/2", state: { mensaje: "Producto actualizado." } });
    expect(await screen.findByText("Producto actualizado.")).toBeTruthy();
  });

  it("elimina en el backend y vuelve al listado si se confirma", async () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrar("/admin/productos/10");
    fireEvent.click(await screen.findByRole("button", { name: "Eliminar" }));
    expect(await screen.findByText("Listado mostrado")).toBeTruthy();
    expect(api.db.productos.find((p) => p.id === 10)).toBeUndefined();
  });

  it("si el backend rechaza la eliminación muestra el error y se queda en el detalle", async () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrar("/admin/productos/10");
    const boton = await screen.findByRole("button", { name: "Eliminar" });
    api.db.caido = true;
    fireEvent.click(boton);
    expect((await screen.findByRole("alert")).textContent).toContain("No se pudo conectar");
    expect(screen.queryByText("Listado mostrado")).toBeNull();
  });

  it("muestra un aviso si el producto no existe", async () => {
    mostrar("/admin/productos/999");
    expect(await screen.findByText(/Producto no encontrado/)).toBeTruthy();
  });
});
