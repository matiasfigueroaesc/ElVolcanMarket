// ============================================
// El Volcán Market — products.js
// Catálogo de productos y render de cards.
// Requiere <div id="contenedorProductos" class="row g-4"></div>
// y, opcionalmente, <span id="cantidadProductos"></span> en el HTML.
//
// Nivel de heading de cada card: por defecto <h2> (correcto cuando el
// título de la página es <h1>, como en products.html). Si la página ya
// tiene un <h2> de sección por encima (como el "Nuestros productos" de
// index.html), declarar ANTES de este script:
//   <script>window.PRODUCTOS_HEADING_TAG = "h3";</script>
// ============================================

const productos = [
  {
    id: 1,
    nombre: "Cilindro de gas 5 kg",
    precio: 8500,
    stock: 20,
    categoria: "Gas licuado",
    imagen: "../assets/img/cilindro-5kg.jpg"
  },
  {
    id: 2,
    nombre: "Cilindro de gas 11 kg",
    precio: 16500,
    stock: 15,
    categoria: "Gas licuado",
    imagen: "../assets/img/cilindro-11kg.jpg"
  },
  {
    id: 3,
    nombre: "Cilindro de gas 15 kg",
    precio: 21000,
    stock: 10,
    categoria: "Gas licuado",
    imagen: "../assets/img/cilindro-15kg.jpg"
  }
];

const contenedor = document.querySelector("#contenedorProductos");
const cantidad = document.querySelector("#cantidadProductos");
const headingTag = window.PRODUCTOS_HEADING_TAG || "h2";

function renderProductos(lista) {
  contenedor.innerHTML = "";

  lista.forEach(producto => {
    contenedor.innerHTML += `
      <div class="col-sm-6 col-lg-4">
        <article class="card h-100 shadow-sm">
          <img src="${producto.imagen}"
               class="card-img-top"
               alt="${producto.nombre}">
          <div class="card-body d-flex flex-column">
            <span class="badge text-bg-light align-self-start mb-2">
              ${producto.categoria}
            </span>
            <${headingTag} class="h5">${producto.nombre}</${headingTag}>
            <p class="fs-5 fw-bold">$${producto.precio.toLocaleString("es-CL")}</p>
            <p>Stock: ${producto.stock}</p>
            <div class="mt-auto d-flex gap-2">
              <a href="product-detail.html" class="btn btn-outline-primary btn-sm">Ver detalle</a>
              <button class="btn btn-primary btn-sm btn-agregar"
                      data-id="${producto.id}"
                      ${producto.stock === 0 ? "disabled" : ""}>
                Agregar al carrito
              </button>
            </div>
          </div>
        </article>
      </div>`;
  });

  if (cantidad) {
    cantidad.textContent = `${lista.length} productos`;
  }
}

if (contenedor) {
  renderProductos(productos);
}
