import {
  PRODUCTOS_SEED,
  buscarProductos,
  crearProducto,
  eliminarProducto,
  listarCriticos,
  listarOfertas,
  listarPorCategoria,
  listarProductos,
  obtenerProducto,
  actualizarProducto,
  precioFinal,
  descontarStock,
} from "../../src/data/productos.js";

describe("data/productos.js", () => {
  beforeEach(() => localStorage.clear());

  it("carga el catálogo de fábrica la primera vez", () => {
    expect(listarProductos().length).toBe(PRODUCTOS_SEED.length);
  });

  it("crea un producto con id correlativo y lo persiste", () => {
    const nuevo = crearProducto({ nombre: "Prueba", precio: 1000, stock: 5, stockCritico: 1, categoriaId: 4 });
    expect(nuevo.id).toBe(PRODUCTOS_SEED.length + 1);
    expect(obtenerProducto(nuevo.id).nombre).toBe("Prueba");
  });

  it("actualiza solo los campos indicados", () => {
    actualizarProducto(1, { precio: 7000 });
    const p = obtenerProducto(1);
    expect(p.precio).toBe(7000);
    expect(p.nombre).toBe("Cilindro GLP 5 kg");
  });

  it("elimina un producto y devuelve false si no existe", () => {
    expect(eliminarProducto(1)).toBeTrue();
    expect(obtenerProducto(1)).toBeNull();
    expect(eliminarProducto(999)).toBeFalse();
  });

  it("filtra por categoría", () => {
    const reguladores = listarPorCategoria(2);
    expect(reguladores.length).toBeGreaterThan(0);
    expect(reguladores.every((p) => p.categoriaId === 2)).toBeTrue();
  });

  it("lista ofertas y usa el precio de oferta como precio final", () => {
    const ofertas = listarOfertas();
    expect(ofertas.length).toBeGreaterThan(0);
    ofertas.forEach((p) => expect(precioFinal(p)).toBeLessThan(p.precio));
    expect(precioFinal(obtenerProducto(1))).toBe(6500);
  });

  it("lista como críticos los productos con stock <= stock crítico", () => {
    const criticos = listarCriticos();
    expect(criticos.map((p) => p.id)).toContain(14);
    expect(criticos.every((p) => p.stock <= p.stockCritico)).toBeTrue();
  });

  it("busca sin distinguir mayúsculas ni tildes", () => {
    // "conexion" (sin tilde) encuentra "Kit conexión completo"
    expect(buscarProductos("CONEXION").map((p) => p.codigo)).toContain("MG004");
    expect(buscarProductos("RG002").length).toBe(1);
    expect(buscarProductos("zzz").length).toBe(0);
    expect(buscarProductos("").length).toBe(PRODUCTOS_SEED.length);
  });

  it("descuenta stock sin bajar de cero", () => {
    descontarStock([{ id: 2, cantidad: 3 }, { id: 14, cantidad: 100 }]);
    expect(obtenerProducto(2).stock).toBe(197);
    expect(obtenerProducto(14).stock).toBe(0);
  });
});
