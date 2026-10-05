import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../../src/components/ProductCard.jsx";

const producto = {
  id: 2, nombre: "Cilindro GLP 11 kg", precio: 12000,
  precioOferta: null, stock: 5, imagen: "", categoriaId: 1,
};

const mostrar = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("<ProductCard />", () => {
  beforeEach(() => localStorage.clear());

  it("muestra el nombre y el stock recibidos por props", () => {
    mostrar(<ProductCard producto={producto} onAgregar={() => {}} />);
    expect(screen.getByText("Cilindro GLP 11 kg")).toBeTruthy();
    expect(screen.getByText("Stock: 5")).toBeTruthy();
  });

  it("llama a onAgregar con el producto al hacer clic", () => {
    const onAgregar = jasmine.createSpy("onAgregar");
    mostrar(<ProductCard producto={producto} onAgregar={onAgregar} />);
    fireEvent.click(screen.getByRole("button", { name: /agregar/i }));
    expect(onAgregar).toHaveBeenCalledWith(producto);
  });

  it("deshabilita el botón cuando no hay stock", () => {
    mostrar(<ProductCard producto={{ ...producto, stock: 0 }} onAgregar={() => {}} />);
    const boton = screen.getByRole("button", { name: /sin stock/i });
    expect(boton.disabled).toBeTrue();
  });
});