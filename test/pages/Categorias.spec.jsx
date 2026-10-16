import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { listarCategorias } from "../../src/data/categorias.js";
import Categorias from "../../src/pages/store/Categorias.jsx";

const mostrar = () =>
  render(
    <MemoryRouter>
      <Categorias />
    </MemoryRouter>
  );

describe("<Categorias />", () => {
  beforeEach(() => localStorage.clear());

  it("muestra el nombre de cada categoría", () => {
    mostrar();
    expect(screen.getByText("Cilindros de Gas")).toBeTruthy();
    expect(screen.getByText("Reguladores")).toBeTruthy();
  });

  it("muestra una tarjeta enlazada por cada categoría", () => {
    mostrar();
    const enlaces = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href").startsWith("/categorias/"));
    expect(enlaces.length).toBe(listarCategorias().length);
  });
});