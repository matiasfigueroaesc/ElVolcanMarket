import {
  actualizarEstado,
  crearOrden,
  estadosSiguientes,
  listarOrdenes,
  listarPorUsuario,
  obtenerOrden,
  seguimientoPedido,
} from "../../src/data/ordenes.js";
import { conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";

const cliente = { nombre: "Ana", apellidos: "Pérez", correo: "ana@hotmail.com" };
const direccion = { calle: "Calle 1", departamento: "", region: "nuble", comuna: "chillan", indicaciones: "" };

describe("data/ordenes.js (servicios ventas y despacho)", () => {
  let api;
  beforeEach(() => {
    api = instalarApiFalsa();
  });

  it("crearOrden envía solo id y cantidad: el precio lo pone el backend", async () => {
    const orden = await crearOrden({
      cliente,
      direccion,
      entrega: "express",
      // precio falso: el backend lo ignora
      items: [{ id: 1, nombre: "Cilindro 5 kg", precio: 1, cantidad: 2, imagen: "" }],
    });
    const peticion = api.db.peticiones.find((p) => p.metodo === "POST" && p.ruta === "/boletas");
    expect(peticion.cuerpo.items).toEqual([{ id: 1, cantidad: 2 }]);
    expect(peticion.cuerpo.simularRechazo).toBeFalse();
    expect(orden.numero).toBe("ORD-000003");
    expect(orden.total).toBe(13000);
    expect(orden.entrega).toBe("express");
    expect(orden.estado).toBe("recibido");
  });

  it("con simularRechazo la boleta queda rechazada y sin despacho", async () => {
    const orden = await crearOrden({ cliente, direccion, entrega: "normal", items: [{ id: 1, cantidad: 1 }], simularRechazo: true });
    expect(orden.estadoPago).toBe("rechazado");
    expect(orden.estado).toBeNull();
  });

  it("listar y filtrar por usuario requiere ADMIN o VENDEDOR", async () => {
    await expectAsync(listarOrdenes()).toBeRejectedWith(jasmine.objectContaining({ status: 401 }));
    conToken("vendedor");
    expect((await listarOrdenes()).map((o) => o.numero)).toEqual(["ORD-000002", "ORD-000001"]);
    expect((await listarPorUsuario(3)).length).toBe(2);
    expect((await listarPorUsuario(1)).length).toBe(0);
  });

  it("obtenerOrden devuelve null si no existe o no es del cliente", async () => {
    conToken("admin");
    expect((await obtenerOrden(2)).estado).toBe("en camino");
    expect(await obtenerOrden(99)).toBeNull();
    conToken("vendedor");
    expect(await obtenerOrden(1)).not.toBeNull();
  });

  it("actualizarEstado avanza el despacho y rechaza estados inválidos", async () => {
    conToken("admin");
    expect(() => actualizarEstado(2, "perdido")).toThrowError(/Estado inválido/);
    const despacho = await actualizarEstado(2, "entregado");
    expect(despacho.estado).toBe("entregado");
    await expectAsync(actualizarEstado(2, "preparando")).toBeRejectedWith(jasmine.objectContaining({ status: 409 }));
  });

  it("seguimientoPedido es público y devuelve null si no existe", async () => {
    const pedido = await seguimientoPedido("ORD-000002");
    expect(pedido.estado).toBe("en camino");
    expect(pedido.cliente).toBeUndefined(); // sin datos personales
    expect(await seguimientoPedido("ORD-999999")).toBeNull();
  });

  it("estadosSiguientes solo ofrece las etapas posteriores", () => {
    expect(estadosSiguientes("recibido")).toEqual(["preparando", "en camino", "entregado"]);
    expect(estadosSiguientes("en camino")).toEqual(["entregado"]);
    expect(estadosSiguientes("entregado")).toEqual([]);
    expect(estadosSiguientes(null)).toEqual([]);
  });
});
