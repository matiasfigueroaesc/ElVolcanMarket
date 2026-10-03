import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductList from "../../src/components/ProductList.jsx";

const crear = (id) => ({
  id, nombre: `Producto ${id}`, precio: 1000,
  precioOferta: null, stock: 3, imagen: "", categoriaId: 1,
});

const mostrar = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("<ProductList />", () => {
  beforeEach(() => localStorage.clear());

  it("renderiza una tarjeta por cada producto recibido", () => {
    mostrar(<ProductList productos={[crear(1), crear(2), crear(3)]} onAgregar={() => {}} />);
    expect(screen.getAllByRole("button", { name: /agregar/i }).length).toBe(3);
  });

  it("muestra un mensaje cuando la lista está vacía", () => {
    mostrar(<ProductList productos={[]} onAgregar={() => {}} />);
    expect(screen.getByText(/no hay productos/i)).toBeTruthy();
  });
});