// Cálculos de la vista de Reportes (/admin/reportes) como funciones PURAS:
// reciben una lista de órdenes y devuelven números o listas nuevas, sin leer datos
// ni tocar React. Así se prueban fácil con Jasmine y la página solo dibuja.
//
// Regla del negocio: solo cuentan como venta las órdenes con estadoPago "pagado".
// Las rechazadas existen (el checkout las guarda) pero no son ventas.

// "2026-09-02T14:10:00.000Z" -> "2026-09-02" según la hora local del navegador.
// (Si se cortara el texto ISO se usaría la fecha UTC, que en Chile puede ser otro día.)
export function fechaLocal(iso) {
  const d = new Date(iso);
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/**
 * Órdenes pagadas dentro del período. desde/hasta son "AAAA-MM-DD" (como los da un
 * <input type="date">) y vacíos significan "sin límite". Ambos extremos se incluyen.
 */
export function ordenesPagadas(ordenes, { desde = "", hasta = "" } = {}) {
  return ordenes
    .filter((o) => o.estadoPago === "pagado")
    .filter((o) => {
      const fecha = fechaLocal(o.fecha);
      return (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
    });
}

/** Totales generales: { total, cantidad, unidades, promedio }. */
export function resumenVentas(ordenes) {
  const total = ordenes.reduce((acc, o) => acc + o.total, 0);
  const unidades = ordenes.reduce(
    (acc, o) => acc + o.items.reduce((suma, item) => suma + item.cantidad, 0),
    0
  );
  return {
    total,
    cantidad: ordenes.length,
    unidades,
    // Ticket promedio redondeado a pesos (0 si no hay órdenes, para no dividir por 0).
    promedio: ordenes.length ? Math.round(total / ordenes.length) : 0,
  };
}

/**
 * Ventas agrupadas por producto, de la más vendida a la menos vendida (por unidades
 * y, si empatan, por monto): [{ id, nombre, unidades, total }].
 * Se usa el nombre y precio guardados EN LA ORDEN, así un producto que después
 * cambió de precio o se eliminó igual aparece con lo que realmente se vendió.
 */
export function ventasPorProducto(ordenes) {
  const porId = {};
  ordenes.forEach((o) =>
    o.items.forEach((item) => {
      const fila = porId[item.id] ?? { id: item.id, nombre: item.nombre, unidades: 0, total: 0 };
      fila.unidades += item.cantidad;
      fila.total += item.precio * item.cantidad;
      porId[item.id] = fila;
    })
  );
  return Object.values(porId).sort((a, b) => b.unidades - a.unidades || b.total - a.total);
}

/**
 * Ventas agrupadas por categoría, de mayor a menor monto: [{ categoria, unidades, total }].
 * La orden no guarda la categoría, así que se recibe una función categoriaDe(idProducto)
 * que devuelve el nombre de la categoría (la página la arma con src/data/).
 */
export function ventasPorCategoria(ordenes, categoriaDe) {
  const porCategoria = {};
  ordenes.forEach((o) =>
    o.items.forEach((item) => {
      const categoria = categoriaDe(item.id);
      const fila = porCategoria[categoria] ?? { categoria, unidades: 0, total: 0 };
      fila.unidades += item.cantidad;
      fila.total += item.precio * item.cantidad;
      porCategoria[categoria] = fila;
    })
  );
  return Object.values(porCategoria).sort((a, b) => b.total - a.total);
}
