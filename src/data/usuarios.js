// ============================================
// El Volcán Market — usuarios.js
// Usuarios del sistema (antes assets/js/users.js) + sesión activa.
//
// NOTA: las contraseñas se guardan en texto plano porque no hay
// backend en esta evaluación. Nunca se guardan en la sesión.
//
// Credenciales de prueba:
//   javiera.munoz@gmail.com / admin1234     (administrador)
//   pedro.salinas@duoc.cl   / vendedor1234  (vendedor)
//   camila.toro@gmail.com   / cliente1234   (cliente)
// ============================================
import { crearRepositorio, leerJSON, escribirJSON } from "./storage.js";

export const USUARIOS_STORAGE_KEY = "volcan_users_catalog";
export const SESION_STORAGE_KEY = "volcan_session";

export const TIPOS_USUARIO = ["administrador", "vendedor", "cliente"];

export const USUARIOS_SEED = [
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

const repo = crearRepositorio(USUARIOS_STORAGE_KEY, USUARIOS_SEED);

// ---------- CRUD ----------
export const listarUsuarios = () => repo.listar();
export const obtenerUsuario = (id) => repo.obtenerPorId(id);
export const actualizarUsuario = (id, cambios) => repo.actualizar(id, cambios);
export const eliminarUsuario = (id) => repo.eliminar(id);
export const reiniciarUsuarios = () => repo.reiniciar();

export function buscarPorCorreo(correo = "") {
  const c = correo.trim().toLowerCase();
  return listarUsuarios().find((u) => u.correo.toLowerCase() === c) ?? null;
}

// Lanza un Error si el correo ya está registrado.
export function crearUsuario(datos) {
  if (buscarPorCorreo(datos.correo)) {
    throw new Error("Ya existe un usuario con ese correo.");
  }
  return repo.crear({ tipo: "cliente", ...datos });
}

// ---------- Autenticación y sesión ----------
// Devuelve los datos públicos del usuario (sin contraseña) o null.
export function autenticar(correo, password) {
  const usuario = buscarPorCorreo(correo);
  if (!usuario || usuario.password !== password) return null;
  return datosPublicos(usuario);
}

export function datosPublicos(usuario) {
  const { password: _password, ...resto } = usuario;
  return resto;
}

export const obtenerSesion = () => leerJSON(SESION_STORAGE_KEY, null);
export const guardarSesion = (usuario) => {
  const sesion = datosPublicos(usuario);
  escribirJSON(SESION_STORAGE_KEY, sesion);
  return sesion;
};
export const cerrarSesion = () => localStorage.removeItem(SESION_STORAGE_KEY);
