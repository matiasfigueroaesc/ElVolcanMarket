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
];

function renderAdminSidebar() {
  const container = document.getElementById("admin-sidebar");
  if (!container) return;

  const currentPage = window.location.pathname.split("/").pop();

  const linksHtml = ADMIN_NAV_ITEMS.map((item) => {
    const isActive = item.href === currentPage;
    return `
      <li class="nav-item">
        <a class="nav-link ${isActive ? "active" : "text-white"}" href="${item.href}" ${isActive ? 'aria-current="page"' : ""}>
          ${item.label}
        </a>
      </li>`;
  }).join("");

  container.innerHTML = `
    <a href="home.html" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <span class="fs-5 fw-semibold">El Volcán Market</span>
    </a>
    <hr class="text-white-50">
    <ul class="nav nav-pills flex-column mb-auto">
      ${linksHtml}
    </ul>
    <hr class="text-white-50">
    <a href="../store/index.html" class="text-white-50 small text-decoration-none">&larr; Volver a la tienda</a>
  `;
}

document.addEventListener("DOMContentLoaded", renderAdminSidebar);
