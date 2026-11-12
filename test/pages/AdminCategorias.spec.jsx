import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Categorias from "../../src/pages/admin/Categorias.jsx";
import CategoriaForm from "../../src/pages/admin/CategoriaForm.jsx";
import { CATEGORIAS_SEED, conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";

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

describe("pages/admin/Categorias y CategoriaForm", () => {
let api;
// OJO: este beforeEach va DENTRO del describe; fuera de él aplicaría a todas las pruebas del proyecto.
beforeEach(() => {
  api = instalarApiFalsa();
  conToken("admin");
});

describe("pages/admin/Categorias", () => {
  it("lista las categorías con su cantidad de productos", async () => {
    mostrar("/admin/categorias");
    const celdas = (await screen.findByText("Cilindros de Gas")).closest("tr").querySelectorAll("td");
    expect(screen.getAllByRole("row").length - 1).toBe(CATEGORIAS_SEED.length);
    expect(celdas[2].textContent).toBe("4"); // columna "Productos"
  });

  it("no deja eliminar una categoría que tiene productos", async () => {
    spyOn(window, "confirm");
    mostrar("/admin/categorias");
    fireEvent.click(await screen.findByRole("button", { name: "Eliminar Reguladores" }));
    expect(screen.getByText(/No se puede eliminar "Reguladores"/)).toBeTruthy();
    expect(window.confirm).not.toHaveBeenCalled();
    expect(api.db.peticiones.some((p) => p.metodo === "DELETE")).toBeFalse();
  });

  it("elimina una categoría vacía en el backend si se confirma", async () => {
    spyOn(window, "confirm").and.returnValue(true);
    api.db.categorias.push({ id: 5, nombre: "Repuestos", slug: "repuestos", descripcion: "", imagen: "" });
    mostrar("/admin/categorias");
    fireEvent.click(await screen.findByRole("button", { name: "Eliminar Repuestos" }));
    expect(await screen.findByText('Categoría "Repuestos" eliminada.')).toBeTruthy();
    expect(api.db.categorias.length).toBe(CATEGORIAS_SEED.length);
  });

  it("si el backend rechaza la eliminación (409) muestra su mensaje", async () => {
    spyOn(window, "confirm").and.returnValue(true);
    api.db.categorias.push({ id: 5, nombre: "Repuestos", slug: "repuestos", descripcion: "", imagen: "" });
    mostrar("/admin/categorias");
    const boton = await screen.findByRole("button", { name: "Eliminar Repuestos" });
    // Otro administrador agregó un producto a "Repuestos" después de cargar la página.
    api.db.productos.push({ ...api.db.productos[0], id: 99, categoriaId: 5 });
    fireEvent.click(boton);
    expect(await screen.findByText("No se puede eliminar una categoría que tiene productos.")).toBeTruthy();
  });
});

describe("pages/admin/CategoriaForm", () => {
  it("crea una categoría (el backend genera el slug) y vuelve al listado", async () => {
    mostrar("/admin/categorias/nueva");
    await screen.findByRole("heading", { name: "Nueva categoría" });
    escribir("Nombre", "Repuestos y Válvulas");
    expect(screen.getByText("URL en la tienda: /categorias/repuestos-y-valvulas")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));
    expect(await screen.findByRole("heading", { name: "Categorías" })).toBeTruthy();
    const creada = api.db.categorias.find((c) => c.slug === "repuestos-y-valvulas");
    expect(creada.nombre).toBe("Repuestos y Válvulas");
    // El slug no viaja en el JSON: lo calcula el servidor.
    expect(api.db.peticiones.find((p) => p.metodo === "POST").cuerpo.slug).toBeUndefined();
  });

  it("muestra el error y no envía nada si el nombre ya existe", async () => {
    mostrar("/admin/categorias/nueva");
    await screen.findByRole("heading", { name: "Nueva categoría" });
    escribir("Nombre", "accesorios");
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));
    expect(screen.getByText("Ya existe una categoría con ese nombre.")).toBeTruthy();
    expect(api.db.peticiones.some((p) => p.metodo === "POST")).toBeFalse();
  });

  it("al editar parte con los datos, conserva el slug y permite guardar el mismo nombre", async () => {
    mostrar("/admin/categorias/3/editar");
    expect((await screen.findByLabelText("Nombre")).value).toBe("Mangueras y Conexiones");
    // El slug de fábrica no coincide con slugify(nombre): se muestra el que tiene guardado.
    expect(screen.getByText("URL en la tienda: /categorias/mangueras-conexiones")).toBeTruthy();
    escribir("Descripción (opcional)", "Mangueras homologadas.");
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(await screen.findByRole("heading", { name: "Categorías" })).toBeTruthy();
    expect(api.db.categorias.find((c) => c.id === 3)).toEqual(
      jasmine.objectContaining({ descripcion: "Mangueras homologadas.", slug: "mangueras-conexiones" })
    );
  });

  it("muestra un aviso si la categoría no existe", async () => {
    mostrar("/admin/categorias/99/editar");
    expect(await screen.findByText(/Categoría no encontrada/)).toBeTruthy();
  });
});
});
