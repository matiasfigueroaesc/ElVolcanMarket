// ============================================
// El Volcán Market — product-detail.js
// Lee el id del producto desde la URL (?id=N) y llena
// dinámicamente el detalle correspondiente.
//
// Requiere en product-detail.html:
//   - <section id="detalle-producto" class="row g-5"></section>
//   - <li id="breadcrumb-actual"> (opcional, para el breadcrumb)
//
// Requiere cargar products.js ANTES que este script (usa el
// array global "productos" para buscar el producto por id).
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("detalle-producto");
  if (!contenedor) return;

  if (typeof productos === "undefined") {
    console.error("product-detail.js: no se encontró el catálogo 'productos'. ¿Falta cargar products.js antes de este script?");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const producto = productos.find((p) => p.id === id);
  const breadcrumbActual = document.getElementById("breadcrumb-actual");

  if (!producto) {
    contenedor.innerHTML = `
      <div class="col-12">
        <p class="text-muted">
          Producto no encontrado. <a href="products.html">Volver al listado</a>.
        </p>
      </div>`;
    if (breadcrumbActual) breadcrumbActual.textContent = "Producto no encontrado";
    return;
  }

  document.title = `El Volcán Market — ${producto.nombre}`;
  if (breadcrumbActual) breadcrumbActual.textContent = producto.nombre;

  contenedor.innerHTML = `
    <div class="col-lg-6">
      <img src="${producto.imagen}" class="img-fluid rounded" alt="${producto.nombre}">
    </div>
    <div class="col-lg-6">
      <h1 class="h3">${producto.nombre}</h1>
      <p class="fs-4 fw-semibold text-primary">$${producto.precio.toLocaleString("es-CL")}</p>
      <p class="text-muted">${producto.descripcion || ""}</p>
      <p>Stock disponible: ${producto.stock}</p>

      <div class="mt-4" style="max-width: 160px;">
        <label for="product-quantity" class="form-label">Cantidad</label>
        <input type="number" class="form-control" id="product-quantity" value="1" min="1" max="${producto.stock}">
      </div>

      <button type="button"
              class="btn btn-primary btn-lg mt-3 btn-agregar"
              data-id="${producto.id}"
              ${producto.stock === 0 ? "disabled" : ""}>
        Añadir al carrito
      </button>
    </div>
  `;
});
