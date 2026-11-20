import {
  actualizarProducto,
  buscarProductos,
  crearProducto,
  eliminarProducto,
  estaEnOferta,
  listarCriticos,
  listarOfertas,
  listarPorCategoria,
  listarProductos,
  obtenerProducto,
  precioFinal,
} from "../../src/data/productos.js";
import { PRODUCTOS_SEED, conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";

// productos.js ahora llama al backend: las pruebas usan el backend falso (helpers/apiFalsa.js).
describe("data/productos.js", () => {
  let api;
  beforeEach(() => {
    api = instalarApiFalsa();
  });

  it("lista el catálogo que entrega el backend", async () => {
    expect((await listarProductos()).length).toBe(PRODUCTOS_SEED.length);
    expect(api.db.peticiones[0]).toEqual(jasmine.objectContaining({ metodo: "GET", ruta: "/productos" }));
  });

  it("filtra por categoría y por ofertas con parámetros de la URL", async () => {
    const reguladores = await listarPorCategoria("2");
    expect(reguladores.length).toBe(3);
    expect(reguladores.every((p) => p.categoriaId === 2)).toBeTrue();

    const ofertas = await listarOfertas();
    expect(ofertas.length).toBe(3);
    ofertas.forEach((p) => expect(precioFinal(p)).toBeLessThan(p.precio));
  });

  it("obtiene un producto por id y devuelve null si no existe (404)", async () => {
    expect((await obtenerProducto(1)).nombre).toBe("Cilindro GLP 5 kg");
    expect(await obtenerProducto(999)).toBeNull();
  });

  it("crea, actualiza y elimina con el token del administrador", async () => {
    conToken("admin");
    const nuevo = await crearProducto({ codigo: "AC099", nombre: "Prueba", precio: 1000, stock: 5, stockCritico: 1, categoriaId: 4 });
    expect(nuevo.id).toBe(PRODUCTOS_SEED.length + 1);

    const editado = await actualizarProducto(nuevo.id, { ...nuevo, precio: 2000 });
    expect(editado.precio).toBe(2000);

    await eliminarProducto(nuevo.id);
    expect(await obtenerProducto(nuevo.id)).toBeNull();
    // Todas las escrituras viajaron con el token Bearer.
    expect(api.db.peticiones.filter((p) => p.metodo !== "GET").every((p) => p.token === "Bearer token-1")).toBeTrue();
  });

  it("sin sesión el backend rechaza crear (401) y el error trae su mensaje", async () => {
    await expectAsync(crearProducto({ codigo: "X1" })).toBeRejectedWith(
      jasmine.objectContaining({ status: 401, message: "Debes iniciar sesión o renovar tu sesión." })
    );
  });

  it("un código repetido devuelve 409 con el mensaje del backend", async () => {
    conToken("admin");
    await expectAsync(crearProducto({ codigo: "CL001", nombre: "Otro" })).toBeRejectedWith(
      jasmine.objectContaining({ status: 409, message: "Ya existe un producto con el código CL001." })
    );
  });

  it("los críticos son solo para administrador y vendedor", async () => {
    await expectAsync(listarCriticos()).toBeRejectedWith(jasmine.objectContaining({ status: 401 }));
    conToken("vendedor");
    expect((await listarCriticos()).map((p) => p.id)).toEqual([14]);
  });

  it("busca sin distinguir mayúsculas ni tildes sobre una lista ya cargada", () => {
    // "conexion" (sin tilde) encuentra "Kit conexión completo"
    expect(buscarProductos("CONEXION", PRODUCTOS_SEED).map((p) => p.codigo)).toContain("MG004");
    expect(buscarProductos("RG002", PRODUCTOS_SEED).length).toBe(1);
    expect(buscarProductos("zzz", PRODUCTOS_SEED).length).toBe(0);
    expect(buscarProductos("", PRODUCTOS_SEED).length).toBe(PRODUCTOS_SEED.length);
  });

  it("estaEnOferta y precioFinal no llaman al backend", () => {
    const enOferta = PRODUCTOS_SEED.find((p) => p.id === 4);
    expect(estaEnOferta(enOferta)).toBeTrue();
    expect(precioFinal(enOferta)).toBe(39990);
    expect(precioFinal(PRODUCTOS_SEED[0])).toBe(6500);
    expect(api.db.peticiones.length).toBe(0);
  });
});
