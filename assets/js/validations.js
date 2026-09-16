// ============================================
// Distribuidora de Gas El Volcán — validations.js
// Validaciones de formularios en tiempo real.
// Reglas detalladas en el Anexo 1 (instrucciones).
// ============================================

// TODO: validación formulario de registro (Run, correo, contraseña, etc.)


// --------------------------------------------
// "Base de datos" de usuarios en localStorage.
// Como la Evaluación 1 es solo HTML+CSS+JS (sin backend),
// el registro guarda usuarios acá y el login valida contra
// esta misma lista. Cuando el proyecto pase a tener backend
// real (evaluaciones futuras), esto se reemplaza por fetch().
// --------------------------------------------
const EVG_USERS_KEY = "evgUsers";
const EVG_SESSION_KEY = "evgSession";
const EVG_EMAIL_DOMINIOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];
 
function evgGetUsuarios() {
  const data = localStorage.getItem(EVG_USERS_KEY);
  return data ? JSON.parse(data) : [];
}
 
function evgGuardarUsuarios(usuarios) {
  localStorage.setItem(EVG_USERS_KEY, JSON.stringify(usuarios));
}
 
// Usuario de prueba, solo para poder probar login.html sin depender
// de que register.html ya esté 100% terminado por el compañero a cargo.
// Se crea una sola vez (si ya existe, no se duplica).
// TODO equipo: se puede quitar cuando el registro esté probado en todas las páginas.
(function evgSembrarUsuarioDemo() {
  const usuarios = evgGetUsuarios();
  const yaExisteDemo = usuarios.some((u) => u.email === "demo@gmail.com");
  if (!yaExisteDemo) {
    usuarios.push({
      run: "111111111",
      name: "Usuario",
      lastname: "Demo",
      email: "demo@gmail.com",
      password: "1234",
      phone: "",
      region: "nuble",
      comuna: "chillan",
      address: "Calle Demo 123, Chillán"
    });
    evgGuardarUsuarios(usuarios);
  }
})();
 
// --------------------------------------------
// Helpers genéricos de feedback visual (Bootstrap .is-valid / .is-invalid).
// Buscan el <div class="invalid-feedback" id="error-<id-del-input>">
// que ya viene armado en el HTML de cada campo.
// --------------------------------------------
function evgMostrarError(input, mensaje) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  const feedback = document.getElementById(`error-${input.id}`);
  if (feedback) feedback.textContent = mensaje;
}
 
function evgMostrarValido(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  const feedback = document.getElementById(`error-${input.id}`);
  if (feedback) feedback.textContent = "";
}
 
// --------------------------------------------
// Validadores reutilizables (los usan login Y registro)
// --------------------------------------------
function evgValidarEmail(input) {
  const valor = input.value.trim();
 
  if (!valor) {
    evgMostrarError(input, "El correo es obligatorio.");
    return false;
  }
  const formatoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  if (!formatoOk) {
    evgMostrarError(input, "Ingresa un correo con formato válido (ej: nombre@dominio.cl).");
    return false;
  }
  const dominio = valor.split("@")[1]?.toLowerCase();
  if (!EVG_EMAIL_DOMINIOS.includes(dominio)) {
    evgMostrarError(
      input,
      `Solo se aceptan correos ${EVG_EMAIL_DOMINIOS.map((d) => "@" + d).join(", ")}.`
    );
    return false;
  }
  evgMostrarValido(input);
  return true;
}
 
function evgValidarPassword(input, { min = 4, max = 10 } = {}) {
  const valor = input.value;
 
  if (!valor) {
    evgMostrarError(input, "La contraseña es obligatoria.");
    return false;
  }
  if (valor.length < min || valor.length > max) {
    evgMostrarError(input, `La contraseña debe tener entre ${min} y ${max} caracteres.`);
    return false;
  }
  evgMostrarValido(input);
  return true;
}

// --------------------------------------------
// REGISTRO (store/register.html)
// Se incluye porque el login necesita usuarios reales para
// funcionar: sin esto no habría contra qué validar el login.
// --------------------------------------------
function evgCalcularDV(cuerpo) {
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}
 
function evgValidarRun(input) {
  const valor = input.value.trim().toUpperCase().replace(/[.\-]/g, "");
 
  if (!valor) {
    evgMostrarError(input, "El Run es obligatorio.");
    return false;
  }
  if (!/^\d{7,8}[0-9K]$/.test(valor)) {
    evgMostrarError(input, "Formato inválido. Ej: 19011022K (sin puntos ni guión).");
    return false;
  }
  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1);
  if (evgCalcularDV(cuerpo) !== dv) {
    evgMostrarError(input, "El dígito verificador del Run no es válido.");
    return false;
  }
  evgMostrarValido(input);
  return true;
}
 
function evgValidarTexto(input, { min = 2, max = 100, etiqueta = "Este campo" } = {}) {
  const valor = input.value.trim();
 
  if (!valor) {
    evgMostrarError(input, `${etiqueta} es obligatorio.`);
    return false;
  }
  if (valor.length < min || valor.length > max) {
    evgMostrarError(input, `${etiqueta} debe tener entre ${min} y ${max} caracteres.`);
    return false;
  }
  evgMostrarValido(input);
  return true;
}
 
