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

const PRODUCTS_STORAGE_KEY = "volcan_products_catalog_v2";

// Catálogo de fábrica: se usa solo la PRIMERA vez que se carga el sitio
// (localStorage vacío) o si el localStorage llegara a corromperse.
const PRODUCTOS_SEED = [
  {
    id: 1,
    codigo: "CL001",
    nombre: "Cilindro GLP 5 kg",
    precio: 6500,
    stock: 80,
    stockCritico: 10,
    categoria: "Cilindros de Gas",
    imagen: "../assets/img/cilindro-5kg.png",
    descripcion: "Cilindro de gas licuado de petróleo 5 kg. Para uso residencial (cocina, calefacción pequeña).",
    unidad: "Unidad"
  },
  {
    id: 2,
    codigo: "CL002",
    nombre: "Cilindro GLP 11 kg",
    precio: 12000,
    stock: 200,
    stockCritico: 10,
    categoria: "Cilindros de Gas",
    imagen: "../assets/img/cilindro-11kg.png",
    descripcion: "Cilindro estándar doméstico. El más utilizado en hogares chilenos. Compatible con reguladores estándar.",
    unidad: "Unidad"
  },
  {
    id: 3,
    codigo: "CL003",
    nombre: "Cilindro GLP 15 kg",
    precio: 16000,
    stock: 90,
    stockCritico: 10,
    categoria: "Cilindros de Gas",
    imagen: "../assets/img/cilindro-15kg.png",
    descripcion: "Cilindro de mayor capacidad para hogares de alto consumo o locales pequeños.",
    unidad: "Unidad"
  },
  {
    id: 4,
    codigo: "CL004",
    nombre: "Cilindro GLP 45 kg",
    precio: 45000,
    stock: 30,
    stockCritico: 10,
    categoria: "Cilindros de Gas",
    imagen: "../assets/img/cilindro-placeholder.svg",
    descripcion: "Cilindro industrial. Uso comercial: restaurantes, talleres, calefacción de locales.",
    unidad: "Unidad"
  },
  {
    id: 5,
    codigo: "RG001",
    nombre: "Regulador doméstico estándar",
    precio: 8990,
    stock: 45,
    stockCritico: 10,
    categoria: "Reguladores",
    imagen: "../assets/img/cilindro-placeholder.svg",
    descripcion: "Regulador de 1 etapa para cilindros 5, 11 y 15 kg. Presión de salida 28 mbar.",
    unidad: "Unidad"
  },
  {
    id: 6,
    codigo: "RG002",
    nombre: "Regulador de alta presión",
    precio: 18990,
    stock: 12,
    stockCritico: 5,
    categoria: "Reguladores",
    imagen: "../assets/img/cilindro-placeholder.svg",
    descripcion: "Regulador para cocinas industriales o equipos de mayor consumo. Presión regulable.",
    unidad: "Unidad"
  },
  {
    id: 7,
    codigo: "RG003",
    nombre: "Regulador dual (2 salidas)",
    precio: 14990,
    stock: 18,
    stockCritico: 5,
    categoria: "Reguladores",
    imagen: "../assets/img/cilindro-placeholder.svg",
    descripcion: "Permite conectar dos artefactos simultáneamente al mismo cilindro.",
    unidad: "Unidad"
  },
  {
    id: 8,
    codigo: "MG001",
    nombre: "Manguera gas 1.5 m",
    precio: 3990,
    stock: 80,
    stockCritico: 10,
    categoria: "Mangueras y Conexiones",
    imagen: "../assets/img/cilindro-placeholder.svg",
    descripcion: "Manguera flexible homologada. Diámetro interior 9mm. Compatible con reguladores estándar.",
    unidad: "Unidad"
  },
  {
    id: 9,
    codigo: "MG002",
    nombre: "Manguera gas 3 m",
    precio: 6990,
    stock: 50,
    stockCritico: 10,
    categoria: "Mangueras y Conexiones",
    imagen: "../assets/img/cilindro-placeholder.svg",
    descripcion: "Manguera larga para instalaciones donde el artefacto está alejado del cilindro.",
    unidad: "Unidad"
  },
  {
    id: 10,
    codigo: "MG003",
    nombre: "Abrazadera metálica",
    precio: 990,
    stock: 200,
    stockCritico: 10,
    categoria: "Mangueras y Conexiones",
    imagen: "../assets/img/cilindro-placeholder.svg",
    descripcion: "Abrazadera de acero para asegurar la conexión manguera-regulador y manguera-artefacto.",
    unidad: "Unidad"
  },
  {
    id: 11,
    codigo: "MG004",
    nombre: "Kit conexión completo (regulador + manguera 1.5m + abrazaderas)",
    precio: 12990,
    stock: 25,
    stockCritico: 10,
    categoria: "Mangueras y Conexiones",
    imagen: "../assets/img/cilindro-placeholder.svg",
    descripcion: "Todo lo necesario para instalar un cilindro nuevo.",
    unidad: "Kit"
  },
  {
    id: 12,
    codigo: "AC001",
    nombre: "Carro porta cilindro 11/15 kg",
    precio: 12990,
    stock: 20,
    stockCritico: 5,
    categoria: "Accesorios",
    imagen: "../assets/img/cilindro-placeholder.svg",
    descripcion: "Carro metálico con ruedas para transportar cilindros dentro del hogar con seguridad.",
    unidad: "Unidad"
  },
  {
    id: 13,
    codigo: "AC002",
    nombre: "Tapa protectora para válvula",
    precio: 1490,
    stock: 60,
    stockCritico: 10,
    categoria: "Accesorios",
    imagen: "../assets/img/cilindro-placeholder.svg",
    descripcion: "Tapa de plástico ABS para proteger la válvula del cilindro durante el transporte.",
    unidad: "Unidad"
  },
  {
    id: 14,
    codigo: "AC003",
    nombre: "Detector de gas a batería",
    precio: 19990,
    stock: 8,
    stockCritico: 5,
    categoria: "Accesorios",
    imagen: "../assets/img/cilindro-placeholder.svg",
    descripcion: "Sensor electroquímico. Alarma sonora y visual ante fuga de gas GLP o metano.",
    unidad: "Unidad"
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
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(lista));
  } catch (e) {
    console.error('products.js: error al guardar catálogo de productos en localStorage', e);
    alert('Imagen demasiado grande; no se guardó el cambio.');
  }
}

// "let" (no "const"): admin-products.js reemplaza este array
// completo tras agregar/editar/eliminar, en la misma página.
let productos = cargarCatalogoProductos();

// --------------------------------------------
// Render de cards (solo páginas de la tienda)
// --------------------------------------------
const contenedor = document.querySelector("#contenedorProductos");
const cantidad = document.querySelector("#cantidadProductos");
const filtroCategoria = document.querySelector("#product-category-filter");
const headingTag = window.PRODUCTOS_HEADING_TAG || "h2";

function filtrarProductosPorCategoria(categoria) {
  if (!categoria) return productos;
  return productos.filter((producto) => producto.categoria === categoria);
}

function renderProductos(lista) {
  contenedor.innerHTML = "";

  if (!lista.length) {
    contenedor.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info mb-0">
          No hay productos para la categoría seleccionada.
        </div>
      </div>`;
  } else {
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
  }

  if (cantidad) {
    cantidad.textContent = `${lista.length} productos`;
  }
}

if (contenedor) {
  const renderVistaActual = () => renderProductos(filtrarProductosPorCategoria(filtroCategoria?.value || ""));

  if (filtroCategoria) {
    filtroCategoria.addEventListener("change", renderVistaActual);
  }

  renderVistaActual();
}
