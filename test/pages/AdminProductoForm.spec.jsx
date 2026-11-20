import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductoForm from "../../src/pages/admin/ProductoForm.jsx";
import { PRODUCTOS_SEED, conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";

// Se monta con las mismas rutas que App.jsx; el detalle se reemplaza por un texto simple
// para comprobar a dónde navega después de guardar.
const mostrar = (ruta) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/productos/nuevo" element={<ProductoForm />} />
        <Route path="/admin/productos/:id/editar" element={<ProductoForm />} />
        <Route path="/admin/productos/:id" element={<p>Detalle mostrado</p>} />
      </Routes>
    </MemoryRouter>
  );

const escribir = (label, valor) => fireEvent.change(screen.getByLabelText(label), { target: { value: valor } });

describe("pages/admin/ProductoForm", () => {
  let api;
  beforeEach(() => {
    api = instalarApiFalsa();
    conToken("admin");
  });

  it("crea un producto nuevo en el backend y navega a su detalle", async () => {
    mostrar("/admin/productos/nuevo");
    expect(await screen.findByRole("heading", { name: "Nuevo producto" })).toBeTruthy();
    escribir("Código", "AC010");
    escribir("Nombre", "Llave de paso");
    escribir("Categoría", "4");
    escribir("Precio", "4990");
    escribir("Stock", "20");
    escribir("Stock crítico", "5");
    fireEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    expect(await screen.findByText("Detalle mostrado")).toBeTruthy();
    expect(api.db.productos.length).toBe(PRODUCTOS_SEED.length + 1);
    expect(api.db.productos.find((p) => p.id === 15).nombre).toBe("Llave de paso");
  });

  it("al editar carga los datos y guarda los cambios con PUT", async () => {
    mostrar("/admin/productos/2/editar");
    expect((await screen.findByLabelText("Nombre")).value).toBe("Cilindro GLP 11 kg");
    escribir("Precio", "12500");
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    await screen.findByText("Detalle mostrado");
    expect(api.db.productos.find((p) => p.id === 2).precio).toBe(12500);
    expect(api.db.productos.length).toBe(PRODUCTOS_SEED.length); // no se creó uno nuevo
    expect(api.db.peticiones.some((p) => p.metodo === "PUT" && p.ruta === "/productos/2")).toBeTrue();
  });

  it("no envía nada al backend si hay errores de validación", async () => {
    mostrar("/admin/productos/2/editar");
    await screen.findByLabelText("Nombre");
    escribir("Stock", "-3");
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(screen.getByText("El stock debe ser un número entero mayor o igual a 0.")).toBeTruthy();
    expect(api.db.peticiones.some((p) => p.metodo === "PUT")).toBeFalse();
  });

  it("muestra el error del backend si el código ya existe (409) y no navega", async () => {
    mostrar("/admin/productos/nuevo");
    await screen.findByRole("heading", { name: "Nuevo producto" });
    escribir("Código", "CL001");
    escribir("Nombre", "Repetido");
    escribir("Categoría", "1");
    escribir("Precio", "1000");
    escribir("Stock", "1");
    escribir("Stock crítico", "1");
    fireEvent.click(screen.getByRole("button", { name: "Crear producto" }));
    expect((await screen.findByRole("alert")).textContent).toBe("Ya existe un producto con el código CL001.");
    expect(screen.queryByText("Detalle mostrado")).toBeNull();
    expect(screen.getByRole("button", { name: "Crear producto" }).disabled).toBeFalse();
  });

  it("muestra un aviso si el producto a editar no existe", async () => {
    mostrar("/admin/productos/999/editar");
    expect(await screen.findByText(/Producto no encontrado/)).toBeTruthy();
  });
});
