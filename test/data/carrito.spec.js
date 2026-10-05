import {
  agregarItem,
  cambiarCantidad,
  quitarItem,
  totalCarrito,
  unidadesCarrito,
} from "../../src/data/carrito.js";

const cilindro = { id: 2, nombre: "Cilindro GLP 11 kg", precio: 12000, precioOferta: null, stock: 3, imagen: "" };
const enOferta = { id: 4, nombre: "Cilindro GLP 45 kg", precio: 45000, precioOferta: 39990, stock: 10, imagen: "" };

describe("data/carrito.js", () => {
  it("agrega un producto nuevo con cantidad 1", () => {
    const carrito = agregarItem([], cilindro);
    expect(carrito.length).toBe(1);
    expect(carrito[0].cantidad).toBe(1);
  });

  it("suma cantidad si el producto ya está, sin pasar el stock", () => {
    let carrito = agregarItem([], cilindro, 2);
    carrito = agregarItem(carrito, cilindro, 5);
    expect(carrito.length).toBe(1);
    expect(carrito[0].cantidad).toBe(3);
  });

  it("no modifica el carrito original (función pura)", () => {
    const original = [];
    agregarItem(original, cilindro);
    expect(original.length).toBe(0);
  });

  it("guarda el precio de oferta cuando corresponde", () => {
    const carrito = agregarItem([], enOferta);
    expect(carrito[0].precio).toBe(39990);
  });

  it("no agrega productos sin stock", () => {
    expect(agregarItem([], { ...cilindro, stock: 0 }).length).toBe(0);
  });

  it("cambiar cantidad a 0 elimina el ítem", () => {
    const carrito = agregarItem([], cilindro);
    expect(cambiarCantidad(carrito, 2, 0).length).toBe(0);
  });

  it("calcula total y unidades", () => {
    let carrito = agregarItem([], cilindro, 2);
    carrito = agregarItem(carrito, enOferta, 1);
    expect(totalCarrito(carrito)).toBe(2 * 12000 + 39990);
    expect(unidadesCarrito(carrito)).toBe(3);
    expect(quitarItem(carrito, 2).length).toBe(1);
  });
});
