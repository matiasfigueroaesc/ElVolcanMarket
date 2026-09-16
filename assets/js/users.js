// ============================================
// El Volcán Market — users.js
// Catálogo de usuarios: fuente de datos COMPARTIDA entre el panel
// de administración (admin/) y, más adelante, el login/registro de
// la tienda (store/login.html, store/register.html), a través de
// localStorage. Mismo patrón que assets/js/products.js.
//
// Lo consumen tanto admin/ (vía admin-users.js) como la tienda
// (vía login.js y register.js): login.js busca acá por correo, y
// register.js agrega acá, siempre forzando tipo "cliente".
//
// NOTA: las contraseñas se guardan en texto plano en localStorage.
// No es seguro, pero no hay backend en este proyecto — es el mismo
// nivel de "base de datos falsa" que products.js usa para el catálogo.
// ============================================

const USERS_STORAGE_KEY = "volcan_users_catalog";

// Catálogo de fábrica: se usa solo la PRIMERA vez que se carga el sitio
// (localStorage vacío) o si el localStorage llegara a corromperse.
// Corresponde a las mismas 3 filas de ejemplo que traía admin/users.html
// antes de conectar esto a localStorage.
//
// Credenciales de prueba (login.html) para cada uno:
//   javiera.munoz@gmail.com   / admin1234     (administrador)
//   pedro.salinas@duoc.cl     / vendedor1234  (vendedor)
//   camila.toro@gmail.com     / cliente1234   (cliente)
const USUARIOS_SEED = [
  {
    id: 1,
    run: "191234561",
    nombre: "Javiera",
    apellidos: "Muñoz Soto",
    correo: "javiera.munoz@gmail.com",
    password: "admin1234",
    telefono: null,
    fechaNacimiento: null,
    tipo: "administrador",
    region: "nuble",
    comuna: "chillan",
    direccion: "Av. Libertad 100, Chillán"
  },
  {
    id: 2,
    run: "17894567K",
    nombre: "Pedro",
    apellidos: "Salinas Rojas",
    correo: "pedro.salinas@duoc.cl",
    password: "vendedor1234",
    telefono: null,
    fechaNacimiento: null,
    tipo: "vendedor",
    region: "nuble",
    comuna: "chillan",
    direccion: "Av. O'Higgins 456, Chillán"
  },
  {
    id: 3,
    run: "205671129",
    nombre: "Camila",
    apellidos: "Toro Pizarro",
    correo: "camila.toro@gmail.com",
    password: "cliente1234",
    telefono: null,
    fechaNacimiento: null,
    tipo: "cliente",
    region: "nuble",
    comuna: "chillan-viejo",
    direccion: "Camino a Chillán Viejo 789"
  }
];

// --------------------------------------------
// Carga/guardado en localStorage
// --------------------------------------------
function cargarCatalogoUsuarios() {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("users.js: catálogo corrupto en localStorage, se reinicia con el catálogo de fábrica.", e);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(USUARIOS_SEED));
  return USUARIOS_SEED;
}

function guardarCatalogoUsuarios(lista) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(lista));
  } catch (e) {
    console.error('users.js: error al guardar catálogo de usuarios en localStorage', e);
    alert('Imagen demasiado grande; no se guardó el cambio.');
  }
}

// "let" (no "const"): admin-users.js reemplaza este array cuando
// agrega/edita/elimina usuarios.
let usuarios = cargarCatalogoUsuarios();

// --------------------------------------------
// Sesión activa (quién inició sesión, en este navegador)
// Usado por login.js, register.js, store-nav.js y admin-nav.js.
// --------------------------------------------
const SESSION_STORAGE_KEY = "volcan_session";

function guardarSesion(usuario) {
  // Solo se guarda lo necesario para saludar/redirigir — nunca la
  // contraseña.
  const sesion = {
    id: usuario.id,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    tipo: usuario.tipo
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sesion));
  return sesion;
}

function obtenerSesion() {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("users.js: sesión corrupta en localStorage, se descarta.", e);
    return null;
  }
}

function cerrarSesion() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
