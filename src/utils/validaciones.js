// src/utils/validaciones.js
//
// Funciones de validación PURAS para toda la Evaluación 2.
// Contrato acordado con el equipo (ver CONTEXTO-Integrante3-ElVolcanMarket.md):
//   validarX(valor, ...opciones) -> "" si es válido, o un mensaje de error.
// No tocan el DOM ni dependen de React: reciben el valor del campo y devuelven
// un string. Así CheckoutForm (I2), RegistroForm y UserForm (I3) comparten
// exactamente la misma lógica.
//
// Reglas portadas desde legacy-eval1/assets/js/validations.js. La única regla
// "de negocio" que vale la pena confirmar con el equipo es el dominio de
// correo permitido (ver validarCorreo): el legado solo aceptaba
// @duoc.cl / @profesor.duoc.cl / @gmail.com.

/** RUN chileno con dígito verificador (acepta con o sin puntos/guión). */
export function esRunValido(run) {
  const valor = (run || "").toString().trim().replace(/[.\s]/g, "").replace("-", "").toUpperCase();

  if (!/^\d{6,8}[0-9K]$/.test(valor)) {
    return false;
  }

  const digitos = valor.slice(0, -1).split("").map(Number);
  let suma = 0;
  let multiplicador = 2;

  for (let i = digitos.length - 1; i >= 0; i--) {
    suma += digitos[i] * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  let digitoEsperado;
  if (resto === 11) digitoEsperado = "0";
  else if (resto === 10) digitoEsperado = "K";
  else digitoEsperado = String(resto);

  return digitoEsperado === valor.charAt(valor.length - 1);
}

/** Dominios de correo permitidos para el proyecto (regla heredada de Eval. 1). */
export function esCorreoPermitido(correo) {
  const valor = (correo || "").trim();
  return /^[^\s@]+@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(valor);
}

/** Nombre: obligatorio. */
export function validarNombre(valor) {
  if (!(valor || "").trim()) return "El nombre es obligatorio";
  return "";
}

/** Apellidos: obligatorio. */
export function validarApellidos(valor) {
  if (!(valor || "").trim()) return "Los apellidos son obligatorios.";
  return "";
}

/**
 * Correo: obligatorio. Valida el formato y, por defecto, restringe el dominio a
 * @duoc.cl, @profesor.duoc.cl o @gmail.com (regla heredada de Eval. 1).
 * Opciones:
 *  - requerido: false -> permite vacío.
 *  - restringirDominio: false -> solo valida el formato (Checkout, donde un
 *    invitado puede comprar con cualquier correo).
 */
export function validarCorreo(valor, { requerido = true, restringirDominio = true } = {}) {
  const limpio = (valor || "").trim();
  if (!limpio) return requerido ? "El correo es obligatorio." : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) return "Ingresa un correo válido.";
  if (restringirDominio && !esCorreoPermitido(limpio)) {
    return "El correo debe tener un dominio válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).";
  }
  return "";
}

/**
 * Contraseña: obligatoria, entre 4 y 20 caracteres.
 * Pasa { requerido: false } para edición de usuario (dejar en blanco = no cambiar).
 */
export function validarPassword(valor, { requerido = true } = {}) {
  if (!valor) {
    return requerido ? "La contraseña es obligatoria." : "";
  }

  if (valor.length < 4 || valor.length > 20) {
    return "La contraseña debe tener entre 4 y 20 caracteres.";
  }

  return "";
}

/** Confirmación de contraseña: debe coincidir con el valor de la contraseña. */
export function validarConfirmacionPassword(valor, passwordValor) {
  if (!valor) return "Debes confirmar la contraseña.";
  if (valor !== passwordValor) return "Las contraseñas no coinciden.";
  return "";
}

/**
 * Teléfono: opcional por defecto (así es en Registro). 8 a 9 dígitos, solo
 * números. Pasa { requerido: true } donde el teléfono sea obligatorio.
 */
export function validarTelefono(valor, { requerido = false } = {}) {
  const limpio = (valor || "").trim();

  if (!limpio) {
    return requerido ? "El teléfono es obligatorio." : "";
  }

  if (!/^\d{8,9}$/.test(limpio)) {
    return "Ingresa un teléfono válido (8 a 9 dígitos, solo números).";
  }

  return "";
}

/** RUN: obligatorio y con dígito verificador válido. */
export function validarRun(valor) {
  const limpio = (valor || "").trim();

  if (!limpio) return "El RUN es obligatorio.";
  if (!esRunValido(limpio)) return "El RUN ingresado no es válido.";

  return "";
}

/** Fecha de nacimiento: opcional, pero no puede ser futura. */
export function validarFechaNacimiento(valor) {
  if (!valor) return "";

  const fecha = new Date(`${valor}T00:00:00`);
  if (Number.isNaN(fecha.getTime()) || fecha > new Date()) {
    return "La fecha de nacimiento no puede ser futura.";
  }

  return "";
}

/**
 * Validación genérica para <select> (región, comuna, tipo de usuario, etc.).
 * `mensaje` permite personalizar el texto según el campo.
 */
export function validarSeleccion(valor, mensaje = "Debes seleccionar una opción.") {
  if (!valor) return mensaje;
  return "";
}

/**
 * Validación genérica de texto obligatorio (dirección, comentario, etc.),
 * con largo mínimo configurable.
 */
export function validarTextoObligatorio(valor, mensaje = "Este campo es obligatorio.", minimo = 1) {
  const limpio = (valor || "").trim();
  if (limpio.length < minimo) return mensaje;
  return "";
}
