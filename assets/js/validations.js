// ============================================
// Distribuidora de Gas El Volcán — validations.js
// Validaciones de formularios en tiempo real.
// Reglas detalladas en el Anexo 1 (instrucciones).
// ============================================

// TODO: validación formulario de registro (Run, correo, contraseña, etc.)


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




// TODO: validación formulario de contacto (nombre, correo, comentario)

// TODO: validación formularios de producto (admin): precio, stock, stock crítico

// TODO: validación formulario de usuario (admin): Run, correo, fecha nacimiento

// TODO: lógica del carrito / pedido (agregar, guardar en localStorage)
