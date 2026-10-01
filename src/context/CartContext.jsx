// Carrito disponible en toda la app: useCart()
// Cada cambio se guarda en localStorage y re-renderiza navbar, carrito y checkout.
import { createContext, useContext, useEffect, useState } from "react";
import {
  agregarItem,
  cambiarCantidad,
  cargarCarrito,
  guardarCarrito,
  quitarItem,
  totalCarrito,
  unidadesCarrito,
} from "../data/carrito.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => cargarCarrito());

  useEffect(() => {
    guardarCarrito(items);
  }, [items]);

  const valor = {
    items,
    total: totalCarrito(items),
    unidades: unidadesCarrito(items),
    agregar: (producto, cantidad = 1) => setItems((c) => agregarItem(c, producto, cantidad)),
    cambiarCantidad: (id, cantidad) => setItems((c) => cambiarCantidad(c, id, cantidad)),
    quitar: (id) => setItems((c) => quitarItem(c, id)),
    vaciar: () => setItems([]),
  };

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
