import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerCategoria } from "../../data/categorias.js";
import { estaEnOferta, obtenerProducto, precioFinal } from "../../data/productos.js";
import { useCart } from "../../context/CartContext.jsx";
import { formatearCLP } from "../../utils/formato.js";

export default function DetalleProducto() {
  const { id } = useParams();
  const producto = obtenerProducto(Number(id));
  const { agregar } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  if (!producto) {
    return (
      <section className="container py-5">
        <div className="alert alert-warning">Producto no encontrado.</div>
        <Link to="/productos" className="btn btn-primary">Volver a productos</Link>
      </section>
    );
  }

  const categoria = obtenerCategoria(producto.categoriaId);
  const sinStock = producto.stock <= 0;

  function cambiarCantidad(e) {
    const n = Number(e.target.value) || 1;
    setCantidad(Math.max(1, Math.min(producto.stock, n)));
    setAgregado(false);
  }

  function manejarAgregar(e) {
    e.preventDefault();
    agregar(producto, cantidad);
    setAgregado(true);
  }

  return (
    <main className="container py-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <section className="row g-5">
        <div className="col-lg-6">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
        </div>
        <div className="col-lg-6">
          {categoria && <span className="badge text-bg-light mb-2">{categoria.nombre}</span>}
          <h1 className="h3">{producto.nombre}</h1>
          <p className="fs-4 fw-semibold text-primary">
            {estaEnOferta(producto) && (
              <del className="text-muted fs-6 me-2">{formatearCLP(producto.precio)}</del>
            )}
            {formatearCLP(precioFinal(producto))}
          </p>
          <p className="text-muted">{producto.descripcion}</p>
          <p>Stock disponible: {producto.stock}</p>

          <form className="mt-4" onSubmit={manejarAgregar}>
            <div className="mb-3" style={{ maxWidth: 160 }}>
              <label htmlFor="cantidad" className="form-label">Cantidad</label>
              <input
                id="cantidad"
                type="number"
                className="form-control"
                min="1"
                max={producto.stock}
                value={cantidad}
                onChange={cambiarCantidad}
                disabled={sinStock}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={sinStock}>
              {sinStock ? "Sin stock" : "Añadir al carrito"}
            </button>
          </form>

          {agregado && (
            <div className="alert alert-success mt-3" role="status">
              Producto agregado. <Link to="/carrito">Ver carrito</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}