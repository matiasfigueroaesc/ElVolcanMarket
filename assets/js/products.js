// ============================================
// El Volcán Market — products.js
// Catálogo de productos: fuente de datos COMPARTIDA entre la
// tienda (store/) y el panel de administración (admin/), a
// través de localStorage. Cualquier cambio hecho desde el admin
// (agregar/editar/eliminar) se refleja automáticamente en la
// tienda la próxima vez que se cargue una página, porque ambas
// leen desde la misma clave de localStorage.
//
// Requiere <div id="contenedorProductos" class="row g-4"></div>
// y, opcionalmente, <span id="cantidadProductos"></span> en el HTML
// (solo en páginas de la tienda que muestran cards; admin no las usa).
//
// Nivel de heading de cada card: por defecto <h2> (correcto cuando el
// título de la página es <h1>, como en products.html). Si la página ya
// tiene un <h2> de sección por encima (como el "Nuestros productos" de
// index.html), declarar ANTES de este script:
//   <script>window.PRODUCTOS_HEADING_TAG = "h3";</script>
// ============================================

const PRODUCTS_STORAGE_KEY = "volcan_products_catalog";

// Catálogo de fábrica: se usa solo la PRIMERA vez que se carga el sitio
// (localStorage vacío) o si el localStorage llegara a corromperse.
const PRODUCTOS_SEED = [
  {
    id: 1,
    codigo: "CIL-05",
    nombre: "Cilindro de gas 5 kg",
    precio: 8500,
    stock: 20,
    stockCritico: 5,
    categoria: "5kg",
    imagen: "../assets/img/cilindro-5kg.png",
    descripcion: "Formato compacto, ideal para cocinas pequeñas, calefont auxiliar o uso ocasional."
  },
  {
    id: 2,
    codigo: "CIL-11",
    nombre: "Cilindro de gas 11 kg",
    precio: 16500,
    stock: 15,
    stockCritico: 5,
    categoria: "11kg",
    imagen: "../assets/img/cilindro-11kg.png",
    descripcion: "El formato más solicitado para uso doméstico: cocina, calefont y estufas. Despacho a domicilio en Chillán y comunas aledañas."
  },
  {
    id: 3,
    codigo: "CIL-15",
    nombre: "Cilindro de gas 15 kg",
    precio: 21000,
    stock: 10,
    stockCritico: 5,
    categoria: "15kg",
    imagen: "../assets/img/cilindro-15kg.png",
    descripcion: "Mayor autonomía para hogares con alto consumo o uso comercial (locales, negocios pequeños)."
  }
];

// --------------------------------------------
// Carga/guardado en localStorage
// --------------------------------------------
function cargarCatalogoProductos() {
  try {
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("products.js: catálogo corrupto en localStorage, se reinicia con el catálogo de fábrica.", e);
  }
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(PRODUCTOS_SEED));
  return PRODUCTOS_SEED;
}

function guardarCatalogoProductos(lista) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(lista));
}

// "let" (no "const"): admin-products.js reemplaza este array
// completo tras agregar/editar/eliminar, en la misma página.
let productos = cargarCatalogoProductos();

// --------------------------------------------
// Render de cards (solo páginas de la tienda)
// --------------------------------------------
const contenedor = document.querySelector("#contenedorProductos");
const cantidad = document.querySelector("#cantidadProductos");
const headingTag = window.PRODUCTOS_HEADING_TAG || "h2";

function formatearCategoria(categoria) {
  // "5kg" -> "5 kg" (solo para mostrar; el valor guardado no lleva espacio,
  // para que coincida tal cual con las opciones del <select> del admin).
  return categoria.replace(/(\d+)kg/i, "$1 kg");
}

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
              ${formatearCategoria(producto.categoria)}
            </span>
            <${headingTag} class="h5">${producto.nombre}</${headingTag}>
            <p class="fs-5 fw-bold">$${producto.precio.toLocaleString("es-CL")}</p>
            <p>Stock: ${producto.stock}</p>
            <div class="mt-auto d-flex gap-2">
              <a href="product-detail.html?id=${producto.id}" class="btn btn-outline-primary btn-sm">Ver detalle</a>
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
