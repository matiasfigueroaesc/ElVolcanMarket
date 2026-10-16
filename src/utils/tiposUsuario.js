// Nombre y color (clase de badge de Bootstrap) de cada tipo de usuario.
// Están aparte para que UserTable, UsuarioDetalle y Perfil muestren lo mismo
// (mismo criterio que utils/estadosOrden.js). Colores tomados de legacy-eval1/assets/js/admin-users.js.
const TIPOS = {
  administrador: { label: "Administrador", clase: "text-bg-dark" },
  vendedor: { label: "Vendedor", clase: "text-bg-info" },
  cliente: { label: "Cliente", clase: "text-bg-secondary" },
};

export function nombreTipo(tipo) {
  return TIPOS[tipo]?.label ?? tipo;
}

export function claseTipo(tipo) {
  return TIPOS[tipo]?.clase ?? "text-bg-light";
}
