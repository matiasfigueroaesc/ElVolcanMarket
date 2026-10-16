import { Link } from "react-router-dom";
import { obtenerCategoria } from "../data/categorias.js";
import { estaEnOferta, precioFinal } from "../data/productos.js";
import { formatearCLP } from "../utils/formato.js";

export default function ProductCard({ producto, onAgregar, encabezado: Encabezado = "h2" }) {
    
  const sinStock = producto.stock <= 0;
  const categoria = obtenerCategoria(producto.categoriaId);

  return (
    <article className="card h-100 shadow-sm">
      <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
      <div className="card-body d-flex flex-column">
        {categoria && (
          <span className="badge text-bg-light align-self-start mb-2">{categoria.nombre}</span>
        )}
        <Encabezado className="h5">{producto.nombre}</Encabezado>
        <p className="fs-5 fw-bold mb-1">
          {estaEnOferta(producto) && (
            <del className="text-muted fs-6 me-2">{formatearCLP(producto.precio)}</del>
          )}
          {formatearCLP(precioFinal(producto))}
        </p>
        <p>Stock: {producto.stock}</p>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/productos/${producto.id}`} className="btn btn-outline-primary btn-sm">
            Ver detalle
          </Link>
          <button
            className="btn btn-primary btn-sm"
            disabled={sinStock}
            onClick={() => onAgregar(producto)}
          >
            {sinStock ? "Sin stock" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </article>
  );
}