// ============================================
// El Volcán Market — carrito.js
// Lógica del carrito como funciones PURAS (reciben el carrito y
// devuelven uno nuevo, sin tocar el original). Así se pueden
// probar fácil con Jasmine. CartContext las usa y se encarga de
// guardar el resultado en localStorage.
//
// Ítem del carrito: { id, nombre, precio, imagen, cantidad, stock }
// ============================================
import { leerJSON, escribirJSON } from "./storage.js";
import { precioFinal } from "./productos.js";

export const CARRITO_STORAGE_KEY = "volcan_cart_v2";

export const cargarCarrito = () => leerJSON(CARRITO_STORAGE_KEY, []);
export const guardarCarrito = (carrito) => escribirJSON(CARRITO_STORAGE_KEY, carrito);

export function agregarItem(carrito, producto, cantidad = 1) {
  if (producto.stock <= 0 || cantidad <= 0) return carrito;
  const existente = carrito.find((item) => item.id === producto.id);
  if (existente) {
    return carrito.map((item) =>
      item.id === producto.id
        ? { ...item, cantidad: Math.min(item.cantidad + cantidad, producto.stock) }
        : item
    );
  }
  return [
    ...carrito,
    {
      id: producto.id,
      nombre: producto.nombre,
      precio: precioFinal(producto),
      imagen: producto.imagen,
      cantidad: Math.min(cantidad, producto.stock),
      stock: producto.stock,
    },
  ];
}

// Cantidad 0 o menos elimina el ítem.
export function cambiarCantidad(carrito, id, cantidad) {
  if (cantidad <= 0) return quitarItem(carrito, id);
  return carrito.map((item) =>
    item.id === id ? { ...item, cantidad: Math.min(cantidad, item.stock) } : item
  );
}

export function quitarItem(carrito, id) {
  return carrito.filter((item) => item.id !== id);
}

export function totalCarrito(carrito) {
  return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

export function unidadesCarrito(carrito) {
  return carrito.reduce((acc, item) => acc + item.cantidad, 0);
}
