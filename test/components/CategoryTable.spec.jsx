import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CategoryTable from "../../src/components/CategoryTable.jsx";

const CATEGORIAS = [
  { id: 1, nombre: "Cilindros", descripcion: "Gas licuado" },
  { id: 7, nombre: "Repuestos", descripcion: "" },
];

const mostrar = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("<CategoryTable />", () => {
  it("muestra una fila por categoría con su cantidad de productos", () => {
    mostrar(<CategoryTable categorias={CATEGORIAS} conteo={{ 1: 4 }} onEliminar={() => {}} />);
    const filaCilindros = screen.getByText("Cilindros").closest("tr");
    const filaRepuestos = screen.getByText("Repuestos").closest("tr");
    expect(within(filaCilindros).getByText("4")).toBeTruthy();
    expect(within(filaRepuestos).getByText("0")).toBeTruthy(); // sin productos -> 0
  });

  it("el enlace Editar apunta a la categoría", () => {
    mostrar(<CategoryTable categorias={CATEGORIAS} onEliminar={() => {}} />);
    const fila = screen.getByText("Repuestos").closest("tr");
    expect(within(fila).getByRole("link", { name: "Editar" }).getAttribute("href")).toBe("/admin/categorias/7/editar");
  });

  it("llama a onEliminar con la categoría clickeada", () => {
    const onEliminar = jasmine.createSpy("onEliminar");
    mostrar(<CategoryTable categorias={CATEGORIAS} onEliminar={onEliminar} />);
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Repuestos" }));
    expect(onEliminar).toHaveBeenCalledOnceWith(CATEGORIAS[1]);
  });

  it("muestra un aviso si no hay categorías", () => {
    mostrar(<CategoryTable categorias={[]} onEliminar={() => {}} />);
    expect(screen.getByText("No hay categorías registradas.")).toBeTruthy();
  });
});
