import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BlogDetalle from "../../src/pages/store/BlogDetalle.jsx";
import { ARTICULOS } from "../../src/utils/blog.js";

const mostrar = (ruta) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/blog/:id" element={<BlogDetalle />} />
      </Routes>
    </MemoryRouter>
  );

describe("<BlogDetalle />", () => {
  // Tipo: render
  it("muestra el artículo cuyo id viene en la URL", () => {
    const a = ARTICULOS[0];
    mostrar("/blog/1");
    expect(screen.getByRole("heading", { level: 1, name: a.titulo })).toBeTruthy();
    expect(screen.getByText(a.introduccion)).toBeTruthy();
  });

  // Tipo: render (lista)
  it("renderiza las 3 secciones del artículo", () => {
    mostrar("/blog/2");
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBe(3);
    expect(screen.getByRole("heading", { name: "3. Mantención de artefactos" })).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("muestra el autor y la fecha de publicación", () => {
    mostrar("/blog/1");
    expect(screen.getByText(/Publicado el 15 de agosto, 2026/)).toBeTruthy();
    expect(screen.getByText(/Administradora El Volcán/)).toBeTruthy();
  });

  // Tipo: render (condicional)
  it("muestra 'no encontrado' si el artículo no existe", () => {
    mostrar("/blog/99");
    expect(screen.getByText(/Artículo no encontrado/)).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
  });

  // Tipo: render (condicional)
  it("muestra 'no encontrado' si el id no es numérico", () => {
    mostrar("/blog/abc");
    expect(screen.getByText(/Artículo no encontrado/)).toBeTruthy();
  });

  // Tipo: props / navegación
  it("incluye el enlace para volver al blog", () => {
    mostrar("/blog/1");
    expect(screen.getByRole("link", { name: /Volver al blog/ }).getAttribute("href")).toBe("/blog");
  });
});
