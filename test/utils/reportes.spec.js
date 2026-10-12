import {
  fechaLocal,
  ordenesPagadas,
  resumenVentas,
  ventasPorCategoria,
  ventasPorProducto,
} from "../../src/utils/reportes.js";

// Fechas a mediodía UTC: en cualquier zona horaria de América caen el mismo día.
const ORDENES = [
  {
    id: 1,
    fecha: "2026-09-02T15:00:00.000Z",
    estadoPago: "pagado",
    total: 24000,
    items: [{ id: 2, nombre: "Cilindro 11 kg", precio: 12000, cantidad: 2 }],
  },
  {
    id: 2,
    fecha: "2026-09-15T15:00:00.000Z",
    estadoPago: "pagado",
    total: 24990,
    items: [
      { id: 3, nombre: "Cilindro 15 kg", precio: 16000, cantidad: 1 },
      { id: 5, nombre: "Regulador", precio: 8990, cantidad: 1 },
    ],
  },
  {
    id: 3,
    fecha: "2026-09-20T15:00:00.000Z",
    estadoPago: "rechazado",
    total: 12000,
    items: [{ id: 2, nombre: "Cilindro 11 kg", precio: 12000, cantidad: 1 }],
  },
];

describe("utils/reportes", () => {
  // Tipo: props (entrada -> salida)
  it("fechaLocal devuelve AAAA-MM-DD", () => {
    expect(fechaLocal("2026-09-02T15:00:00.000Z")).toBe("2026-09-02");
  });

  // Tipo: props
  it("ordenesPagadas descarta los pagos rechazados", () => {
    expect(ordenesPagadas(ORDENES).map((o) => o.id)).toEqual([1, 2]);
  });

  // Tipo: props
  it("ordenesPagadas filtra por período incluyendo los extremos", () => {
    expect(ordenesPagadas(ORDENES, { desde: "2026-09-10" }).map((o) => o.id)).toEqual([2]);
    expect(ordenesPagadas(ORDENES, { hasta: "2026-09-02" }).map((o) => o.id)).toEqual([1]);
    expect(ordenesPagadas(ORDENES, { desde: "2026-10-01", hasta: "2026-10-31" })).toEqual([]);
  });

  // Tipo: props
  it("resumenVentas calcula total, cantidad, unidades y promedio", () => {
    expect(resumenVentas(ordenesPagadas(ORDENES))).toEqual({ total: 48990, cantidad: 2, unidades: 4, promedio: 24495 });
  });

  // Tipo: props (caso borde)
  it("resumenVentas sin órdenes devuelve ceros (no divide por 0)", () => {
    expect(resumenVentas([])).toEqual({ total: 0, cantidad: 0, unidades: 0, promedio: 0 });
  });

  // Tipo: props
  it("ventasPorProducto agrupa y ordena del más vendido al menos vendido", () => {
    expect(ventasPorProducto(ordenesPagadas(ORDENES))).toEqual([
      { id: 2, nombre: "Cilindro 11 kg", unidades: 2, total: 24000 },
      { id: 3, nombre: "Cilindro 15 kg", unidades: 1, total: 16000 },
      { id: 5, nombre: "Regulador", unidades: 1, total: 8990 },
    ]);
  });

  // Tipo: props (recibe una función por parámetro)
  it("ventasPorCategoria usa la función categoriaDe y ordena por monto", () => {
    const categoriaDe = (id) => (id === 5 ? "Reguladores" : "Cilindros");
    expect(ventasPorCategoria(ordenesPagadas(ORDENES), categoriaDe)).toEqual([
      { categoria: "Cilindros", unidades: 3, total: 40000 },
      { categoria: "Reguladores", unidades: 1, total: 8990 },
    ]);
  });
});
