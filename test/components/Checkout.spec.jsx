import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import { CARRITO_STORAGE_KEY } from "../../src/data/carrito.js";
import { listarOrdenes } from "../../src/data/ordenes.js";
import { obtenerProducto } from "../../src/data/productos.js";
import { guardarSesion } from "../../src/data/usuarios.js";
import Checkout from "../../src/pages/store/Checkout.jsx";

const item = { id: 2, nombre: "Cilindro GLP 11 kg", precio: 12000, imagen: "", cantidad: 2, stock: 10 };

const mostrar = () =>
  render(
    <MemoryRouter initialEntries={["/checkout"]}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pago/exito/:ordenId" element={<p>pantalla exito</p>} />
            <Route path="/pago/error/:ordenId" element={<p>pantalla error</p>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

function llenar() {
  fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
  fireEvent.change(screen.getByLabelText("Apellidos"), { target: { value: "Pérez Soto" } });
  fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "ana@correo.cl" } });
  fireEvent.change(screen.getByLabelText("Calle y número"), { target: { value: "Av. Libertad 100" } });
  fireEvent.change(screen.getByLabelText("Región"), { target: { value: "nuble" } });
  fireEvent.change(screen.getByLabelText("Comuna"), { target: { value: "chillan" } });
}

describe("<Checkout />", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify([item]));
  });

  it("muestra un mensaje si el carrito está vacío", () => {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify([]));
    mostrar();
    expect(screen.getByText(/carrito está vacío/i)).toBeTruthy();
  });

  it("autocompleta el formulario con el usuario en sesión", () => {
    guardarSesion({
      id: 3, nombre: "Camila", apellidos: "Toro Pizarro", correo: "camila.toro@gmail.com",
      direccion: "Camino a Chillán Viejo 789", region: "nuble", comuna: "chillan-viejo", tipo: "cliente",
    });
    mostrar();
    expect(screen.getByLabelText("Nombre").value).toBe("Camila");
    expect(screen.getByLabelText("Calle y número").value).toBe("Camino a Chillán Viejo 789");
  });

  it("con pago aprobado crea la orden, descuenta stock y vacía el carrito", () => {
    const ordenesAntes = listarOrdenes().length;
    const stockAntes = obtenerProducto(2).stock;
    mostrar();
    llenar();
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));

    expect(screen.getByText("pantalla exito")).toBeTruthy();
    const ordenes = listarOrdenes();
    expect(ordenes.length).toBe(ordenesAntes + 1);
    expect(ordenes[ordenes.length - 1].estadoPago).toBe("pagado");
    expect(obtenerProducto(2).stock).toBe(stockAntes - 2);
    expect(JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY))).toEqual([]);
  });

  it("con pago rechazado crea la orden rechazada y conserva el carrito", () => {
    const ordenesAntes = listarOrdenes().length;
    const stockAntes = obtenerProducto(2).stock;
    mostrar();
    llenar();
    fireEvent.click(screen.getByLabelText("Simular pago rechazado"));
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));

    expect(screen.getByText("pantalla error")).toBeTruthy();
    const ordenes = listarOrdenes();
    expect(ordenes.length).toBe(ordenesAntes + 1);
    expect(ordenes[ordenes.length - 1].estadoPago).toBe("rechazado");
    expect(obtenerProducto(2).stock).toBe(stockAntes);
    expect(JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY)).length).toBe(1);
  });
});