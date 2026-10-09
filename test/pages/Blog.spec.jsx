import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Blog from "../../src/pages/store/Blog.jsx";
import { ARTICULOS } from "../../src/utils/blog.js";

describe("<Blog />", () => {
  const mostrar = () =>
    render(
      <MemoryRouter>
        <Blog />
      </MemoryRouter>
    );

  // Tipo: render
  it("muestra el título del blog", () => {
    mostrar();
    expect(screen.getByRole("heading", { level: 1, name: "Blog de noticias y consejos" })).toBeTruthy();
  });

  // Tipo: render (lista)
  it("renderiza una tarjeta por cada artículo", () => {
    mostrar();
    expect(screen.getAllByRole("link", { name: "Leer artículo" }).length).toBe(ARTICULOS.length);
    ARTICULOS.forEach((a) => {
      expect(screen.getByRole("heading", { name: a.titulo })).toBeTruthy();
    });
  });

  // Tipo: props / eventos (navegación)
  it("cada enlace lleva al detalle de su artículo", () => {
    mostrar();
    const enlaces = screen.getAllByRole("link", { name: "Leer artículo" });
    expect(enlaces[0].getAttribute("href")).toBe("/blog/1");
    expect(enlaces[1].getAttribute("href")).toBe("/blog/2");
  });
});
