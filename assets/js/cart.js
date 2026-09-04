// ============================================
// El Volcán Market — cart.js
// Lógica del carrito de pedidos: lectura/escritura en
// localStorage ('volcan_cart'), render de la tabla en
// cart.html, actualización de totales y contador global,
// agregar productos desde index.html/products.html, y
// validación del formulario de despacho.
//
// Requiere en cart.html:
//   - <tbody id="cart-table-body">
//   - <strong id="cart-total-amount">
//   - <span id="cart-count"> (renderizado por store-nav.js)
//   - <form id="checkout-form"> con #client-name,
//     #client-address, #client-phone y sus spans de error
//     #error-client-name, #error-client-address, #error-client-phone
//
// Requiere en index.html/products.html:
//   - Cargar products.js ANTES de este script (usa el array
//     global "productos" para buscar nombre/precio/stock al
//     agregar desde el botón .btn-agregar).
// ============================================

const CART_STORAGE_KEY = "volcan_cart";

document.addEventListener("DOMContentLoaded", () => {
  const tablaBody = document.getElementById("cart-table-body");
  const totalAmountEl = document.getElementById("cart-total-amount");
  const checkoutForm = document.getElementById("checkout-form");

  // --------------------------------------------
  // Helpers de localStorage
  // --------------------------------------------
  function obtenerCarrito() {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    try {
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Carrito corrupto en localStorage, se reinicia.", e);
      return [];
    }
  }

  function guardarCarrito(carrito) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
  }

  function formatearCLP(valor) {
    return `$${valor.toLocaleString("es-CL")}`;
  }

  // --------------------------------------------
  // Contador global del navbar (#cart-count)
  // Reusable: se puede llamar desde cualquier página que
  // incluya store-nav.js + cart.js.
  // --------------------------------------------
  function actualizarContadorCart() {
    const carrito = obtenerCarrito();
    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const contadorEl = document.getElementById("cart-count");
    if (contadorEl) {
      contadorEl.textContent = totalUnidades;
    }
  }

  // --------------------------------------------
  // Agregar producto al carrito — botón .btn-agregar
  // generado por products.js en index.html/products.html.
  // Delegado en document porque el botón puede no existir
  // aún al momento de correr este script (depende del orden
  // de carga respecto a products.js), y porque cart.js se
  // carga también en páginas sin ese botón (cart.html).
  // --------------------------------------------
  function manejarAgregarAlCarrito(e) {
    if (!e.target.classList.contains("btn-agregar")) return;

    const id = Number(e.target.dataset.id);

    // "productos" es el array global declarado en products.js.
    // Si esta página no cargó products.js (ej. cart.html), no
    // existe ningún botón .btn-agregar y esta función nunca
    // debería dispararse; el chequeo es solo defensivo.
    if (typeof productos === "undefined") {
      console.error("cart.js: no se encontró el catálogo 'productos'. ¿Falta cargar products.js antes de cart.js?");
      return;
    }

    const producto = productos.find((p) => p.id === id);
    if (!producto) {
      console.error(`cart.js: producto con id ${id} no encontrado en el catálogo.`);
      return;
    }

    const carrito = obtenerCarrito();
    const itemExistente = carrito.find((p) => p.id === id);

    if (itemExistente) {
      if (itemExistente.cantidad < producto.stock) {
        itemExistente.cantidad += 1;
      }
      // Si ya está en el tope de stock, no sumamos más (silencioso;
      // se puede agregar un aviso visual más adelante si se quiere).
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        stockMaximo: producto.stock
      });
    }

    guardarCarrito(carrito);
    actualizarContadorCart();
  }

  document.addEventListener("click", manejarAgregarAlCarrito);

  // --------------------------------------------
  // Render de la tabla del carrito
  // --------------------------------------------
  function renderCarrito() {
    if (!tablaBody) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
      tablaBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted py-4">
            Tu carrito está vacío
          </td>
        </tr>`;
      if (totalAmountEl) totalAmountEl.textContent = formatearCLP(0);
      actualizarContadorCart();
      return;
    }

    tablaBody.innerHTML = carrito
      .map((item) => {
        const subtotal = item.precio * item.cantidad;
        return `
        <tr data-id="${item.id}">
          <td>${item.nombre}</td>
          <td>${formatearCLP(item.precio)}</td>
          <td style="max-width: 90px;">
            <input
              type="number"
              class="form-control form-control-sm input-cantidad"
              value="${item.cantidad}"
              min="1"
              max="${item.stockMaximo}"
              data-id="${item.id}">
          </td>
          <td class="subtotal">${formatearCLP(subtotal)}</td>
          <td class="text-end">
            <button type="button" class="btn btn-sm btn-outline-danger btn-quitar" data-id="${item.id}">
              Quitar
            </button>
          </td>
        </tr>`;
      })
      .join("");

    actualizarTotales();
    actualizarContadorCart();
  }

  // --------------------------------------------
  // Recalcula el total general (#cart-total-amount)
  // --------------------------------------------
  function actualizarTotales() {
    const carrito = obtenerCarrito();
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    if (totalAmountEl) {
      totalAmountEl.textContent = formatearCLP(total);
    }
  }

  // --------------------------------------------
  // Cambios de cantidad (input) — delegación de eventos
  // --------------------------------------------
  function manejarCambioCantidad(e) {
    if (!e.target.classList.contains("input-cantidad")) return;

    const id = Number(e.target.dataset.id);
    const carrito = obtenerCarrito();
    const item = carrito.find((p) => p.id === id);
    if (!item) return;

    let nuevaCantidad = parseInt(e.target.value, 10);

    // No permitir valores inválidos, menores a 1 ni mayores al stock máximo
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
      nuevaCantidad = 1;
    } else if (nuevaCantidad > item.stockMaximo) {
      nuevaCantidad = item.stockMaximo;
    }

    item.cantidad = nuevaCantidad;
    e.target.value = nuevaCantidad;
    guardarCarrito(carrito);

    // Actualiza solo el subtotal de la fila afectada (evita re-render completo)
    const fila = e.target.closest("tr");
    const subtotalCell = fila?.querySelector(".subtotal");
    if (subtotalCell) {
      subtotalCell.textContent = formatearCLP(item.precio * item.cantidad);
    }

    actualizarTotales();
    actualizarContadorCart();
  }

  // --------------------------------------------
  // Eliminar item — delegación de eventos
  // --------------------------------------------
  function manejarQuitarItem(e) {
    if (!e.target.classList.contains("btn-quitar")) return;

    const id = Number(e.target.dataset.id);
    let carrito = obtenerCarrito();
    carrito = carrito.filter((p) => p.id !== id);
    guardarCarrito(carrito);

    renderCarrito();
  }

  // --------------------------------------------
  // Listeners de la tabla (delegados en el tbody)
  // --------------------------------------------
  if (tablaBody) {
    tablaBody.addEventListener("input", manejarCambioCantidad);
    tablaBody.addEventListener("click", manejarQuitarItem);
  }

  // --------------------------------------------
  // Validación del formulario de despacho
  // --------------------------------------------
  function limpiarErrores() {
    ["client-name", "client-address", "client-phone"].forEach((id) => {
      const input = document.getElementById(id);
      const errorEl = document.getElementById(`error-${id}`);
      input?.classList.remove("is-invalid");
      if (errorEl) errorEl.textContent = "";
    });
  }

  function marcarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(`error-${inputId}`);
    input?.classList.add("is-invalid");
    if (errorEl) errorEl.textContent = mensaje;
  }

  function validarFormularioDespacho() {
    limpiarErrores();
    let esValido = true;

    const nombre = document.getElementById("client-name")?.value.trim() || "";
    const direccion = document.getElementById("client-address")?.value.trim() || "";
    const telefono = document.getElementById("client-phone")?.value.trim() || "";

    // Nombre: requerido, mínimo 3 caracteres
    if (nombre.length < 3) {
      marcarError("client-name", "Ingresa tu nombre completo (mínimo 3 caracteres).");
      esValido = false;
    }

    // Dirección: requerida
    if (direccion.length === 0) {
      marcarError("client-address", "Ingresa la dirección de entrega.");
      esValido = false;
    }

    // Teléfono: requerido, 8 a 9 dígitos numéricos
    const telefonoRegex = /^[0-9]{8,9}$/;
    if (!telefonoRegex.test(telefono)) {
      marcarError("client-phone", "Ingresa un teléfono válido (8 a 9 dígitos, solo números).");
      esValido = false;
    }

    return { esValido, nombre };
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const carrito = obtenerCarrito();
      if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de confirmar el pedido.");
        return;
      }

      const { esValido, nombre } = validarFormularioDespacho();
      if (!esValido) return;

      // Pedido válido: limpiar carrito y confirmar
      localStorage.removeItem(CART_STORAGE_KEY);
      alert(`¡Gracias, ${nombre}! Tu solicitud de gas fue registrada. Un camión repartidor se pondrá en contacto contigo.`);
      window.location.href = "index.html";
    });
  }

  // --------------------------------------------
  // Inicialización
  // --------------------------------------------
  // Se llama aparte de renderCarrito() porque esta última corta
  // con un "return" temprano si no existe #cart-table-body (es
  // decir, en index.html/products.html) — sin esto, el número del
  // carrito en el navbar no se actualizaría en esas páginas.
  actualizarContadorCart();
  renderCarrito();
});
