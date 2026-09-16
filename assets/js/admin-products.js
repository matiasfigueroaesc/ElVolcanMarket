// ============================================
// El Volcán Market — admin-products.js
// CRUD de productos del panel admin, sobre el mismo catálogo
// compartido con la tienda (assets/js/products.js: variable
// global "productos" + localStorage bajo PRODUCTS_STORAGE_KEY).
//
// Requiere cargar products.js ANTES que este script.
//
// Usa en admin/products.html:
//   <tbody id="admin-products-table-body">
// Usa en admin/new-product.html:
//   <form id="new-product-form"> con los campos #product-code,
//   #product-name, #product-description, #product-price,
//   #product-category, #product-stock, #product-critical-stock,
//   #product-image
// Usa en admin/edit-product.html: mismos campos, dentro de
//   <form id="edit-product-form">, y se espera navegar a esta
//   página con ?id=N en la URL.
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  if (typeof productos === "undefined") {
    console.error("admin-products.js: no se encontró el catálogo 'productos'. ¿Falta cargar products.js antes de este script?");
    return;
  }

  const sesion = typeof obtenerSesion === "function" ? obtenerSesion() : null;
  const esVendedor = sesion?.tipo === "vendedor";

  const botonNuevoProducto = document.querySelector('a[href="new-product.html"]');
  if (botonNuevoProducto && esVendedor) {
    botonNuevoProducto.style.display = "none";
  }

  // --------------------------------------------
  // admin/products.html — listado
  // --------------------------------------------
  const tablaBody = document.getElementById("admin-products-table-body");

  function renderTablaProductos() {
    if (!tablaBody) return;

    if (productos.length === 0) {
      tablaBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted py-4">
            No hay productos registrados.
          </td>
        </tr>`;
      return;
    }

    tablaBody.innerHTML = productos
      .map((p) => {
        const hayStockCritico = p.stockCritico != null && p.stock <= p.stockCritico;
        const accionesHtml = esVendedor
          ? '<span class="text-muted small">Solo lectura</span>'
          : `
            ${hayStockCritico ? '<span class="badge text-bg-warning me-1">Stock crítico</span>' : ""}
            <a href="edit-product.html?id=${p.id}" class="btn btn-sm btn-outline-secondary">Editar</a>
            <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-producto" data-id="${p.id}">Eliminar</button>`;

        return `
        <tr data-id="${p.id}">
          <td>${p.codigo}</td>
          <td>${p.nombre}</td>
          <td>${p.categoria}</td>
          <td>$${p.precio.toLocaleString("es-CL")}</td>
          <td>${p.stock}</td>
          <td>${p.stockCritico ?? "—"}</td>
          <td class="text-end">
            ${accionesHtml}
          </td>
        </tr>`;
      })
      .join("");
  }

  if (tablaBody) {
    renderTablaProductos();

    tablaBody.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn-eliminar-producto")) return;

      const id = Number(e.target.dataset.id);
      const producto = productos.find((p) => p.id === id);
      if (!producto) return;

      const confirmado = confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`);
      if (!confirmado) return;

      productos = productos.filter((p) => p.id !== id);
      guardarCatalogoProductos(productos);
      renderTablaProductos();
    });
  }

  // --------------------------------------------
  // admin/new-product.html y admin/edit-product.html — formulario
  // --------------------------------------------
  const form = document.getElementById("new-product-form") || document.getElementById("edit-product-form");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  const modoEdicion = idParam !== null;
  let productoEditando = null;

  if (modoEdicion) {
    productoEditando = productos.find((p) => p.id === Number(idParam));

    if (!productoEditando) {
      alert("Producto no encontrado.");
      window.location.href = "products.html";
      return;
    }

    document.getElementById("product-code").value = productoEditando.codigo;
    document.getElementById("product-name").value = productoEditando.nombre;
    document.getElementById("product-description").value = productoEditando.descripcion || "";
    document.getElementById("product-price").value = productoEditando.precio;
    document.getElementById("product-category").value = productoEditando.categoria;
    document.getElementById("product-stock").value = productoEditando.stock;
    document.getElementById("product-critical-stock").value = productoEditando.stockCritico ?? "";
  }

  // Convierte la imagen subida (si hay) a base64 para poder guardarla
  // en localStorage — no hay backend/servidor de archivos en este proyecto.
  function leerImagenComoBase64(inputFile) {
    return new Promise((resolve) => {
      const file = inputFile?.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (typeof validarFormularioProducto === "function" && !validarFormularioProducto()) {
      return;
    }

    const codigo = document.getElementById("product-code").value.trim();
    const nombre = document.getElementById("product-name").value.trim();
    const descripcion = document.getElementById("product-description").value.trim();
    const precio = Number(document.getElementById("product-price").value);
    const categoria = document.getElementById("product-category").value;
    const stock = Number(document.getElementById("product-stock").value);
    const stockCriticoRaw = document.getElementById("product-critical-stock").value;
    const stockCritico = stockCriticoRaw === "" ? null : Number(stockCriticoRaw);

    const imagenInput = document.getElementById("product-image");
    const imagenBase64 = await leerImagenComoBase64(imagenInput);
    // Si no se subió imagen nueva: conserva la que ya tenía (modo edición)
    // o usa un placeholder (producto nuevo sin imagen).
    const imagenFinal = imagenBase64 || productoEditando?.imagen || "../assets/img/cilindro-placeholder.svg";

    if (modoEdicion) {
      productoEditando.codigo = codigo;
      productoEditando.nombre = nombre;
      productoEditando.descripcion = descripcion;
      productoEditando.precio = precio;
      productoEditando.categoria = categoria;
      productoEditando.stock = stock;
      productoEditando.stockCritico = stockCritico;
      productoEditando.imagen = imagenFinal;
    } else {
      const nuevoId = productos.length ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
      productos.push({
        id: nuevoId,
        codigo,
        nombre,
        descripcion,
        precio,
        categoria,
        stock,
        stockCritico,
        imagen: imagenFinal
      });
    }

    guardarCatalogoProductos(productos);
    window.location.href = "products.html";
  });
});
