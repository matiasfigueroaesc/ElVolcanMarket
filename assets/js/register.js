// ============================================
// El Volcán Market — register.js
// Lógica de store/register.html: agrega un nuevo usuario al catálogo
// compartido de assets/js/users.js. El autoregistro SIEMPRE crea
// usuarios tipo "cliente" — no hay forma de elegir el rol desde acá
// (eso es exclusivo de admin/new-user.html, ya autenticado como
// Administrador).
//
// Requiere cargar users.js ANTES que este script.
// Usa <form id="register-form"> con los campos del formulario de
// store/register.html (#reg-run, #reg-name, #reg-lastname,
// #reg-email, #reg-password, #reg-password-confirm, #reg-phone,
// #reg-region, #reg-comuna, #reg-address).
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  if (typeof usuarios === "undefined") {
    console.error("register.js: no se encontró el catálogo 'usuarios'. ¿Falta cargar users.js antes de este script?");
    return;
  }

  const form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const run = document.getElementById("reg-run").value.trim();
    const nombre = document.getElementById("reg-name").value.trim();
    const apellidos = document.getElementById("reg-lastname").value.trim();
    const correo = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const passwordConfirm = document.getElementById("reg-password-confirm").value;
    const telefonoRaw = document.getElementById("reg-phone").value.trim();
    const telefono = telefonoRaw === "" ? null : telefonoRaw;
    const region = document.getElementById("reg-region").value;
    const comuna = document.getElementById("reg-comuna").value;
    const direccion = document.getElementById("reg-address").value.trim();

    if (password !== passwordConfirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const correoDuplicado = usuarios.some((u) => u.correo.toLowerCase() === correo.toLowerCase());
    if (correoDuplicado) {
      alert(`Ya existe una cuenta registrada con el correo ${correo}.`);
      return;
    }

    const runDuplicado = usuarios.some((u) => u.run === run);
    if (runDuplicado) {
      alert(`Ya existe una cuenta registrada con el Run ${run}.`);
      return;
    }

    const nuevoId = usuarios.length ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
    const nuevoUsuario = {
      id: nuevoId,
      run,
      nombre,
      apellidos,
      correo,
      password,
      telefono,
      fechaNacimiento: null,
      tipo: "cliente", // Forzado: el autoregistro nunca crea Administrador/Vendedor.
      region,
      comuna,
      direccion
    };

    usuarios.push(nuevoUsuario);
    guardarCatalogoUsuarios(usuarios);

    // Deja al nuevo cliente ya con sesión iniciada, sin pedirle
    // loguearse de nuevo con lo que recién escribió.
    guardarSesion(nuevoUsuario);
    window.location.href = "index.html";
  });
});
