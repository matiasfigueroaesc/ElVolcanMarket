import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductoDetalle from "../../src/pages/admin/ProductoDetalle.jsx";
import { obtenerProducto } from "../../src/data/productos.js";

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
  beforeEach(() => localStorage.clear());

  it("muestra los datos del producto de la URL con su categoría", () => {
    mostrar("/admin/productos/5");
    expect(screen.getByRole("heading", { name: "Regulador doméstico estándar" })).toBeTruthy();
    expect(screen.getByText("RG001")).toBeTruthy();
    expect(screen.getByText("Reguladores")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Editar" }).getAttribute("href")).toBe("/admin/productos/5/editar");
  });

  it("marca oferta y stock crítico solo cuando corresponde", () => {
    mostrar("/admin/productos/14"); // Detector: en oferta y con stock bajo el crítico
    expect(screen.getByText("Oferta")).toBeTruthy();
    expect(screen.getByText("Stock crítico")).toBeTruthy();
  });

  it("no marca oferta ni stock crítico en un producto normal", () => {
    mostrar("/admin/productos/2");
    expect(screen.queryByText("Oferta")).toBeNull();
    expect(screen.queryByText("Stock crítico")).toBeNull();
  });

  it("muestra el mensaje que llega desde el formulario", () => {
    mostrar({ pathname: "/admin/productos/2", state: { mensaje: "Producto actualizado." } });
    expect(screen.getByText("Producto actualizado.")).toBeTruthy();
  });

  it("elimina y vuelve al listado si se confirma", () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrar("/admin/productos/10");
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(obtenerProducto(10)).toBeNull();
    expect(screen.getByText("Listado mostrado")).toBeTruthy();
  });

  it("muestra un aviso si el producto no existe", () => {
    mostrar("/admin/productos/999");
    expect(screen.getByText(/Producto no encontrado/)).toBeTruthy();
  });
});
