// ============================================
// El Volcán Market — usuarios.js
// Usuarios y sesión. Desde la Eval 3 vienen del microservicio usuarios
// (a través del Gateway): /api/v1/auth y /api/v1/usuarios.
//
// - Las contraseñas ya NO se guardan en el navegador: el backend las guarda con
//   BCrypt y nunca las devuelve.
// - La sesión es un JWT que vive en memoria (api/cliente.js) + una cookie HttpOnly
//   con el refresh token, que el navegador envía solo y JavaScript no puede leer.
// - El CRUD de usuarios es solo para ADMIN. El backend rechaza correos y RUN
//   repetidos (409) y no deja eliminar la propia cuenta ni el último administrador.
//
// Credenciales de prueba (Seed.java del servicio usuarios):
//   javiera.munoz@gmail.com / admin1234     (administrador)
//   pedro.salinas@duoc.cl   / vendedor1234  (vendedor)
//   camila.toro@gmail.com   / cliente1234   (cliente)
// ============================================
import { api, establecerToken, nuloSi404, renovarSesion } from "../api/cliente.js";

export const TIPOS_USUARIO = ["administrador", "vendedor", "cliente"];

// ---------- CRUD (solo ADMIN) ----------
// filtros opcionales: { texto, tipo }
export const listarUsuarios = (filtros) => api.get("/usuarios", filtros);
export const obtenerUsuario = (id) => nuloSi404(api.get(`/usuarios/${Number(id)}`));
export const crearUsuario = (datos) => api.post("/usuarios", datos);
// Al editar el RUN no cambia; password vacío o ausente = se mantiene la actual.
export const actualizarUsuario = (id, datos) => api.put(`/usuarios/${Number(id)}`, datos);
export const eliminarUsuario = (id) => api.delete(`/usuarios/${Number(id)}`);

// Deja el RUN sin puntos, guion ni espacios y con K mayúscula,
// para que "19.123.456-1" y "191234561" se reconozcan como el mismo.
export function normalizarRun(run = "") {
  return run.toString().replace(/[.\s-]/g, "").toUpperCase();
}

// ---------- Sesión ----------
// Todas devuelven la sesión { accessToken, expiresIn, usuario } o el usuario.

export async function iniciarSesion(correo, password) {
  const sesion = await api.sesion("/auth/login", { correo: correo.trim(), password });
  establecerToken(sesion.accessToken);
  return sesion;
}

// Registro público: el backend siempre lo crea como cliente.
export const registrarCliente = (datos) => api.sesion("/auth/registro", datos);

// Al recargar la página: recupera la sesión con la cookie del refresh (o null si no hay).
export const restaurarSesion = () => renovarSesion();

export async function cerrarSesion() {
  try {
    await api.sesion("/auth/logout");
  } finally {
    // Aunque el servidor no responda, en este navegador la sesión se cierra igual.
    establecerToken(null);
  }
}

export const obtenerMiUsuario = () => api.get("/auth/me");
