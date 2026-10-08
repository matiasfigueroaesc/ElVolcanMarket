import { fireEvent, render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm.jsx";

const CATEGORIAS = [
  { id: 1, nombre: "Cilindros de Gas" },
  { id: 2, nombre: "Reguladores" },
];

const escribir = (label, valor) => fireEvent.change(screen.getByLabelText(label), { target: { value: valor } });

describe("<ProductForm />", () => {
  it("muestra las categorías recibidas por props en el select", () => {
    render(<ProductForm categorias={CATEGORIAS} onGuardar={() => {}} />);
    expect(screen.getByRole("option", { name: "Reguladores" })).toBeTruthy();
  });

  it("parte con los datos del producto cuando se edita", () => {
    const producto = { id: 9, codigo: "RG009", nombre: "Regulador X", precio: 1000, precioOferta: null, categoriaId: 2, unidad: "Unidad", stock: 3, stockCritico: 1, descripcion: "", imagen: "" };
    render(<ProductForm producto={producto} categorias={CATEGORIAS} onGuardar={() => {}} />);
    expect(screen.getByLabelText("Nombre").value).toBe("Regulador X");
    expect(screen.getByLabelText("Categoría").value).toBe("2");
    expect(screen.getByLabelText("Precio oferta (opcional)").value).toBe("");
  });

  it("actualiza el estado al escribir (input controlado)", () => {
    render(<ProductForm categorias={CATEGORIAS} onGuardar={() => {}} />);
    escribir("Código", "ab1");
    expect(screen.getByLabelText("Código").value).toBe("ab1");
  });

  it("al enviar vacío muestra los errores y no llama a onGuardar", () => {
    const onGuardar = jasmine.createSpy("onGuardar");
    render(<ProductForm categorias={CATEGORIAS} onGuardar={onGuardar} />);
    expect(screen.queryByText("Debes seleccionar una categoría.")).toBeNull(); // sin errores antes de enviar
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(screen.getByText("Debes seleccionar una categoría.")).toBeTruthy();
    expect(screen.getByLabelText("Código").classList).toContain("is-invalid");
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it("con datos válidos llama a onGuardar con números y null", () => {
    const onGuardar = jasmine.createSpy("onGuardar");
    render(<ProductForm categorias={CATEGORIAS} onGuardar={onGuardar} textoBoton="Crear producto" />);
    escribir("Código", "rg010");
    escribir("Nombre", " Regulador nuevo ");
    escribir("Categoría", "2");
    escribir("Precio", "9990");
    escribir("Stock", "15");
    escribir("Stock crítico", "3");
    fireEvent.click(screen.getByRole("button", { name: "Crear producto" }));
    expect(onGuardar).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        codigo: "RG010",
        nombre: "Regulador nuevo",
        precio: 9990,
        precioOferta: null,
        categoriaId: 2,
        stock: 15,
        stockCritico: 3,
      })
    );
  });
});
