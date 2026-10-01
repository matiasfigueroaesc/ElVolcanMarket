// ============================================
// El Volcán Market — login.js
// Lógica de store/login.html: valida las credenciales contra el
// catálogo compartido de assets/js/users.js y redirige según el
// tipo de usuario (rol).
//
// Requiere cargar users.js ANTES que este script.
// Usa <form id="login-form"> con #login-email y #login-password.
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  if (typeof usuarios === "undefined") {
    console.error("login.js: no se encontró el catálogo 'usuarios'. ¿Falta cargar users.js antes de este script?");
    return;
  }

  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const correo = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    const usuario = usuarios.find(
      (u) => u.correo.toLowerCase() === correo && u.password === password
    );

    if (!usuario) {
      alert("Correo o contraseña incorrectos.");
      return;
    }

    guardarSesion(usuario);

    // Cliente se queda en la tienda; Administrador/Vendedor entran al panel.
    if (usuario.tipo === "cliente") {
      window.location.href = "index.html";
    } else {
      window.location.href = "../admin/home.html";
    }
  });
});
