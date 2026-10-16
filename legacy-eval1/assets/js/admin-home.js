document.addEventListener("DOMContentLoaded", () => {
  if (typeof productos === "undefined" || typeof usuarios === "undefined") {
    console.error("admin-home.js: faltan los catálogos 'productos' o 'usuarios'. ¿Falta cargar products.js/users.js antes de este script?");
    return;
  }

  const totalProductosEl = document.getElementById("stat-total-productos");
  const totalUsuariosEl = document.getElementById("stat-total-usuarios");
  const stockCriticoEl = document.getElementById("stat-stock-critico");

  if (totalProductosEl) totalProductosEl.textContent = String(productos.length);
  if (totalUsuariosEl) totalUsuariosEl.textContent = String(usuarios.length);

  const totalStockCritico = productos.filter(
    (producto) => producto.stockCritico != null && producto.stock <= producto.stockCritico
  ).length;

  if (stockCriticoEl) stockCriticoEl.textContent = String(totalStockCritico);
});
