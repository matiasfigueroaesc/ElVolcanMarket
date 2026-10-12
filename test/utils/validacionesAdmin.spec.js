import { hayErrores, validarCategoria, validarProducto } from "../../src/utils/validacionesAdmin.js";

const VALIDO = {
  codigo: "CL010",
  nombre: "Cilindro de prueba",
  precio: "5000",
  precioOferta: "",
  categoriaId: "1",
  stock: "10",
  stockCritico: "2",
};

describe("utils/validacionesAdmin", () => {
  describe("validarProducto", () => {
    it("no devuelve errores con datos válidos", () => {
      expect(validarProducto(VALIDO)).toEqual({});
    });

    it("exige código de al menos 3 caracteres y nombre", () => {
      const errores = validarProducto({ ...VALIDO, codigo: "C1", nombre: "  " });
      expect(errores.codigo).toBe("El código debe tener al menos 3 caracteres.");
      expect(errores.nombre).toBe("El nombre del producto es obligatorio.");
    });

    it("rechaza nombres de más de 100 caracteres", () => {
      expect(validarProducto({ ...VALIDO, nombre: "x".repeat(101) }).nombre).toContain("100");
    });

    it("rechaza precio vacío o negativo", () => {
      expect(validarProducto({ ...VALIDO, precio: "" }).precio).toBeDefined();
      expect(validarProducto({ ...VALIDO, precio: "-1" }).precio).toBeDefined();
      expect(validarProducto({ ...VALIDO, precio: "0" }).precio).toBeUndefined();
    });

    it("el precio de oferta es opcional pero debe ser menor que el precio", () => {
      expect(validarProducto({ ...VALIDO, precioOferta: "4000" }).precioOferta).toBeUndefined();
      expect(validarProducto({ ...VALIDO, precioOferta: "5000" }).precioOferta).toBe(
        "El precio de oferta debe ser menor que el precio normal."
      );
      expect(validarProducto({ ...VALIDO, precioOferta: "-5" }).precioOferta).toBeDefined();
    });

    it("exige elegir categoría", () => {
      expect(validarProducto({ ...VALIDO, categoriaId: "" }).categoriaId).toBe("Debes seleccionar una categoría.");
    });

    it("stock y stock crítico deben ser enteros mayores o iguales a 0", () => {
      expect(validarProducto({ ...VALIDO, stock: "2.5" }).stock).toBeDefined();
      expect(validarProducto({ ...VALIDO, stock: "-1" }).stock).toBeDefined();
      expect(validarProducto({ ...VALIDO, stockCritico: "" }).stockCritico).toBeDefined();
      expect(validarProducto({ ...VALIDO, stock: "0", stockCritico: "0" })).toEqual({});
    });
  });

  describe("validarCategoria", () => {
    const EXISTENTES = [{ id: 1, nombre: "Reguladores" }];

    it("acepta un nombre nuevo", () => {
      expect(validarCategoria({ nombre: "Repuestos", descripcion: "" }, EXISTENTES)).toEqual({});
    });

    it("exige al menos 3 caracteres", () => {
      expect(validarCategoria({ nombre: "ab" }, EXISTENTES).nombre).toBe("El nombre debe tener al menos 3 caracteres.");
    });

    it("no permite repetir el nombre (sin importar mayúsculas)", () => {
      expect(validarCategoria({ nombre: " reguladores " }, EXISTENTES).nombre).toBe(
        "Ya existe una categoría con ese nombre."
      );
    });

    it("limita la descripción a 200 caracteres", () => {
      expect(validarCategoria({ nombre: "Repuestos", descripcion: "x".repeat(201) }).descripcion).toBeDefined();
    });
  });

  it("hayErrores indica si el objeto tiene algún campo", () => {
    expect(hayErrores({})).toBeFalse();
    expect(hayErrores({ nombre: "mal" })).toBeTrue();
  });
});
