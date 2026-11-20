import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Categorias from "../../src/pages/store/Categorias.jsx";
import { CATEGORIAS_SEED, instalarApiFalsa } from "../helpers/apiFalsa.js";

const mostrar = () =>
  render(
    <MemoryRouter>
      <Categorias />
    </MemoryRouter>
  );

describe("<Categorias />", () => {
  beforeEach(() => instalarApiFalsa());

  it("muestra 'Cargando...' mientras espera al backend", () => {
    mostrar();
    expect(screen.getByRole("status").textContent).toContain("Cargando");
  });

  it("muestra el nombre de cada categoría", async () => {
    mostrar();
    expect(await screen.findByText("Cilindros de Gas")).toBeTruthy();
    expect(screen.getByText("Reguladores")).toBeTruthy();
  });

  it("muestra una tarjeta enlazada por cada categoría", async () => {
    mostrar();
    await screen.findByText("Cilindros de Gas");
    const enlaces = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href").startsWith("/categorias/"));
    expect(enlaces.length).toBe(CATEGORIAS_SEED.length);
  });
});