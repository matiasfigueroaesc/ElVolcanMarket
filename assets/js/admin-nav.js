// ============================================
// El Volcán Market — admin-nav.js
// Genera el sidebar del panel administrador a partir
// de un array (evita repetir el <nav> en cada página).
// Requiere un contenedor <nav id="admin-sidebar"></nav>
// en el HTML de cada página del admin.
// ============================================

const ADMIN_NAV_ITEMS = [
  { label: "Inicio", href: "home.html" },
  { label: "Productos", href: "products.html" },
  { label: "Usuarios", href: "users.html" },
  { label: "Pedidos", href: "orders.html" },
];

function renderAdminSidebar() {
  const container = document.getElementById("admin-sidebar");
  if (!container) return;

  const currentPage = window.location.pathname.split("/").pop();
  const sesion = typeof obtenerSesion === "function" ? obtenerSesion() : null;
  const nombreUsuario = sesion?.nombre || "Usuario";

  const navItemsFiltrados = ADMIN_NAV_ITEMS.filter((item) => {
    if (!sesion || sesion.tipo === "administrador") return true;
    if (sesion.tipo === "vendedor") return item.href !== "users.html";
    return false;
  });

  const linksHtml = navItemsFiltrados.map((item) => {
    const isActive = item.href === currentPage;
    return `
      <li class="nav-item">
        <a class="nav-link ${isActive ? "active" : "text-white"}" href="${item.href}" ${isActive ? 'aria-current="page"' : ""}>
          ${item.label}
        </a>
      </li>`;
  }).join("");

  container.innerHTML = `
    <a href="home.html" class="d-flex align-items-center mb-2 text-white text-decoration-none">
      <span class="fs-5 fw-semibold">El Volcán Market</span>
    </a>
    <div class="small text-white-50 mb-3">${nombreUsuario}</div>
    <button type="button" class="btn btn-link btn-sm text-white-50 p-0 mb-3 text-decoration-none" id="admin-logout-button">Cerrar sesión</button>
    <hr class="text-white-50">
    <ul class="nav nav-pills flex-column mb-auto">
      ${linksHtml}
    </ul>
    <hr class="text-white-50">
    <a href="../store/index.html" class="text-white-50 small text-decoration-none">&larr; Volver a la tienda</a>
  `;

  const logoutButton = document.getElementById("admin-logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (typeof cerrarSesion === "function") {
        cerrarSesion();
      }
      window.location.href = "../store/login.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", renderAdminSidebar);
