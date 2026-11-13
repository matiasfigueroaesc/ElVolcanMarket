// ============================================
// El Volcán Market — cliente.js
// ÚNICO lugar del frontend que habla con el backend (fetch).
// Los módulos de src/data/ lo usan; las páginas nunca llaman a fetch.
//
//  - URL base: VITE_API_URL o, por defecto, "/api/v1" (en desarrollo el proxy
//    de vite.config.js la reenvía al Gateway en http://localhost:8080).
//  - Agrega el JWT (access token) en el encabezado Authorization.
//  - Si el backend responde 401, renueva el token UNA vez con la cookie del
//    refresh y repite la petición. Si no se puede renovar, avisa a AuthContext.
//  - Los errores llegan como ApiError con el mensaje y los errores por campo
//    que manda el backend: { status, mensaje, campos }.
// ============================================

export const API_URL = import.meta.env?.VITE_API_URL ?? "/api/v1";

// Encabezado que el servicio usuarios exige en login, refresh y logout (protección CSRF).
const ENCABEZADO_SESION = { "X-Requested-With": "ElVolcanMarket" };

const SIN_CONEXION = "No se pudo conectar con el servidor. Revisa que el backend esté encendido.";

export class ApiError extends Error {
  constructor(status, mensaje, campos = {}) {
    super(mensaje);
    this.name = "ApiError";
    this.status = status;
    this.campos = campos;
  }
}

// El access token vive solo en memoria (no en localStorage): si alguien inyecta
// JavaScript en la página, no puede leerlo de un almacenamiento permanente.
// Al recargar la página se recupera con la cookie del refresh (renovarSesion).
let accessToken = null;
let alExpirarSesion = null;
let renovacionEnCurso = null;

export const establecerToken = (token) => {
  accessToken = token ?? null;
};
export const obtenerToken = () => accessToken;

// AuthContext registra aquí qué hacer cuando la sesión ya no se puede renovar.
export function cuandoExpireLaSesion(funcion) {
  alExpirarSesion = funcion;
}

function construirUrl(ruta, params) {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") query.append(clave, String(valor));
  });
  const texto = query.toString();
  return `${API_URL}${ruta}${texto ? `?${texto}` : ""}`;
}

async function leerCuerpo(respuesta) {
  if (respuesta.status === 204) return null;
  const texto = await respuesta.text();
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

async function enviar(metodo, ruta, { body, params, encabezados, sinToken = false } = {}) {
  const headers = { Accept: "application/json", ...encabezados };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  // Login, refresh y logout van SIN token: Spring Security responde 401 a cualquier
  // petición que traiga un token vencido, aunque la ruta sea pública.
  if (accessToken && !sinToken) headers.Authorization = `Bearer ${accessToken}`;
  try {
    return await fetch(construirUrl(ruta, params), {
      method: metodo,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      // Necesario para que viaje la cookie HttpOnly del refresh token.
      credentials: "include",
    });
  } catch {
    throw new ApiError(0, SIN_CONEXION);
  }
}

async function comoResultado(respuesta) {
  const cuerpo = await leerCuerpo(respuesta);
  if (respuesta.ok) return cuerpo;
  throw new ApiError(
    respuesta.status,
    cuerpo?.mensaje ?? `Error ${respuesta.status} al comunicarse con el servidor.`,
    cuerpo?.campos ?? {}
  );
}

/**
 * Pide un access token nuevo con la cookie del refresh. Devuelve la sesión
 * { accessToken, expiresIn, usuario } o null si no hay sesión válida.
 * Si se llama dos veces seguidas (por ejemplo, React StrictMode), las dos
 * esperan la misma petición: el refresh rota y solo se puede usar una vez.
 */
export function renovarSesion() {
  if (!renovacionEnCurso) {
    renovacionEnCurso = (async () => {
      try {
        const respuesta = await enviar("POST", "/auth/refresh", {
          encabezados: ENCABEZADO_SESION,
          sinToken: true,
        });
        if (!respuesta.ok) {
          establecerToken(null);
          return null;
        }
        const sesion = await leerCuerpo(respuesta);
        establecerToken(sesion?.accessToken);
        return sesion;
      } catch {
        return null;
      } finally {
        renovacionEnCurso = null;
      }
    })();
  }
  return renovacionEnCurso;
}

async function solicitar(metodo, ruta, opciones = {}) {
  let respuesta = await enviar(metodo, ruta, opciones);
  // 401 = token vencido o ausente: se intenta renovar una sola vez (no en las rutas /auth).
  if (respuesta.status === 401 && accessToken && !ruta.startsWith("/auth/")) {
    const sesion = await renovarSesion();
    if (!sesion) alExpirarSesion?.();
    // Se repite con el token nuevo; si no se pudo renovar, va sin token: una ruta pública
    // (el catálogo) responde igual y una privada vuelve a dar 401.
    respuesta = await enviar(metodo, ruta, opciones);
  }
  return comoResultado(respuesta);
}

export const api = {
  get: (ruta, params) => solicitar("GET", ruta, { params }),
  post: (ruta, body) => solicitar("POST", ruta, { body }),
  put: (ruta, body) => solicitar("PUT", ruta, { body }),
  patch: (ruta, body) => solicitar("PATCH", ruta, { body }),
  delete: (ruta) => solicitar("DELETE", ruta),
  // Login, registro y logout: llevan el encabezado de sesión y no intentan renovar.
  sesion: (ruta, body) =>
    enviar("POST", ruta, { body, encabezados: ENCABEZADO_SESION, sinToken: true }).then(comoResultado),
};

// Texto para mostrar en una alerta: el mensaje y, si hay, los errores de cada campo.
// Ej.: "Revisa los campos del formulario. El RUN ingresado no es válido."
export function textoError(error) {
  const detalle = Object.values(error?.campos ?? {});
  return [error?.message, ...detalle].filter(Boolean).join(" ");
}

// Para obtener por id: un 404 se convierte en null (la página muestra "no encontrado").
export async function nuloSi404(promesa) {
  try {
    return await promesa;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
