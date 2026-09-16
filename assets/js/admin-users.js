// ============================================
// El Volcán Market — admin-users.js
// CRUD de usuarios del panel admin, sobre el catálogo compartido
// assets/js/users.js: variable global "usuarios" + localStorage
// bajo USERS_STORAGE_KEY.
//
// Requiere cargar users.js ANTES que este script.
//
// Usa en admin/users.html:
//   <tbody id="admin-users-table-body">
// Usa en admin/new-user.html:
//   <form id="new-user-form"> con los campos #user-run, #user-name,
//   #user-lastname, #user-email, #user-birthdate, #user-type,
//   #user-region, #user-comuna, #user-address
// Usa en admin/edit-user.html: mismos campos, dentro de
//   <form id="edit-user-form">, y se espera navegar a esta página
//   con ?id=N en la URL.
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  if (typeof usuarios === "undefined") {
    console.error("admin-users.js: no se encontró el catálogo 'usuarios'. ¿Falta cargar users.js antes de este script?");
    return;
  }

  const TIPO_BADGE = {
    administrador: "text-bg-dark",
    vendedor: "text-bg-info",
    cliente: "text-bg-secondary"
  };

  const TIPO_LABEL = {
    administrador: "Administrador",
    vendedor: "Vendedor",
    cliente: "Cliente"
  };

  // --------------------------------------------
  // admin/users.html — listado
  // --------------------------------------------
  const tablaBody = document.getElementById("admin-users-table-body");

  function renderTablaUsuarios() {
    if (!tablaBody) return;

    if (usuarios.length === 0) {
      tablaBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-4">
            No hay usuarios registrados.
          </td>
        </tr>`;
      return;
    }

    tablaBody.innerHTML = usuarios
      .map((u) => {
        const badgeClass = TIPO_BADGE[u.tipo] || "text-bg-secondary";
        const badgeLabel = TIPO_LABEL[u.tipo] || u.tipo;
        return `
        <tr data-id="${u.id}">
          <td>${u.run}</td>
          <td>${u.nombre}</td>
          <td>${u.apellidos}</td>
          <td>${u.correo}</td>
          <td><span class="badge ${badgeClass}">${badgeLabel}</span></td>
          <td class="text-end">
            <a href="edit-user.html?id=${u.id}" class="btn btn-sm btn-outline-secondary">Editar</a>
            <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-usuario" data-id="${u.id}">Eliminar</button>
          </td>
        </tr>`;
      })
      .join("");
  }

  if (tablaBody) {
    renderTablaUsuarios();

    tablaBody.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn-eliminar-usuario")) return;

      const id = Number(e.target.dataset.id);
      const usuario = usuarios.find((u) => u.id === id);
      if (!usuario) return;

      const confirmado = confirm(`¿Eliminar a "${usuario.nombre} ${usuario.apellidos}"? Esta acción no se puede deshacer.`);
      if (!confirmado) return;

      usuarios = usuarios.filter((u) => u.id !== id);
      guardarCatalogoUsuarios(usuarios);
      renderTablaUsuarios();
    });
  }

  // --------------------------------------------
  // admin/new-user.html y admin/edit-user.html — formulario
  // --------------------------------------------
  const form = document.getElementById("new-user-form") || document.getElementById("edit-user-form");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  const modoEdicion = idParam !== null;
  let usuarioEditando = null;

  const campoRun = document.getElementById("user-run");

  if (modoEdicion) {
    usuarioEditando = usuarios.find((u) => u.id === Number(idParam));

    if (!usuarioEditando) {
      alert("Usuario no encontrado.");
      window.location.href = "users.html";
      return;
    }

    campoRun.value = usuarioEditando.run;
    // El Run identifica al usuario: no se edita una vez creado.
    campoRun.readOnly = true;
    document.getElementById("user-name").value = usuarioEditando.nombre;
    document.getElementById("user-lastname").value = usuarioEditando.apellidos;
    document.getElementById("user-email").value = usuarioEditando.correo;
    // La contraseña nunca se precarga (ni siquiera oculta): el campo
    // se deja vacío y solo se cambia si se escribe algo nuevo.
    document.getElementById("user-birthdate").value = usuarioEditando.fechaNacimiento || "";
    document.getElementById("user-type").value = usuarioEditando.tipo;
    document.getElementById("user-region").value = usuarioEditando.region;
    document.getElementById("user-comuna").value = usuarioEditando.comuna;
    document.getElementById("user-address").value = usuarioEditando.direccion;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const run = campoRun.value.trim();
    const nombre = document.getElementById("user-name").value.trim();
    const apellidos = document.getElementById("user-lastname").value.trim();
    const correo = document.getElementById("user-email").value.trim();
    const passwordIngresada = document.getElementById("user-password").value;
    const fechaNacimientoRaw = document.getElementById("user-birthdate").value;
    const fechaNacimiento = fechaNacimientoRaw === "" ? null : fechaNacimientoRaw;
    const tipo = document.getElementById("user-type").value;
    const region = document.getElementById("user-region").value;
    const comuna = document.getElementById("user-comuna").value;
    const direccion = document.getElementById("user-address").value.trim();

    // Un mismo Run no puede repetirse entre dos usuarios distintos.
    const yaExiste = usuarios.some(
      (u) => u.run === run && (!modoEdicion || u.id !== usuarioEditando.id)
    );
    if (yaExiste) {
      alert(`Ya existe un usuario registrado con el Run ${run}.`);
      return;
    }

    if (modoEdicion) {
      usuarioEditando.nombre = nombre;
      usuarioEditando.apellidos = apellidos;
      usuarioEditando.correo = correo;
      // Campo en blanco = no cambiar la contraseña actual.
      if (passwordIngresada !== "") {
        usuarioEditando.password = passwordIngresada;
      }
      usuarioEditando.fechaNacimiento = fechaNacimiento;
      usuarioEditando.tipo = tipo;
      usuarioEditando.region = region;
      usuarioEditando.comuna = comuna;
      usuarioEditando.direccion = direccion;
    } else {
      const nuevoId = usuarios.length ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
      usuarios.push({
        id: nuevoId,
        run,
        nombre,
        apellidos,
        correo,
        password: passwordIngresada,
        telefono: null,
        fechaNacimiento,
        tipo,
        region,
        comuna,
        direccion
      });
    }

    guardarCatalogoUsuarios(usuarios);
    window.location.href = "users.html";
  });
});
