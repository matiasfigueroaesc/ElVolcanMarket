import { fireEvent, render, screen } from "@testing-library/react";
import CartTable from "../../src/components/CartTable.jsx";

const items = [
  { id: 2, nombre: "Cilindro GLP 11 kg", precio: 12000, imagen: "", cantidad: 2, stock: 10 },
];

describe("<CartTable />", () => {
  it("renderiza una fila por cada ítem recibido", () => {
    render(<CartTable items={items} onCambiar={() => {}} onQuitar={() => {}} />);
    expect(screen.getByText("Cilindro GLP 11 kg")).toBeTruthy();
  });

  it("llama a onCambiar con el id y la nueva cantidad", () => {
    const onCambiar = jasmine.createSpy("onCambiar");
    render(<CartTable items={items} onCambiar={onCambiar} onQuitar={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "menos" }));
    expect(onCambiar).toHaveBeenCalledWith(2, 1);
  });

  it("llama a onQuitar con el id del ítem", () => {
    const onQuitar = jasmine.createSpy("onQuitar");
    render(<CartTable items={items} onCambiar={() => {}} onQuitar={onQuitar} />);
    fireEvent.click(screen.getByRole("button", { name: "Quitar" }));
    expect(onQuitar).toHaveBeenCalledWith(2);
  });

  it("deshabilita el botón más al llegar al stock", () => {
    const lleno = [{ ...items[0], cantidad: 10 }];
    render(<CartTable items={lleno} onCambiar={() => {}} onQuitar={() => {}} />);
    expect(screen.getByRole("button", { name: "más" }).disabled).toBeTrue();
  });
});