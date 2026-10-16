import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Categorias from "../../src/pages/admin/Categorias.jsx";
import CategoriaForm from "../../src/pages/admin/CategoriaForm.jsx";
import {
  CATEGORIAS_SEED,
  crearCategoria,
  listarCategorias,
  obtenerCategoria,
  obtenerCategoriaPorSlug,
} from "../../src/data/categorias.js";

const mostrar = (ruta) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/categorias" element={<Categorias />} />
        <Route path="/admin/categorias/nueva" element={<CategoriaForm />} />
        <Route path="/admin/categorias/:id/editar" element={<CategoriaForm />} />
      </Routes>
    </MemoryRouter>
  );

const escribir = (label, valor) => fireEvent.change(screen.getByLabelText(label), { target: { value: valor } });

describe("pages/admin/Categorias", () => {
  beforeEach(() => localStorage.clear());

  it("lista las categorías con su cantidad de productos", () => {
    mostrar("/admin/categorias");
    expect(screen.getAllByRole("row").length - 1).toBe(CATEGORIAS_SEED.length);
    const celdas = screen.getByText("Cilindros de Gas").closest("tr").querySelectorAll("td");
    expect(celdas[2].textContent).toBe("4"); // columna "Productos"
  });

  it("no deja eliminar una categoría que tiene productos", () => {
    spyOn(window, "confirm");
    mostrar("/admin/categorias");
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Reguladores" }));
    expect(screen.getByText(/No se puede eliminar "Reguladores"/)).toBeTruthy();
    expect(window.confirm).not.toHaveBeenCalled();
    expect(obtenerCategoria(2)).not.toBeNull();
  });

  it("elimina una categoría vacía si se confirma", () => {
    spyOn(window, "confirm").and.returnValue(true);
    crearCategoria({ nombre: "Repuestos" });
    mostrar("/admin/categorias");
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Repuestos" }));
    expect(screen.getByText('Categoría "Repuestos" eliminada.')).toBeTruthy();
    expect(listarCategorias().length).toBe(CATEGORIAS_SEED.length);
  });
});

describe("pages/admin/CategoriaForm", () => {
  beforeEach(() => localStorage.clear());

  it("crea una categoría con su slug y vuelve al listado", () => {
    mostrar("/admin/categorias/nueva");
    escribir("Nombre", "Repuestos y Válvulas");
    expect(screen.getByText("URL en la tienda: /categorias/repuestos-y-valvulas")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));
    expect(screen.getByRole("heading", { name: "Categorías" })).toBeTruthy();
    expect(obtenerCategoriaPorSlug("repuestos-y-valvulas")).not.toBeNull();
  });

  it("muestra el error y no guarda si el nombre ya existe", () => {
    mostrar("/admin/categorias/nueva");
    escribir("Nombre", "accesorios");
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));
    expect(screen.getByText("Ya existe una categoría con ese nombre.")).toBeTruthy();
    expect(listarCategorias().length).toBe(CATEGORIAS_SEED.length);
  });

  it("al editar parte con los datos y permite guardar el mismo nombre", () => {
    mostrar("/admin/categorias/2/editar");
    expect(screen.getByLabelText("Nombre").value).toBe("Reguladores");
    escribir("Descripción (opcional)", "Reguladores de presión.");
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(obtenerCategoria(2).descripcion).toBe("Reguladores de presión.");
  });

  it("muestra un aviso si la categoría no existe", () => {
    mostrar("/admin/categorias/99/editar");
    expect(screen.getByText(/Categoría no encontrada/)).toBeTruthy();
  });
});
