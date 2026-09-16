document.addEventListener("DOMContentLoaded", () => {
  if (typeof pedidos === "undefined") {
    console.error("admin-orders.js: no se encontró el catálogo 'pedidos'. ¿Falta cargar orders.js antes de este script?");
    return;
  }

  const tablaBody = document.getElementById("admin-orders-table-body");

  function crearModalDetalle() {
    const existente = document.getElementById("order-detail-modal");
    if (existente) return existente;

    const modalHtml = `
      <div class="modal fade" id="order-detail-modal" tabindex="-1" aria-labelledby="order-detail-modal-label" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="order-detail-modal-label">Detalle del pedido</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <p class="mb-1"><strong>ID:</strong> <span id="modal-order-id"></span></p>
                <p class="mb-1"><strong>Fecha:</strong> <span id="modal-order-date"></span></p>
                <p class="mb-1"><strong>Estado:</strong> <span id="modal-order-status"></span></p>
              </div>

              <div class="mb-3">
                <h6 class="fw-bold">Datos del cliente</h6>
                <p class="mb-1"><strong>Nombre:</strong> <span id="modal-order-customer"></span></p>
                <p class="mb-1"><strong>Dirección:</strong> <span id="modal-order-address"></span></p>
                <p class="mb-1"><strong>Teléfono:</strong> <span id="modal-order-phone"></span></p>
                <p class="mb-1"><strong>Notas:</strong> <span id="modal-order-notes"></span></p>
              </div>

              <div>
                <h6 class="fw-bold">Productos</h6>
                <ul id="modal-order-items" class="mb-0 ps-3"></ul>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    return document.getElementById("order-detail-modal");
  }

  function renderTablaPedidos() {
    if (!tablaBody) return;

    if (pedidos.length === 0) {
      tablaBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-4">
            No hay pedidos registrados.
          </td>
        </tr>`;
      return;
    }

    tablaBody.innerHTML = pedidos
      .map((pedido) => {
        const fecha = new Date(pedido.fecha).toLocaleString("es-CL", {
          dateStyle: "short",
          timeStyle: "short"
        });

        return `
          <tr data-id="${pedido.id}">
            <td>${fecha}</td>
            <td>${pedido.clienteNombre || "Invitado"}</td>
            <td>$${Number(pedido.total || 0).toLocaleString("es-CL")}</td>
            <td><span class="badge text-bg-warning">${pedido.estado || "pendiente"}</span></td>
            <td class="text-end">
              <button type="button" class="btn btn-sm btn-outline-primary btn-ver-pedido" data-id="${pedido.id}">Ver detalle</button>
            </td>
          </tr>`;
      })
      .join("");
  }

  function mostrarDetallePedido(id) {
    const pedido = pedidos.find((item) => item.id === Number(id));
    if (!pedido) return;

    const modal = crearModalDetalle();
    const bootstrapModal = new bootstrap.Modal(modal);

    document.getElementById("modal-order-id").textContent = pedido.id;
    document.getElementById("modal-order-date").textContent = new Date(pedido.fecha).toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short"
    });
    document.getElementById("modal-order-status").textContent = pedido.estado || "pendiente";
    document.getElementById("modal-order-customer").textContent = pedido.clienteNombre || "Invitado";
    document.getElementById("modal-order-address").textContent = pedido.clienteDireccion || "—";
    document.getElementById("modal-order-phone").textContent = pedido.clienteTelefono || "—";
    document.getElementById("modal-order-notes").textContent = pedido.notas || "Sin notas adicionales";

    const itemsContainer = document.getElementById("modal-order-items");
    itemsContainer.innerHTML = (pedido.items || [])
      .map((item) => `<li>${item.nombre} — ${item.cantidad} x $${Number(item.precio).toLocaleString("es-CL")} = $${(item.precio * item.cantidad).toLocaleString("es-CL")}</li>`)
      .join("");

    bootstrapModal.show();
  }

  if (tablaBody) {
    renderTablaPedidos();

    tablaBody.addEventListener("click", (e) => {
      const boton = e.target.closest(".btn-ver-pedido");
      if (!boton) return;

      mostrarDetallePedido(boton.dataset.id);
    });
  }
});
