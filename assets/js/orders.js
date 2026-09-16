// ============================================
// El Volcán Market — orders.js
// Catálogo de órdenes: guarda cada pedido confirmado
// en localStorage para que el admin pueda listarlos y
// ver el detalle.
// ============================================

const ORDERS_STORAGE_KEY = "volcan_orders";

function cargarPedidos() {
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("orders.js: catálogo de pedidos corrupto en localStorage, se reinicia.", e);
  }

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([]));
  return [];
}

function guardarPedidos(lista) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(lista));
}

let pedidos = cargarPedidos();
