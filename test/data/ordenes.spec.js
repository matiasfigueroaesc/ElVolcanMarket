import {
  ORDENES_SEED,
  actualizarEstado,
  crearOrden,
  listarOrdenes,
  listarPorUsuario,
} from "../../src/data/ordenes.js";

describe("data/ordenes.js", () => {
  beforeEach(() => localStorage.clear());

  it("crea una orden con número, total y estado inicial", () => {
    const orden = crearOrden({
      usuarioId: 3,
      cliente: { nombre: "Camila", apellidos: "Toro", correo: "camila.toro@gmail.com" },
      direccion: { calle: "Calle 1", region: "nuble", comuna: "chillan" },
      items: [
        { id: 1, nombre: "Cilindro 5 kg", precio: 6500, cantidad: 2, imagen: "" },
        { id: 8, nombre: "Manguera", precio: 3990, cantidad: 1, imagen: "" },
      ],
    });
    expect(orden.numero).toBe(`ORD-00000${ORDENES_SEED.length + 1}`);
    expect(orden.total).toBe(16990);
    expect(orden.estado).toBe("recibido");
    expect(listarOrdenes().length).toBe(ORDENES_SEED.length + 1);
  });

  it("filtra las órdenes de un usuario", () => {
    expect(listarPorUsuario(3).length).toBe(2);
    expect(listarPorUsuario(1).length).toBe(0);
  });

  it("solo acepta estados válidos", () => {
    expect(actualizarEstado(1, "preparando").estado).toBe("preparando");
    expect(() => actualizarEstado(1, "perdido")).toThrowError(/Estado inválido/);
  });
});
