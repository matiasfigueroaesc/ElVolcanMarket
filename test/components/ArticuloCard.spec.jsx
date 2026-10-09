import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ArticuloCard from "../../src/components/ArticuloCard.jsx";
import { ARTICULOS } from "../../src/utils/blog.js";

const mostrar = (articulo) =>
  render(
    <MemoryRouter>
      <ArticuloCard articulo={articulo} />
    </MemoryRouter>
  );

describe("<ArticuloCard />", () => {
  // Tipo: props
  it("muestra título, fecha y resumen del artículo recibido por props", () => {
    const a = ARTICULOS[0];
    mostrar(a);
    expect(screen.getByRole("heading", { name: a.titulo })).toBeTruthy();
    expect(screen.getByText(a.fecha)).toBeTruthy();
    expect(screen.getByText(a.resumen)).toBeTruthy();
  });

  // Tipo: props
  it("el enlace apunta al detalle del artículo", () => {
    const a = ARTICULOS[1];
    mostrar(a);
    expect(screen.getByRole("link", { name: "Leer artículo" }).getAttribute("href")).toBe("/blog/2");
  });

  // Tipo: render
  it("la imagen usa el texto alternativo del artículo", () => {
    const a = ARTICULOS[0];
    mostrar(a);
    expect(screen.getByAltText(a.alt)).toBeTruthy();
  });
});
