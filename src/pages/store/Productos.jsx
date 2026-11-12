import { useState } from "react";
import { listarCategorias } from "../../data/categorias.js";
import { buscarProductos, listarProductos } from "../../data/productos.js";
import { useCart } from "../../context/CartContext.jsx";
import { useCarga } from "../../hooks/useCarga.js";
import CategoryFilter from "../../components/CategoryFilter.jsx";
import EstadoCarga from "../../components/EstadoCarga.jsx";
import ProductList from "../../components/ProductList.jsx";

export default function Productos() {
  const [texto, setTexto] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const { agregar } = useCart();

  // El catálogo completo se pide una vez al backend; la búsqueda y el filtro de
  // categoría se aplican aquí mismo, para que la lista cambie mientras se escribe.
  const { datos, cargando, error, recargar } = useCarga(() =>
    Promise.all([listarProductos(), listarCategorias()])
  );
  const [productos, categorias] = datos ?? [[], []];

  const base = categoriaId ? productos.filter((p) => p.categoriaId === Number(categoriaId)) : productos;
  const visibles = buscarProductos(texto, base);

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Nuestros productos</h1>
        {!cargando && !error && <span className="text-muted">{visibles.length} productos</span>}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <CategoryFilter
            categorias={categorias}
            seleccionada={categoriaId}
            onCambiar={setCategoriaId}
          />
        </div>
      </div>

      {cargando || error ? (
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      ) : (
        <ProductList productos={visibles} categorias={categorias} onAgregar={(p) => agregar(p, 1)} />
      )}
    </section>
  );
}
