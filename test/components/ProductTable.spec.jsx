import { fireEvent, render, screen, within } from "@testing-library/react";
import ProductTable from "../../src/components/ProductTable.jsx";

// Datos de prueba pequeños: la tabla no depende de localStorage.
const PRODUCTOS = [
  { id: 1, codigo: "CL001", nombre: "Cilindro 5 kg", precio: 6500, stock: 80, stockCritico: 10 },
  { id: 2, codigo: "AC003", nombre: "Detector de gas", precio: 19990, stock: 4, stockCritico: 5 },
];

describe("<ProductTable />", () => {
  it("muestra una fila por producto con sus datos (props)", () => {
    render(<ProductTable productos={PRODUCTOS} onEliminar={() => {}} />);
    const filas = screen.getAllByRole("row"); // 1 encabezado + 2 productos
    expect(filas.length).toBe(3);
    expect(within(filas[1]).getByText("CL001")).toBeTruthy();
    expect(within(filas[1]).getByText("$6.500")).toBeTruthy();
  });

  it("marca solo los productos con stock crítico (renderizado condicional)", () => {
    render(<ProductTable productos={PRODUCTOS} onEliminar={() => {}} />);
    const filaDetector = screen.getByText("Detector de gas").closest("tr");
    const filaCilindro = screen.getByText("Cilindro 5 kg").closest("tr");
    expect(within(filaDetector).getByText("Crítico")).toBeTruthy();
    expect(within(filaCilindro).queryByText("Crítico")).toBeNull();
  });

  it("llama a onEliminar con el producto al hacer clic en Eliminar (evento)", () => {
    const onEliminar = jasmine.createSpy("onEliminar");
    render(<ProductTable productos={PRODUCTOS} onEliminar={onEliminar} />);
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Detector de gas" }));
    expect(onEliminar).toHaveBeenCalledOnceWith(PRODUCTOS[1]);
  });
});
