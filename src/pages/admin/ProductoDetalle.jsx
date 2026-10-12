// Detalle de un producto en el panel: /admin/productos/:id
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { obtenerCategoria } from "../../data/categorias.js";
import { eliminarProducto, estaEnOferta, obtenerProducto } from "../../data/productos.js";
import { formatearCLP } from "../../utils/formato.js";

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Mensaje que manda ProductoForm al guardar (si se llegó desde ahí).
  const mensaje = useLocation().state?.mensaje;
  const producto = obtenerProducto(id);

  if (!producto) {
    return (
      <div className="alert alert-warning" role="status">
        Producto no encontrado. <Link to="/admin/productos">Volver al listado</Link>
      </div>
    );
  }

  const categoria = obtenerCategoria(producto.categoriaId);
  const critico = producto.stock <= producto.stockCritico;

  function handleEliminar() {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    eliminarProducto(producto.id);
    navigate("/admin/productos");
  }

  return (
    <>
      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}
      <p>
        <Link to="/admin/productos">← Volver a productos</Link>
      </p>

      <div className="card shadow-sm">
        <div className="row g-0">
          <div className="col-md-4 p-3 text-center bg-white">
            {producto.imagen ? (
              <img src={producto.imagen} alt={producto.nombre} className="img-fluid" style={{ maxHeight: 220 }} />
            ) : (
              <p className="text-muted my-5">Sin imagen</p>
            )}
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h1 className="h3">{producto.nombre}</h1>
              <p className="text-muted">{producto.descripcion || "Sin descripción."}</p>

              <dl className="row mb-0">
                <dt className="col-sm-4">Código</dt>
                <dd className="col-sm-8">{producto.codigo}</dd>

                <dt className="col-sm-4">Categoría</dt>
                <dd className="col-sm-8">{categoria?.nombre ?? "Sin categoría"}</dd>

                <dt className="col-sm-4">Precio</dt>
                <dd className="col-sm-8">
                  {estaEnOferta(producto) ? (
                    <>
                      <del>{formatearCLP(producto.precio)}</del>{" "}
                      <strong className="text-danger">{formatearCLP(producto.precioOferta)}</strong>{" "}
                      <span className="badge text-bg-success">Oferta</span>
                    </>
                  ) : (
                    formatearCLP(producto.precio)
                  )}
                </dd>

                <dt className="col-sm-4">Unidad</dt>
                <dd className="col-sm-8">{producto.unidad}</dd>

                <dt className="col-sm-4">Stock</dt>
                <dd className="col-sm-8">
                  {producto.stock} (crítico: {producto.stockCritico})
                  {critico && <span className="badge text-bg-danger ms-2">Stock crítico</span>}
                </dd>
              </dl>

              <div className="d-flex flex-wrap gap-2 mt-3">
                <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-primary">
                  Editar
                </Link>
                <button type="button" className="btn btn-outline-danger" onClick={handleEliminar}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
