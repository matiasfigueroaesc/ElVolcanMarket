// ============================================
// El Volcán Market — validacionesAdmin.js
// Validaciones de los formularios del panel admin (producto y categoría).
// Mismas reglas que la Eval 1 (legacy-eval1/assets/js/validations.js),
// pero como funciones puras: reciben los valores y devuelven un objeto
// { campo: "mensaje" } solo con los campos que tienen error.
// Reutilizan las funciones genéricas de validaciones.js.
// ============================================
import { validarSeleccion, validarTextoObligatorio } from "./validaciones.js";

// true si el texto es un número entero >= 0 ("10" sí, "-1", "2.5" y "" no).
function esEnteroNoNegativo(texto) {
  if (String(texto).trim() === "") return false;
  const n = Number(texto);
  return Number.isInteger(n) && n >= 0;
}

export function validarProducto(v) {
  const errores = {};

  const codigo = validarTextoObligatorio(v.codigo, "El código debe tener al menos 3 caracteres.", 3);
  if (codigo) errores.codigo = codigo;

  const nombre = validarTextoObligatorio(v.nombre, "El nombre del producto es obligatorio.");
  if (nombre) errores.nombre = nombre;
  else if (v.nombre.trim().length > 100) errores.nombre = "El nombre no puede superar los 100 caracteres.";

  if (String(v.precio).trim() === "" || Number.isNaN(Number(v.precio)) || Number(v.precio) < 0) {
    errores.precio = "El precio debe ser un número mayor o igual a 0.";
  }

  // El precio de oferta es opcional, pero si se escribe debe ser menor que el precio normal.
  if (String(v.precioOferta ?? "").trim() !== "") {
    const oferta = Number(v.precioOferta);
    if (Number.isNaN(oferta) || oferta < 0) errores.precioOferta = "El precio de oferta no puede ser negativo.";
    else if (!errores.precio && oferta >= Number(v.precio)) {
      errores.precioOferta = "El precio de oferta debe ser menor que el precio normal.";
    }
  }

  const categoria = validarSeleccion(v.categoriaId, "Debes seleccionar una categoría.");
  if (categoria) errores.categoriaId = categoria;

  if (!esEnteroNoNegativo(v.stock)) errores.stock = "El stock debe ser un número entero mayor o igual a 0.";

  if (!esEnteroNoNegativo(v.stockCritico)) {
    errores.stockCritico = "El stock crítico debe ser un número entero mayor o igual a 0.";
  }

  return errores;
}

export function validarCategoria(v, otrasCategorias = []) {
  const errores = {};

  const nombre = validarTextoObligatorio(v.nombre, "El nombre debe tener al menos 3 caracteres.", 3);
  if (nombre) errores.nombre = nombre;
  else {
    // No se permiten dos categorías con el mismo nombre (sin importar mayúsculas).
    const repetida = otrasCategorias.some((c) => c.nombre.trim().toLowerCase() === v.nombre.trim().toLowerCase());
    if (repetida) errores.nombre = "Ya existe una categoría con ese nombre.";
  }

  if ((v.descripcion || "").trim().length > 200) {
    errores.descripcion = "La descripción no puede superar los 200 caracteres.";
  }

  return errores;
}

// true si el objeto de errores tiene al menos un campo.
export function hayErrores(errores) {
  return Object.keys(errores).length > 0;
}
