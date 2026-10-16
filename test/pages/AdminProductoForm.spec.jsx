import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductoForm from "../../src/pages/admin/ProductoForm.jsx";
import { PRODUCTOS_SEED, listarProductos, obtenerProducto } from "../../src/data/productos.js";

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
  beforeEach(() => localStorage.clear());

  it("crea un producto nuevo y navega a su detalle", () => {
    mostrar("/admin/productos/nuevo");
    expect(screen.getByRole("heading", { name: "Nuevo producto" })).toBeTruthy();
    escribir("Código", "AC010");
    escribir("Nombre", "Llave de paso");
    escribir("Categoría", "4");
    escribir("Precio", "4990");
    escribir("Stock", "20");
    escribir("Stock crítico", "5");
    fireEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    expect(screen.getByText("Detalle mostrado")).toBeTruthy();
    expect(listarProductos().length).toBe(PRODUCTOS_SEED.length + 1);
    expect(obtenerProducto(15).nombre).toBe("Llave de paso");
  });

  it("al editar carga los datos y guarda los cambios", () => {
    mostrar("/admin/productos/2/editar");
    expect(screen.getByLabelText("Nombre").value).toBe("Cilindro GLP 11 kg");
    escribir("Precio", "12500");
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(obtenerProducto(2).precio).toBe(12500);
    expect(listarProductos().length).toBe(PRODUCTOS_SEED.length); // no se creó uno nuevo
  });

  it("no guarda si hay errores", () => {
    mostrar("/admin/productos/2/editar");
    escribir("Stock", "-3");
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(screen.getByText("El stock debe ser un número entero mayor o igual a 0.")).toBeTruthy();
    expect(obtenerProducto(2).stock).toBe(200);
  });

  it("muestra un aviso si el producto a editar no existe", () => {
    mostrar("/admin/productos/999/editar");
    expect(screen.getByText(/Producto no encontrado/)).toBeTruthy();
  });
});
