import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard.jsx";
import { ADMIN_NAV_ITEMS } from "../../components/AdminSidebar.jsx";
import { listarOrdenes } from "../../data/ordenes.js";
import { listarCriticos, listarProductos } from "../../data/productos.js";
import { listarUsuarios } from "../../data/usuarios.js";
import { formatearCLP } from "../../utils/formato.js";

const DESCRIPCIONES = {
  Dashboard: "Visión general de las métricas del sistema.",
  "Órdenes": "Seguimiento de las compras y sus boletas.",
  Productos: "Inventario, precios y stock de cada producto.",
  "Categorías": "Organiza los productos del catálogo.",
  Usuarios: "Cuentas de clientes, vendedores y administradores.",
  Reportes: "Ventas por producto y por período.",
  Perfil: "Tus datos de administrador.",
};

export default function Dashboard() {
  const ordenes = listarOrdenes().filter((o) => o.estadoPago === "pagado");
  const productos = listarProductos();
  const criticos = listarCriticos();
  const usuarios = listarUsuarios();
  const ventas = ordenes.reduce((acc, o) => acc + o.total, 0);
  const stockTotal = productos.reduce((acc, p) => acc + p.stock, 0);

  return (
    <>
      <h1 className="h3">Dashboard</h1>
      <p className="text-muted">Resumen de la actividad de la tienda.</p>

      <section className="row g-3 mb-4" aria-label="Métricas">
        <div className="col-sm-6 col-xl-3">
          <StatCard titulo="Compras" valor={ordenes.length} detalle={`Ventas: ${formatearCLP(ventas)}`} color="primary" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard titulo="Productos" valor={productos.length} detalle={`Stock total: ${stockTotal}`} color="success" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard titulo="Usuarios" valor={usuarios.length} detalle="Registrados en el sistema" color="warning" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard titulo="Stock crítico" valor={criticos.length} detalle="Productos bajo el mínimo" color="danger" />
        </div>
      </section>

      <section className="row g-3" aria-label="Accesos directos">
        {ADMIN_NAV_ITEMS.filter((i) => i.to !== "/admin").map((item) => (
          <div className="col-sm-6 col-xl-4" key={item.to}>
            <Link to={item.to} className="card h-100 text-decoration-none text-reset shadow-sm">
              <div className="card-body text-center">
                <div className="fs-2" aria-hidden="true">
                  {item.icono}
                </div>
                <h2 className="h5">{item.label}</h2>
                <p className="small text-muted mb-0">{DESCRIPCIONES[item.label]}</p>
              </div>
            </Link>
          </div>
        ))}
      </section>
    </>
  );
}
