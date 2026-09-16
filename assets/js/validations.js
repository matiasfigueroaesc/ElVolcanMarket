// ============================================
// Distribuidora de Gas El Volcán — validations.js
// Validaciones de formularios en tiempo real.
// Reglas detalladas en el Anexo 1 (instrucciones).
// ============================================

const COMUNAS_POR_REGION = {
  metropolitana: [
    { value: "chillan", label: "Chillán" },
    { value: "chillan-viejo", label: "Chillán Viejo" }
  ],
  araucania: [
    { value: "chillan", label: "Chillán" },
    { value: "chillan-viejo", label: "Chillán Viejo" }
  ],
  nuble: [
    { value: "chillan", label: "Chillán" },
    { value: "chillan-viejo", label: "Chillán Viejo" }
  ]
};

function mostrarError(input, mensaje) {
  if (!input) return;

  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
  input.setCustomValidity(mensaje || "Entrada inválida");

  const feedback = document.getElementById(`error-${input.id}`);
  if (feedback) {
    feedback.textContent = mensaje;
  }
}

function limpiarError(input) {
  if (!input) return;

  input.classList.remove("is-invalid");
  input.setAttribute("aria-invalid", "false");
  input.setCustomValidity("");

  const feedback = document.getElementById(`error-${input.id}`);
  if (feedback) {
    feedback.textContent = "";
  }
}

