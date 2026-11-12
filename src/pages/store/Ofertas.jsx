import { useCart } from "../../context/CartContext.jsx";
import { listarCategorias } from "../../data/categorias.js";
import { listarOfertas } from "../../data/productos.js";
import { useCarga } from "../../hooks/useCarga.js";
import EstadoCarga from "../../components/EstadoCarga.jsx";
import ProductList from "../../components/ProductList.jsx";

export default function Ofertas() {
  const { agregar } = useCart();
  const { datos, cargando, error, recargar } = useCarga(() =>
    Promise.all([listarOfertas(), listarCategorias()])
  );
  const [ofertas, categorias] = datos ?? [[], []];

  return (
    <section className="container py-5">
      <h1 className="h3 mb-2">Ofertas</h1>
      <p className="text-muted mb-4">Aprovecha estos precios especiales mientras duren.</p>

      {cargando || error ? (
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      ) : ofertas.length === 0 ? (
        <div className="alert alert-info">No hay ofertas disponibles por ahora.</div>
      ) : (
        <ProductList productos={ofertas} categorias={categorias} onAgregar={(p) => agregar(p, 1)} />
      )}
    </section>
  );
}
