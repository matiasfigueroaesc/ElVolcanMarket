// ============================================
// El Volcán Market — store-nav.js
// Genera el navbar público (store) a partir de un
// array, para no repetir el mismo <nav> en cada
// página. Requiere un contenedor
// <nav id="store-navbar"></nav> en el HTML.
// ============================================

const STORE_NAV_ITEMS = [
  { label: "Inicio", href: "index.html" },
  { label: "Productos", href: "products.html" },
  { label: "Nosotros", href: "about.html" },
  { label: "Blog", href: "blog.html" },
  { label: "Contacto", href: "contact.html" },
];

function renderStoreNavbar() {
  const container = document.getElementById("store-navbar");
  if (!container) return;

  const currentPage = window.location.pathname.split("/").pop();
  const sesion = typeof obtenerSesion === "function" ? obtenerSesion() : null;

  const linksHtml = STORE_NAV_ITEMS.map((item) => {
    const isActive = item.href === currentPage;
    return `
      <li class="nav-item">
        <a class="nav-link ${isActive ? "active" : ""}" href="${item.href}" ${isActive ? 'aria-current="page"' : ""}>
          ${item.label}
        </a>
      </li>`;
  }).join("");

  const loginHtml = sesion
    ? `
      <span class="navbar-text me-2">Hola, ${sesion.nombre}</span>
      <button type="button" class="btn btn-outline-secondary me-2" id="store-logout-button">Cerrar sesión</button>
      `
    : `
      <a href="register.html" class="btn btn-outline-primary me-2">Registrarse</a>
      <a href="login.html" class="btn btn-outline-secondary me-2">Iniciar sesión</a>
    `;

  container.innerHTML = `
    <div class="container-fluid">
      <a class="navbar-brand" href="index.html">
        <img src="../assets/img/EVG_Horizontal.svg" alt="El Volcán Market" height="36">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#storeNavCollapse" aria-controls="storeNavCollapse" aria-expanded="false" aria-label="Abrir menú">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="storeNavCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          ${linksHtml}
        </ul>
        ${loginHtml}
        <a href="cart.html" class="btn btn-outline-primary" id="store-cart-link">
          🛒 Carrito <span class="badge text-bg-primary" id="cart-count">0</span>
        </a>
      </div>
    </div>
  `;

  const logoutButton = document.getElementById("store-logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      cerrarSesion();
      window.location.href = "index.html";
    });
  }

  if (currentPage === "cart.html") {
    document.getElementById("store-cart-link")?.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", renderStoreNavbar);
