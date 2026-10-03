import { fireEvent, render, screen } from "@testing-library/react";
import CategoryFilter from "../../src/components/CategoryFilter.jsx";

const categorias = [
  { id: 1, nombre: "Cilindros" },
  { id: 2, nombre: "Reguladores" },
];

describe("<CategoryFilter />", () => {
  it("muestra una opción por categoría más la opción 'Todas'", () => {
    render(<CategoryFilter categorias={categorias} seleccionada="" onCambiar={() => {}} />);
    expect(screen.getAllByRole("option").length).toBe(3);
  });

  it("llama a onCambiar con el valor elegido", () => {
    const onCambiar = jasmine.createSpy("onCambiar");
    render(<CategoryFilter categorias={categorias} seleccionada="" onCambiar={onCambiar} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });
    expect(onCambiar).toHaveBeenCalledWith("2");
  });
});