import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import { CARRITO_STORAGE_KEY } from "../../src/data/carrito.js";
import { listarOrdenes } from "../../src/data/ordenes.js";
import Checkout from "../../src/pages/store/Checkout.jsx";
import { instalarApiFalsa } from "../helpers/apiFalsa.js";

const item = {
  id: 2,
  nombre: "Cilindro GLP 11 kg",
  precio: 12000,
  imagen: "/img/cilindro-5kg.png",
  cantidad: 2,
  stock: 10,
};

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
  fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "ana@gmail.com" } });
  fireEvent.change(screen.getByLabelText("Calle y número"), { target: { value: "Av. Libertad 100" } });
  fireEvent.change(screen.getByLabelText("Región"), { target: { value: "nuble" } });
  fireEvent.change(screen.getByLabelText("Comuna"), { target: { value: "chillan" } });
  fireEvent.change(screen.getByLabelText("Opción de entrega"), { target: { value: "normal" } });
}

describe("<Checkout />", () => {
  let api;
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify([item]));
    api = instalarApiFalsa();
  });

  it("muestra un mensaje si el carrito está vacío", () => {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify([]));
    mostrar();
    expect(screen.getByText(/carrito está vacío/i)).toBeTruthy();
  });

  it("autocompleta el formulario con el usuario en sesión", async () => {
    instalarApiFalsa({ sesion: "cliente" }); // Camila
    mostrar();
    // La sesión llega del backend después de montar; el formulario se reinicia con sus datos.
    expect((await screen.findByDisplayValue("Camila")).id).toBeTruthy();
    expect(screen.getByLabelText("Nombre").value).toBe("Camila");
    expect(screen.getByLabelText("Calle y número").value).toBe("Camino a Chillán Viejo 789");
  });

  it("con pago aprobado crea la orden y vacía el carrito (el stock lo descontará el backend)", () => {
    const ordenesAntes = listarOrdenes().length;
    mostrar();
    llenar();
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));

    expect(screen.getByText("pantalla exito")).toBeTruthy();
    const ordenes = listarOrdenes();
    const ultima = ordenes[ordenes.length - 1];
    expect(ordenes.length).toBe(ordenesAntes + 1);
    expect(ultima.estadoPago).toBe("pagado");
    expect(ultima.entrega).toBe("normal");
    // Mientras no exista el servicio ventas, el navegador no toca el stock del catálogo.
    expect(api.db.peticiones.some((p) => p.metodo !== "GET" && p.ruta.startsWith("/productos"))).toBeFalse();
    expect(JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY))).toEqual([]);
  });

  it("con pago rechazado crea la orden rechazada y conserva el carrito", () => {
    const ordenesAntes = listarOrdenes().length;
    mostrar();
    llenar();
    fireEvent.click(screen.getByLabelText("Simular pago rechazado"));
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));

    expect(screen.getByText("pantalla error")).toBeTruthy();
    const ordenes = listarOrdenes();
    expect(ordenes.length).toBe(ordenesAntes + 1);
    expect(ordenes[ordenes.length - 1].estadoPago).toBe("rechazado");
    expect(JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY)).length).toBe(1);
  });
});