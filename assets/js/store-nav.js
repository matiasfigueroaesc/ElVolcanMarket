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

  const linksHtml = STORE_NAV_ITEMS.map((item) => {
    const isActive = item.href === currentPage;
    return `
      <li class="nav-item">
        <a class="nav-link ${isActive ? "active" : ""}" href="${item.href}" ${isActive ? 'aria-current="page"' : ""}>
          ${item.label}
        </a>
      </li>`;
  }).join("");

  container.innerHTML = `
    <div class="container-fluid">
      <a class="navbar-brand fw-semibold" href="index.html">El Volcán Market</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#storeNavCollapse" aria-controls="storeNavCollapse" aria-expanded="false" aria-label="Abrir menú">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="storeNavCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          ${linksHtml}
        </ul>
        <a href="cart.html" class="btn btn-outline-primary" id="store-cart-link">
          🛒 Carrito <span class="badge text-bg-primary" id="cart-count">0</span>
        </a>
      </div>
    </div>
  `;

  // Marca el link del carrito como activo si estamos en cart.html
  if (currentPage === "cart.html") {
    document.getElementById("store-cart-link")?.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", renderStoreNavbar);
