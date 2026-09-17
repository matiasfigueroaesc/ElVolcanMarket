document.addEventListener("DOMContentLoaded", () => {
  if (typeof pedidos === "undefined") {
    console.error("admin-orders.js: no se encontró el catálogo 'pedidos'. ¿Falta cargar orders.js antes de este script?");
    return;
  }

  const tablaBody = document.getElementById("admin-orders-table-body");

  function obtenerClaseBadgeEstado(estado) {
    switch ((estado || "").toLowerCase()) {
      case "preparando":
        return "text-bg-warning";
      case "en camino":
        return "text-bg-primary";
      case "entregado":
        return "text-bg-success";
      case "recibido":
      default:
        return "text-bg-secondary";
    }
  }

  function actualizarEstadoPedido(id, nuevoEstado) {
    const pedido = pedidos.find((item) => item.id === Number(id));
    if (!pedido) return;

    pedido.estado = nuevoEstado;
    guardarPedidos(pedidos);
    renderTablaPedidos();
  }

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
                <div class="mb-2">
                  <label for="modal-order-status" class="form-label mb-1"><strong>Estado:</strong></label>
                  <select id="modal-order-status" class="form-select form-select-sm" aria-label="Estado del pedido">
                    <option value="recibido">recibido</option>
                    <option value="preparando">preparando</option>
                    <option value="en camino">en camino</option>
                    <option value="entregado">entregado</option>
                  </select>
                </div>
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

    const root = document.getElementById("order-detail-modal-root") || document.body;
    root.insertAdjacentHTML("beforeend", modalHtml);
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
        const estado = (pedido.estado || "recibido").toLowerCase() === "pendiente" ? "recibido" : (pedido.estado || "recibido").toLowerCase();

        return `
          <tr data-id="${pedido.id}">
            <td>${fecha}</td>
            <td>${pedido.clienteNombre || "Invitado"}</td>
            <td>$${Number(pedido.total || 0).toLocaleString("es-CL")}</td>
            <td><span class="badge ${obtenerClaseBadgeEstado(estado)}">${estado}</span></td>
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
    document.getElementById("modal-order-status").value = (pedido.estado || "recibido").toLowerCase() === "pendiente" ? "recibido" : (pedido.estado || "recibido").toLowerCase();
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

  document.addEventListener("change", (e) => {
    if (!e.target.matches("#modal-order-status")) return;

    const pedidoId = document.getElementById("modal-order-id")?.textContent;
    if (!pedidoId) return;

    actualizarEstadoPedido(pedidoId, e.target.value);
  });

  if (tablaBody) {
    renderTablaPedidos();

    tablaBody.addEventListener("click", (e) => {
      const boton = e.target.closest(".btn-ver-pedido");
      if (!boton) return;

      mostrarDetallePedido(boton.dataset.id);
    });
  }
});