function esRunValido(run) {
  const valor = (run || "").toString().trim().replace(/\s+/g, "").toUpperCase();

  if (!/^\d{7,8}[0-9K]$/.test(valor)) {
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
  let digitoEsperado = "";

  if (resto === 11) {
    digitoEsperado = "0";
  } else if (resto === 10) {
    digitoEsperado = "K";
  } else {
    digitoEsperado = String(resto);
  }

  return digitoEsperado === valor.charAt(valor.length - 1).toUpperCase();
}

function esCorreoPermitido(correo) {
  const valor = (correo || "").trim();
  return /^[^\s@]+@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(valor);
}

function aplicarFiltroComunas(regionSelectId, comunaSelectId) {
  const regionSelect = document.getElementById(regionSelectId);
  const comunaSelect = document.getElementById(comunaSelectId);

  if (!regionSelect || !comunaSelect) {
    return;
  }

  const valorActual = comunaSelect.value;
  const opciones = COMUNAS_POR_REGION[regionSelect.value] || [];

  comunaSelect.innerHTML = '<option value="" selected disabled>-- Seleccione comuna --</option>';

  opciones.forEach((comuna) => {
    const option = document.createElement("option");
    option.value = comuna.value;
    option.textContent = comuna.label;
    comunaSelect.appendChild(option);
  });

  if (valorActual && opciones.some((comuna) => comuna.value === valorActual)) {
    comunaSelect.value = valorActual;
  } else {
    comunaSelect.value = "";
  }

  comunaSelect.disabled = !regionSelect.value;
}

function validarTextoObligatorio(input, mensaje) {
  if (!input) return true;

  const valor = input.value.trim();
  if (!valor) {
    mostrarError(input, mensaje);
    return false;
  }

  limpiarError(input);
  return true;
}

function validarRun(input, mensaje) {
  if (!input) return true;

  const valor = input.value.trim();
  if (!valor) {
    mostrarError(input, mensaje || "El RUN es obligatorio.");
    return false;
  }

  if (!esRunValido(valor)) {
    mostrarError(input, "El RUN ingresado no es válido.");
    return false;
  }

  limpiarError(input);
  return true;
}

function validarCorreo(input, requerido = true, mensajePersonalizado = "") {
  if (!input) return true;

  const valor = input.value.trim();

  if (!valor) {
    if (requerido) {
      mostrarError(input, mensajePersonalizado || "El correo es obligatorio.");
      return false;
    }

    limpiarError(input);
    return true;
  }

  if (!esCorreoPermitido(valor)) {
    mostrarError(input, "El correo debe tener un dominio válido (@duoc.cl, @profesor.duoc.cl o @gmail.com). ");
    return false;
  }

  limpiarError(input);
  return true;
}

function validarPassword(input, requerido = true) {
  if (!input) return true;

  const valor = input.value;

  if (!valor) {
    if (requerido) {
      mostrarError(input, "La contraseña es obligatoria.");
      return false;
    }

    limpiarError(input);
    return true;
  }

  if (valor.length < 4 || valor.length > 10) {
    mostrarError(input, "La contraseña debe tener entre 4 y 10 caracteres.");
    return false;
  }

  limpiarError(input);
  return true;
}

function validarConfirmacionPassword(input, passwordInput, mensaje = "Las contraseñas no coinciden.") {
  if (!input || !passwordInput) return true;

  if (!input.value) {
    mostrarError(input, "Debes confirmar la contraseña.");
    return false;
  }

  if (input.value !== passwordInput.value) {
    mostrarError(input, mensaje);
    return false;
  }

  limpiarError(input);
  return true;
}

function validarSelect(input, mensaje) {
  if (!input) return true;

  if (!input.value) {
    mostrarError(input, mensaje);
    return false;
  }

  limpiarError(input);
  return true;
}

function validarPrecio(input) {
  if (!input) return true;

  const valor = Number(input.value);
  if (Number.isNaN(valor) || valor <= 0) {
    mostrarError(input, "El precio debe ser mayor que 0.");
    return false;
  }

  limpiarError(input);
  return true;
}

function validarStock(input, mensaje) {
  if (!input) return true;

  const valor = Number(input.value);
  if (Number.isNaN(valor) || !Number.isInteger(valor) || valor < 0) {
    mostrarError(input, mensaje || "El stock debe ser un número entero mayor o igual a 0.");
    return false;
  }

  limpiarError(input);
  return true;
}

function validarFechaNacimiento(input) {
  if (!input || !input.value) {
    return true;
  }

  const hoy = new Date();
  const fecha = new Date(`${input.value}T00:00:00`);

  if (Number.isNaN(fecha.getTime()) || fecha > hoy) {
    mostrarError(input, "La fecha de nacimiento no puede ser futura.");
    return false;
  }

  limpiarError(input);
  return true;
}

function validarFormularioRegistro() {
  const form = document.getElementById("register-form");
  if (!form) return true;

  const run = document.getElementById("reg-run");
  const nombre = document.getElementById("reg-name");
  const apellidos = document.getElementById("reg-lastname");
  const correo = document.getElementById("reg-email");
  const password = document.getElementById("reg-password");
  const passwordConfirm = document.getElementById("reg-password-confirm");
  const region = document.getElementById("reg-region");
  const comuna = document.getElementById("reg-comuna");
  const direccion = document.getElementById("reg-address");

  let valido = true;
  valido = validarRun(run, "El RUN es obligatorio.") && valido;
  valido = validarTextoObligatorio(nombre, "El nombre es obligatorio.") && valido;
  valido = validarTextoObligatorio(apellidos, "Los apellidos son obligatorios.") && valido;
  valido = validarCorreo(correo, true) && valido;
  valido = validarPassword(password, true) && valido;
  valido = validarConfirmacionPassword(passwordConfirm, password) && valido;
  valido = validarSelect(region, "Debes seleccionar una región.") && valido;
  valido = validarSelect(comuna, "Debes seleccionar una comuna.") && valido;
  valido = validarTextoObligatorio(direccion, "La dirección es obligatoria.") && valido;

  return valido;
}

function validarFormularioLogin() {
  const form = document.getElementById("login-form");
  if (!form) return true;

  const correo = document.getElementById("login-email");
  const password = document.getElementById("login-password");

  let valido = true;
  valido = validarCorreo(correo, true) && valido;
  valido = validarPassword(password, true) && valido;

  return valido;
}

function validarFormularioContacto() {
  const form = document.getElementById("contact-form");
  if (!form) return true;

  const nombre = document.getElementById("contact-name");
  const correo = document.getElementById("contact-email");
  const comentario = document.getElementById("contact-comment");

  let valido = true;
  const nombreValor = nombre?.value.trim() || "";
  if (nombreValor.length < 3) {
    mostrarError(nombre, "El nombre debe tener al menos 3 caracteres.");
    valido = false;
  } else {
    limpiarError(nombre);
  }

  if (correo && correo.value.trim() && !esCorreoPermitido(correo.value.trim())) {
    mostrarError(correo, "El correo debe tener un dominio válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).");
    valido = false;
  } else if (correo) {
    limpiarError(correo);
  }

  if (!comentario || !comentario.value.trim()) {
    mostrarError(comentario, "El comentario es obligatorio.");
    valido = false;
  } else {
    limpiarError(comentario);
  }

  return valido;
}

function validarFormularioProducto() {
  const form = document.getElementById("new-product-form") || document.getElementById("edit-product-form");
  if (!form) return true;

  const codigo = document.getElementById("product-code");
  const nombre = document.getElementById("product-name");
  const precio = document.getElementById("product-price");
  const categoria = document.getElementById("product-category");
  const stock = document.getElementById("product-stock");
  const stockCritico = document.getElementById("product-critical-stock");

  let valido = true;
  if (codigo && codigo.value.trim().length < 3) {
    mostrarError(codigo, "El código del producto debe tener al menos 3 caracteres.");
    valido = false;
  } else if (codigo) {
    limpiarError(codigo);
  }

  valido = validarTextoObligatorio(nombre, "El nombre del producto es obligatorio.") && valido;
  valido = validarPrecio(precio) && valido;
  valido = validarSelect(categoria, "Debes seleccionar una categoría.") && valido;
  valido = validarStock(stock, "El stock debe ser un número entero mayor o igual a 0.") && valido;

  if (stockCritico && stockCritico.value !== "") {
    const valorCritico = Number(stockCritico.value);
    const stockValor = Number(stock.value || 0);

    if (Number.isNaN(valorCritico) || !Number.isInteger(valorCritico) || valorCritico < 0) {
      mostrarError(stockCritico, "El stock crítico debe ser un número entero mayor o igual a 0.");
      valido = false;
    } else if (valorCritico > stockValor) {
      mostrarError(stockCritico, "El stock crítico no puede ser mayor que el stock.");
      valido = false;
    } else {
      limpiarError(stockCritico);
    }
  } else if (stockCritico) {
    limpiarError(stockCritico);
  }

  return valido;
}

function validarFormularioUsuario() {
  const form = document.getElementById("new-user-form") || document.getElementById("edit-user-form");
  if (!form) return true;

  const run = document.getElementById("user-run");
  const nombre = document.getElementById("user-name");
  const apellidos = document.getElementById("user-lastname");
  const correo = document.getElementById("user-email");
  const password = document.getElementById("user-password");
  const fechaNacimiento = document.getElementById("user-birthdate");
  const tipo = document.getElementById("user-type");
  const region = document.getElementById("user-region");
  const comuna = document.getElementById("user-comuna");
  const direccion = document.getElementById("user-address");

  let valido = true;
  valido = validarRun(run, "El RUN es obligatorio.") && valido;
  valido = validarTextoObligatorio(nombre, "El nombre es obligatorio.") && valido;
  valido = validarTextoObligatorio(apellidos, "Los apellidos son obligatorios.") && valido;
  valido = validarCorreo(correo, true) && valido;

  if (form.id === "new-user-form") {
    valido = validarPassword(password, true) && valido;
  } else if (password && password.value) {
    valido = validarPassword(password, false) && valido;
  } else if (password) {
    limpiarError(password);
  }

  valido = validarFechaNacimiento(fechaNacimiento) && valido;
  valido = validarSelect(tipo, "Debes seleccionar un tipo de usuario.") && valido;
  valido = validarSelect(region, "Debes seleccionar una región.") && valido;
  valido = validarSelect(comuna, "Debes seleccionar una comuna.") && valido;
  valido = validarTextoObligatorio(direccion, "La dirección es obligatoria.") && valido;

  return valido;
}

function configurarValidacionesFormulario() {
  const regionKeys = [
    { regionId: "reg-region", comunaId: "reg-comuna" },
    { regionId: "user-region", comunaId: "user-comuna" }
  ];

  regionKeys.forEach(({ regionId, comunaId }) => {
    const regionSelect = document.getElementById(regionId);
    const comunaSelect = document.getElementById(comunaId);

    if (regionSelect && comunaSelect) {
      regionSelect.addEventListener("change", () => {
        aplicarFiltroComunas(regionId, comunaId);
      });
      aplicarFiltroComunas(regionId, comunaId);
    }
  });

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    [
      "reg-run",
      "reg-name",
      "reg-lastname",
      "reg-email",
      "reg-password",
      "reg-password-confirm",
      "reg-region",
      "reg-comuna",
      "reg-address"
    ].forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;

      input.addEventListener("input", () => {
        if (id === "reg-run") validarRun(input, "El RUN es obligatorio.");
        if (id === "reg-name") validarTextoObligatorio(input, "El nombre es obligatorio.");
        if (id === "reg-lastname") validarTextoObligatorio(input, "Los apellidos son obligatorios.");
        if (id === "reg-email") validarCorreo(input, true);
        if (id === "reg-password") validarPassword(input, true);
        if (id === "reg-password-confirm") validarConfirmacionPassword(input, document.getElementById("reg-password"));
        if (id === "reg-region") validarSelect(input, "Debes seleccionar una región.");
        if (id === "reg-comuna") validarSelect(input, "Debes seleccionar una comuna.");
        if (id === "reg-address") validarTextoObligatorio(input, "La dirección es obligatoria.");
      });

      input.addEventListener("blur", () => {
        if (id === "reg-run") validarRun(input, "El RUN es obligatorio.");
        if (id === "reg-name") validarTextoObligatorio(input, "El nombre es obligatorio.");
        if (id === "reg-lastname") validarTextoObligatorio(input, "Los apellidos son obligatorios.");
        if (id === "reg-email") validarCorreo(input, true);
        if (id === "reg-password") validarPassword(input, true);
        if (id === "reg-password-confirm") validarConfirmacionPassword(input, document.getElementById("reg-password"));
        if (id === "reg-region") validarSelect(input, "Debes seleccionar una región.");
        if (id === "reg-comuna") validarSelect(input, "Debes seleccionar una comuna.");
        if (id === "reg-address") validarTextoObligatorio(input, "La dirección es obligatoria.");
      });
    });

    registerForm.addEventListener("submit", (event) => {
      if (!validarFormularioRegistro()) {
        event.preventDefault();
      }
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    ["login-email", "login-password"].forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;

      input.addEventListener("input", () => {
        if (id === "login-email") validarCorreo(input, true);
        if (id === "login-password") validarPassword(input, true);
      });

      input.addEventListener("blur", () => {
        if (id === "login-email") validarCorreo(input, true);
        if (id === "login-password") validarPassword(input, true);
      });
    });

    loginForm.addEventListener("submit", (event) => {
      if (!validarFormularioLogin()) {
        event.preventDefault();
      }
    });
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    ["contact-name", "contact-email", "contact-comment"].forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;

      input.addEventListener("input", () => {
        if (id === "contact-name") {
          const valor = input.value.trim();
          if (valor.length < 3) mostrarError(input, "El nombre debe tener al menos 3 caracteres.");
          else limpiarError(input);
        }

        if (id === "contact-email") {
          if (input.value.trim() && !esCorreoPermitido(input.value.trim())) {
            mostrarError(input, "El correo debe tener un dominio válido (@duoc.cl, @profesor.duoc.cl o @gmail.com). ");
          } else {
            limpiarError(input);
          }
        }

        if (id === "contact-comment") {
          if (!input.value.trim()) mostrarError(input, "El comentario es obligatorio.");
          else limpiarError(input);
        }
      });

      input.addEventListener("blur", () => {
        if (id === "contact-name") {
          const valor = input.value.trim();
          if (valor.length < 3) mostrarError(input, "El nombre debe tener al menos 3 caracteres.");
          else limpiarError(input);
        }

        if (id === "contact-email") {
          if (input.value.trim() && !esCorreoPermitido(input.value.trim())) {
            mostrarError(input, "El correo debe tener un dominio válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).");
          } else {
            limpiarError(input);
          }
        }

        if (id === "contact-comment") {
          if (!input.value.trim()) mostrarError(input, "El comentario es obligatorio.");
          else limpiarError(input);
        }
      });
    });

    contactForm.addEventListener("submit", (event) => {
      if (!validarFormularioContacto()) {
        event.preventDefault();
      }
    });
  }

  const productForm = document.getElementById("new-product-form") || document.getElementById("edit-product-form");
  if (productForm) {
    ["product-code", "product-name", "product-price", "product-category", "product-stock", "product-critical-stock"].forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;

      input.addEventListener("input", () => {
        if (id === "product-code") {
          if (input.value.trim().length < 3) mostrarError(input, "El código del producto debe tener al menos 3 caracteres.");
          else limpiarError(input);
        }

        if (id === "product-name") {
          validarTextoObligatorio(input, "El nombre del producto es obligatorio.");
        }

        if (id === "product-price") {
          validarPrecio(input);
        }

        if (id === "product-category") {
          validarSelect(input, "Debes seleccionar una categoría.");
        }

        if (id === "product-stock") {
          validarStock(input, "El stock debe ser un número entero mayor o igual a 0.");
        }

        if (id === "product-critical-stock" && input.value !== "") {
          const valorCritico = Number(input.value);
          const stockValor = Number(document.getElementById("product-stock")?.value || 0);

          if (Number.isNaN(valorCritico) || !Number.isInteger(valorCritico) || valorCritico < 0) {
            mostrarError(input, "El stock crítico debe ser un número entero mayor o igual a 0.");
          } else if (valorCritico > stockValor) {
            mostrarError(input, "El stock crítico no puede ser mayor que el stock.");
          } else {
            limpiarError(input);
          }
        } else if (id === "product-critical-stock") {
          limpiarError(input);
        }
      });

      input.addEventListener("blur", () => {
        if (id === "product-code") {
          if (input.value.trim().length < 3) mostrarError(input, "El código del producto debe tener al menos 3 caracteres.");
          else limpiarError(input);
        }

        if (id === "product-name") {
          validarTextoObligatorio(input, "El nombre del producto es obligatorio.");
        }

        if (id === "product-price") {
          validarPrecio(input);
        }

        if (id === "product-category") {
          validarSelect(input, "Debes seleccionar una categoría.");
        }

        if (id === "product-stock") {
          validarStock(input, "El stock debe ser un número entero mayor o igual a 0.");
        }

        if (id === "product-critical-stock" && input.value !== "") {
          const valorCritico = Number(input.value);
          const stockValor = Number(document.getElementById("product-stock")?.value || 0);

          if (Number.isNaN(valorCritico) || !Number.isInteger(valorCritico) || valorCritico < 0) {
            mostrarError(input, "El stock crítico debe ser un número entero mayor o igual a 0.");
          } else if (valorCritico > stockValor) {
            mostrarError(input, "El stock crítico no puede ser mayor que el stock.");
          } else {
            limpiarError(input);
          }
        } else if (id === "product-critical-stock") {
          limpiarError(input);
        }
      });
    });

    productForm.addEventListener("submit", (event) => {
      if (!validarFormularioProducto()) {
        event.preventDefault();
      }
    });
  }

  const userForm = document.getElementById("new-user-form") || document.getElementById("edit-user-form");
  if (userForm) {
    ["user-run", "user-name", "user-lastname", "user-email", "user-password", "user-birthdate", "user-type", "user-region", "user-comuna", "user-address"].forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;

      input.addEventListener("input", () => {
        if (id === "user-run") validarRun(input, "El RUN es obligatorio.");
        if (id === "user-name") validarTextoObligatorio(input, "El nombre es obligatorio.");
        if (id === "user-lastname") validarTextoObligatorio(input, "Los apellidos son obligatorios.");
        if (id === "user-email") validarCorreo(input, true);
        if (id === "user-password") {
          if (userForm.id === "new-user-form") validarPassword(input, true);
          else if (input.value) validarPassword(input, false);
          else limpiarError(input);
        }
        if (id === "user-birthdate") validarFechaNacimiento(input);
        if (id === "user-type") validarSelect(input, "Debes seleccionar un tipo de usuario.");
        if (id === "user-region") validarSelect(input, "Debes seleccionar una región.");
        if (id === "user-comuna") validarSelect(input, "Debes seleccionar una comuna.");
        if (id === "user-address") validarTextoObligatorio(input, "La dirección es obligatoria.");
      });

      input.addEventListener("blur", () => {
        if (id === "user-run") validarRun(input, "El RUN es obligatorio.");
        if (id === "user-name") validarTextoObligatorio(input, "El nombre es obligatorio.");
        if (id === "user-lastname") validarTextoObligatorio(input, "Los apellidos son obligatorios.");
        if (id === "user-email") validarCorreo(input, true);
        if (id === "user-password") {
          if (userForm.id === "new-user-form") validarPassword(input, true);
          else if (input.value) validarPassword(input, false);
          else limpiarError(input);
        }
        if (id === "user-birthdate") validarFechaNacimiento(input);
        if (id === "user-type") validarSelect(input, "Debes seleccionar un tipo de usuario.");
        if (id === "user-region") validarSelect(input, "Debes seleccionar una región.");
        if (id === "user-comuna") validarSelect(input, "Debes seleccionar una comuna.");
        if (id === "user-address") validarTextoObligatorio(input, "La dirección es obligatoria.");
      });
    });

    userForm.addEventListener("submit", (event) => {
      if (!validarFormularioUsuario()) {
        event.preventDefault();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", configurarValidacionesFormulario);
