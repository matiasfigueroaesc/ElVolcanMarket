document.addEventListener("DOMContentLoaded", () => {
  const sesion = typeof obtenerSesion === "function" ? obtenerSesion() : null;
  const paginaActual = window.location.pathname.split("/").pop();
  const paginasRestringidasVendedor = [
    "users.html",
    "new-user.html",
    "edit-user.html",
    "new-product.html",
    "edit-product.html"
  ];

  if (!sesion || (sesion.tipo !== "administrador" && sesion.tipo !== "vendedor")) {
    window.location.href = "../store/login.html";
    return;
  }

  if (sesion.tipo === "vendedor" && paginasRestringidasVendedor.includes(paginaActual)) {
    window.location.href = "products.html";
  }
});