function evgInicializarRegistro() {
  const form = document.getElementById("register-form");
  if (!form) return;
 
  const inputRun = document.getElementById("reg-run");
  const inputName = document.getElementById("reg-name");
  const inputLastname = document.getElementById("reg-lastname");
  const inputEmail = document.getElementById("reg-email");
  const inputPassword = document.getElementById("reg-password");
  const inputPasswordConfirm = document.getElementById("reg-password-confirm");
  const inputAddress = document.getElementById("reg-address");
 
  function validarConfirmacion() {
    if (inputPasswordConfirm.value !== inputPassword.value) {
      evgMostrarError(inputPasswordConfirm, "Las contraseñas no coinciden.");
      return false;
    }
    evgMostrarValido(inputPasswordConfirm);
    return true;
  }
 
  inputRun.addEventListener("input", () => evgValidarRun(inputRun));
  inputName.addEventListener("input", () => evgValidarTexto(inputName, { max: 50, etiqueta: "El nombre" }));
  inputLastname.addEventListener("input", () =>
    evgValidarTexto(inputLastname, { max: 100, etiqueta: "El apellido" })
  );
  inputEmail.addEventListener("input", () => evgValidarEmail(inputEmail));
  inputPassword.addEventListener("input", () => evgValidarPassword(inputPassword));
  inputPasswordConfirm.addEventListener("input", validarConfirmacion);
  inputAddress.addEventListener("input", () =>
    evgValidarTexto(inputAddress, { min: 5, max: 300, etiqueta: "La dirección" })
  );
 
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
 
    const validaciones = [
      evgValidarRun(inputRun),
      evgValidarTexto(inputName, { max: 50, etiqueta: "El nombre" }),
      evgValidarTexto(inputLastname, { max: 100, etiqueta: "El apellido" }),
      evgValidarEmail(inputEmail),
      evgValidarPassword(inputPassword),
      validarConfirmacion(),
      evgValidarTexto(inputAddress, { min: 5, max: 300, etiqueta: "La dirección" })
    ];
    if (validaciones.includes(false)) return;
 
    const email = inputEmail.value.trim().toLowerCase();
    const run = inputRun.value.trim().toUpperCase().replace(/[.\-]/g, "");
    const usuarios = evgGetUsuarios();
 
    if (usuarios.some((u) => u.email.toLowerCase() === email)) {
      evgMostrarError(inputEmail, "Ya existe una cuenta registrada con este correo.");
      return;
    }
    if (usuarios.some((u) => u.run === run)) {
      evgMostrarError(inputRun, "Ya existe una cuenta registrada con este Run.");
      return;
    }
 
    usuarios.push({
      run,
      name: inputName.value.trim(),
      lastname: inputLastname.value.trim(),
      email,
      password: inputPassword.value,
      phone: document.getElementById("reg-phone")?.value.trim() ?? "",
      region: document.getElementById("reg-region")?.value ?? "",
      comuna: document.getElementById("reg-comuna")?.value ?? "",
      address: inputAddress.value.trim()
    });
    evgGuardarUsuarios(usuarios);
 
    alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
    window.location.href = "login.html";
  });
}


// TODO: validación formulario de login (correo + contraseña)


// --------------------------------------------
// LOGIN (store/login.html)
// --------------------------------------------
function evgInicializarLogin() {
  const form = document.getElementById("login-form");
  if (!form) return; // este script se comparte entre páginas: si no hay form, no hace nada
 
  const inputEmail = document.getElementById("login-email");
  const inputPassword = document.getElementById("login-password");
  const alertaBox = evgCrearAlertaLogin(form);
 
  // Validación en tiempo real mientras el usuario escribe
  inputEmail.addEventListener("input", () => evgValidarEmail(inputEmail));
  inputPassword.addEventListener("input", () => evgValidarPassword(inputPassword));
 
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    alertaBox.classList.add("d-none");
 
    const emailOk = evgValidarEmail(inputEmail);
    const passwordOk = evgValidarPassword(inputPassword);
    if (!emailOk || !passwordOk) return;
 
    const email = inputEmail.value.trim().toLowerCase();
    const password = inputPassword.value;
    const usuarios = evgGetUsuarios();
    const usuario = usuarios.find((u) => u.email.toLowerCase() === email);
 
    if (!usuario) {
      evgMostrarAlertaLogin(alertaBox, "No existe una cuenta con ese correo. ¿Ya te registraste?");
      return;
    }
    if (usuario.password !== password) {
      evgMostrarError(inputPassword, "Contraseña incorrecta.");
      return;
    }
 
    // Login correcto: se guarda la sesión y se redirige a la tienda.
    localStorage.setItem(
      EVG_SESSION_KEY,
      JSON.stringify({ email: usuario.email, name: usuario.name, lastname: usuario.lastname })
    );
    window.location.href = "index.html";
  });
}
 
// Crea (una sola vez) el contenedor de alerta general del login,
// para errores que no pertenecen a un campo específico (ej: correo no registrado).
function evgCrearAlertaLogin(form) {
  let alertaBox = document.getElementById("login-alert");
  if (!alertaBox) {
    alertaBox = document.createElement("div");
    alertaBox.id = "login-alert";
    alertaBox.className = "alert alert-danger d-none";
    alertaBox.setAttribute("role", "alert");
    form.prepend(alertaBox);
  }
  return alertaBox;
}
 
function evgMostrarAlertaLogin(alertaBox, mensaje) {
  alertaBox.textContent = mensaje;
  alertaBox.classList.remove("d-none");
}


// --------------------------------------------
// Inicialización general.
// Cada función revisa primero si su formulario existe en la página
// actual, así este mismo archivo se puede cargar en todo el sitio.
// --------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  evgInicializarLogin();
  evgInicializarRegistro();
});

// TODO: validación formulario de contacto (nombre, correo, comentario)

// TODO: validación formularios de producto (admin): precio, stock, stock crítico

// TODO: validación formulario de usuario (admin): Run, correo, fecha nacimiento

// TODO: lógica del carrito / pedido (agregar, guardar en localStorage)
