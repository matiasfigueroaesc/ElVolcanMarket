import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import StoreNavbar from "../../src/components/StoreNavbar.jsx";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { CartProvider, useCart } from "../../src/context/CartContext.jsx";
import { instalarApiFalsa } from "../helpers/apiFalsa.js";

// Botón auxiliar para agregar al carrito desde la prueba.
function BotonAgregar() {
  const { agregar } = useCart();
  return (
    <button onClick={() => agregar({ id: 1, nombre: "Cilindro", precio: 6500, precioOferta: null, stock: 5 })}>
      agregar
    </button>
  );
}

function renderNavbar() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <StoreNavbar />
          <BotonAgregar />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("<StoreNavbar />", () => {
  beforeEach(() => {
    localStorage.clear();
    instalarApiFalsa();
  });

  it("muestra login y registro cuando no hay sesión", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Panel admin" })).toBeNull();
  });

  it("muestra el acceso al panel solo a administradores (sesión recuperada del backend)", async () => {
    instalarApiFalsa({ sesion: "admin" });
    renderNavbar();
    expect(await screen.findByText("Hola, Javiera")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Panel admin" })).toBeTruthy();
  });

  it("un cliente con sesión no ve el panel", async () => {
    instalarApiFalsa({ sesion: "cliente" });
    renderNavbar();
    expect(await screen.findByText("Hola, Camila")).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Panel admin" })).toBeNull();
  });

  it("actualiza el contador del carrito al agregar un producto", () => {
    renderNavbar();
    expect(screen.getByTestId("cart-count").textContent).toBe("0");
    fireEvent.click(screen.getByText("agregar"));
    fireEvent.click(screen.getByText("agregar"));
    expect(screen.getByTestId("cart-count").textContent).toBe("2");
  });
});
