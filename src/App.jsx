// Rutas de la aplicación. Tienda pública en "/" y panel en "/admin".
import { Route, Routes } from "react-router-dom";
import StoreLayout from "./layouts/StoreLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// Tienda
import Home from "./pages/store/Home.jsx";
import Productos from "./pages/store/Productos.jsx";
import DetalleProducto from "./pages/store/DetalleProducto.jsx";
import Categorias from "./pages/store/Categorias.jsx";
import CategoriaDetalle from "./pages/store/CategoriaDetalle.jsx";
import Ofertas from "./pages/store/Ofertas.jsx";
import Carrito from "./pages/store/Carrito.jsx";
import Checkout from "./pages/store/Checkout.jsx";
import PagoExitoso from "./pages/store/PagoExitoso.jsx";
import PagoError from "./pages/store/PagoError.jsx";
import Login from "./pages/store/Login.jsx";
import Registro from "./pages/store/Registro.jsx";
import Nosotros from "./pages/store/Nosotros.jsx";
import Blog from "./pages/store/Blog.jsx";
import BlogDetalle from "./pages/store/BlogDetalle.jsx";
import Contacto from "./pages/store/Contacto.jsx";
import Seguimiento from "./pages/store/Seguimiento.jsx";
import ZonasDespacho from "./pages/store/ZonasDespacho.jsx";
import NoEncontrado from "./pages/store/NoEncontrado.jsx";

// Admin
import Dashboard from "./pages/admin/Dashboard.jsx";
import Ordenes from "./pages/admin/Ordenes.jsx";
import Boleta from "./pages/admin/Boleta.jsx";
import AdminProductos from "./pages/admin/Productos.jsx";
import ProductoForm from "./pages/admin/ProductoForm.jsx";
import ProductoDetalle from "./pages/admin/ProductoDetalle.jsx";
import ProductosCriticos from "./pages/admin/ProductosCriticos.jsx";
import AdminCategorias from "./pages/admin/Categorias.jsx";
import CategoriaForm from "./pages/admin/CategoriaForm.jsx";
import Usuarios from "./pages/admin/Usuarios.jsx";
import UsuarioForm from "./pages/admin/UsuarioForm.jsx";
import UsuarioDetalle from "./pages/admin/UsuarioDetalle.jsx";
import HistorialCompras from "./pages/admin/HistorialCompras.jsx";
import Reportes from "./pages/admin/Reportes.jsx";
import Perfil from "./pages/admin/Perfil.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:id" element={<DetalleProducto />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="categorias/:slug" element={<CategoriaDetalle />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pago/exito/:ordenId" element={<PagoExitoso />} />
        <Route path="pago/error/:ordenId" element={<PagoError />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetalle />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="seguimiento" element={<Seguimiento />} />
        <Route path="zonas-despacho" element={<ZonasDespacho />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="ordenes" element={<Ordenes />} />
        <Route path="ordenes/:id" element={<Boleta />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="productos/nuevo" element={<ProductoForm />} />
        <Route path="productos/criticos" element={<ProductosCriticos />} />
        <Route path="productos/:id" element={<ProductoDetalle />} />
        <Route path="productos/:id/editar" element={<ProductoForm />} />
        <Route path="categorias" element={<AdminCategorias />} />
        <Route path="categorias/nueva" element={<CategoriaForm />} />
        <Route path="categorias/:id/editar" element={<CategoriaForm />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="usuarios/nuevo" element={<UsuarioForm />} />
        <Route path="usuarios/:id" element={<UsuarioDetalle />} />
        <Route path="usuarios/:id/editar" element={<UsuarioForm />} />
        <Route path="usuarios/:id/compras" element={<HistorialCompras />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}
