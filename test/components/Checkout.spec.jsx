import { fireEvent, render, screen } from "@testing-library/react";
import { esperarQue } from "../helpers/esperar.js";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider } from "../../src/context/CartContext.jsx";
import { CARRITO_STORAGE_KEY } from "../../src/data/carrito.js";
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

  it("con pago aprobado crea la boleta en el backend y vacía el carrito", async () => {
    mostrar();
    llenar();
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));

    expect(await screen.findByText("pantalla exito")).toBeTruthy();
    const ultima = api.db.boletas[api.db.boletas.length - 1];
    expect(api.db.boletas.length).toBe(3);
    expect(ultima.estadoPago).toBe("pagado");
    expect(ultima.entrega).toBe("normal");
    expect(ultima.usuarioId).toBeNull(); // compra como invitado
    // Solo viajan id y cantidad; el stock lo descuenta el backend.
    expect(api.db.peticiones.find((p) => p.ruta === "/boletas").cuerpo.items).toEqual([{ id: 2, cantidad: 2 }]);
    expect(api.db.productos.find((p) => p.id === 2).stock).toBe(198);
    await esperarQue(() => JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY)).length === 0, "el carrito vacío");
  });

  it("con sesión la boleta queda a nombre del usuario", async () => {
    api = instalarApiFalsa({ sesion: "cliente" });
    mostrar();
    await screen.findByDisplayValue("Camila");
    fireEvent.change(screen.getByLabelText("Opción de entrega"), { target: { value: "normal" } });
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));
    expect(await screen.findByText("pantalla exito")).toBeTruthy();
    expect(api.db.boletas[2].usuarioId).toBe(3);
  });

  it("con pago rechazado crea la boleta rechazada y conserva el carrito", async () => {
    mostrar();
    llenar();
    fireEvent.click(screen.getByLabelText("Simular pago rechazado"));
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));

    expect(await screen.findByText("pantalla error")).toBeTruthy();
    expect(api.db.boletas[2].estadoPago).toBe("rechazado");
    expect(api.db.productos.find((p) => p.id === 2).stock).toBe(200);
    expect(JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY)).length).toBe(1);
  });

  it("si no hay stock muestra el error del backend y no navega", async () => {
    api.db.productos.find((p) => p.id === 2).stock = 1;
    mostrar();
    llenar();
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));

    expect((await screen.findByRole("alert")).textContent).toContain("Stock insuficiente de Cilindro GLP 11 kg");
    expect(screen.queryByText("pantalla exito")).toBeNull();
    expect(screen.getByRole("button", { name: "Pagar" }).disabled).toBeFalse();
    expect(JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY)).length).toBe(1);
  });

  it("si el backend está apagado avisa sin perder el carrito", async () => {
    api.db.caido = true;
    mostrar();
    llenar();
    fireEvent.click(screen.getByRole("button", { name: "Pagar" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY)).length).toBe(1);
  });
});
