document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tracking-form");
  const input = document.getElementById("tracking-order-id");
  const errorEl = document.getElementById("tracking-error");
  const resultsEl = document.getElementById("tracking-results");
  const steps = Array.from(document.querySelectorAll("#tracking-timeline .badge"));
  const center = [-36.6066, -72.1034];
  let map = null;

  let customerMarker = null;
  let truckMarker = null;

  const normalizarEstado = (estado) => {
    const valor = String(estado || "recibido").toLowerCase();
    return valor === "pendiente" ? "recibido" : valor;
  };

  const setTimeline = (estado) => {
    const order = ["recibido", "preparando", "en camino", "entregado"];
    const current = order.indexOf(normalizarEstado(estado));
    steps.forEach((step, index) => {
      step.className = `badge p-3 ${index <= current ? "text-bg-primary" : "text-bg-secondary"}`;
    });
  };

  function inicializarMapa() {
    if (map) return map;

    map = L.map("map").setView(center, 13);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri &mdash; Source: Esri"
    }).addTo(map);
    return map;
  };

  const renderOrder = (orderId) => {
    const orders = JSON.parse(localStorage.getItem("volcan_orders") || "[]");
    const order = orders.find((item) => String(item.id || item.orderId || item.codigo || item.numero) === String(orderId));
    if (!order) {
      if (errorEl) errorEl.textContent = "Pedido no encontrado. Verifica el ID.";
      errorEl?.classList.remove("d-none");
      resultsEl?.classList.add("d-none");
      return;
    }

    if (errorEl) errorEl.textContent = "";
    errorEl?.classList.add("d-none");
    resultsEl?.classList.remove("d-none");

    const estado = normalizarEstado(order.estado || order.status || order.state || "recibido");

    setTimeline(estado);
    const currentMap = inicializarMapa();
    if (customerMarker) currentMap.removeLayer(customerMarker);
    if (truckMarker) currentMap.removeLayer(truckMarker);

    customerMarker = L.marker(center).addTo(currentMap).bindPopup("Dirección del cliente");
    currentMap.setView(center, 13);

    if (estado === "en camino") {
      truckMarker = L.marker([-36.5966, -72.0934]).addTo(currentMap).bindPopup("Camión en ruta");
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    renderOrder(input.value.trim());
  });

  errorEl?.classList.add("d-none");
  resultsEl?.classList.add("d-none");
});